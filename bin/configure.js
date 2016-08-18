#!/usr/bin/env node
'use strict';
process.chdir(__dirname);


var Configurer = require('../lib/configurer'),
    extend = require('extend'),
    installConfig = require('../conf/installer'),
    questions = require('../etc/installer-questions');


var configurer = Configurer({
  nonInteractive: installConfig.nonInteractive,
  outputFile: installConfig.configFile
});


configurer.configure(extend({}, installConfig, {questions: questions}))
.then((/*configuration*/) => {
  process.stdout.write('Configuration complete.\n');
}).catch((err) => {
  process.stderr.write(err + '\n');
  if (err.stack) {
    process.stderr.write(err.stack + '\n');
  }
  process.exit(-1);
});
