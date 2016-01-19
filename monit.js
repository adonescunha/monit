'use strict';

var Promise = require('bluebird').Promise;
Promise.promisifyAll(require('xml2js'));

var Client  = require('./lib/client');
var Server  = require('./lib/server');

module.exports = {
  Client: Client,
  Server: Server
};
