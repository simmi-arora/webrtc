// 'use strict';

// var inherits = require('util').inherits;
// var EventEmitter = require('events').EventEmitter;

/**************************************************************************************
        peerconnection 
****************************************************************************/

var channelpresence= false;
var localVideoStreaming= null;
var turn="none";
var localobj={}, remoteobj={};
var pendingFileTransfer=[];

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
 * Assigns ICE gateways and  widgets 
 * @constructor
 * @param {json} _localObj - local object.
 * @param {json} _remoteObj - remote object.
 * @param {json} incoming - incoming media stream attributes
 * @param {json} outgoing - outgoing media stream attributes
 * @param {json} session - session object.
 * @param {json} widgets - widgets object.
 */
var webrtcdevconstructor= function(_localobj , _remoteobj , incoming, outgoing , session, widgets){
    //try{
        sessionid  = session.sessionid;
        socketAddr = session.socketAddr;
        localobj = _localobj;
        remoteobj = _remoteobj;
        webrtcdev.log("[startjs] WebRTCdev Session - " , session);
    // }catch(e){
    //     webrtcdev.error(e);
    //     alert(" Session object doesnt have all parameters ");
    // }

    turn    = (session.hasOwnProperty('turn')?session.turn:null);
    webrtcdev.log("[ startjs] WebRTCdev TURN - ", turn);
    if(turn && turn !="none"){
        if(turn.active && turn.iceServers){
            webrtcdev.log("WebRTCdev - Getting preset static ICE servers " , turn.iceServers);
            webrtcdevIceServers = turn.iceServers;
        }else{
            webrtcdev.info("WebRTCdev - Calling API to fetch dynamic ICE servers ");
            getICEServer();  
            // getICEServer( turn.username ,turn.secretkey , turn.domain,
            //                 turn.application , turn.room , turn.secure);                
        }
    }else{
        webrtcdev.log("WebRTCdev - TURN not applied ");
    }

    if(widgets){

        webrtcdev.log( " WebRTCdev - widgets  " , widgets);

        if(widgets.debug)           debug           = widgets.debug || false;

        if(widgets.chat)            chatobj         = widgets.chat || null;

        if(widgets.fileShare)       fileshareobj    = widgets.fileShare || null;

        if(widgets.screenrecord)    screenrecordobj = widgets.screenrecord || null;

        if(widgets.screenshare)     screenshareobj  = widgets.screenshare || null;

        if(widgets.snapshot)        snapshotobj     = widgets.snapshot || null;

        if(widgets.videoRecord)     videoRecordobj  = widgets.videoRecord || null;

        if(widgets.reconnect)       reconnectobj    = widgets.reconnect || null;

        if(widgets.drawCanvas)      drawCanvasobj   = widgets.drawCanvas || null;

        if(widgets.texteditor)      texteditorobj   = widgets.texteditor || null;

        if(widgets.codeeditor)      codeeditorobj   = widgets.codeeditor || null;

        if(widgets.mute)            muteobj         = widgets.mute || null;

        if(widgets.timer)           timerobj        = widgets.timer || null;

        if(widgets.listenin)        listeninobj     = widgets.listenin || null;

        if(widgets.cursor)          cursorobj       = widgets.cursor || null;

        if(widgets.minmax)          minmaxobj       = widgets.minmax || null;

        if(widgets.help)            helpobj         = widgets.help || null;

        if(widgets.statistics)      statisticsobj   = widgets.statistics || null;
    }

    return {
        sessionid : sessionid,
        socketAddr: socketAddr,
        turn : turn,
        widgets  : widgets,
        startwebrtcdev: funcStartWebrtcdev,
        rtcConn : rtcConn
    };
};

/**
 * function to return chain of promises for webrtc session to start
 * @method
 * @name funcStartWebrtcdev
 */
