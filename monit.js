'use strict';

var Promise = require('bluebird').Promise;
Promise.promisifyAll(require('xml2js'));
var errors = require('./lib/errors');
var Client = require('./lib/client');

module.exports = {
  errors: errors,
  Client: Client
};
