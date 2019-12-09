
var Client = require('./start');

function WebRTCDev(options) {
  var client  = new Client(options);

  Object.defineProperties(this, {
    client: {
      enumerable: true,
      value: client
    }
  });
}

module.exports = WebRTCDev;