function funcStartWebrtcdev(){

    webrtcdev.log("[]startJS] startwebrtcdev ");

    return new Promise(function (resolve, reject) {

        // webrtcdev.log(" [ startJS webrtcdom ] : DetectRTC " , DetectRTC);
        // if(!DetectRTC) resolve("detectRTC not found");

        // //Cases around webcam malfunctiojn or absense 
        // if(!DetectRTC.hasWebcam){
        //     alert(" Your browser doesnt have webcam" , "warning");
        //     outgoing.video = false;
        // }
        // if(!DetectRTC.isWebsiteHasWebcamPermissions){
        //     alert(" Your browser doesnt have permission for accessing webcam", "warning");
        //     outgoing.video = false;
        // }
        
        // //Cases around Miceohone malfunction or absense 
        // if(!DetectRTC.hasMicrophone){
        //     alert(" Your browser doesnt have microphone", "warning");   
        //     outgoing.audio = false ;
        // }
        // if(!DetectRTC.isWebsiteHasMicrophonePermissions){
        //     alert(" Your browser doesnt have permission for accessing microphone", "warning");
        //     outgoing.audio = false;
        // }
        
        // Case around speaker abent
        // if(!DetectRTC.hasSpeakers){
        //     alert(" Your browser doesnt have speakers", "warning");      
        // }

        resolve("done");
    }).then((res)=>{
        webrtcdev.log(" [ startJS webrtcdom ] : sessionid : "+ sessionid+" and localStorage  " , localStorage);

        return new Promise(function (resolve , reject){
            if(localStorage.length>=1 && localStorage.getItem("channel") != sessionid){
                webrtcdev.log("[startjs] Current Session ID " + sessionid + " doesnt match cached channel id "+ localStorage.getItem("channel") +"-> clearCaches()");
                clearCaches();
            }else {
                webrtcdev.log(" no action taken on localStorage");
            }
            resolve("done");
        });
    }).then((res)=>{

        webrtcdev.log(" [ startJS webrtcdom ] : incoming " , incoming);
        webrtcdev.log(" [ startJS webrtcdom ] : outgoing " , outgoing);

        return new Promise(function (resolve , reject){
            if(incoming){
                incomingAudio = incoming.audio ; 
                incomingVideo = incoming.video ; 
                incomingData  = incoming.data  ;  
            }
            if(outgoing){
                outgoingAudio = outgoing.audio ; 
                outgoingVideo = outgoing.video ; 
                outgoingData  = outgoing.data ;
            }
            resolve("done");
        });
    }).then((res)=>{

        webrtcdev.log(" [ startJS webrtcdom ] : localobj " , localobj);
        webrtcdev.log(" [ startJS webrtcdom ] : remoteobj " , remoteobj);

        return new Promise(function (resolve , reject){

            /* When user is single */
            localVideo = localobj.video;

            /* when user is in conference */
            let _remotearr = remoteobj.videoarr;
            /* first video container in remotearr belongs to user */
            if(outgoingVideo){
                selfVideo = _remotearr[0];
            }
            /* create arr for remote peers videos */
            if(!remoteobj.dynamicVideos){
                for(var x=1;x<_remotearr.length;x++){
                    remoteVideos.push(_remotearr[x]);    
                }
            }
            resolve("done");
        });
    }).then((res)=>{
        return new Promise(function (resolve , reject){

            if(localobj.hasOwnProperty('userdetails')){
                let obj      = localobj.userdetails;
                webrtcdev.info("localobj userdetails " , obj);
                selfusername = obj.username  || "LOCAL";
                selfcolor    = obj.usercolor || "orange";
                selfemail    = obj.useremail || "unknown";
                role         = obj.role      || "participant";
            }else{
                webrtcdev.warn("localobj has no userdetails ");
            }

            if(remoteobj.hasOwnProperty('userdetails')){
                let obj        = remoteobj.userdetails;
                webrtcdev.info("remoteobj userdetails " , obj);
                remoteusername = obj.username  || "REMOTE";
                remotecolor    = obj.usercolor || "orange"; 
                remoteemail    = obj.useremail || "unknown";
            }else{
                webrtcdev.warn("remoteobj has no userdetails ");
            }
            resolve("done");
        });
    }).then( ()=> setRtcConn(sessionid)
    ).then( (result)=> setWidgets(rtcConn)
    ).then( (result)=> startSocketSession(rtcConn, socketAddr,  sessionid)
    ).catch((err) =>{
        webrtcdev.error(" Promise rejected " , err);
    });
}

/**
 * function to start session with socket
 * @method
 * @name startSession
 * @param {object} connection
 */
