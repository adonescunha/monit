'use strict';

var Promise = require('bluebird').Promise;
Promise.promisifyAll(require('xml2js'));

var Client  = require('./lib/client');

module.exports = {
  Client: Client
};
