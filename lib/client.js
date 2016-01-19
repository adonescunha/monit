'use strict'

var xml2js  = require('xml2js');
var url     = require('url');
var request = require('request-promise');
var Server  = require('./server');

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
  var self = this;

  return xml2js.parseStringAsync(body).then(function(result) {
    var serverNode = result.monit.server[0];
    self.server = new Server({
      id: serverNode.id[0],
      incarnation: serverNode.incarnation[0],
      version: serverNode.version[0],
      poll: serverNode.poll[0],
      startdelay: serverNode.startdelay[0],
      localhostname: serverNode.localhostname[0],
      controlfile: serverNode.controlfile[0]
    });
  });
};

Client.prototype.get = function() {
  var self = this;
  return request(this.getStatusUrl())
    .then(function(response) {
      return self.parse(response);
    });
};

module.exports = Client;