function startSocketSession(rtcConn , socketAddr , sessionid){

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
            shownotification(" Checking status of  : " + sessionid);
            socket.emit("presence", {
                channel: sessionid
            });

        } else{
            webrtcdev.error(" Session id undefined ");
            //alert("rtcCon channel / session id undefined ");
            return; 
        }

        // Socket Listners
        socket.on("connect", function () {
            socket.on('disconnected', function () {
                shownotification("Disconnected from signaller ");
            });
        });

        socket.on("presence", function (event) {
            //If debug mode is on , show user detaisl at top under mainDiv
            if(debug) showUserStats();
            webrtcdev.log("presence for sessionid ", event);
            channelpresence = event;
            if(channelpresence) joinWebRTC(sessionid, selfuserid);
            else                openWebRTC(sessionid, selfuserid);
        });

        socket.on("open-channel-resp", function (event) {
            webrtcdev.log(" opened-channel", event, event.status, event.channel == sessionid);
            if (event.status && event.channel == sessionid) {

                let promise = new Promise(function(resolve, reject) {
                    webrtcdev.log(" [open-channel-resp ] ",
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
                        if (selfuserid == null) {
                            selfuserid = rtcConn.userid;

                            if (tempuserid != selfuserid)
                                socket.emit("update-channel", {
                                    type: "change-userid",
                                    channel: rtcConn.channel,
                                    sender: selfuserid,
                                    extra: {
                                        old: tempuserid,
                                        new: selfuserid
                                    }
                                });
                        }
                    })
                    //rtcConn.openOrJoin(event.channel)
                ).then(function(res){
                    let uid = selfuserid || rtcConn.userid;
                    updatePeerInfo(uid , selfusername, selfcolor, selfemail, role, "local");
                    webrtcdev.info(" [startJS] open-channel-resp - Trying to open a channel on WebRTC SDP  "  , uid , role);
                }).then(
                    getCamMedia()
                ).catch((reason) => {
                        webrtcdev.error('Handle rejected promise ('+reason+')');
                    }
                );

            } else {
                alert(" signaller doesnt allow channel open");
            }
            if(event.message)
                shownotification(event.msgtype + " : " + event.message);
        });

        socket.on("join-channel-resp", function (event) {
            webrtcdev.log("joined-channel", event);
            
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
                ).then(
                    // for a new joiner , update his local info 
                    updatePeerInfo(rtcConn.userid, selfusername, selfcolor, selfemail, role, "local"),
                    webrtcdev.info(" [startJS] join-channel-resp. Trying to join a channel on WebRTC SDP " , rtcConn.userid)
                ).then(function(res){
                    //for remote users also update webcallpeers
                    for (x in rtcConn.remoteUsers) {
                        remoterole =  "participant"; // will fail in case of 2 listeners 
                        updatePeerInfo(rtcConn.remoteUsers[x], remoteusername, remotecolor, remoteemail, remoterole , "remote");
                        if (role == "inspector") shownotificationWarning("This session is being inspected ");
                    }
                }).then(
                    getCamMedia() 
                ).catch(
                   (reason) => {
                        webrtcdev.error('Handle rejected promise ('+reason+')');
                    }
                );   
                if(event.message)  
                    shownotification(event.msgtype + " : " + event.message);               
            } else {
                alert(" signaller doesnt allow channel Join");
            }
        });

        socket.on("channel-event", function (event) {
            webrtcdev.log("channel-event", event);
            if (event.type == "new-join") {
                if (event.status) {
                    var peerinfo = findPeerInfo(event.data.sender);
                    if (!peerinfo) {
                        if (event.data.extra.name == "LOCAL") {
                            event.data.extra.name = "REMOTE";
                            event.data.extra.color = remotecolor;
                        }
                        // event.data.extra.color ,  not this color , it is local color 
                        updatePeerInfo(event.data.sender, event.data.extra.name, "#a69afe", event.data.extra.email, event.data.extra.role , "remote");
                        shownotification( event.data.extra.role  + "  " +event.type);
                    }else {
                        // Peer was already present  , this is s rejoin 
                        // event.data.extra.color ,  not this color , it is local color 
                        updatePeerInfo(event.data.sender, event.data.extra.name, "#a69afe", event.data.extra.email, event.data.extra.role , "remote");
                        shownotification(event.data.extra.role  + "  " +event.type);
                    }
                } else {
                    if(event.message)
                        shownotification(event.msgtype + " : " + event.message);
                }
            }
        });

        resolve("done");

    })
    .catch((err)=>{
        reject(err);
    });
    
}


