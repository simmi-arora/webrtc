

// var inherits = require('util').inherits;
// var EventEmitter = require('events').EventEmitter;

//instantiates event emitter
// EventEmitter.call(this);

// function handleError(error) {
//   if (error.name === 'ConstraintNotSatisfiedError') {
//     let v = constraints.video;
//     webrtcdev.error(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
//   } else if (error.name === 'PermissionDeniedError') {
//     webrtcdev.error('Permissions have not been granted to use your camera and ' +
//       'microphone, you need to allow the page access to your devices in ' +
//       'order for the demo to work.');
//   }
//   webrtcdev.error(`getUserMedia error: ${error.name}`, error);

//   outgoingVideo = false;
// }



/**
 * function to start session with socket
 * @method
 * @name startSession
 * @param {object} connection
 */
function startSocketSession(rtcConn , socketAddr , sessionid){
    selfuserid = rtcConn.userid;

    return new Promise((resolve, reject )=>{
        try {
            var addr = "/";
            if (socketAddr != "/") {
                addr = socketAddr;
            }
            webrtcdev.log("[startjs] StartSession" + sessionid , " on address " , addr );
            socket = io.connect(addr ,{
                         transports: ['websocket']
            });
           // socket.set('log level', 3);
        } catch (e) {
            webrtcdev.error(" problem in socket connnection", e);
            throw (" problem in socket connnection");
        }

        if (sessionid){
            shownotification("Checking status of  : " + sessionid);
            socket.emit("presence", {
                channel: sessionid
            });
        } else{
            shownotification("Invalid session");
            webrtcdev.error("[startjs] Session id undefined ");
            return; 
        }

        // Socket Listners
        socket.on("connect", function () {
            socket.on('disconnected', function () {
                shownotification("Disconnected from signaller ");
            });
        });

        socket.on("presence", function (channelpresence) {
            //If debug mode is on , show user detaisl at top under mainDiv
            if(debug) showUserStats();
            webrtcdev.log("[startjs] presence for sessionid ", channelpresence);
            if(channelpresence) joinWebRTC(sessionid, selfuserid);
            else                openWebRTC(sessionid, selfuserid , remoteobj.maxAllowed || 10 );
        });

        socket.on("open-channel-resp", function (event) {
            webrtcdev.log("[startjs] --------------open-channel-resp---------------------  ", event);
            if (event.status && event.channel == sessionid) {

                let promise = new Promise(function(resolve, reject) {
                    webrtcdev.log(" [open-channel-resp] ",
                        " Session video:" ,  outgoingVideo,
                        " audio: " , outgoingAudio ,
                        " data: " , outgoingData , 
                        " OfferToReceiveAudio: " , incomingAudio,
                        " OfferToReceiveVideo: " , incomingVideo
                    );

                    rtcConn.connectionType = "open",

                    rtcConn.session = {
                        video: outgoingVideo,
                        audio: outgoingAudio,
                        data: outgoingData
                    },

                    rtcConn.sdpConstraints.mandatory = {
                        OfferToReceiveAudio: incomingAudio,
                        OfferToReceiveVideo: incomingVideo
                    };
                    resolve(); // immediately give the result: 123
                });

                promise.then(
                    rtcConn.open(event.channel, function () {
                        webrtcdev.log(" [startJS] offer/answer webrtc ", selfuserid , " with role " , role)
                    })
                ).then(function(res){
                    updatePeerInfo(selfuserid, selfusername, selfcolor, selfemail, role, "local"),
                    webrtcdev.log(" [startJS] updated local peerinfo for open-channel ")
                }).then(
                    getCamMedia(rtcConn),
                    webrtcdev.log(" [startJS] done cam media ")
                ).catch((reason) => {
                    webrtcdev.error(' [startJS] Handle rejected promise ('+reason+')');
                });
            } else {
                // signaller doesnt allow channel open
                alert("Could not open this channel, Server refused");
                webrtcdev.error(" [startJS] Could not open this channel, Server refused");
            }
            if(event.message)
                shownotification(event.msgtype + " : " + event.message);
        });

        socket.on("join-channel-resp", function (event) {
            webrtcdev.log("[startjs] --------------join-channel-resp---------------------  ", event);
            
            if (event.status && event.channel == sessionid) {
            
                let promise = new Promise(function(resolve, reject) {

                    webrtcdev.log(" [ join-channel-resp ] ",
                        " Session video:" ,  outgoingVideo,
                        " audio: " , outgoingAudio ,
                        " data: " , outgoingData , 
                        " OfferToReceiveAudio: " , incomingAudio,
                        " OfferToReceiveVideo: " , incomingVideo
                    ); 
                    rtcConn.connectionType = "join",
                    rtcConn.session = {
                        video: outgoingVideo,
                        audio: outgoingAudio,
                        data: outgoingData
                    },
                    rtcConn.sdpConstraints.mandatory = {
                        OfferToReceiveAudio: incomingAudio,
                        OfferToReceiveVideo: incomingVideo
                    },
                    rtcConn.remoteUsers = event.users;                        
                    resolve(); // immediately give the result: 123
                });

                promise.then(
                    rtcConn.connectionDescription = rtcConn.join(event.channel),
                    webrtcdev.info(" [startJS] offer/answer webrtc  " , selfuserid , " with role " , role)
                ).then(
                    // for a new joiner , update his local info 
                    updatePeerInfo(selfuserid , selfusername, selfcolor, selfemail, role, "local"),
                    webrtcdev.log(" [startJS] updated local peerinfo for join-channel ")
                ).then(
                    getCamMedia(rtcConn),
                    webrtcdev.log(" [startJS] done cam media ")
                ).catch(
                   (reason) => {
                        webrtcdev.error('Handle rejected promise ('+reason+')');
                    }
                );   
                if(event.message)  
                    shownotification(event.msgtype + " : " + event.message);               
            } else {
                // signaller doesnt allow channel Join
                webrtcdev.error(" [startJS] Could not join this channel, Server refused");
                alert("Coudl not join this channel, Server refused ");
            }
        });

        socket.on("channel-event", function (event) {
            webrtcdev.log("[startjs] --------------channel-event---------------------  ", event);
            if (event.type == "new-join" && event.msgtype != "error") {
                webrtcdev.warn(" [new-join-channel]" ); 

                // check if maxAllowed capacity of the session isnt reached before updating peer info, else return
                if (remoteobj.maxAllowed != "unlimited" && webcallpeers.length <= remoteobj.maxAllowed) {
                    webrtcdev.log("[startjs] channel-event : peer length "+ webcallpeers.length +" is less than max capacity of session  of the session "+ remoteobj.maxAllowed);
                    let participantId = event.data.sender;
                    if(!participantId){
                        webrtcdev.error("[sartjs] channel-event : userid not present in channel-event:"+ event.type)
                        reject("userid not found");
                    }
                    let peerinfo = findPeerInfo(participantId);
                    let name = event.data.extra.name;
                    let color = event.data.extra.color;
                    let email = event.data.extra.email;
                    let role = event.data.extra.role;
                    if (!peerinfo) {
                        webrtcdev.log(" [sartjs] channel-event : PeerInfo not already present, create new peerinfo");
                        // If peerinfo isnot present for new particpant , treat him as Remote 
                        if (name == "LOCAL") {
                            name = "REMOTE";
                            color = remotecolor;
                        }
                        updatePeerInfo(participantId, name , color ,email, role , "remote");
                        // shownotification( event.data.extra.role  + "  " +event.type);
                    }else {
                        // Peer was already present, this is s rejoin 
                        webrtcdev.log(" [sartjs] channel-event : PeerInfo was already present, this is s rejoin, update the peerinfo ");
                        updatePeerInfo(participantId, name, color, email, role , "remote");
                        //shownotification(event.data.extra.role+" "+event.type);
                    }
 
                    if(!peerinfo){
                        peerinfo = findPeerInfo(participantId)
                    }
                    peerinfo.type = "remote";
                    peerinfo.stream = "";
                    peerinfo.streamid = "";
                    updateWebCallView(peerinfo);
                    
                    onLocalConnect() // event emitter for app client 

                } else {
                    // max capacity of session is reached 
                    webrtcdev.error("[sartjs] channel-event : max capacity of session is reached ", remoteobj.maxAllowed);
                    shownotification("Another user is trying to join this channel but max count [ " + remoteobj.maxAllowed + " ] is reached", "warning");
                    return;
                }

            }else{
                webrtcdev.warn(" unhandled channel event "); 
            }
        });

        resolve("done");
    })
    .catch((err)=>{
        webrtcdev.error("[startjs] startSocketSession error -", err);
        reject(err);
    });   
}


