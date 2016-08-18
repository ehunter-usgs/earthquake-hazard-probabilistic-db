#!/usr/bin/env node
'use strict';
process.chdir(__dirname);


var fs = require('fs'),
    path = require('path'),
    pg = require('pg');


var client,
    config;

config = JSON.parse(fs.readFileSync(path.resolve(
    __dirname + '/../conf/config.json')));

client = new pg.Client({
  database: config.DB_NAME,
  password: config.DB_ADMIN_PASSWORD,
  port: config.DB_PORT,
  user: config.DB_ADMIN_USERNAME
});

client.connect();

client.query(`
  DROP TABLE IF EXISTS curve CASCADE;
  DROP TABLE IF EXISTS dataset CASCADE;
  DROP TABLE IF EXISTS region CASCADE;
  DROP TABLE IF EXISTS edition CASCADE;
  DROP TABLE IF EXISTS vs30 CASCADE;
  DROP TABLE IF EXISTS imt CASCADE;
`).then(() => {
  return client.query(`DROP OWNED BY ${config.DB_READ_USERNAME}`)
    .catch((/*err*/) => {
      process.stdout.write(`Nothing owned by ${config.DB_READ_USERNAME}\n`);
    });
}).then(() => {
  return client.query(`DROP USER IF EXISTS ${config.DB_READ_USERNAME}`);
}).then(() => {
  process.stdout.write('Uninstall complete!\n');
}).catch((err) => {
  if (err) {
    if (err.stack) {
      process.stdout.write(err.stack + '\n');
    } else {
      process.stdout.write(err + '\n');
    }
  }
}).then(() => {
  client.end();
});
