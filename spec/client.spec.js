require('./spec_helper');
var Client = require('../lib/client');

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
});