/*
 * set Real Time Communication connection
 * @method
 * @name setRtcConn
 * @param {int} sessionid
*/
var setRtcConn = function (sessionid) {

    return new Promise( (resolve, reject)=> {

        webrtcdev.log("[startjs - setRtcConn] initiating RtcConn"),

        rtcConn = new RTCMultiConnection(),

        rtcConn.channel = this.sessionid,
        rtcConn.socketURL = location.hostname+":8085/",

        // turn off media till connection happens
        webrtcdev.log("info", "[startjs] set dontAttachStream , dontCaptureUserMedia , dontGetRemoteStream as true "),
        rtcConn.dontAttachStream =  true,
        rtcConn.dontCaptureUserMedia = true,
        rtcConn.dontGetRemoteStream = true,

        rtcConn.onNewParticipant = function (participantId, userPreferences) {
            webrtcdev.log("[sartjs] rtcconn onNewParticipant, participantId -  ", participantId, " , userPreferences - ",  userPreferences);
            //shownotification("[sartjs] onNewParticipant userPreferences.connectionDescription.sender : " + participantId + " name : "+ remoteusername + " requests new participation ");
            rtcConn.acceptParticipationRequest(participantId, userPreferences);
        },

        rtcConn.onopen = function (event) {
            
            webrtcdev.log("[startjs] rtconn onopen - " , event );
            try {

                webrtcdev.log("[startjs onopen] selfuserid ", selfuserid);
                // Add remote peer userid to remoteUsers
                remoteUsers = rtcConn.peers.getAllParticipants(),
                webrtcdev.log(" [startJS onopen] Collecting remote peers" , remoteUsers);

                // remove old non existing peers, excluded selfuserid 
                for (x in webcallpeers) {
                        webrtcdev.log(" [startJS onopen] webcallpeers["+x+"]", webcallpeers[x] , webcallpeers[x].userid);
                    if(!(remoteUsers.includes(webcallpeers[x].userid)) && (webcallpeers[x].userid != selfuserid)){
                        console.warn("[startjs remove PeerInfo - " , webcallpeers[x].userid );
                        removePeerInfo(webcallpeers[x].userid);
                    }
                }

                // add new peers
                for (x in remoteUsers) {
                    webrtcdev.log(" [startJS] join-channel. Adding remote peer " , remoteUsers[x]);
                    if(remoteUsers[x] == event.userid){
                        let remoterole =  event.extra.role || "participant", // will fail in case of 2 listeners
                        remotecolor = event.extra.color,
                        remoteemail = event.extra.email,
                        remoteusername = event.extra.remoteusername;
                        updatePeerInfo(remoteUsers[x], remoteusername, remotecolor, remoteemail, remoterole , "remote");
                        if (remoterole == "inspector"){
                            shownotificationWarning("This session is being inspected ")
                        }
                    }
                    // }else{
                    //     updatePeerInfo(remoteUsers[x], remoteusername, remotecolor, remoteemail, remoterole , "remote");
                    // }
                    webrtcdev.log(" [startJS onopen] created/updated local peerinfo for open-channel ");
                }

                // Remove Duplicates from remote
                remoteUsers = remoteUsers.filter(function(elem, index, self) {
                    return index == self.indexOf(elem);
                });

                // setting local caches 
                webrtcdev.log(" [startjs onopen] setting cache - channel "+ sessionid +" with self-userid " + selfuserid + " and remoteUsers "+ remoteUsers );
                
                // In debug mode let the users create multiple user sesison in same browser , 
                // do not use localstoarge values to get old userid for resuse
                if(!debug){
                    if(!localStorage.getItem("userid"))
                        localStorage.setItem("userid", selfuserid);
                    
                    if(!localStorage.getItem("remoteUsers"))
                        localStorage.setItem("remoteUsers", remoteUsers);

                    if(!localStorage.getItem("channel"))
                        localStorage.setItem("channel", sessionid);
                }

                 webrtcdev.log(" [startjs onopen] webcallpeers " , webcallpeers);
                // Connect to webrtc  
                if (rtcConn.connectionType == "open")
                    connectWebRTC("open", sessionid, selfuserid, []);
                else if (rtcConn.connectionType == "join")
                    connectWebRTC("join", sessionid, selfuserid, remoteUsers);
                else
                    shownotification("connnection type is neither open nor join", "warning");

                if (timerobj && timerobj.active){
                    startsessionTimer(timerobj);
                    shareTimePeer();
                }
                shownotification(event.extra.name + " joined session ", "info");
                showdesktopnotification();
                
                // if the callback function is defined in client implementation , call it 
                if (typeof onSessionConnect !== 'undefined') {
                    onSessionConnect();
                }
                //eventEmitter.emit('sessionconnected');        // Call Function just in case the client is implementing this

                // stats widget
                if (statisticsobj && statisticsobj.active) {
                    //populate RTP stats 
                    showRtpstats();
                }

            } catch(err) {
                shownotification("problem in session open ", "warning");
                webrtcdev.error("problem in session open", err);
            }
        },

        rtcConn.onMediaError = function (error, constraints) {
            webrtcdev.error("[startJS] onMediaError - ", error, constraints);

            if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
              webrtcdev.warn("enumerateDevices() not supported.");
              return;
            }

            // List cameras and microphones.
            navigator.mediaDevices.enumerateDevices()
            .then(function(devices) {
              devices.forEach(function(device) {
                 webrtcdev.log("[startJS] onMediaError- checkDevices ",device.kind ,  ": " , device.label ," id = " , device.deviceId);
              });
            })
            .catch(function(err) {
              webrtcdev.error('[startJS] onMediaError- checkDevices ', err.name , ": " , err.message);
            });

            // retrying checkDevices 
            // checkDevices();

            webrtcdev.warn("[startJS] onMediaError- Joining without camera Stream");
            shownotification(error.name + " Joining without camera Stream ", "warning");
            localVideoStreaming = false;
            // For local Peer , if camera is not allowed or not connected then put null in video containers 
            var peerinfo = webcallpeers[0];
            peerinfo.type = "Local";
            peerinfo.stream = null;
            peerinfo.streamid = "nothing01";
            updateWebCallView(peerinfo);

            // start local Connect 
            onLocalConnect() // event emitter for app client 
        },

        rtcConn.onstream = function (event) {
            webrtcdev.log("[startJs onstream ] on stream Started event ", event);
            if(event.type=="local") localVideoStreaming = true;

            var peerinfo = findPeerInfo(event.userid) ;
            if (!peerinfo ) {
                webrtcdev.error("[sartjs] onstream - PeerInfo not present in webcallpeers ", event.userid, rtcConn , " creating it now ");
                //userid, username, usecolor, useremail, userrole, type 
                updatePeerInfo(event.userid, event.extra.name, event.extra.color, event.extra.email, event.extra.role, event.type),
                webrtcdev.log(" [startJS] onstream - updated local peerinfo for open-channel "),
                peerinfo = findPeerInfo(event.userid);
                //alert(" Cannot create session for Peer");
            } else if(role=="inspector" && event.type=="local"){
                //ignore
                webrtcdev.info("[startjs] onstream - ignore any incoming stream from inspector");
            } 

            peerinfo.type = event.type;
            peerinfo.stream = event.stream;
            peerinfo.streamid = event.stream.streamid;
            updateWebCallView(peerinfo);
            
            onLocalConnect() // event emitter for app client 
        },

        rtcConn.onstreamended = function (event) {
            webrtcdev.log(" On streamEnded event ", event);
            var mediaElement = document.getElementById(event.streamid);
            if (mediaElement) {
                mediaElement.parentNode.removeChild(mediaElement);
            }
        },

        rtcConn.chunkSize = 50 * 1000,

        rtcConn.onmessage = function (e) {
            webrtcdev.log("[startjs] on message ", e);
            if (e.data.typing) {
                updateWhotyping(e.extra.name + " is typing ...");
            } else if (e.data.stoppedTyping) {
                updateWhotyping("");
            } else {
                var msgpeerinfo = findPeerInfo(e.userid);
                switch (e.data.type) {
                    case "screenshare":
                        if ( e.data.message == "startscreenshare"){ 
                            let scrroomid = e.data.screenid;
                            shownotification("Starting screen share ", scrroomid);
                            //createScreenViewButton();
                            let button = document.getElementById(screenshareobj.button.shareButton.id);
                            button.className = screenshareobj.button.shareButton.class_busy;
                            button.innerHTML = screenshareobj.button.shareButton.html_busy;
                            button.disabled = true;
                            connectScrWebRTC("join", scrroomid);
                        } else if (e.data.message == "screenshareStartedViewing") {
                            screenshareNotification("", "screenshareStartedViewing"); 
                        } else if (e.data.message == "stoppedscreenshare") {
                            shownotification("Screenshare has stopped : " + e.data.screenStreamid);
                            //createScreenViewButton();
                            let button = document.getElementById(screenshareobj.button.shareButton.id);
                            button.className = screenshareobj.button.shareButton.class_off;
                            button.innerHTML = screenshareobj.button.shareButton.html_off;
                            button.disabled = false;
                            webrtcdevCleanShareScreen(e.data.screenStreamid);
                        }else{
                            webrtcdev.warn(" unreognized screen share nessage ",e.data.message );
                        }
                        break;
                    case "chat":
                        updateWhotyping(e.extra.name + " has send message");
                        addNewMessage({
                            header: e.extra.name,
                            message: e.data.message,
                            userinfo: e.data.userinfo,
                            color: e.extra.color
                        });
                        break;
                    case "imagesnapshot":
                        displayList(null, msgpeerinfo, e.data.message, e.data.name, "imagesnapshot");
                        displayFile(null, msgpeerinfo, e.data.message, e.data.name, "imagesnapshot");
                        break;
                    case "videoRecording":
                        displayList(null, msgpeerinfo, e.data.message, e.data.name, "videoRecording");
                        displayFile(null, msgpeerinfo, e.data.message, e.data.name, "videoRecording");
                        break;
                    case "videoScreenRecording":
                        displayList(null, msgpeerinfo, e.data.message, e.data.name, "videoScreenRecording");
                        displayFile(null, msgpeerinfo, e.data.message, e.data.name, "videoScreenRecording");
                        break;
                    case "file":
                        addNewMessage({
                            header: e.extra.name,
                            message: e.data.message,
                            userinfo: getUserinfo(rtcConn.blobURLs[e.userid], "chat-message.png"),
                            color: e.extra.color
                        });
                        break;
                    case "canvas":
                        if (e.data.draw) {
                            CanvasDesigner.syncData(e.data.draw);
                        } else if (e.data.board) {
                            webrtcdev.log(" Canvas : ", e.data);
                            if (e.data.board.from == "remote") {
                                if (e.data.board.event == "open" && isDrawOpened != true)
                                    syncDrawBoard(e.data.board);
                                else if (e.data.board.event == "close" && isDrawOpened == true)
                                    syncDrawBoard(e.data.board);
                            }
                        } else {
                            webrtcdev.warn(" Board data mismatch", e.data);
                        }
                        break;
                    case "texteditor":
                        receiveWebrtcdevTexteditorSync(e.data.data);
                        break;
                    case "codeeditor":
                        receiveWebrtcdevCodeeditorSync(e.data.data);
                        break;
                    case "pointer":
                        var elem = document.getElementById("cursor2");
                        if (elem) {
                            if (e.data.action == "startCursor") {
                                elem.setAttribute("style", "display:block");
                                placeCursor(elem, e.data.corX, e.data.corY);
                            } else if (e.data.action == "stopCursor") {
                                elem.setAttribute("style", "display:none");
                            }
                        } else {
                            alert(" Cursor for remote is not present ");
                        }

                        break;
                    case "timer":
                        if(!msgpeerinfo.time && !msgpeerinfo.zone) {
                            //check if the peer has stored zone and time info
                            msgpeerinfo.time = e.data.time;
                            msgpeerinfo.zone = e.data.zone;
                            webrtcdev.log("[startjs] webcallpeers appended with zone and datetime " , msgpeerinfo);
                        }
                        webrtcdev.log("[startjs] peerTimerStarted, start peerTimeZone and startPeersTime");                        
                        peerTimeZone(e.data.zone, e.userid);
                        startPeersTime(e.data.time, e.data.zone , e.userid);
                        break;
                    case "buttonclick":
                        var buttonElement = document.getElementById(e.data.buttonName);
                        if (buttonElement.getAttribute("lastClickedBy") != rtcConn.userid) {
                            buttonElement.setAttribute("lastClickedBy", e.userid);
                            buttonElement.click();
                        }
                        break;
                    case "syncOldFiles":
                        sendOldFiles();
                        break;
                    case "shareFileRemove":
                        webrtcdev.log(" [startjs] shareFileRemove - remove file : " , e.data._filename);
                        var progressdiv = e.data._element;
                        var filename = e.data._filename;
                        let removeButton = "removeButton"+progressdiv;

                        if(document.getElementById("display"+filename))
                            document.getElementById("display"+filename).setAttribute( "style", "display:none !important");

                        if(document.getElementById(progressdiv)){
                            document.getElementById(progressdiv).setAttribute( "style", "display:none !important");
                            removeFile(progressdiv);
                            webrtcdev.log(" [startjs] shareFileRemove done");
                        }else{
                             webrtcdev.log(" [startjs] shareFileRemove already done since " ,  progressdiv , "element doesnt exist ");
                            // already removed
                            return; 
                        }
                        document.getElementById(removeButton).click();
                        document.getElementById(removeButton).hidden = true;

                        break;
                    case "shareFileStopUpload":
                        var progressid = e.data._element;
                        webrtcdev.log(" [startjs] shareFileStopUpload" ,progressid);
                        // var filename = e.data._filename;

                        //console.log(" here 1 ");
                        for(x in webcallpeers){
                            //console.log("here 2 ")
                            for( y in webcallpeers[x].filearray){
                                //console.log ("here ------------- " , webcallpeers[x].filearray[y]);
                                if(webcallpeers[x].filearray[y].pid == progressid ) {
                                    console.log("[ startjs ] shareFileStopUpload -  filepid " , webcallpeers[x].filearray[y].pid , " | status " , webcallpeers[x].filearray[y].status);
                                    webcallpeers[x].filearray[y].status="stopped";
                                    hideFile( progressid);
                                    removeFile( progressid);
                                    return;
                                }
                            }
                        }
                        //  let stopuploadButton = "stopuploadButton"+filename;
                        // document.getElementById(stopuploadButton).hidden = true;
                        break;
                    default:
                        webrtcdev.warn(" unrecognizable message from peer  ", e);
                        break;
                }
            }
            return;
        },

        rtcConn.sendMessage = function (event) {
            webrtcdev.log(" sendMessage ", event);
            event.userid = rtcConn.userid,
            event.extra = rtcConn.extra,
            rtcConn.sendCustomMessage(event)
        },

        rtcConn.onleave = function (e) {
            /*
            addNewMessage({
                header: e.extra.name,
                message: e.extra.name + " left session.",
                userinfo: getUserinfo(rtcConn.blobURLs[e.userid], "info.png"),
                color: e.extra.color
            }), */

            var peerinfo = findPeerInfo(e.userid) ;

            webrtcdev.log(" RTCConn onleave user", e , " his peerinfo " , peerinfo , " rom webcallpeers " , webcallpeers );
            if (e.extra.name != "undefined")
                shownotification(e.extra.name + "  left the conversation.");
            //rtcConn.playRoleOfInitiator()
            
            /*if(peerinfo){
                destroyWebCallView(peerinfo, function (result) {
                    if (result)
                        removePeerInfo(e.userid);
                });
            }*/
            //eventEmitter.emit('sessiondisconnected', peerinfo);
        },

        rtcConn.onclose = function (e) {
            webrtcdev.log(" RTCConn on close conversation ", e);
            /*alert(e.extra.name + "closed ");*/
        },

        rtcConn.onEntireSessionClosed = function (event) {
            rtcConn.attachStreams.forEach(function (stream) {
                stream.stop();
            });
            shownotification("Session Disconneted");
            //alert(" Entire Session Disconneted ");
            //eventEmitter.emit('sessiondisconnected', '');
        },

        rtcConn.onFileStart = function (file) {
            webrtcdev.log("[start] on File start " , file);
            webrtcdev.log("[start] on File start description  , name :", file.name , " from -> ", file.userid , " to ->" , file.remoteUserId);
            
            //alert ( "send fille to " + file.remoteUserId , findPeerInfo(file.remoteUserId).name);

            var progressid = file.uuid+"_"+file.userid+"_"+file.remoteUserId;
            var peerinfo = findPeerInfo(file.userid);
            // check if not already present , 
            // done to include one entry even if same file is being sent to multiple particpants 
            if(!peerinfo.filearray.includes("name : file.name")){
                // add to peerinfo file array
                peerinfo.filearray.push({
                    "pid"  : progressid,
                    "name" : file.name,
                    "status" : "progress",
                    "from" : file.userid ,
                    "to"   : file.remoteUserId
                });

                // create multiple instances  , also pass file from and file to for the progress bars           
                addProgressHelper(file.uuid, peerinfo, file.name, file.maxChunks, file , "fileBoxClass" , file.userid , file.remoteUserId );
            }
            onFileShareStart(file);
        },

        rtcConn.onFileProgress = function (e) { 
            //.log("[start] on File progress uuid : ", e.uuid , " , name :", e.name , 
            //   " from -> ", e.userid , " to ->" , e.remoteUserId);
            try{
                // if the file has already recahed max chunks then exit 
                if( e.currentPosition > e.maxChunks ) return;

                var progressid = e.uuid+"_"+e.userid+"_"+e.remoteUserId;
                var r = progressHelper[progressid];
                // webrtcdev.log("[start] on File progress ",
                //     " progresshelper id - " , progressid , 
                //     "currentPosition - " , e.currentPosition ,
                //     "maxchunks - ", e.maxChunks , 
                //     "progress.max - " , r.progress.max);

                r && (r.progress.value = e.currentPosition || e.maxChunks || r.progress.max, updateLabel(r.progress, r.label));
            }catch(err){
                webrtcdev.error("[startjs] Problem in onFileProgress " , err);
            }
        },

        rtcConn.onFileEnd = function (file) {
            webrtcdev.log("[start] On file End description , file :", file , " from -> ", file.userid , " to ->" , file.remoteUserId);
            
            //alert ( "end file to " + file.remoteUserId , findPeerInfo(file.remoteUserId).name);

            var progressid = file.uuid+"_"+file.userid+"_"+file.remoteUserId;
            var filename = file.name;

            // find duplicate file
            // for(x in webcallpeers){
            //     for (y in webcallpeers[x].filearray){
            //         webrtcdev.log(" Duplicate find , Files shared  so far " , webcallpeers[x].filearray[y].name);
            //         if(webcallpeers[x].filearray[y].name==filename){
            //             //discard file as duplicate
            //             webrtcdev.error("duplicate file shared ");
            //             return;
            //         }
            //     }
            // }

            // push to peerinfo's file array
            var peerinfo = findPeerInfo(file.userid); 
            if (peerinfo != null)  {
                for( x in peerinfo.filearray)
                    if(peerinfo.filearray[x].name == filename && peerinfo.filearray[x].pid == progressid ){
                        //update filearray status to finished
                        peerinfo.filearray[x].status = "finished";

                        // Hide the stop upload button for this file 
                        var stopuploadbutton = document.getElementById("stopuploadButton"+progressid);
                        if(stopuploadbutton) stopuploadbutton.hidden = true;
                    }
            }

            // if all file progress bars with the name are finsihed 
            //- tbd

            // Display on File Viewer and List
            webrtcdev.log("[start] onFileEnd - Display on File Viewer and List -" , file.url, filename, file.type);
            displayFile(file.uuid, peerinfo, file.url, filename, file.type);

            webrtcdev.log("[startjs] onFileEnd - Display List -" , filename+file.uuid , document.getElementById(filename+file.uuid) );
            // if the file is from me ( orignal share ) then diaply listing in viewbox just one
            if(selfuserid == file.userid && document.getElementById(filename+file.uuid)){
                return;
            }
            displayList(file.uuid, peerinfo, file.url, filename, file.type);
            onFileShareEnded(file);

            //start the pending transfer from pendingFileTransfer.push(file);
            if(pendingFileTransfer.length >= pendingFileTransferlimit){
                webrtcdev.log("resuming pending/paused file " , pendingFileTransfer[0]);
                document.getElementById(pendingFileTransfer[0].name).hidden = true;
                sendFile(pendingFileTransfer[0]);
                pendingFileTransfer.pop();
            }
        },

        rtcConn.takeSnapshot = function (userid, callback) {
            takeSnapshot({
                userid: userid,
                connection: connection,
                callback: callback
            });
        },

        rtcConn.connectionType = null,
        rtcConn.remoteUsers = [],

        rtcConn.extra = {
            // do not use tempuserid for uuid now 
            uuid : rtcConn.userid ,
            name : selfusername|| "",
            color: selfcolor|| "",
            email: selfemail || "",
            role : role || "participant"
        },

        rtcConn.socketMessageEvent = 'RTCMultiConnection-Message',
        rtcConn.socketCustomEvent = 'RTCMultiConnection-Custom-Message',

        rtcConn.enableFileSharing = true,
        rtcConn.filesContainer = document.body || document.documentElement,

        rtcConn.iceServers = webrtcdevIceServers,
        
        webrtcdev.log(" [startjs] rtcConn : ", rtcConn);

        //tempuserid = supportSessionRefresh();
        //rtcConn.userid = tempuserid;
        
        // if(this.turn!=null && this.turn !="none"){
        //     if (!webrtcdevIceServers) {
        //         return;
        //     }
        //     webrtcdev.info(" WebRTC dev ICE servers ", webrtcdevIceServers);
        //     rtcConn.iceServers = webrtcdevIceServers;
        //     //window.clearInterval(repeatInitilization);
        // }

        if(rtcConn)
            resolve("done");
        else 
            reject("failed");
    })
    .catch((err)=>{
        webrtcdev.error("setRtcConn" , err);
        reject(err);
    });
}

