module.exports = {
  configFile: __dirname + '/../conf/config.json',
  nonInteractive: process.env.NON_INTERACTIVE === 'true',
  schemaFile: __dirname + '/../database/schema.sql'
};
