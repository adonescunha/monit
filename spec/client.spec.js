require('./spec_helper');
var Client = require('../monit').Client;

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
      var body = `
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
      client.parse(body).then(function() {
        client.server.id.should.equal('91767252e99b1a45f1d2a21fa42f92f8');
        client.server.incarnation.should.equal('1453203838');
        client.server.version.should.equal('5.6');
        client.server.poll.should.equal(120);
        client.server.startdelay.should.equal(0);
        client.server.localhostname.should.equal('dummy-host');
        client.server.controlfile.should.equal('/etc/monit/monitrc');
        done();
      }).catch(function(err) {
        done(err);
      });
    });
  });
});