/*
* Support Session Refresh
*/
function supportSessionRefresh(){
    //alert(" old Userid " + localStorage.getItem("userid") + " | old channel  "+ localStorage.getItem("channel") );
    webrtcdev.log(" [startJS ] check for session refresh/user refreshed" , 
        " Channel in local stoarge - " , localStorage.getItem("channel") , 
        " Current Channel  - " , rtcConn.channel,
        " match ", localStorage.getItem("channel") == rtcConn.channel );

    if(localStorage.getItem("channel") == rtcConn.channel && localStorage.getItem("userid")){
        webrtcdev.log(" [startJS ] supportSessionRefresh - rejoining with old user id " + localStorage.getItem("userid") );
        selfuserid = localStorage.getItem("userid");
        shownotification("Refreshing the Session");
        return selfuserid;
    }
    //return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
    return rtcConn.userid;;
}

function detectWebcam(callback) {
  let md = navigator.mediaDevices;
  if (!md || !md.enumerateDevices) return callback(false);
  md.enumerateDevices().then(devices => {
    callback(devices.some(device => 'videoinput' === device.kind));
  })
}

/*
* Check Microphone and Camera Devices
*/
function checkDevices(resolveparent , rejectparent , incoming , outgoing){
    // if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    //   webrtcdev.warn("enumerateDevices() not supported.");
    //   return;
    // }

    // List cameras and microphones.
    // navigator.mediaDevices.enumerateDevices()
    // .then(function(devices) {
    //   devices.forEach(function(device) {
    //      webrtcdev.log("[startJS] checkDevices ",device.kind ,  ": " , device.label ," id = " , device.deviceId);
    //   });
    // })
    // .catch(function(err) {
    //   webrtcdev.error('[startJS] checkDevices ', err.name , ": " , err.message);
    // });
    return new Promise(function(resolve, reject) {

        detectWebcam(function(hasWebcam) {
            console.log('Webcam: ' + (hasWebcam ? 'yes' : 'no'));
            resolve("ok");
        });

        // DetectRTC.load(function() {
        //     if(!DetectRTC) resolve("detectRTC not found");
        //     webrtcdev.log(" [startJS] : DetectRTC - " , DetectRTC , DetectRTC.MediaDevices);

        //     if(role == "inspector"){
        //         resolve("ok");
        //     }

        //     if(!DetectRTC.isWebsiteHasWebcamPermissions || !DetectRTC.isWebsiteHasMicrophonePermissions){
        //         //permission not found , retry getting permissions 
        //         webrtcdev.warn(" [startJS] checkDevices : permission not found for mic or camera , try getusermedia again ");
        //         var promise1 = new Promise(function(resolvec, rejectc) {
        //             webrtcdev.log(" [startJS] checkDevices : retry to getusermedia  inattempt to get device pemrissions " );
        //             navigator.mediaDevices.getUserMedia({audio: true, video: true})
        //                 .then(function(stream) {
        //                     webrtcdev.log(" [startJS] checkDevices : DetectRTC  recheck stream " , stream );
        //                     resolvec('foo');
        //                 }).catch(function(err) {
        //                     webrtcdev.error('[startJS] checkDevices : DetectRTC  recheck stream error: ', err);
        //                     console.error(err.code , err.name , err.message);
        //                     rejectc(err);
        //                 })
        //         }).catch(function(err) {
        //              webrtcdev.error('[startJS] checkDevices : DetectRTC : ', err);
        //             // of user still doesnt give permission to browser  set outgoing values and stat the session by resolve still 
        //             if (!DetectRTC.isWebsiteHasWebcamPermissions ){
        //                 if(role != "inspector") alert(" Your browser doesnt have permission for accessing webcam", "warning");
        //                 outgoing.video = false;
        //             }

        //             if(!DetectRTC.isWebsiteHasMicrophonePermissions){
        //                 if(role != "inspector") alert(" Your browser doesnt have permission for accessing microphone", "warning");
        //                 outgoing.audio = false;
        //             }
        //         });

        //     }else if(!DetectRTC.hasWebcam || !DetectRTC.hasMicrophone){
        //         // devices not found
        //         if(!DetectRTC.hasWebcam){
        //             alert(" Your browser doesnt have webcam" , "warning");
        //             outgoing.video = false;
        //         } 

        //         if(!DetectRTC.hasMicrophone){
        //             alert(" Your browser doesnt have microphone", "warning");   
        //             outgoing.audio = false ;
        //         }
        //     }
            
        //     //Case around speaker absent
        //     if(!DetectRTC.hasSpeakers){
        //         alert(" Your browser doesnt have speakers", "warning"); 
        //         incoming.audio = false ;     
        //     }

        //     resolve("ok");
        // });
    }).then(function(value) {
        webrtcdev.info("checkdevices complete"),
        resolveparent("done");
    }).catch((err) =>{
        webrtcdev.error("Yes detectRTC failed to load " , err);
        resolveparent("proceed");
    });
}

