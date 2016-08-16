#!/usr/bin/env node


var fs = require('fs'),
    inquirer = require('inquirer'),
    installConfig = require('./config'),
    questions = require('./questions');



var getUpdatedQuestions,
    main;


getUpdatedQuestions = function (questions, configFile) {
  var config,
      updatedQuestions;

  try {
    process.stdout.write('Using existing configuration file as defaults.\n');

    updatedQuestions = JSON.parse(JSON.stringify(questions));
    config = JSON.parse(fs.readFileSync(configFile));

    // Update question defaults based on existing configuration
    updatedQuestions.forEach((question) => {
      if (question.name in config) {
        question.default = config[question.name];
      }
    });
  } catch (err) {
    // revert to defaults on error
    updatedQuestions = JSON.parse(JSON.stringify(questions));
    process.stderr.write('Failed to parse existing configuration. ' +
        'Reverting to defaults.\n');
  }

  return updatedQuestions;
};

main = function () {
  var configFile,
      nonInteractive,
      promise;

  configFile = installConfig.configFile;
  nonInteractive = installConfig.nonInteractive;
  if (fs.existsSync(configFile)) {
    if (nonInteractive) {
      // Use existing configuration file in non-interactive mode
      promise = new Promise((resolve/*, reject*/) => {
        resolve(getUpdatedQuestions(questions, configFile));
      });
    } else {
      // Ask if we should use existing configuration file or not
      promise = inquirer.prompt([{
        type: 'confirm',
        name: 'useExisting',
        message: 'Use existing configuration as defaults?',
        default: true
      }]).then((answer) => {
        if (answer.useExisting) {
          return getUpdatedQuestions(questions, configFile);
        } else {
          return questions;
        }
      });
    }
  } else {
    // No existing configuration file
    promise = new Promise((resolve/*, reject*/) => {
      resolve(questions);
    });
  }

  return promise.then((questions) => {
    var config;

    if (nonInteractive) {
      config = {};

      questions.forEach((q) => {
        config[q.name] = ('default' in q) ? q.default : null;
      });
      return config;
    } else {
      return inquirer.prompt(questions);
    }
  }).then((config) => {
    fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
    return config;
  }).catch((err) => {
    process.stderr.write('Error running pre-install: ' + err.message + '\n');
    process.stderr.write(err.stack);
    process.exit(-1);
  });
};


if (!module.parent) {
  // configure script run directly from command line, run configuration
  process.chdir(__dirname);

  if (installConfig.nonInteractive) {
    process.stdout.write('Generating configuration non-interactively...\n');
  }

  main();
} else {
  module.exports = main;
}
