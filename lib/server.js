'use strict';

var Server = function(options) {
  if (options === undefined) {
    options = {};
  }

  this.id = options.id;
  this.incarnation = options.incarnation;
  this.version = options.version;
  this.uptime = options.uptime;
  this.poll = parseInt(options.poll);
  this.startdelay = parseInt(options.startdelay);
  this.localhostname = options.localhostname;
  this.controlfile = options.controlfile;
};

module.exports = Server;