/*
* Get Audio and Video Stream Media
*/
function getCamMedia(rtcConn){
    rtcConn.dontAttachStream =  false,
    rtcConn.dontCaptureUserMedia = false,
    rtcConn.dontGetRemoteStream = false;

    webrtcdev.log(" [startJS] getCamMedia  role :" , role );
    return new Promise(function (resolve, reject) {
        if(role == "inspector"){
            console.log("[startJS] getCamMedia  - Joining as inspector without camera Video");
        }else if(outgoingVideo){
            webrtcdev.log("[startJS] getCamMedia  - Capture Media ");
            rtcConn.getUserMedia();  // not wait for the rtc conn on media stream or on error 
        }else{
            webrtcdev.error(" [startJS] getCamMedia - dont Capture outgoing video " , outgoingVideo);
            onNoCameraCard();
        }
        resolve("success");
    }).catch(
       (reason) => {
        webrtcdev.error('[startJS] getCamMedia  - rejected promise ('+reason+')');
    });
}

/**
 * set Widgets.
 */
var setWidgets = function (rtcConn) {

    return new Promise (function(resolve, reject){

        // ---------------------------------- Chat Widget --------------------------------------------------
        if (chatobj.active) {
            if (chatobj.inputBox && chatobj.inputBox.text_id && document.getElementById(chatobj.inputBox.text_id)) {
                webrtcdev.log("Assign chat Box ");
                assignChatBox(chatobj);
            } else {
                webrtcdev.log("Create chat Box ");
                createChatBox(chatobj);
            }
            webrtcdev.log("chat widget loaded ");
        } else {
            webrtcdev.log("chat widget not loaded ");
        }

        // ---------------------------------- Screen record Widget --------------------------------------------------
        if (screenrecordobj && screenrecordobj.active && role !="inspector") {
            if (screenrecordobj.button.id && document.getElementById(screenrecordobj.button.id)) {
                webrtcdev.log("Assign Record Button ");
                assignScreenRecordButton(screenrecordobj);
            } else {
                webrtcdev.log("Create Record Button ");
                createScreenRecordButton(screenrecordobj);
            }
            webrtcdev.log(" screen record widget loaded ");
        } else if (screenrecordobj && !screenrecordobj.active) {
            if (screenrecordobj.button && screenrecordobj.button.id && document.getElementById(screenrecordobj.button.id)) {
                document.getElementById(screenrecordobj.button.id).className = "inactiveButton";
            }
            webrtcdev.log(" screen record widget not loaded ");
        }

        // ---------------------------------- Screenshare Widget --------------------------------------------------
        if (screenshareobj.active) {
            //................ TBD
            if (screenrecordobj.button.id && document.getElementById(screenrecordobj.button.id)) {
                webrtcdev.log("Assign Record Button ");
                assignScreenShareButton(screenshareobj.button.shareButton);
            } else {
                webrtcdev.log("Create Record Button ");
                createScreenShareButton();
            }
            webrtcdev.log(" screen share widget loaded ");
        } else {
            webrtcdev.log(" screen share widget not loaded ");
        }

        // ---------------------------------- Reconnect Widget --------------------------------------------------
        if (reconnectobj && reconnectobj.active) {
            if (reconnectobj.button.id && document.getElementById(reconnectobj.button.id)) {
                webrtcdev.log("Rconnect Button Assigned");
                assignButtonRedial(reconnectobj.button.id);
            } else {
                webrtcdev.log("Rconnect Button created");
                createButtonRedial(reconnectobj);
            }
            webrtcdev.log(" reconnect widget loacded ");
        } else if (reconnectobj && !reconnectobj.active) {
            if (reconnectobj.button && reconnectobj.button.id && document.getElementById(reconnectobj.button.id)) {
                document.getElementById(reconnectobj.button.id).className = "inactiveButton";
            }
            webrtcdev.log(" reconnect widget not loaded ");
        }

        // ---------------------------------- Cursor Widget --------------------------------------------------
        if (cursorobj.active) {
            document.getElementById("cursor1").setAttribute("style", "display:none");
            document.getElementById("cursor2").setAttribute("style", "display:none");
        }

        // ---------------------------------- Listenin Widget --------------------------------------------------
        if (listeninobj && listeninobj.active) {
            if (listeninobj.button.id && document.getElementById(listeninobj.button.id)) {
                //assignButtonRedial(reconnectobj.button.id);
            } else {
                //createButtonRedial();
            }
            webrtcdev.log(" listen in widget loaded ");
        } else if (listeninobj && !listeninobj.active) {
            if (listeninobj.button.id && document.getElementById(listeninobj.button.id)) {
                document.getElementById(listeninobj.button.id).className = "inactiveButton";
            }
            webrtcdev.log(" listenein widget not loaded ");
        }

        // ---------------------------------- Timer Widget --------------------------------------------------
        if (timerobj && timerobj.active) {
            startTime();
            timeZone();
            activateBttons(timerobj);
            document.getElementById(timerobj.container.id).hidden = true;
        } else if (timerobj && !timerobj.active) {
            if (timerobj.button.id && document.getElementById(timerobj.button.id)) {
                document.getElementById(timerobj.button.id).className = "inactiveButton";
            }
        }

        // ---------------------------------- Draw Widget --------------------------------------------------
        if (drawCanvasobj && drawCanvasobj.active) {
            if (drawCanvasobj.container && drawCanvasobj.container.id && document.getElementById(drawCanvasobj.container.id)) {
                document.getElementById(drawCanvasobj.container.id).hidden = true;
            }
            if (drawCanvasobj.button && drawCanvasobj.button.id && document.getElementById(drawCanvasobj.button.id)) {
                assigndrawButton(drawCanvasobj);
            } else {
                createdrawButton(drawCanvasobj);
            }

            CanvasDesigner = (function () {
                var iframe;
                var tools = {
                    line: true,
                    pencil: true,
                    dragSingle: true,
                    dragMultiple: true,
                    eraser: true,
                    rectangle: true,
                    arc: true,
                    bezier: true,
                    quadratic: true,
                    text: true
                };

                var selectedIcon = 'pencil';

                function syncData(data) {
                    if (!iframe) return;

                    iframe.contentWindow.postMessage({
                        canvasDesignerSyncData: data
                    }, '*');
                }

                var syncDataListener = function (data) {
                    webrtcdev.log("syncDataListener", data);
                };

                function onMessage() {
                    if (!event.data || !event.data.canvasDesignerSyncData) return;
                    syncDataListener(event.data.canvasDesignerSyncData);
                }

                /*window.addEventListener('message', onMessage, false);*/

                var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
                var eventer = window[eventMethod];
                var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

                // Listen to message from child window
                eventer(messageEvent, function (e) {
                    webrtcdev.log("CanvasDesigner parent received message : ", e.data);

                    if (e.data.modalpopup) {
                        saveButtonCanvas.click();
                        //return;
                    } else if (e.data || e.data.canvasDesignerSyncData) {
                        syncDataListener(e.data.canvasDesignerSyncData);
                    } else if (!e.data || !e.data.canvasDesignerSyncData) {
                        webrtcdev.log("parent received unexpected message");
                        //return;
                    }

                }, false);

                return {
                    appendTo: function (parentNode) {
                        iframe = document.createElement('iframe');
                        iframe.id = "drawboard";
                        iframe.src = 'widget.html?tools=' + JSON.stringify(tools) + '&selectedIcon=' + selectedIcon;
                        iframe.style.width = "100%";
                        iframe.style.height = "100%";
                        iframe.style.border = 0;
                        parentNode.appendChild(iframe);
                    },
                    destroy: function () {
                        if (iframe) {
                            iframe.parentNode.removeChild(iframe);
                        }
                        window.removeEventListener('message', onMessage);
                    },
                    addSyncListener: function (callback) {
                        syncDataListener = callback;
                    },
                    syncData: syncData,
                    setTools: function (_tools) {
                        tools = _tools;
                    },
                    setSelected: function (icon) {
                        if (typeof tools[icon] !== 'undefined') {
                            selectedIcon = icon;
                        }
                    }
                };
            })();
            webrtcdev.log(" draw widget loaded ");
        } else if (drawCanvasobj && !drawCanvasobj.active) {
            if (drawCanvasobj.button && drawCanvasobj.button.id && document.getElementById(drawCanvasobj.button.id)) {
                document.getElementById(drawCanvasobj.button.id).className = "inactiveButton";
            }
            webrtcdev.log(" draw widget not loaded ");
        }

        // ---------------------------------- TextEditor Widget --------------------------------------------------
        if (texteditorobj.active) {
            createTextEditorButton();
        }

        // ---------------------------------- CodeEditor Widget --------------------------------------------------
        if (codeeditorobj.active) {
            createCodeEditorButton();
        }

        // ---------------------------------- Fileshare Widget --------------------------------------------------
        if (fileshareobj.active) {

            webrtcdev.log(" fileshareobj - rtcConn ", rtcConn),

            rtcConn.enableFileSharing = true;
            // //rtcConn.filesContainer = document.body || document.documentElement;
            // /*setFileProgressBarHandlers(rtcConn);*/
            rtcConn.filesContainer = document.getElementById(fileshareobj.fileShareContainer);
            if (fileshareobj.button.id && document.getElementById(fileshareobj.button.id)) {
                assignFileShareButton(fileshareobj);
            } else {
                createFileShareButton(fileshareobj);
            }
            webrtcdev.log(" File sharing widget loaded ");
        } else {
            webrtcdev.log(" File sharing widget not loaded ");
        }

        // ---------------------------------- stats Widget --------------------------------------------------
        if(statisticsobj && statisticsobj.active){
            try{
                document.getElementById(statisticsobj.statsConainer).innerHTML="";
            }catch(e){
                webrtcdev.error(" statisticsobj statsConainer not found" , e );
            }
        }

        // ---------------------------------- Help Widget --------------------------------------------------
        if(helpobj && helpobj.active){
            try{
                document.getElementById(helpobj.helpContainer).innerHTML="";
            }catch(e){
                webrtcdev.error(" helpobj helpContainer not found" , e );
            }
        }
        resolve("success");
    });
};


