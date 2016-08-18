'use strict';


var copyFrom = require('pg-copy-streams').from,
    extend = require('extend'),
    FileParser = require('./file-parser'),
    FtpDownloader = require('./ftp-downloader'),
    fs = require('fs'),
    os = require('os'),
    path = require('path'),
    rimraf = require('rimraf');


var _DEFAULTS = {
  connection: null,
  downloader: {
    ftp: {
      host: 'localhost',
      port: 21
    }
  },
  parser: {
    numHeaderRows: 3
  }
};


var Database = function (options) {
  var _this,
      _initialize;


  _this = {
    begin: null,
    commit: null,
    createAccount: null,
    execFile: null,
    grant: null,
    loadData: null,
    rollback: null
  };

  _initialize = function (options) {
    options = extend(true, {}, _DEFAULTS, options);

    _this.connection = options.connection;
    process.stdout.write('downloader options = ' + JSON.stringify(options.downloader, null, 2) + '\n');
    _this.downloader = FtpDownloader(options.downloader);
    _this.parser = FileParser(options.parser);
  };


  _this.begin = function () {
    if (_this.transactionStarted) {
      return Promise.reject('A transaction is already started.');
    } else {
      _this.transactionStarted = true; // Assume transaction will start ...
      return _this.connection.query('BEGIN').catch((err) => {
        // ... but if it doesn't, reset our internal state
        _this.transactionStarted = false;
        throw err;
      });
    }
  };

  _this.commit = function () {
    if (!_this.transactionStarted) {
      return Promise.reject(new Error('No transaction to end.'));
    } else {
      return _this.connection.query('COMMIT').then(() => {
        _this.transactionStarted = false;
      });
    }
  };

  _this.createAccount = function (username, password) {
    // return new Promise((resolve, reject) => {
    return _this.connection.query(
        `DROP OWNED BY ${username}`
      ).catch(() => {
        process.stderr.write(`Nothing owned by ${username}.\nContinuing...\n`);
      }).then(() => {
        return _this.connection.query(`DROP USER IF EXISTS ${username}`);
      }).then(() => {
        return _this.connection.query(`
          CREATE USER
            ${username}
          WITH ENCRYPTED PASSWORD
            '${password}'
        `);
      });
  };

  _this.execFile = function (fileName) {
    return _this.connection.query(fs.readFileSync(fileName).toString());
  };

  _this.getDataset = function (config) {
    var dataset;

    dataset = {
      edition: null,
      id: null,
      iml: [],
      imt: null,
      region: null,
      vs30: null
    };

    // Find the ids based on the given values
    return _this.connection.query(`
      SELECT
        edition.id AS editionid,
        imt.id AS imtid,
        region.id AS regionid,
        vs30.id AS vs30id
      FROM
        edition,
        imt,
        region,
        vs30
      WHERE
        edition.value = '${config.edition}'
        AND imt.value = '${config.imt}'
        AND region.value = '${config.region}'
        AND vs30.value = '${config.vs30}'
    `).then((result) => {
      // Create the dataset object and db record using the ids
      var row;

      if (!result.rows.length) {
        throw new Error('Failed to find ids for dataset values.');
      }

      row = result.rows[0];
      dataset.editionid = row.editionid;
      dataset.imtid = row.imtid;
      dataset.regionid = row.regionid;
      dataset.vs30id = row.vs30id;

      return _this.connection.query(`
        INSERT INTO
          dataset
        (
          editionid,
          imtid,
          regionid,
          vs30id
        )
        VALUES
        (
          ${dataset.editionid},
          ${dataset.imtid},
          ${dataset.regionid},
          ${dataset.vs30id}
        )
      `);
    }).then(() => {
      // Find the id of the just-created db record
      return _this.connection.query(`
        SELECT
          id
        FROM
          dataset
        WHERE
          editionid = ${dataset.editionid}
          AND imtid = ${dataset.imtid}
          AND regionid = ${dataset.regionid}
          AND vs30id = ${dataset.vs30id}
      `);
    }).then((result) => {
      // Update the dataset object with the db record id, return the dataset
      if (result.rows.length) {
        dataset.id = result.rows[0].id;
        return dataset;
      }

      throw new Error('Could not find dataset for input parameters.');
    });
  };

  _this.grant = function (user, privileges) {
    privileges = privileges.join(', ');

    // Grant privileges on existing tables
    return _this.connection.query(`
      GRANT
        ${privileges}
      ON ALL TABLES IN SCHEMA
        public
      TO
        ${user}
    `).then(() => {
      // Grant privileges on tables created subsequently
      return _this.connection.query(`
        ALTER DEFAULT PRIVILEGES
        IN SCHEMA
          PUBLIC
        GRANT
          ${privileges}
        ON TABLES TO
          ${user}
      `);
    });
  };

  _this.loadFileFromFtp = function (dataFile, config) {
    process.stdout.write(`   File: "${dataFile.path}"\n`);
    return _this.getDataset(dataFile).then((dataset) => {
      process.stdout.write('   ... downloading ... ');
      return _this.downloader.downloadFile(dataFile.path, config.scratchDir,
          {gzip: true, tar: true}
      ).then(() => {
        // TODO :: Less hacky way of finding downloaded file...
        var sourceFile = config.scratchDir + path.sep + path.basename(
            dataFile.path.replace('.tar.gz', '.txt'));
        process.stdout.write('parsing ... ');
        return _this.parser.parseFile(sourceFile, dataset.id);
      }).then((result) => {
        // Update dataset IML values
        return _this.connection.query(`
          UPDATE
            dataset
          SET
            iml = '{${result.imlData.join(',')}}'
          WHERE
            id = ${dataset.id}
        `).then(() => {
          return new Promise((resolve, reject) => {
            var dataStream,
                queryStream;

            // TODO :: Drop indexes/constraints before doing a big data load,
            //         Re-add the indexes/constraints afterwards. Perhaps
            //         We should do this as part of loadFilesFromFtp ?

            queryStream = _this.connection.query(copyFrom(
                'COPY curve (datasetid, latitude, longitude, afe) FROM STDIN'));
            dataStream = fs.createReadStream(result.afeFile);

            process.stdout.write('importing ... ');
            dataStream.pipe(queryStream).once('error', (err) => {
              process.stdout.write('error!\n');
              reject(err);
            }).once('finish', () => {
              process.stdout.write('done.\n');
              dataStream.close();
              resolve();
            });
          });
        });
      });
    });
  };

  _this.loadFilesFromFtp = function (dataFiles, config) {
    var result,
        scratchDir;

    result = _this.begin();

    scratchDir = os.tmpdir() + path.sep +
        'earthquake-hazard-probabilistic-db-downloads';

    if (fs.existsSync(scratchDir)) {
      rimraf.sync(scratchDir);
    }

    fs.mkdirSync(scratchDir);

    dataFiles.forEach((dataFile) => {
      result = result.then(() => {
        return _this.loadFileFromFtp(dataFile, extend({},
            {scratchDir: scratchDir}, config));
      });
    });

    result = result.then(() => {
      return _this.commit();
    }).catch((err) => {
      process.stderr.write(err + '\n');
      return err;
    }).then(() => {
      return new Promise((resolve, reject) => {
        rimraf(scratchDir, (err) => {
          if (err) {
            reject(err);
          }
          resolve();
        });
      });
    });

    return result;
  };

  _this.rollback = function () {
    if (!_this.transactionStarted) {
      return Promise.reject(new Error('No transaction to rollback.'));
    } else {
      return _this.connection.query('ROLLBACK').then(() => {
        _this.transactionStarted = false;
      });
    }
  };

  _initialize(options);
  options = null;
  return _this;
};

module.exports = Database;
