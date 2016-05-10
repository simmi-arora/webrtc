var server = require('https');
    url = require('url'),
    path = require('path'),
    fs = require('fs'),
    _static = require('node-static');

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

var file = new _static.Server(folderPath, {
    cache: 3600,
    gzip: true,
    indexFile: "index.html"
});

function serverHandler(request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume(); 
}

var app;
var options = {
      key: fs.readFileSync('ssl_certs/server.key'),
      cert: fs.readFileSync('ssl_certs/server.crt'),
      ca: fs.readFileSync('ssl_certs/ca.crt')
};
app = server.createServer(options, serverHandler);

app = app.listen(process.env.PORT || 9001, process.env.IP || "0.0.0.0", function() {
    var addr = app.address();
    console.log("Server listening at", addr.address + ":" + addr.port);
});

require('./realtimecomm.js')(app, function(socket) {
    try {
        var params = socket.handshake.query;

        // "socket" object is totally in your own hands!
        // do whatever you want!

        // in your HTML page, you can access socket as following:
        // connection.socketCustomEvent = 'custom-message';
        // var socket = connection.getSocket();
        // socket.emit(connection.socketCustomEvent, { test: true });

        if (!params.socketCustomEvent) {
            params.socketCustomEvent = 'custom-message';
        }

        socket.on(params.socketCustomEvent, function(message) {
            try {
                socket.broadcast.emit(params.socketCustomEvent, message);
            } catch (e) {}
        });
    } catch (e) {}
});