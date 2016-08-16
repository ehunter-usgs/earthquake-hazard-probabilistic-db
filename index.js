#!/usr/bin/env node

var database = require('./database'),
    extend = require('extend'),
    inquirer = require('inquirer'),
    installer = require('./installer'),
    pg = require('pg');


process.chdir(__dirname);


var createDbInstaller;

createDbInstaller = function (config) {
  return new Promise((resolve, reject) => {
    var client,
        db;

    client = new pg.Client({
      database: config.DB_NAME,
      password: config.DB_ADMIN_PASSWORD,
      port: config.DB_PORT,
      user: config.DB_ADMIN_USERNAME
    });

    client.connect((err) => {
      if (err) {
        reject(err);
      }

      db = database(extend(true, {connection: client}, config));
      resolve(db);
    });
  });
};


installer.configure().then((config) => {
  if (installer.config.nonInteractive) {
    process.stdout.write('Running non-interactively, ' +
        'database not created/updated.\n');
  } else {
    return inquirer.prompt([
      {
        type: 'confirm',
        name: 'CREATE_ACCOUNTS',
        message: 'Create database user accounts?',
        default: false
      },
      {
        type: 'confirm',
        name: 'LOAD_SCHEMA',
        message: 'Create database schema?',
        default: false
      },
      {
        type: 'confirm',
        name: 'LOAD_DATA',
        message: 'Load data into database?',
        default: false
      }
    ]).then((answers) => {
      var promise;

      if (answers.CREATE_ACCOUNTS || answers.LOAD_SCHEMA || answers.LOAD_DATA) {
        promise = createDbInstaller(config).then((dbInstaller) => {
          var installChain;

          if (answers.CREATE_ACCOUNTS) {
            installChain = dbInstaller.createAccount(
              config.DB_READ_USERNAME,
              config.DB_READ_PASSWORD
            ).then(() => {
              return dbInstaller.grant(config.DB_READ_USERNAME, ['SELECT']);
            });
          } else {
            installChain = Promise.resolve();
          }

          if (answers.LOAD_SCHEMA) {
            installChain = installChain.then(() => {
              dbInstaller.execFile(installer.config.schemaFile);
            });
          }

          if (answers.LOAD_DATA) {
            installChain = installChain.then(() => {
              return dbInstaller.loadData();
            });
          }

          return installChain;
        });
      } else {
        promise = Promise.resolve('No database work performed.');
      }

      return promise;
    });
  }
}).then(() => {
  process.stdout.write('Installation completed successfully.\n');
  process.exit(0);
}).catch((err) => {
  process.stdout.write('Installation failed.\n\n');
  process.stderr.write(err.message + '\n');
  process.stderr.write(err.stack + '\n\n');
  process.exit(-1);
});
