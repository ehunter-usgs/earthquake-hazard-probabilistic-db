#!/usr/bin/env node
'use strict';
process.chdir(__dirname);


var Configurer = require('../lib/configurer'),
    extend = require('extend'),
    Installer = require('../lib/installer'),
    installConfig = require('../conf/installer'),
    questions = require('../etc/installer-questions');


var configurer,
    installer;


configurer = Configurer({
  nonInteractive: installConfig.nonInteractive,
  outputFile: installConfig.outputFile
});

configurer.configure(extend({}, installConfig, {questions: questions}))
.then((configuration) => {
  installer = Installer(extend(true, installConfig, configuration));

  return installer.install();
}).then((message) => {
  process.stdout.write(`${message}\nSuccess!\n`);
  process.exit(0);
}).catch((err) => {
  process.stdout.write(err + '\n');
  process.exit(-1);
});