/**
 * Update local cache of user sesssion based object called peerinfo
 * @method
 * @name updateWebCallView
 * @param {json} peerInfo
 */
function updateWebCallView(peerinfo){
    let myrole = role;
    webrtcdev.log("[start.js - updateWebCallView] start with ",
        " peerinfo" , peerinfo , 
        " | myrole :", myrole ,
        " | video indexOf : ", peerinfo.vid.indexOf("videoundefined") );

    try{
        switch(myrole){
            
            case "inspector":
                var vi=0;
                for(var v=0; v<remoteVideos.length; v++){
                    webrtcdev.log("Remote Video index array " , v , " || ", remoteVideos[v] , 
                        document.getElementsByName(remoteVideos[v])  , 
                        document.getElementsByName(remoteVideos[v]).src);
                    if(remoteVideos[v].src){
                        vi++;
                    }
                }

                var remvid;
                var video = document.createElement('video');
                remoteVideos[vi] = video;
                document.getElementById(remoteobj.videoContainer).appendChild(video);
                remvid = remoteVideos[vi];
                webrtcdev.log(" [start.js - updateWebCallView] role-inspector , attaching stream" , remvid, peerinfo.stream );
                attachMediaStream(remvid, peerinfo.stream);
                if(remvid.hidden) removid.hidden = false;
                remvid.id = peerinfo.videoContainer;
                remvid.className = remoteobj.videoClass;
                //attachControlButtons(remvid, peerInfo); 
                if(remoteobj.userDisplay && peerinfo.name ){
                    attachUserDetails( remvid, peerinfo); 
                }
                if(remoteobj.userMetaDisplay && peerinfo.userid){
                    attachMetaUserDetails( remvid, peerinfo ); 
                }
                // Hide the unsed video for Local
                var _templ = document.getElementsByName(localVideo)[0];
                if(_templ) _templ.hidden=true;

                for(v in remoteobj.videoarr){
                    var _templ2 = document.getElementsByName(remoteobj.videoarr[v])[0];
                    if(_templ2) _templ2.setAttribute("style","display:none");
                }

                for(t in document.getElementsByClassName("timeBox")){
                    document.getElementsByClassName("timeBox")[t].hidden=true;
                }
            break;

            case "host":
            case "guest":
            case "participant":

                if(peerinfo.vid.indexOf("videolocal") > -1 ){
                    webrtcdev.info(" [start.js - updateWebCallView] role-participant , peerinfo Vid is Local");
                    // when video is local
                    if(localVideo && document.getElementsByName(localVideo)[0]){
                        var vid = document.getElementsByName(localVideo)[0];
                        vid.muted = true;
                        vid.className = localobj.videoClass;
                        attachMediaStream(vid, peerinfo.stream);

                        // if(localobj.userDisplay && peerInfo.name)
                        //     attachUserDetails( vid, peerInfo ); 

                        if(localobj.userDisplay && peerinfo.name)
                            attachUserDetails( vid, peerinfo ); 
                        
                        if(localobj.userMetaDisplay && peerinfo.userid)
                            attachMetaUserDetails( vid , peerinfo ); 

                        webrtcdev.info(" User is alone in the session  , hiding remote video container" , 
                        "showing users single video conrainer and attaching attachMediaStream and attachUserDetails ");

                    }else{
                        //alert(" Please Add a video container in config for single");
                        webrtcdev.error(" No local video conatainer in localobj -> " , localobj);
                    }

                } else if(peerinfo.vid.indexOf("videoremote") > -1) {
                    webrtcdev.info(" [start.js - updateWebCallView] role-participant , peerinfo Vid is Remote");
                    //when video is remote 

                    // handling local video transition to active
                    if( outgoingVideo && localVideo && selfVideo ){
                        /*chk if local video is added to conf , else adding local video to index 0 */
                        //localvid : video container before p2p session 
                        var localvid = document.getElementsByName(localVideo)[0];
                        // selfvid : local video in a p2p session
                        var selfvid = document.getElementsByName(selfVideo)[0];
                        
                        if(selfvid.played.length==0){
                            if(localvid.played.lebth>0){
                                reattachMediaStream(selfvid, localvid);
                            }else{
                                attachMediaStream(selfvid, webcallpeers[0].stream);
                            }
                            selfvid.id = webcallpeers[0].videoContainer;
                            selfvid.className = remoteobj.videoClass;
                            selfvid.muted = true;
                            attachControlButtons( selfvid, webcallpeers[0]); 

                            if(localobj.userDisplay && webcallpeers[0].name){
                                attachUserDetails( selfvid, webcallpeers[0] );
                            } 

                            if(localobj.userMetaDisplay && webcallpeers[0].userid){
                                attachMetaUserDetails( selfvid, webcallpeers[0] ); 
                            }
                        }else{
                            webrtcdev.log(" not uppdating self video as it is already playing ");
                        }

                        webrtcdev.info(" User is joined by a remote peer , hiding local video container" , 
                        "showing users conf video container and attaching attachMediaStream and attachUserDetails ");

                    }else if(!outgoingVideo){
                        webrtcdev.error(" Outgoing Local video is " , outgoingVideo);
                    }else{
                        //alert(" Please Add a video container in config for video call ");
                        webrtcdev.error(" Local video container not defined ");
                    }

                    // handling remote video addition 
                    if(remoteVideos){

                        /*get the next empty index of video and pointer in remote video array */
                        var vi=0;
                        for(v in remoteVideos){
                            webrtcdev.log("Remote Video index array " , v , " || ", remoteVideos[v] , 
                                document.getElementsByName(remoteVideos[v]),  document.getElementsByName(remoteVideos[v]).src);
                            if(document.getElementsByName(remoteVideos[v])[0] && document.getElementsByName(remoteVideos[v])[0].src !=""){
                                vi++;
                            }
                            // }else if(remoteVideos[v].video){
                            //     vi++;
                            // }
                        }

                        try{
                            if(remoteobj.maxAllowed=="unlimited"){
                                webrtcdev.log("remote video is unlimited , creating video for remoteVideos array ");
                                var video = document.createElement('video');
                                //video.autoplay = "autoplay";
                                remoteVideos[vi] = {
                                    "userid": peerinfo.userid, 
                                    "video" : video
                                };
                                document.getElementById(remoteobj.dynamicVideos.videoContainer).appendChild(video);
                            }else{
                                webrtcdev.log("remote video is limited to size maxAllowed , current index ", vi);
                                var remVideoHolder = document.getElementsByName(remoteVideos[vi]);
                                webrtcdev.log("searching for video with index ", vi , " in remote video : " , remVideoHolder[0] );
                                if(remVideoHolder){
                                    if(remVideoHolder[0]){
                                        remoteVideos[vi] = { 
                                            "userid": peerinfo.userid, 
                                            "video" : remVideoHolder[0] 
                                        };
                                    }
                                }else{
                                    // since remvideo holder doesnt exist just overwrite the last remote with the video 
                                    remoteVideos[remoteVideos.length -1] = { 
                                        "userid": peerinfo.userid, 
                                        "video" : remVideoHolder[0] 
                                    };
                                }
                            }

                            attachMediaStream(remoteVideos[vi].video, peerinfo.stream);
                            //if(remoteVideos[vi].video.hidden) remoteVideos[vi].video.hidden = false;
                            showelem(remoteVideos[vi].video);

                            remoteVideos[vi].video.id = peerinfo.videoContainer;
                            remoteVideos[vi].video.className = remoteobj.videoClass;
                            attachControlButtons(remoteVideos[vi].video, peerinfo); 

                            if(remoteobj.userDisplay && peerinfo.name ) {
                                attachUserDetails( remoteVideos[vi].video, peerinfo); 
                            }
                            
                            if(remoteobj.userMetaDisplay && peerinfo.userid) {
                                attachMetaUserDetails( remoteVideos[vi].video, peerInfo ); 
                            }
                        
                        }catch(e){
                            webrtcdev.error(e);
                        }

                    }else{
                        alert("remote Video containers not defined");
                    }
                
                } else {
                    webrtcdev.error(" PeerInfo vid didnt match either case ");
                }
            break;

            default:
                webrtcdev.log("[start.js - updateWebCallView] Switch default case");
        }

    }catch(err){
        webrtcdev.error("[start.js - updateWebCallView] " , err);
    }

    webrtcdev.log(" [start.js - updateWebCallView] - finish");
}


