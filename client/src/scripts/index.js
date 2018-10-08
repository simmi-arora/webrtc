'use strict';
var Client = require('./start');

function Plivo(options) {
  var client  = new Client(options);

  Object.defineProperties(this, {
    client: {
      enumerable: true,
      value: client
    }
  });
}

module.exports = Plivo;