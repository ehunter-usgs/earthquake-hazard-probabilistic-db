'use strict';


var extend = require('extend'),
    fs = require('fs'),
    readline = require('readline');


var _DEFAULTS;

_DEFAULTS = {
  numHeaderRows: 3
};


var FileParser = function (options) {
  var _this,
      _initialize;


  _this = {
    parseFile: null
  };

  _initialize = function (options) {
    options = extend({}, _DEFAULTS, options);
    _this.numHeaderRows = options.numHeaderRows;
  };

  _this._parseInputLine = function (line, imlData, afeStream) {
    var afe,
        latitude,
        longitude,
        tokens;

    tokens = line.split(/\s+/);

    if (tokens.length === 1) {
      if (!isNaN(tokens[0])) {
        imlData.push(tokens[0]);
      }
    } else {
      latitude = tokens[1];
      longitude = tokens[2];
      afe = '{' + tokens.slice(3).join(',') + '}';

      afeStream.write(`${latitude}\t${longitude}\t${afe}\n`);
    }
  };

  /**
   * Parse IML and AFE data out of a data file.
   *
   * @param dataFile {String}
   *     A file path identifying the input data file to be parsed.
   *
   * @return Promise
   *     A promise that will resolve with an object containing `imlData` and
   *     `afeFile`. The `imlData` is an {Array} of IML values parsed from the
   *     given `dataFile` while the `afeFile` is a {String} identifying
   *     a file where the "latitude\tlongitude{afe}" TSV file containing AFE
   *     data can be found.
   */
  _this.parseFile = function (dataFile) {
    return new Promise((resolve, reject) => {
      var afeFile,
          afeStream,
          imlData,
          inputStream,
          lineCount;

      afeFile = dataFile + '.afe';
      if (fs.existsSync(afeFile)) {
        // Save a copy if one already existed
        fs.writeFileSync(`${afeFile}.orig`, fs.readFileSync(afeFile));
      }

      afeStream = fs.createWriteStream(afeFile);
      imlData = [];
      lineCount = 0;

      inputStream = readline.createInterface({
        input: fs.createReadStream(dataFile, {encoding: 'utf8'})
      });

      inputStream.on('line', (line) => {
        lineCount += 1;

        if (lineCount <= _this.numHeaderRows) {
          return;
        } else {
          _this._parseInputLine(line, imlData, afeStream);
        }
      }).on('error', (err) => {
        reject(err);
      }).on('close', () => {
        afeStream.close();
        resolve({
          afeFile: afeFile,
          imlData: imlData
        });
      });
    });
  };


  _initialize(options);
  options = null;
  return _this;
};

module.exports = FileParser;