/*
set Real Time Communication connection
*/
var setRtcConn = function (sessionid) {

    return new Promise( (resolve, reject)=> {

        webrtcdev.log("[startjs - setRtcConn] initiating RTcConn"),

        rtcConn = new RTCMultiConnection(),

        rtcConn.channel = this.sessionid,
        rtcConn.socketURL = location.hostname+":8085/",

        rtcConn.onNewParticipant = function (participantId, userPreferences) {
            
            webrtcdev.log("onNewParticipant", participantId, userPreferences);
            shownotification(remoteusername + " requests new participatation ");
            if (remoteobj.maxAllowed !="unlimited " && webcallpeers.length <= remoteobj.maxAllowed) {
                updatePeerInfo(participantId, remoteusername, remotecolor, "", role, "remote");
            } else {
                shownotification("Another user is trying to join this channel but max count [ " + remoteobj.maxAllowed + " ] is reached", "warning");
                return;
            }
            rtcConn.acceptParticipationRequest(participantId, userPreferences);
        },

        rtcConn.onopen = function (event) {
            
            webrtcdev.log("rtcconn onopen " + rtcConn.connectionType);
            try {

                remoteUsers = rtcConn.remoteUsers;
                // let index = remoteUsers.indexOf(selfuserid);
                // if (index > -1) {
                //   webrtcdev.log(" Splice remote users array "+ remoteUsers+ " -  index " , index , " for selfuserid " , selfuserid);
                //   remoteUsers.splice(index, 1);
                //   webrtcdev.log("after splice " , remoteUsers);
                // }

                // Remove Duplicates from remote
                remoteUsers = remoteUsers.filter(function(elem, index, self) {
                    return index == self.indexOf(elem);
                });

                // setting local caches 
                webrtcdev.log(" [startjs connectwebrtc ] setting cache - channel "+ sessionid +" with userid " + selfuserid + " and remoteUsers "+ remoteUsers );
                
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
                    rtpstats();
                }

            } catch (e) {
                shownotification("problem in on session open "+ e.message, "warning");
                webrtcdev.error("problem in on session open", e);
            }
        },

        rtcConn.onMediaError = function (error, constraints) {
            webrtcdev.error("[startJS onMediaError] ", error, constraints);
            shownotification(error.name + " Joining without camera Stream ", "warning");
            localVideoStreaming = false;
            // For local Peer , if camera is not allowed or not connected then put null in video containers 
            // for(x in webcallpeers){
                //if(!webcallpeers[x].stream &&  !webcallpeers[x].streamid){
                    var peerinfo = webcallpeers[0];
                    peerinfo.type = "Local";
                    peerinfo.stream = null;
                    peerinfo.streamid = "nothing01";
                    updateWebCallView(peerinfo);
                //}
            //}

            // get media info for console debuggging 
            checkDevices();

            // start local Connect 
            onLocalConnect() // event emitter for app client 
        },

        rtcConn.onstream = function (event) {
            webrtcdev.log("[startJs on stream ] on stream Started event ", event);
            if(event.type=="local") localVideoStreaming = true;

            var peerinfo = findPeerInfo(event.userid) ;
            if (!peerinfo ) {
                console.error(" PeerInfo not present in webcallpeers ", event.userid, rtcConn);
                alert(" Cannot create session for Peer");
            } else if(role=="inspector" && event.type=="local"){
                //ignore
            } else {
                peerinfo.type = event.type;
                peerinfo.stream = event.stream;
                peerinfo.streamid = event.stream.streamid;
                updateWebCallView(peerinfo);
            }
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
            webrtcdev.log(" on message ", e);
            if (e.data.typing) {
                updateWhotyping(e.extra.name + " is typing ...");
            } else if (e.data.stoppedTyping) {
                updateWhotyping("");
            } else {
                var msgpeerinfo = findPeerInfo(e.userid);
                switch (e.data.type) {
                    case "screenshare":
                        if (e.data.message == "stoppedscreenshare") {
                            shownotification("Screenshare has stopped : " + e.data.screenStreamid);
                            //createScreenViewButton();
                            let button = document.getElementById(screenshareobj.button.shareButton.id);
                            button.className = screenshareobj.button.shareButton.class_off;
                            button.innerHTML = screenshareobj.button.shareButton.html_off;
                            button.disabled = false;

                            scrConn.onstreamended();
                            scrConn.removeStream(e.data.screenStreamid);
                            scrConn.close();
                        } else if (e.data.message == "screenshareStartedViewing") {
                            screenshareNotification("", "screenshareStartedViewing");
                        } else {
                            shownotification("screen is getting shared " + e.data.screenid);
                            //createScreenViewButton();
                            let button = document.getElementById(screenshareobj.button.shareButton.id);
                            button.className = screenshareobj.button.shareButton.class_busy;
                            button.innerHTML = screenshareobj.button.shareButton.html_busy;
                            button.disabled = true;

                            screenRoomid = e.data.screenid;
                            var selfuserid = "temp_" + (new Date().getUTCMilliseconds());
                            webrtcdevPrepareScreenShare(function (screenRoomid) {
                                //scrConn.join(screenRoomid);  
                                connectScrWebRTC("join", screenRoomid, selfuserid, []);
                            });
                        }

                        break;
                    case "chat":
                        updateWhotyping(e.extra.name + " has send message");
                        /*var userinfo;
                        try{
                            userinfo=getUserinfo(rtcConn.blobURLs[e.userid], "chat-message.png");
                        }catch(e){
                            userinfo="empty";
                        }*/
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
                            webrtcdev.log("webcallpeers appended with zone and datetime " , msgpeerinfo);
                        }

                        webrtcdev.log(" [startjs] peerTimerStarted , start peerTimeZone and startPeersTime");
                        
                            peerTimeZone(e.data.zone, e.userid);
                            startPeersTime(e.data.time, e.data.zone , e.userid);

                        //if(!peerTimerStarted){
                        //}
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
            uuid: rtcConn.userid ,
            name: selfusername|| "",
            color: selfcolor|| "",
            email: selfemail || ""
        },

        rtcConn.socketMessageEvent = 'RTCMultiConnection-Message',
        rtcConn.socketCustomEvent = 'RTCMultiConnection-Custom-Message',

        rtcConn.enableFileSharing = true,
        rtcConn.filesContainer = document.body || document.documentElement,

        //rtcConn.dontCaptureUserMedia = true,

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
    webrtcdev.log(" [startJS ] check for session refresh / user refreshed , channel in local stoarge " , localStorage.getItem("channel") , 
        " Current Channel " , rtcConn.channel);
    if(localStorage.getItem("channel") == rtcConn.channel && localStorage.getItem("userid")){
        selfuserid = localStorage.getItem("userid");
        webrtcdev.log(" [startJS ] supportSessionRefresh - rejoing with old user id" + selfuserid + " , "+ localStorage.getItem("userid"));
        shownotification("Refreshing the Session");
        return selfuserid;
    }
    //return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
    return rtcConn.userid;;
}

/*
* Check Microphone and Camera Devices
*/
function checkDevices(){
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      webrtcdev.warn("enumerateDevices() not supported.");
      return;
    }

    // List cameras and microphones.
    navigator.mediaDevices.enumerateDevices()
    .then(function(devices) {
      devices.forEach(function(device) {
         webrtcdev.log("[startJS] checkDevices ",device.kind ,  ": " , device.label ," id = " , device.deviceId);
      });
    })
    .catch(function(err) {
      webrtcdev.error('[startJS] checkDevices ', err.name , ": " , err.message);
    });
}

/*
* Get Audio and Video Stream Media
*/
function getCamMedia(){
    webrtcdev.log(" [startJS] getCamMedia  role :" , role );
    return new Promise(function (resolve, reject) {
        if( role == "inspector"){
            console.log("[startJS] getCamMedia  - Joining as inspector without camera Video");
        }else if(outgoingVideo){
            webrtcdev.log("[startJS] getCamMedia  - Capture Media ");
            //rtcConn.dontCaptureUserMedia = false,
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

            detectExtension(screenshareobj.extensionID, function (status) {
                extensioninstalled = status;
                webrtcdev.log("is screenshareobj extension installed  ? ", status);

                if (status == 'not-installed') {
                    shownotification(" Sessions recoridng cannot start as there is not extension installed ", "warning");
                    createExtensionInstallWindow();
                } else if (status == 'installed-enabled') {
                    if (screenrecordobj.button.id && document.getElementById(screenrecordobj.button.id)) {
                        webrtcdev.log("Assign Record Button ");
                        assignScreenRecordButton(screenrecordobj);
                    } else {
                        webrtcdev.log("Create Record Button ");
                        createScreenRecordButton(screenrecordobj);
                    }
                } else if (extensioninstalled == 'installed-disabled') {
                    shownotification("chrome extension is installed but disabled." , "warning");
                    if (screenrecordobj.button.id && document.getElementById(screenrecordobj.button.id)) {
                        assignScreenRecordButton(screenrecordobj);
                        webrtcdev.log("Assign Record Button ");
                    } else {
                        webrtcdev.log("Create Record Button ");
                        createScreenRecordButton(screenrecordobj);
                    }
                } else if (extensioninstalled == 'not-chrome') {
                    // using non-chrome browser
                } else{
                     webrtcdev.error(" screen record extension's state is undefined ");
                }

            });

            webrtcdev.log(" screen record widget loaded ");
        } else if (screenrecordobj && !screenrecordobj.active) {
            if (screenrecordobj.button && screenrecordobj.button.id && document.getElementById(screenrecordobj.button.id)) {
                document.getElementById(screenrecordobj.button.id).className = "inactiveButton";
            }
            webrtcdev.log(" screen record widget not loaded ");
        }

        // ---------------------------------- Screenshare Widget --------------------------------------------------
        if (screenshareobj.active) {

            detectExtension(screenshareobj.extensionID, function (status) {
                webrtcdev.log("is screenshareobj extension installed  ? ", status);
                if (status == 'installed-enabled') {
                    var screenShareButton = createOrAssignScreenshareButton(screenshareobj);
                    hideScreenInstallButton();
                } else if (status == 'installed-disabled') {
                    shownotification("chrome extension is installed but disabled.");
                    var screenShareButton = createOrAssignScreenshareButton(screenshareobj);
                    hideScreenInstallButton();
                } else if (status == 'not-installed') {

                    //document.getElementById("screensharedialog").showModal();
                    $("#screensharedialog").modal("show");
                    hideScreenShareButton();

                    if (screenshareobj.button.installButton.id && document.getElementById(screenshareobj.button.installButton.id)) {
                        assignScreenInstallButton(screenshareobj.extensionID);
                    } else {
                        createScreenInstallButton(screenshareobj.extensionID);
                    }
                } else if (status == 'not-chrome') {
                    // using non-chrome browser
                    alert(" Screen share extension only works in Chrome for now ");
                } else{
                    webrtcdev.error(" screen share extension's state is undefined ");
                }
            });

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
function updateWebCallView(peerInfo){
    webrtcdev.log("[start.js - updateWebCallView] start with ",
        " peerInfo" , peerInfo , 
        " || role is ", role ,
        " || indexOf ", peerInfo.vid.indexOf("videoundefined") );

    try{
        switch(role){
            
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
                webrtcdev.log(" [start.js - updateWebCallView] role-inspector , attaching stream" , remvid, peerInfo.stream );
                attachMediaStream(remvid, peerInfo.stream);
                if(remvid.hidden) removid.hidden = false;
                remvid.id = peerInfo.videoContainer;
                remvid.className = remoteobj.videoClass;
                //attachControlButtons(remvid, peerInfo); 
                if(remoteobj.userDisplay && peerInfo.name ){
                    attachUserDetails( remvid, peerInfo); 
                }
                
                if(remoteobj.userMetaDisplay && peerInfo.userid){
                    attachMetaUserDetails( remvid, peerInfo ); 
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

                if(peerInfo.vid.indexOf("videolocal") > -1 ){
                    webrtcdev.info(" [start.js - updateWebCallView] role-participant , PeerInfo Vid is Local");
                    // when video is local
                    if(localVideo && document.getElementsByName(localVideo)[0]){
                        var vid = document.getElementsByName(localVideo)[0];
                        vid.muted = true;
                        vid.className = localobj.videoClass;
                        attachMediaStream(vid, peerInfo.stream);

                        // if(localobj.userDisplay && peerInfo.name)
                        //     attachUserDetails( vid, peerInfo ); 

                        if(localobj.userDisplay && peerInfo.name)
                            attachUserDetails( vid, peerInfo ); 
                        
                        if(localobj.userMetaDisplay && peerInfo.userid)
                            attachMetaUserDetails( vid , peerInfo ); 

                        webrtcdev.info(" User is alone in the session  , hiding remote video container" , 
                        "showing users single video conrainer and attaching attachMediaStream and attachUserDetails ");

                    }else{
                        //alert(" Please Add a video container in config for single");
                        webrtcdev.error(" No local video conatainer in localobj -> " , localobj);
                    }

                } else if(peerInfo.vid.indexOf("videoremote") > -1) {
                    webrtcdev.info(" [start.js - updateWebCallView] role-participant , PeerInfo Vid is Remote");
                    //when video is remote 

                    /* handling local video transistion to active */
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
                            if(document.getElementsByName(remoteVideos[v])[0] && document.getElementsByName(remoteVideos[v])[0].src){
                                vi++;
                            }else if(remoteVideos[v].video && remoteVideos[v].video){
                                vi++;
                            }
                        }

                        try{

                            if(remoteobj.maxAllowed=="unlimited"){
                                webrtcdev.log("remote video is unlimited , creating video for remoteVideos array ");
                                var video = document.createElement('video');
                                //video.autoplay = "autoplay";
                                remoteVideos[vi] = {
                                    "userid": peerInfo.userid, 
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
                                            "userid": peerInfo.userid, 
                                            "video" : remVideoHolder[0] 
                                        };
                                    }
                                }else{
                                    // since remvideo holder doesnt exist just overwrite the last remote with the video 
                                    remoteVideos[remoteVideos.length -1] = { 
                                        "userid": peerInfo.userid, 
                                        "video" : remVideoHolder[0] 
                                    };
                                }

                            }

                            attachMediaStream(remoteVideos[vi].video, peerInfo.stream);
                            if(remoteVideos[vi].video.hidden) remoteVideos[vi].video.hidden = false;
                            remoteVideos[vi].video.id = peerInfo.videoContainer;
                            remoteVideos[vi].video.className = remoteobj.videoClass;
                            attachControlButtons(remoteVideos[vi].video, peerInfo); 

                            if(remoteobj.userDisplay && peerInfo.name ) {
                                attachUserDetails( remoteVideos[vi].video, peerInfo); 
                            }
                            
                            if(remoteobj.userMetaDisplay && peerInfo.userid) {
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
  
    /********************************************************************************** 
            Session call and Updating Peer Info
    ************************************************************************************/
    var repeatInitilization = null;

    /**
     * starts a call 
     * @method
     * @name startCall
     * @param {json} obj
     */
    function startCall(obj){
        webrtcdev.log(" startCall obj" , obj);
        webrtcdev.log(" TURN " , turn);
        //if(turn=='none'){
            obj.startwebrtcdev();
        // }else if(turn!=null){
        //     repeatInitilization = window.setInterval(obj.startwebrtcdev, 2000);     
        // }
        return;
    }

    /**
     * stops a call and removes loalstorage items 
     * @method
     * @name stopCall
     */
    function stopCall(){
        webrtcdev.log(" stopCall ");
        rtcConn.closeEntireSession();

        if(!localStorage.getItem("channel"))
            localStorage.removeItem("channel");

        if(!localStorage.getItem("userid"))
            localStorage.removeItem("userid");
        
        if(!localStorage.getItem("remoteUsers"))
            localStorage.removeItem("remoteUsers");

        return;
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
    function updatePeerInfo(userid , username , usecolor , useremail, userrole ,  type ){
        webrtcdev.log("updating peerInfo: " , userid , username , usecolor , useremail, userrole ,  type);

        // if userid deosnt exist , exit
        if (!userid){
            return;
        }

        // if userid is already present in webcallpeers , exit
        for(var x in webcallpeers){
            if(webcallpeers[x].userid == userid) {
                webrtcdev.log("UserID is already existing in webcallpeers");
                return;
            }
        }

        peerInfo={ 
            videoContainer : "video"+userid,
            videoHeight : null,
            videoClassName: null,
            userid : userid , 
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
        webrtcdev.log("updated peerInfo: " ,peerInfo);
        webcallpeers.push(peerInfo);

        // Update the web call view 
        // updateWebCallView(peerInfo);
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
        webrtcdev.log(" [removePeerInfo] Before  " , webcallpeers);
        webrtcdev.log(" [removePeerInfo] Removing peerInfo: " , userid);
        webcallpeers.splice(userid, 1);
        webrtcdev.log(" [removePeerInfo] After removing peerInfo" , webcallpeers);
    }

    /**
     * destroy users webcall view
     * @method
     * @name destroyWebCallView
     * @param {json} peerInfo
     * @param {function} callback
     */
    function destroyWebCallView(peerInfo , callback){
        webrtcdev.log(" [destroyWebCallView] peerInfo" , peerInfo);
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
    var openWebRTC = function(channel , userid){
        webrtcdev.info(" [openWebRTC] channel: " , channel);

        socket.emit("open-channel", {
            channel    : channel,
            sender     : tempuserid,
            maxAllowed : remoteobj.maxAllowed
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
    var connectWebRTC=function(type, channel, userid ,remoteUsers){
        webrtcdev.info(" [start ConnectWebRTC ] type : " , type , " , Channel :" , channel , 
                                        " , Userid : " ,  userid , " , remote users : " , remoteUsers);

        if(debug) showUserStats();

        /*void(document.title = channel);*/
        if(fileshareobj.active){
            
            //Do not create file share and file viewer for inspector's own session 
            var _peerinfo = findPeerInfo(userid);

            // Create File Sharing Div 
            if(fileshareobj.props.fileShare=="single"){
                createFileSharingDiv(_peerinfo);
                document.getElementById(_peerinfo.fileShare.outerbox).style.width="100%";

            } else if(fileshareobj.props.fileShare=="divided"){
                
                // create local File sharing window 
                if(role!="inspector") {
                    webrtcdev.log(" [start connectWebRTC] creating local file sharing");
                    createFileSharingDiv(_peerinfo);
                }else{
                    webrtcdev.log(" [start] Since it is an inspectors own session , not creating local File viewer and list");
                }
                
                // create remotes File sharing window 
                for(x in webcallpeers){
                    if(webcallpeers[x].userid != userid && webcallpeers[x].role != "inspector"){
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

        }

    };


    /**
     * function to join w webrtc socket channel
     * @method
     * @name joinWebRTC
     * @param {string} channel
     * @param {string} userid
     */
    var joinWebRTC = function(channel , userid){
        shownotification("Joining an existing session " + channel);
        webrtcdev.info(" [joinWebRTC] channel: " , channel);
        
        if(debug) showUserStats();
        
        if (selfuserid == null)
            selfuserid = tempuserid;

        socket.emit("join-channel", {
            channel: channel,
            sender: selfuserid,
            extra: {
                userid  : selfuserid,
                name    : selfusername,
                color   : selfcolor,
                email   : selfemail,
                role    : role
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
        webrtcdev.log( localStorage.getItem("channel"));
        alert(" Refreshing the Page will loose the session data");
    };

    /**
     * function to interact with background script of chrome extension
     * @call
     * @name addeventlistener
     */
    window.addEventListener('message', function(event){
        webrtcdev.log("------ message from Extension " , event);
        if (event.data.type) {
            if(event.data.type=="screenshare"){
                onScreenshareExtensionCallback(event);
            }else if(event.data.type=="screenrecord"){
                onScreenrecordExtensionCallback(event);
            }
        }else if(event.data=="webrtcdev-extension-getsourceId-audio-plus-tab"){
            onScreenrecordExtensionCallback(event);
        }else{
            onScreenshareExtensionCallback(event);
        }
    }); 

    function clearCaches(){
        localStorage.clear();
    }