'use strict'

var xml2js  = require('xml2js');
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

Client.prototype.get = function() {
  var self = this;
  return request(this.getStatusUrl())
    .then(function(response) {
      return self.parse(response);
    });
};

module.exports = Client;
