'use strict';


var fs = require('fs');


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
    _this.connection = options.connection;
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

  _this.loadData = function () {
    return new Promise((resolve/*, reject*/) => {
      process.stderr.write('TODO :: loadData(inputFile)\n');
      resolve();
    });
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
