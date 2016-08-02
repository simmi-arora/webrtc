var fs = require('fs');
var _static = require('node-static');
var https = require('https');


var _properties = require('./env.js')(fs).readEnv();
var properties= JSON.parse(_properties);
console.log(properties);

var folderPath="", file="";

if(properties.enviornment=="production"){
  folderPath='./client/prod';
}else if(properties.enviornment=="test"){
  folderPath='./client/tests';
}else{
  folderPath='./client/build';
}

console.log("Folder Path for this enviornment " , folderPath);

file = new _static.Server(folderPath, {
  cache: 3600,
  gzip: true,
  indexFile: "home.html"
});

var options = {
  key: fs.readFileSync('ssl_certs/server.key'),
  cert: fs.readFileSync('ssl_certs/server.crt'),
  ca: fs.readFileSync('ssl_certs/ca.crt'),
  requestCert: true,
  rejectUnauthorized: false
};

var app = https.createServer(options, function(request, response){
        request.addListener('end', function () {
        file.serve(request, response);
    }).resume();     
});
app.listen(properties.httpsPort);


var _realtimecomm=require('./client/build/minScripts/webrtcdevelopmentServer.js').realtimecomm;
var realtimecomm= _realtimecomm(app, properties , function(socket) {
    try {
        var params = socket.handshake.query;

        if (!params.socketCustomEvent) {
            params.socketCustomEvent = 'custom-message';
        }

        socket.on(params.socketCustomEvent, function(message) {
            try {
                socket.broadcast.emit(params.socketCustomEvent, message);
            } catch (e) {}
        });
    }catch (e) {
        console.error(e);
    }
});

var _restapi= require('./client/build/minScripts/webrtcdevelopmentServer.js').restapi;
var restapi=_restapi(realtimecomm, options ,app, properties);

console.log("< ------------------------ HTTPS Server -------------------> ");
console.log(" WebRTC server env => "+ properties.enviornment+ " running at\n "+properties.httpsPort+ "/\nCTRL + C to shutdown");

/*var options = {
  host: 'https://docs.google.com/spreadsheets/d/1ora3ej7ySrrIxijjTqKI97KGxtn0ah4xyYjF6gVtsjs/',
  port: 80,
  path: 'pub?gid=0&single=true&output=csv',
  method: 'POST'
};

https.request(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
}).end();
*/