/**
 * update info about a peer in list of peers (webcallpeers)
 * @method
 * @name updatePeerInfo
 * @param {string} userid
 * @param {string} username
 * @param {string} usercolor
 * @param {string} type
 */
function updatePeerInfo(userid, username, usecolor, useremail, userrole, type ){
    webrtcdev.log("updating peerInfo: " , userid , username , usecolor , useremail, userrole ,  type);
    var updateflag = -1;

    return new Promise(function (resolve, reject) {
        // if userid deosnt exist , exit
        if (!userid){
            console.error("[startjs] userid is null / undefined, cannot create PeerInfo");
            reject("userid is null / undefined, cannot create PeerInfo");
            return;
        }

        // if userid is already present in webcallpeers , exit
        for(var x in webcallpeers){
            if(webcallpeers[x].userid == userid) {
                webrtcdev.log("UserID is already existing in webcallpeers, update the fields only at index ", x);
                updateflag=x;
                break;
            }
        }

        // check if total capacity of webcallpeers has been reached 
        peerInfo = { 
            videoContainer : "video"+userid,
            videoHeight : null,
            videoClassName: null,
            userid : userid, 
            name  :  username,
            color : usecolor,
            email : useremail,
            role : userrole,
            controlBarName: "control-video"+userid,
            filearray : [],
            vid : "video"+type+"_"+userid
        };

        if(fileshareobj.active ){
            if(fileshareobj.props.fileShare=="single"){
                peerInfo.fileShare={
                    outerbox: "widget-filesharing-box",
                    container : "widget-filesharing-container",
                    minButton: "widget-filesharing-minbutton",
                    maxButton: "widget-filesharing-maxbutton",
                    rotateButton: "widget-filesharing-rotatebutton",
                    closeButton: "widget-filesharing-closebutton"
                };
            }else{
                peerInfo.fileShare={
                    outerbox: "widget-filesharing-box"+userid,
                    container : "widget-filesharing-container"+userid,
                    minButton: "widget-filesharing-minbutton"+userid,
                    maxButton: "widget-filesharing-maxbutton"+userid,
                    rotateButton: "widget-filesharing-rotatebutton"+userid,
                    closeButton: "widget-filesharing-closebutton"+userid
                };
            }

            if(fileshareobj.props.fileList=="single"){
                peerInfo.fileList={
                    outerbox: "widget-filelisting-box",
                    container : "widget-filelisting-container"
                };
            }else{
                peerInfo.fileList={
                    outerbox: "widget-filelisting-box"+userid,
                    container : "widget-filelisting-container"+userid
                };
            }
        }

        if(updateflag>-1){
            webcallpeers[updateflag] = peerInfo;
            webrtcdev.log("[startjs] updated peerInfo: ",peerInfo);
        }else{
            webcallpeers.push(peerInfo);
            webrtcdev.log("[startjs] created peerInfo: ",peerInfo);
        }
        resolve("done");
    })
    .catch((err) =>{
        webrtcdev.error(" Promise rejected " , err);
    });
}

