'use strict';


var Cli = require('./cli'),
    DBInstaller = require('../lib/database'),
    extend = require('extend'),
    pg = require('pg');


var _DEFAULTS,
    _PROMPT_CREATE_ACCOUNTS,
    _PROMPT_LOAD_DATA,
    _PROMPT_LOAD_SCHEMA;

_DEFAULTS = {
  showProgress: true // Flag to give progress updates on STDOUT
};

_PROMPT_CREATE_ACCOUNTS = {
  type: 'confirm',
  name: 'CREATE_ACCOUNTS',
  message: 'Create database user accounts?',
  default: false
};

_PROMPT_LOAD_SCHEMA = {
  type: 'confirm',
  name: 'LOAD_SCHEMA',
  message: 'Create database schema?',
  default: false
};

_PROMPT_LOAD_DATA = {
  type: 'confirm',
  name: 'LOAD_DATA',
  message: 'Load data into database?',
  default: false
};

var Installer = function (options) {
  var _this,
      _initialize;


  _this = Cli(options);

  _initialize = function (options) {
    _this.options = extend(true, {}, _DEFAULTS, options);
  };


  _this.createAccounts = function () {
    _this._progress(' - Creating accounts\n');
    if (!_this.dbLoader) {
      return Promise.reject('DBLoader not initialized.');
    }

    return _this.dbLoader.createAccount(
      _this.options.DB_READ_USERNAME, _this.options.DB_READ_PASSWORD
    ).then(() => {
      return _this.dbLoader.grant(_this.options.DB_READ_USERNAME, ['SELECT']);
    });
  };

  _this.createDatabase = function () {
    return new Promise((resolve/*, reject*/) => {
      var connection,
          dbInstaller;

      connection = new pg.Client({
        database: _this.options.DB_NAME,
        password: _this.options.DB_ADMIN_PASSWORD,
        port: _this.options.DB_PORT,
        user: _this.options.DB_ADMIN_USERNAME
      });

      connection.connect();

      dbInstaller = DBInstaller(extend(
          true, {connection: connection}, _this.options));

      resolve(dbInstaller);
    });
  };

  _this.install = function () {
    return _this.prompt([
      _PROMPT_CREATE_ACCOUNTS,
      _PROMPT_LOAD_SCHEMA,
      _PROMPT_LOAD_DATA
    ]).then(_this.installComponents);
  };

  _this.installComponents = function (components) {
    var installChain;

    if (components.CREATE_ACCOUNTS || components.LOAD_SCHCEMA ||
          components.LOAD_DATA) {
      installChain = _this.createDatabase().then((result) => {
        _this.dbLoader = result;
      });

      if (components.CREATE_ACCOUNTS) {
        installChain = installChain.then(_this.createAccounts);
      }

      if (components.LOAD_SCHEMA) {
        installChain = installChain.then(_this.loadSchema);
      }

      if (components.LOAD_DATA) {
        installChain = installChain.then(_this.loadData);
      }

      // Just a message to the user
      installChain = installChain.then(() => {
        return 'Database setup complete!';
      });
    } else {
      installChain = Promise.resolve('Database installation skipped.');
    }

    return installChain;
  };

  _this.loadSchema = function () {
    _this._progress(' - Loading schema\n');
    if (!_this.dbLoader) {
      return Promise.reject('DBLoader not initialized.');
    }

    return _this.dbLoader.execFile(_this.options.schemaFile).then(() => {
      return _this.dbLoader.execFile(_this.options.metadataFile);
    });
  };

  _this.loadData = function () {
    _this._progress(' - Loading data\n');
    if (!_this.dbLoader) {
      return Promise.reject('DBLoader not initialized.');
    }

    return _this.dbLoader.loadFilesFromFtp(_this.options.dataFiles,
        _this.options);
  };

  _this._progress = function (message) {
    if (_this.options.showProgress) {
      process.stdout.write(message);
    }
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = Installer;
