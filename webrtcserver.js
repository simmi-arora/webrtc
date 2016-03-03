var fs = require('fs');
var _static = require('node-static');
var https = require('https');


var file = new _static.Server('./client/build', {
    cache: 3600,
    gzip: true,
    indexFile: "index.html"
});


/*
var options = {
  key: fs.readFileSync('/etc/apache2/ssl/villageexpert.key'),
  cert: fs.readFileSync('/etc/apache2/ssl/edac0f74577a2bdf.crt'),
  ca: fs.readFileSync('/etc/apache2/ssl/gd_bundle-g2-g1.crt'),
};
*/

var options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt'),
  ca: fs.readFileSync('ca.crt'),
  requestCert: true,
  rejectUnauthorized: false
};


var app = https.createServer(options, function(request, response){
        request.addListener('end', function () {
        file.serve(request, response);
    }).resume();     
});

var io = require('socket.io').listen(app, {
    log: false,
    origins: '*:*'
});

io.set('transports', [
    'websocket'
]);

var channels = {};

io.sockets.on('connection', function (socket) {

    console.log("connection ");
    var initiatorChannel = '';

    if (!io.isConnected) {
        io.isConnected = true;
    }

    socket.on('new-channel', function (data) {  
        if (!channels[data.channel]) {
            initiatorChannel = data.channel;
        }
        console.log("new channel ");
        channels[data.channel] = data.channel;     
        onNewNamespace(data.channel, data.sender);
    });


    socket.on('presence', function (channel) {
        console.log("presence ");
        var isChannelPresent = !! channels[channel.channel];
        socket.emit('presence', isChannelPresent);
    });

    socket.on('disconnect', function (channel) {
    });

});

function onNewNamespace(channel, sender) {
   console.log("onNewNamespace ");
    io.of('/' + channel).on('connection', function (socket) {
        
        var username;
        
        if (io.isConnected) {
            io.isConnected = false;
            socket.emit('connect', true);
        }

        socket.on('message', function (data) {
            console.log("message" , data);
            if (data.sender == sender) {
                if(!username) username = data.data.sender;                
                socket.broadcast.emit('message', data.data);
            }
        });
        
        socket.on('disconnect', function() {
            console.log("disconnect");
            if(username) {
                socket.broadcast.emit('user-left', username);
                username = null;
            }
        });
    });
}

app.listen(8084);