/**
 * update info about a peer in list of peers (webcallpeers)
 * @method
 * @name removePeerInfo
 * @param {string} userid
 * @param {string} usernamess
 * @param {string} usercolor
 * @param {string} type
 */
function removePeerInfo(userid){
    webrtcdev.log(" [startjs] removePeerInfo  Before  " , webcallpeers);
    webrtcdev.log(" [startjs] removePeerInfo  peerInfo: " , userid);
    webcallpeers.splice(userid, 1);
    webrtcdev.log(" [startjs] removePeerInfo  After removing: " , webcallpeers);
}

/**
 * destroy users webcall view
 * @method
 * @name destroyWebCallView
 * @param {json} peerInfo
 * @param {function} callback
 */
function destroyWebCallView(peerInfo , callback){
    webrtcdev.log(" [starjs] destroyWebCallView peerInfo" , peerInfo);
    if( peerInfo.videoContainer && document.getElementById(peerInfo.videoContainer))
        document.getElementById(peerInfo.videoContainer).src="";
    
    /*if(fileshareobj.active){
        if(fileshareobj.props.fileShare){
            if(fileshareobj.props.fileShare=="divided")
                webrtcdev.log("dont remove it now ");
                //createFileSharingDiv(peerInfo);
            else if(fileshareobj.props.fileShare=="single")
                webrtcdev.log("No Seprate div created for this peer  s fileshare container is single");
            else
                webrtcdev.log("props undefined ");
        }
    }*/

    callback(true);
}

