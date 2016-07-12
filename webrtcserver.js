var fs = require('fs');
var _static = require('node-static');
var https = require('https');


var property = require('./propertyWriter.js')(fs);
/*property.writeEnv();*/
var properties= JSON.parse(property.readEnv());

var folderPath="";
if(properties.enviornment=="production"){
  folderPath='.client/prod';
}else if(properties.enviornment=="test"){
  folderPath='.client/tests';
}else{
  folderPath='.client/build';
}
var file = new _static.Server('./client/build', {
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

var realtimecomm= require('./realtimecomm.js')(app, properties);

var restapi= require('./restapi.js')(realtimecomm, options ,app, properties);

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