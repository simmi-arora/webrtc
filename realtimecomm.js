module.exports = function(app , properties) {
    
    console.log(properties);
    console.log("< ------------------------realtimecomm-------------------> ");
    
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

        socket.on('namespace',function(data){
            onNewNamespace(data.channel, data.sender);
        });

        socket.on('new-channel', function (data) {  
            if (!channels[data.channel]) {
                initiatorChannel = data.channel;
            }
            console.log("------------new channel------------- ", data.channel , " by " , data.sender);
            channels[data.channel] = {
                channel: data.channel,
                timestamp: new Date().toLocaleString(),
                users:[data.sender],
                status:"active",
                endtimestamp:0
            };     

        });

        socket.on('join-channel', function (data) {  
            console.log("------------join channel------------- ", data.channel , " by " , data.sender);
            channels[data.channel].users.push(data.sender);    
        });

        socket.on('presence', function (channel) {
            var isChannelPresent = !! channels[channel.channel];
            console.log("presence for channel " ,isChannelPresent);
            socket.emit('presence', isChannelPresent);
        });

        socket.on('disconnect', function (channel) {
        });

        socket.on("admin_enquire",function(data){
            switch (data.ask){
                case "channels":
                    socket.emit('response_to_admin_enquire', {
                        response:'channels',
                        channels:channels,
                        format:data.format
                    });
                break;
                case "users":
                    var users=[];
                    console.log("Request for users by Admin");
                    for (i in Object.keys(channels)) { 
                        var key=Object.keys(channels)[i];
                        for (j in channels[key].users) {
                            users.push(channels[key].users[j]);
                        }
                    }
                    console.log(users);
                    socket.emit('response_to_admin_enquire', {
                        response:'users',
                        users:users,
                        format:data.format
                    });
                break;
                case "channel_clients":
                    socket.emit('response_to_admin_enquire', io.of('/' + data.channel).clients());
                break;
                default :
                 socket.emit('response_to_admin_enquire', channels);
            }
           
        });
    });

    function onNewNamespace(channel, sender) {
       console.log(" ---------------> onNewNamespace ", channel);

        io.of('/' + channel).on('connection', function (socket) {
            
            var username;
            if (io.isConnected) {
                io.isConnected = false;
                socket.emit('connect', true);
            }

            socket.on('message', function (data) {
                if (data.sender == sender) {
                    if(!username) username = data.data.sender;                
                    socket.broadcast.emit('message', data.data);
                }
            });
            
            socket.on('disconnect', function() {
                if(username) {
                    socket.broadcast.emit('user-left', username);
                    username = null;
                }
            });
        });
    }

    return   module;
};