/**
 * find information about a peer form array of peers based on userid
 * @method
 * @name findPeerInfo
 * @param {string} userid
 */
var findPeerInfo = function (userid){
    //var peerInfo;
    /*    
    if(rtcConn.userid==userid){
        webrtcdev.log("PeerInfo is found for initiator", webcallpeers[0]);
        return webcallpeers[0];
    }
    */
    for(x in webcallpeers){
        if(webcallpeers[x].userid==userid) {
            return webcallpeers[x];
        }
    }
    return null;
}


/**
 * Open a WebRTC socket channel
 * @method
 * @name opneWebRTC
 * @param {string} channel
 * @param {string} userid
 */
var openWebRTC = function(channel , userid , maxallowed){
    webrtcdev.info(" [openWebRTC] channel: " , channel);

    socket.emit("open-channel", {
        channel    : channel,
        sender     : userid,
        maxAllowed : maxallowed
    });
    
    shownotification(" Making a new session ");
}


/**
 * connect to a webrtc socket channel
 * @method
 * @name connectWebRTC
 * @param {string} type
 * @param {string} channel
 * @param {string} userid
 * @param {string} remoteUsers
 */
var connectWebRTC = function(type, channel, selfuserid ,remoteUsers){
    webrtcdev.info(" [startjs] ConnectWebRTC type : " , type , " , Channel :" , channel , 
                                    " , self-Userid : " ,  selfuserid , " , and remote users : " , remoteUsers);
    if(debug) showUserStats();

    /*void(document.title = channel);*/
    if(fileshareobj.active){
        
        try{
            var _peerinfo = findPeerInfo(selfuserid);
            if(!_peerinfo) throw "peerinfo missing in webcallpeers for "+selfuserid;

            // Create File Sharing Div 
            if(fileshareobj.props.fileShare=="single"){
                createFileSharingDiv(_peerinfo);
                //max diaply the local / single fileshare 
                document.getElementById(_peerinfo.fileShare.outerbox).style.width="100%";
                // hide the remote fileshare
                //document.getElementById(_peerinfo.fileShare.outerbox).style.width="100%";
            } else if(fileshareobj.props.fileShare=="divided"){
                
                // create local File sharing window 
                //Do not create file share and file viewer for inspector's own session 
                if(role!="inspector") {
                    webrtcdev.log(" [start connectWebRTC] creating local file sharing");
                    createFileSharingDiv(_peerinfo);
                }else{
                    webrtcdev.log(" [start] Since it is an inspector's own session , not creating local File viewer and list");
                }
                
                // create remotes File sharing window 
                for(x in webcallpeers){
                    if(webcallpeers[x].userid != selfuserid && webcallpeers[x].role != "inspector"){
                        webrtcdev.log(" [start connectWebRTC] creating remote file sharing ");
                        createFileSharingDiv(webcallpeers[x]);
                    }
                }
                
                // on connect webrtc request old file from peerconnection session
                if(fileshareobj.sendOldFiles){
                    requestOldFiles();
                }

            }else{
                webrtcdev.error("fileshareobj.props.fileShare undefined ");
            }
            
            // Creating File listing div 
            if(fileshareobj.props.fileList=="single"){
                document.getElementById(_peerinfo.fileList.outerbox).style.width="100%";
            }else if(fileshareobj.props.fileShare!="single"){
                webrtcdev.log("No Seprate div created for this peer since fileshare container is single");
            }else{
                webrtcdev.error("fileshareobj.props.fileShare undefined ");
            }

        }catch(err){
            webrtcdev.error("[startjs] connectwebrtc -" , err)
        }

    }

};


/**
 * function to join a webrtc socket channel
 * @method
 * @name joinWebRTC
 * @param {string} channel
 * @param {string} userid
 */
var joinWebRTC = function(channel , userid){
    shownotification("Joining an existing session " + channel);
    webrtcdev.info(" [startjs] joinWebRTC channel: " , channel );
    
    if(debug) showUserStats();

    socket.emit("join-channel", {
        channel: channel,
        sender: userid,
        extra: {
            userid  : userid,
            name    : selfusername || "",
            color   : selfcolor || "",
            email   : selfemail || "",
            role    : role || "participant"
        }
    });
};

/**
 * function to leave a webrtc socket channel
 * @method
 * @name leaveWebRTC
 */
var leaveWebRTC=function(){
    shownotification("Leaving the session ");
};

/*window.onload=function(){
    webrtcdev.log( "Local Storage Channel " ,  localStorage.getItem("channel"));
};
*/
window.onunload=function(){
    webrtcdev.log( "[startjs] onunload " , localStorage.getItem("channel"));
    alert(" Refreshing the Page will loose the session data");
};

/**
 * cleares local storage varibles 
 * @method
 * @name clearCaches
 */
function clearCaches(){
    localStorage.clear();
}
