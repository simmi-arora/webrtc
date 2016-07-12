module.exports = function(app , properties) {
    
    console.log("< ------------------------realtimecomm-------------------> ");
    
    var io = require('socket.io').listen(app, {
        log: false,
        origins: '*:*'
    });

    io.set('transports', [
        'websocket'
    ]);

    var channels = {};
    var users = {};

    io.sockets.on('connection', function (socket) {

        var initiatorChannel = '';

        if (!io.isConnected) {
            io.isConnected = true;
        }

        socket.on('namespace',function(data){
            users[data.sender]={
                userid: data.sender,
                join_timestamp: new Date().toLocaleString(),
                status:"online"
            }
            onNewNamespace(data.channel, data.sender);
        });

        socket.on('new-channel', function (data) {  
            if (!channels[data.channel]) {
                initiatorChannel = data.channel;
            }
            console.log("------------new channel------------- ", data.channel," by " , data.sender);
            channels[data.channel] = {
                channel: data.channel,
                timestamp: new Date().toLocaleString(),
                users:[data.sender],
                status:"waiting",
                endtimestamp:0,
                log:[new Date().toLocaleString()+":-channel created . User "+data.sender+" waiting "]
            };     
        });

        socket.on('join-channel', function (data) {  
            console.log("------------join channel------------- ", data.channel," by " , data.sender);
            channels[data.channel].users.push(data.sender); 
            channels[data.channel].status=channels[data.channel].users.length + " active members";
            channels[data.channel].log.push(new Date().toLocaleString()+":-User "+data.sender+" joined the channel ");    
        });

        socket.on('leave-channel', function(msg) {
            console.log('leave-channel' , msg);
        });

        socket.on('presence', function (channel) {
            var isChannelPresent = !! channels[channel.channel];
            console.log("------------presence for channel------------ ",channel," is ",isChannelPresent);
            socket.emit('presence', isChannelPresent);
        });

        socket.on('disconnect', function (channel) {
            console.log("disconnect",channel);
        });

        socket.on("admin_enquire",function(data){
            switch (data.ask){
                case "channels":
                    socket.emit('response_to_admin_enquire', module.getAllChannels(data.format));
                break;
                case "users":
                    socket.emit('response_to_admin_enquire', module.getAllActiveUsers(data.format));
                break;
                case "channel_clients":
                    socket.emit('response_to_admin_enquire', module.getChannelClients(data.channel));
                break;
                default :
                    socket.emit('response_to_admin_enquire', "no case matched ");
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
                    console.log(data.data);              
                    socket.broadcast.emit('message', data.data);
                    if(channels[channel]){
                        channels[channel].log.push(new Date().toLocaleString()+":-user "+data.sender+" send message "+JSON.stringify(data.data));    
                    }else if(data.data.left){
                        /*channels[data.data.sessionid].users.pop(data.data.userid);*/ 
                        
                        var i = channels[data.data.sessionid].users.indexOf(data.data.userid);
                        if(i != -1) {
                            channels[data.data.sessionid].users.splice(i, 1);
                        }

                        channels[data.data.sessionid].log.push(new Date().toLocaleString()+":-user "+data.data.userid+" left ");         
                        if( channels[data.data.sessionid].users.length ==0){
                            channels[data.data.sessionid].status="inactive";
                        }else{
                            channels[data.data.sessionid].status=channels[data.data.sessionid].users.length + " active members";
                        }
                    }else{
                        console.log("channels[channel] doesnt exist ");
                    }
                }
            });
            
            socket.on('disconnect', function(data) {
                console.log("disconnect inside new namespace -----",data);
                if(username) {
                    console.log("username " , username);
                    socket.broadcast.emit('user-left', username);
                    channels[channel].log.push(new Date().toLocaleString()+":-user "+username+" left ");    
                    username = null;
                }else{
                    console.log("username not defined ");
                }
            });
        });
    }


    module.getAllChannels=function(format){
        var output={
                response:'channels',
                channels:channels,
                format:format
            };
        return output;
    };

    module.getChannel=function(channelid , format){

        var output={
                response:'users',
                users:channels[channelid],
                format:format
            };
        return output;
    };


    module.getAllActiveUsers=function(format){
        var users=[];
        for (i in Object.keys(channels)) { 
            var key=Object.keys(channels)[i];
            for (j in channels[key].users) {
                users.push(channels[key].users[j]);
            }
        }

        var output={
                response:'users',
                users:users,
                format:format
            };
        return output;
    };

    module.getUser=function(userid , format){

        var output={
                response:'users',
                users:(users[userid]?users[userid]:"notfound"),
                format:format
            };
        return output;
    };

    module.getChannelClients=function(channel){
        
        var output={
                response:'users',
                clients:io.of('/' + channel).clients(),
                format:data.format
            };
        return output;
    };

    console.log(" Socket.io env => "+ properties.enviornment+ " running at\n "+properties.httpsPort);

    return module;
};

