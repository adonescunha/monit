'use strict'

var should = require('chai').should();
var nock   = require('nock');
var Client = require('./monit').Client;

var responseBody =  `
  <?xml version="1.0" encoding="ISO-8859-1"?>
  <monit>
    <server>
      <id>91767252e99b1a45f1d2a21fa42f92f8</id>
      <incarnation>1453203838</incarnation>
      <version>5.6</version>
      <uptime>21360</uptime>
      <poll>120</poll>
      <startdelay>0</startdelay>
      <localhostname>dummy-host</localhostname>
      <controlfile>/etc/monit/monitrc</controlfile>
      <httpd>
        <address>0.0.0.0</address>
        <port>2812</port>
        <ssl>0</ssl>
      </httpd>
    </server>
  </monit>
`;

var checkResultMatchResponseBody = function(result) {
  var serverNode = result.monit.server[0];
  serverNode.id[0].should.equal('91767252e99b1a45f1d2a21fa42f92f8');
  serverNode.incarnation[0].should.equal('1453203838');
  serverNode.version[0].should.equal('5.6');
  serverNode.poll[0].should.equal('120');
  serverNode.startdelay[0].should.equal('0');
  serverNode.localhostname[0].should.equal('dummy-host');
  serverNode.controlfile[0].should.equal('/etc/monit/monitrc');
};

describe('Client', function() {
  var subject;

  describe('constructor', function() {
    beforeEach(function() {
      subject = new Client();
    });

    it('defaults hostname option to "localhost"', function() {
      subject.hostname.should.equal('localhost');
    });

    it('defaults port option to 2812', function() {
      subject.port.should.equal(2812);
    });

    it('defaults ssl option to false', function() {
      subject.ssl.should.equal(false);
    });
  });

  describe('getUrlObj', function() {
    describe('when ssl is true', function() {
      before(function() {
        var client = new Client({ssl: true});
        subject = client.getUrlObj();
      });

      it('has protocol attribute set to https', function() {
        subject.protocol.should.equal('https');
      });
    });

    describe('when ssl is false', function() {
      before(function() {
        var client = new Client();
        subject = client.getUrlObj();
      });

      it('has protocol attribute set to http', function() {
        subject.protocol.should.equal('http');
      });
    });

    describe('when username and password are set', function() {
      before(function() {
        var client = new Client({
          username: 'admin',
          password: 'monit'
        });
        subject = client.getUrlObj();
      });

      it('has auth attribute set', function() {
        subject.auth.should.equal('admin:monit');
      });
    });
  });

  describe('getUrl', function() {
    beforeEach(function() {
      var client = new Client({
        username: 'admin',
        password: 'monit'
      });
      subject = client.getUrl();
    });

    it('builds monit host URL from options', function() {
      subject.should.equal('http://admin:monit@localhost:2812')
    });
  });

  describe('getStatusUrl', function() {
    beforeEach(function() {
      var client = new Client({
        username: 'admin',
        password: 'monit'
      });
      subject = client.getStatusUrl();
    });

    it('builds monit host URL from options', function() {
      subject.should.equal('http://admin:monit@localhost:2812/_status?format=xml')
    });
  });

  describe('parse', function() {
    it('builds a server instance', function(done) {
      var client = new Client();
      client.parse(responseBody).then(function(result) {
        checkResultMatchResponseBody(result);
        done();
      }).catch(function(err) {
        done(err);
      });
    });
  });

  describe('status', function() {
    it('makes a request to monit and parses the response', function(done) {
      var client = new Client();
      var url = client.getUrl();
      nock(url)
        .get('/_status')
        .query({format: 'xml'})
        .reply(200, responseBody);
      client.status().then(function(result) {
        checkResultMatchResponseBody(result);
        done();
      }).catch(function(err) {
        done(err);
      });
    });
  });

  describe('action', function() {
    it('performs a post to service resource', function(done) {
      var client = new Client();
      var url = client.getUrl();
      nock(url + '/dummy-service')
        .post('', {action: 'monitor'})
        .reply(200, 'OK');
      client.action({
        service: 'dummy-service',
        action: 'monitor'
      }).then(function(result) {
        result.should.equal('OK');
        done();
      }).catch(function(err) {
        done(err);
      });
    });

    it('raises an error when no options is undefined', function(done) {
      var client = new Client();
      client.action().catch(function(err) {
        err.message.should.equal('Service and action must be provided.');
        done();
      });
    });

    it('raises an error when no service is not provided', function(done) {
      var client = new Client({
        action: 'monitor'
      });
      client.action().catch(function(err) {
        err.message.should.equal('Service and action must be provided.');
        done();
      });
    });

    it('raises an error when no action is not provided', function(done) {
      var client = new Client({
        service: 'dummy-service'
      });
      client.action().catch(function(err) {
        err.message.should.equal('Service and action must be provided.');
        done();
      });
    });
  });
});
