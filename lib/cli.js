'use strict';


var extend = require('extend'),
    inquirer = require('inquirer');


var _DEFAULTS;

_DEFAULTS = {
  nonInteractive: false
};


var Cli = function (options) {
  var _this,
      _initialize;


  _this = {};

  _initialize = function (options) {
    _this.options = extend(true, {}, _DEFAULTS, options);
  };


  _this.getDefaultAnswers = function (questions) {
    return new Promise((resolve, reject) => {
      var answers;

      try {
        answers = {};
        questions.forEach((question) => {
          answers[question.name] = ('default' in question) ?
              question.default : null;
        });
      } catch (err) {
        reject(err);
      }

      resolve(answers);
    });
  };

  _this.prompt = function (questions) {
    if (_this.options.nonInteractive) {
      return _this.getDefaultAnswers(questions);
    } else {
      return inquirer.prompt(questions);
    }
  };


  _initialize(options);
  options = null;
  return _this;
};


module.exports = Cli;
