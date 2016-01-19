'use strict'

var url = require('url');

var Client = function(options) {
  if (options === undefined) {
    options = {};
  }

  this.hostname = options.host || "localhost";
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

module.exports = Client;
