'use strict'

var util = require('util');

var UNSUPPORTED_ACTION_ERROR_MESSAGE = ['Action invalid. Only start, ',
                                        'stop, restart, monitor and ',
                                        'unmonitor are supported'].join('');

var UnsupportedActionError = function(extra) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = UNSUPPORTED_ACTION_ERROR_MESSAGE;
  this.extra = extra;
};

util.inherits(UnsupportedActionError, Error);

module.exports = {
  UnsupportedActionError: UnsupportedActionError
};
