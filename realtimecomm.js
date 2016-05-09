module.exports = function(app , properties) {
    
    console.log(properties);
    console.log("----------realtimecomm---------");
    
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
            console.log("------------new channel------------- ");
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
       console.log(" ---------------> onNewNamespace ");

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

    return   module;
};


