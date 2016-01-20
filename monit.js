'use strict';

var Promise = require('bluebird').Promise;
var xml2js  = Promise.promisifyAll(require('xml2js'));
var url     = require('url');
var request = require('request-promise');

var Client = function(options) {
  if (options === undefined) {
    options = {};
  }

  this.hostname = options.hostname || "localhost";
  this.port     = parseInt(options.port || 2812);
  this.ssl      = options.ssl || false;
  this.username = options.username;
  this.password = options.password;
  this.services = [];
};

Client.prototype.getUrlObj = function() {
  var urlObj = {
    hostname: this.hostname,
    port: this.port,
    protocol: this.ssl ? 'https' : 'http'
  };

  if (this.username !== undefined && this.password !== undefined) {
    urlObj.auth = this.username + ':' + this.password;
  }

  return urlObj;
};

Client.prototype.getUrl = function() {
  return url.format(this.getUrlObj());
};

Client.prototype.getStatusUrl = function() {
  var urlObj = this.getUrlObj();
  urlObj.pathname = '/_status';
  urlObj.query = {format: 'xml'}

  return url.format(urlObj);
};

Client.prototype.parse = function(body) {
  return xml2js.parseStringAsync(body);
};

Client.prototype.status = function() {
  var self = this;
  return request(this.getStatusUrl())
    .then(function(response) {
      return self.parse(response);
    });
};

Client.prototype.action = function(options) {
  if (!options) {
    options = {};
  }

  if (!options.service || !options.action) {
    return new Promise(function() {
      throw Error('Service and action must be provided.');
    });
  }

  var urlObj = this.getUrlObj();
  urlObj.pathname = '/' + options.service;
  var serviceUrl = url.format(urlObj)
  return request.post({
    url: serviceUrl,
    form: {action: options.action}
  });
};

module.exports = {
  Client: Client
};
