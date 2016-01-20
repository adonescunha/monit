# `monit`
[![npm version](https://badge.fury.io/js/monit.svg)](https://badge.fury.io/js/monit)
[![Build Status](https://travis-ci.org/adonescunha/monit.svg?branch=master)](https://travis-ci.org/adonescunha/monit) [![Coverage Status](https://coveralls.io/repos/adonescunha/monit/badge.svg?branch=master&service=github)](https://coveralls.io/github/adonescunha/monit?branch=master) [![Dependencies Status](https://david-dm.org/adonescunha/monit.svg)](https://david-dm.org/adonescunha/monit)

The `monit` module provides a Node interface to interact with [Monit](https://mmonit.com/monit/) management utility.

## Instalation

```
npm install monit
```

## Usage

### `Client`

The `Client` class allows you to make requests to the Monit instance.

```js
var Client = require('monit').Client;

var client = new Client({
  hostname: 'monit.myapp.com',
  username: 'admin',
  password: 'monit'
});
```

#### Options available

Name       | Default       | Description
-----------|---------------|------------
`hostname` | `'localhost'` | The host serving the Monit instance
`port`     | `2812`        | The port used to serve the Monit port
`ssl`      | `false`       | Wheter monit web is being served under SSL
`username` | `null`        | Username to be used on authentication
`password` | `null`        | Password to be used on authentication

### `Client.status`

Retrieves the current status data from the Monit instance.

```js
client.status()
  .then(function(result) {
    console.log(result.monit.server[0].localhostname);
  }).catch(function(err) {
    throw err;
  });
```

### `Client.action`

Allows you to perform one of the Monit supported actions on a service. The supported actions are `'start'`, `'stop'`, `'restart'`, `'monitor'` and `'unmonitor'`. Both options `service` and `action` are required.

```js
client.action({
  service: 'nginx',
  action: 'monitor'
}).then(function(response) {
  console.log('nginx monitoring was enabled!');
}).catch(function(err) {
  throw err;
});
```

## MIT Licensed

See the [LICENSE file](LICENSE) for details.

-----
[Adones Cunha](http://github.com/adonescunha)
