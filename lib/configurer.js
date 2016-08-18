'use strict';


var Cli = require('./cli'),
    extend = require('extend'),
    fs = require('fs'),
    path = require('path');


var _DEFAULTS,
    _PROMPT_USE_EXISTING_CONFIG;

_DEFAULTS = {
  outputFile: path.resolve(__dirname + '/../conf/config.json')
};

_PROMPT_USE_EXISTING_CONFIG = {
  type: 'confirm',
  name: 'useExisting',
  message: 'Existing configuration found. Use this as defaults?',
  default: true
};

var Configurer = function (options) {
  var _this,
      _initialize;


  _this = Cli(options);

  _initialize = function (options) {
    _this.options = extend(true, {}, _DEFAULTS, options);
  };


  _this.configure = function (options) {
    options = extend({}, _this.options, options);

    return _this.getExistingConfig(options.outputFile)
      .then((existingConfig) => {
        if (existingConfig) {
          return _this.updateQuestionDefaults(options.questions,
              existingConfig);
        } else {
          return options.questions;
        }
      }).then((questions) => {
        return _this.prompt(questions);
      }).then((configuration) => {
        return _this.saveOutput(configuration, options.outputFile);
      });
  };

  /**
   * Checks if the indicated `existingConfig` already exists in the file system.
   * If it does, prompts the user as to whether the information stored in that
   * file should be used as the default configuration parameters for this
   * configuration.
   *
   * This method is called from the "configure" method is is not typically
   * invoked directly.
   *
   *
   * @param existingConfig {String}
   *     The path to where existing configuration might be found.
   *
   * @return {Promise}
   *      A promise that will reject if an error occurs or resolve with:
   *        (a) The configuration object from the `existingConfig` if such a
   *            file existed _and_ the user chose to use that configuration as
   *            defaults.
   *        (b) Undefined otherwise.
   */
  _this.getExistingConfig = function (existingConfig) {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(existingConfig)) {
        resolve();
      } else {
        _this.prompt([_PROMPT_USE_EXISTING_CONFIG]).then((answer) => {
          if (answer.useExisting) {
            try {
              resolve(JSON.parse(fs.readFileSync(existingConfig)));
            } catch (err) {
              reject(err);
            }
          } else {
            resolve();
          }
        });
      }
    });
  };

  _this.saveOutput = function (configuration, outputFile) {
    return new Promise((resolve, reject) => {
      try {
        fs.writeFileSync(outputFile, JSON.stringify(configuration, null, 2));
        resolve(configuration);
      } catch (err) {
        reject(err);
      }
    });
  };

  _this.updateQuestionDefaults = function (questions, defaultAnswers) {
    return new Promise((resolve/*, reject*/) => {
      var updatedQuestions;

      try {
        updatedQuestions = JSON.parse(JSON.stringify(questions));

        // Update question defaults based on `defaultAnswers`
        updatedQuestions.forEach((question) => {
          if (question.name in defaultAnswers) {
            question.default = defaultAnswers[question.name];
          }
        });
      } catch (err) {
        // revert to defaults on error
        process.stderr.write('Failed to parse existing configuration. ' +
            'Reverting to defaults.\n');
        updatedQuestions = JSON.parse(JSON.stringify(questions));
      }

      resolve(updatedQuestions);
    });
  };


  _initialize(options);
  options = null;
  return _this;
};

module.exports = Configurer;
