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
function startSocketSession(rtcConn, socketAddr, sessionid) {
    webrtcdev.log("[sessionmanager] startSocketSession , set selfuserid ", rtcConn.userid);
    if(!selfuserid)
        selfuserid = rtcConn.userid;
    else
        webrtcdev.warn("[sessionmanager] trying to overwrite selfuserid")

    return new Promise((resolve, reject) => {
        try {
            let addr = "/";
            if (socketAddr != "/") {
                addr = socketAddr;
            }
            webrtcdev.log("[sessionmanager] StartSession" + sessionid, " on address ", addr);
            socket = io.connect(addr, {
                transports: ['websocket']
            });
            // socket.set('log level', 3);
        } catch(err) {
            webrtcdev.error(" problem in socket connnection", err);
            throw (" problem in socket connnection");
        }

        if (sessionid) {
            shownotification("Checking status of  : " + sessionid);
            socket.emit("presence", {
                channel: sessionid
            });
        } else {
            shownotification("Invalid session");
            webrtcdev.error("[sessionmanager] Session id undefined ");
            return;
        }

        // Socket Listeners
        socket.on("connect", function () {
            socket.on('disconnected', function () {
                shownotification("Disconnected from signaller ");
            });
        });

        socket.on("presence", function (channelpresence) {
            //If debug mode is on , show user detaisl at top under mainDiv
            if (debug) showUserStats();
            webrtcdev.log("[sessionmanager] presence for sessionid ", channelpresence);
            if (channelpresence) joinWebRTC(sessionid, selfuserid);
            else openWebRTC(sessionid, selfuserid, remoteobj.maxAllowed || 10);
        });

        socket.on("open-channel-resp", function (event) {
            webrtcdev.log("[sessionmanager] --------------open-channel-resp---------------------  ", event);
            if (event.status && event.channel == sessionid) {

                let promise = new Promise(function (resolve, reject) {
                    webrtcdev.log(" [open-channel-resp] ",
                        " Session video:", outgoingVideo,
                        " audio: ", outgoingAudio,
                        " data: ", outgoingData,
                        " OfferToReceiveAudio: ", incomingAudio,
                        " OfferToReceiveVideo: ", incomingVideo
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
                    },
                    rtcConn.open(event.channel, function(res) {
                        // alert(" callback from open room ", res);
                        webrtcdev.log(" [sessionmanager] offer/answer webrtc ", selfuserid, " with role ", role);
                    });
                    webrtcdev.log(" [sessionmanager] ------------------------------ oooooooooooooo ");
                    resolve("ok"); // immediately give the result: 123
                }).then(function (res) {
                    updatePeerInfo(selfuserid, selfusername, selfcolor, selfemail, role, "local"),
                        webrtcdev.log(" [sessionmanager] updated local peerinfo for open-channel ");
                }).catch((reason) => {
                    webrtcdev.error(' [sessionmanager] Handle rejected promise (' + reason + ')');
                });

                getCamMedia(rtcConn);
                webrtcdev.log(" [sessionmanager] open-channel-resp -  done cam media ");
            } else {
                // signaller doesnt allow channel open
                alert("Could not open this channel, Server refused");
                webrtcdev.error(" [sessionmanager] Could not open this channel, Server refused");
            }
            if (event.message)
                shownotification(event.msgtype + " : " + event.message);
        });

        socket.on("join-channel-resp", function (event) {
            webrtcdev.log("[sessionmanager] --------------join-channel-resp---------------------  ", event);

            if (event.status && event.channel == sessionid) {

                let promise = new Promise(function (resolve, reject) {

                    webrtcdev.log(" [ join-channel-resp ] ",
                        " Session video:", outgoingVideo,
                        " audio: ", outgoingAudio,
                        " data: ", outgoingData,
                        " OfferToReceiveAudio: ", incomingAudio,
                        " OfferToReceiveVideo: ", incomingVideo
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
                    webrtcdev.info(" [sessionmanager] offer/answer webrtc  ", selfuserid, " with role ", role)
                ).then(
                    // for a new joiner , update his local info 
                    updatePeerInfo(selfuserid, selfusername, selfcolor, selfemail, role, "local"),
                    webrtcdev.log(" [sessionmanager] updated local peerinfo for join-channel ")
                ).catch((reason) => {
                        webrtcdev.error('Handle rejected promise (' + reason + ')');
                });

                getCamMedia(rtcConn),
                webrtcdev.log(" [sessionmanager] join-channel-resp -  done cam media ");

                if (event.message)
                    shownotification(event.msgtype + " : " + event.message);
            } else {
                // signaller doesnt allow channel Join
                webrtcdev.error(" [sessionmanager] Could not join this channel, Server refused");
                alert("Could not join this channel, Server refused ");
            }
        });

        socket.on("channel-event", function (event) {
            webrtcdev.log("[sessionmanager] --------------channel-event---------------------  ", event);
            if (event.type == "new-join" && event.msgtype != "error") {
                webrtcdev.warn(" [new-join-channel]");

                // check if maxAllowed capacity of the session isnt reached before updating peer info, else return
                if (remoteobj.maxAllowed != "unlimited" && webcallpeers.length <= remoteobj.maxAllowed) {
                    webrtcdev.log("[sessionmanager] channel-event : peer length " + webcallpeers.length + " is less than max capacity of session  of the session " + remoteobj.maxAllowed);
                    let participantId = event.data.sender;
                    if (!participantId) {
                        webrtcdev.error("[sartjs] channel-event : userid not present in channel-event:" + event.type)
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
                        updatePeerInfo(participantId, name, color, email, role, "remote");
                        shownotification( event.data.extra.role  + "  " +event.type);
                    } else {
                        // Peer was already present, this is s rejoin 
                        webrtcdev.log(" [sartjs] channel-event : PeerInfo was already present, this is s rejoin, update the peerinfo ");
                        updatePeerInfo(participantId, name, color, email, role, "remote");
                        shownotification(event.data.extra.role+" "+event.type);
                    }

                    if (!peerinfo) {
                        peerinfo = findPeerInfo(participantId)
                    }
                    peerinfo.type = "remote";
                    peerinfo.stream = "";
                    peerinfo.streamid = "";
                    updateWebCallView(peerinfo);

                    onLocalConnect(); // event emitter for app client

                } else {
                    // max capacity of session is reached 
                    webrtcdev.error("[sartjs] channel-event : max capacity of session is reached ", remoteobj.maxAllowed);
                    shownotification("Another user is trying to join this channel but max count [ " + remoteobj.maxAllowed + " ] is reached", "warning");
                    return;
                }

            } else {
                webrtcdev.warn(" unhandled channel event ");
            }
        });
        resolve("done");
    })
    .catch((err) => {
        webrtcdev.error("[sessionmanager] startSocketSession error -", err);
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

    return new Promise((resolve, reject) => {

        webrtcdev.log("[sessionmanager - setRtcConn] initiating RtcConn"),

        rtcConn = new RTCMultiConnection(),

        rtcConn.channel = this.sessionid,
        rtcConn.socketURL = location.hostname + ":8085/",

        // turn off media till connection happens
        webrtcdev.log("info", "[sessionmanager] set dontAttachStream , dontCaptureUserMedia , dontGetRemoteStream as true "),
        rtcConn.dontAttachStream = true,
        rtcConn.dontCaptureUserMedia = true,
        rtcConn.dontGetRemoteStream = true,

        rtcConn.onNewParticipant = function (participantId, userPreferences) {
            webrtcdev.log("[sartjs] rtcconn onNewParticipant, participantId -  ", participantId, " , userPreferences - ", userPreferences);
            //shownotification("[sartjs] onNewParticipant userPreferences.connectionDescription.sender : " + participantId + " name : "+ remoteusername + " requests new participation ");
            rtcConn.acceptParticipationRequest(participantId, userPreferences);
        },

        rtcConn.onopen = function (event) {

            webrtcdev.log("[sessionmanager] rtconn onopen - ", event);
            try {

                webrtcdev.log("[sessionmanager onopen] selfuserid ", selfuserid);

                // Add remote peer userid to remoteUsers
                remoteUsers = rtcConn.peers.getAllParticipants(),
                    webrtcdev.log(" [sessionmanager onopen] Collecting remote peers", remoteUsers);

                webrtcdev.log(" [sessionmanager onopen] webcallpeers length ", webcallpeers.length);
                // remove old non existing peers, excluded selfuserid
                webrtcdev.log(" [sessionmanager] removePeerInfo  Before  ", webcallpeers);
                for (x in webcallpeers) {
                    webrtcdev.log(" [sessionmanager onopen] webcallpeers[" + x + "]", webcallpeers[x]);
                    if (!(remoteUsers.includes(webcallpeers[x].userid)) && (webcallpeers[x].userid != selfuserid)) {
                        console.warn("[sessionmanager remove PeerInfo - ", webcallpeers[x].userid, " which neither exists in remote peer and not is selfuserid");
                        removePeerInfo(x);
                    }
                }
                webrtcdev.log(" [sessionmanager] removePeerInfo  After  ", webcallpeers);

                // add new peers
                for (x in remoteUsers) {
                    webrtcdev.log(" [sessionmanager] join-channel. Adding remote peer ", remoteUsers[x]);
                    if (remoteUsers[x] == event.userid) {
                        let remoterole = event.extra.role || "participant", // will fail in case of 2 listeners
                            remotecolor = event.extra.color,
                            remoteemail = event.extra.email,
                            remoteusername = event.extra.remoteusername;
                        updatePeerInfo(remoteUsers[x], remoteusername, remotecolor, remoteemail, remoterole, "remote");
                        if (remoterole == "inspector") {
                            shownotificationWarning("This session is being inspected ")
                        }
                        break;
                    }
                    webrtcdev.log(" [sessionmanager onopen] created/updated local peerinfo for open-channel ");
                }

                // Remove Duplicates from remote
                // remoteUsers = remoteUsers.filter(function (elem, index, self) {
                //     return index == self.indexOf(elem);
                // });

                // setting local caches
                webrtcdev.log(" [sessionmanager onopen] setting cache - channel " + sessionid + " with self-userid " + selfuserid + " and remoteUsers " + remoteUsers);

                // In debug mode let the users create multiple user sesison in same browser ,
                // do not use localstoarge values to get old userid for resuse
                if (!debug) {
                    if (!localStorage.getItem("userid"))
                        localStorage.setItem("userid", selfuserid);

                    if (!localStorage.getItem("remoteUsers"))
                        localStorage.setItem("remoteUsers", remoteUsers);

                    if (!localStorage.getItem("channel"))
                        localStorage.setItem("channel", sessionid);
                }

                webrtcdev.log(" [sessionmanager onopen] webcallpeers ", webcallpeers);
                // Connect to webrtc
                if (rtcConn.connectionType == "open")
                    connectWebRTC("open", sessionid, selfuserid, []);
                else if (rtcConn.connectionType == "join")
                    connectWebRTC("join", sessionid, selfuserid, remoteUsers);
                else
                    shownotification("connnection type is neither open nor join", "warning");

                if (timerobj && timerobj.active) {
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

            } catch (err) {
                shownotification("problem in session open ", "warning");
                webrtcdev.error("problem in session open", err);
            }
        },

        rtcConn.onMediaError = function (error, constraints) {
            webrtcdev.error("[sessionmanager] onMediaError - ", error, " constraints ", constraints);

            // Join without stream
            webrtcdev.warn("[sessionmanager] onMediaError- Joining without camera Stream");
            shownotification(error.name + " Joining without camera Stream ", "warning");
            localVideoStreaming = false;
            // For local Peer , if camera is not allowed or not connected then put null in video containers
            let peerinfo = webcallpeers[0];
            peerinfo.type = "Local";
            peerinfo.stream = "";
            peerinfo.streamid = "";
            updateWebCallView(peerinfo);

            // start local Connect
            onLocalConnect(); // event emitter for app client

        },

        rtcConn.onstream = function (event) {
            webrtcdev.log("[sessionmanager onstream ] on stream Started event ", event);
            if (event.type == "local") localVideoStreaming = true;

            var peerinfo = findPeerInfo(event.userid);
            if (!peerinfo) {
                webrtcdev.error("[sartjs] onstream - PeerInfo not present in webcallpeers ", event.userid, " creating it now ");

                //userid, username, usecolor, useremail, userrole, type
                updatePeerInfo(event.userid, event.extra.name, event.extra.color, event.extra.email, event.extra.role, event.type),
                webrtcdev.log(" [sessionmanager] onstream - updated local peerinfo for open-channel "),
                peerinfo = findPeerInfo(event.userid);
                //alert(" Cannot create session for Peer");
            } else if (role == "inspector" && event.type == "local") {
                //ignore
                webrtcdev.info("[sessionmanager] onstream - ignore any incoming stream from inspector");
            }

            peerinfo.type = event.type;
            peerinfo.stream = event.stream;
            peerinfo.streamid = event.stream.streamid;
            updateWebCallView(peerinfo);

            onLocalConnect(); // event emitter for app client
        },

        rtcConn.onstreamended = function (event) {
            webrtcdev.log(" On streamEnded event ", event);
            let mediaElement = document.getElementById(event.streamid);
            if (mediaElement) {
                mediaElement.parentNode.removeChild(mediaElement);
            }
        },

        rtcConn.chunkSize = 50 * 1000,

        rtcConn.onmessage = function (e) {
            webrtcdev.log("[sessionmanager] on message ", e);
            if (e.data.typing) {
                updateWhotyping(e.extra.name + " is typing ...");
            } else if (e.data.stoppedTyping) {
                updateWhotyping("");
            } else {
                let msgpeerinfo = findPeerInfo(e.userid);
                switch (e.data.type) {
                    case "screenshare":
                        if (e.data.message == "startscreenshare") {
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
                        } else {
                            webrtcdev.warn(" unrecognized screenshare message ", e.data.message);
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
                        if (!msgpeerinfo.time && !msgpeerinfo.zone) {
                            //check if the peer has stored zone and time info
                            msgpeerinfo.time = e.data.time;
                            msgpeerinfo.zone = e.data.zone;
                            webrtcdev.log("[sessionmanager] webcallpeers appended with zone and datetime ", msgpeerinfo);
                        }
                        webrtcdev.log("[sessionmanager] peerTimerStarted, start peerTimeZone and startPeersTime");
                        peerTimeZone(e.data.zone, e.userid);
                        startPeersTime(e.data.time, e.data.zone, e.userid);
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
                        webrtcdev.log(" [sessionmanager] shareFileRemove - remove file : ", e.data._filename);
                        var progressdiv = e.data._element;
                        var filename = e.data._filename;
                        let removeButton = "removeButton" + progressdiv;

                        if (document.getElementById("display" + filename))
                            document.getElementById("display" + filename).setAttribute("style", "display:none !important");

                        if (document.getElementById(progressdiv)) {
                            document.getElementById(progressdiv).setAttribute("style", "display:none !important");
                            removeFile(progressdiv);
                            webrtcdev.log(" [sessionmanager] shareFileRemove done");
                        } else {
                            webrtcdev.log(" [sessionmanager] shareFileRemove already done since ", progressdiv, "element doesnt exist ");
                            // already removed
                            return;
                        }
                        document.getElementById(removeButton).click();
                        document.getElementById(removeButton).hidden = true;

                        break;
                    case "shareFileStopUpload":
                        var progressid = e.data._element;
                        webrtcdev.log(" [sessionmanager] shareFileStopUpload", progressid);
                        // var filename = e.data._filename;

                        for (x in webcallpeers) {
                            for (y in webcallpeers[x].filearray) {
                                if (webcallpeers[x].filearray[y].pid == progressid) {
                                    console.log("[ sessionmanager ] shareFileStopUpload -  filepid ", webcallpeers[x].filearray[y].pid, " | status ", webcallpeers[x].filearray[y].status);
                                    webcallpeers[x].filearray[y].status = "stopped";
                                    hideFile(progressid);
                                    removeFile(progressid);
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

            var peerinfo = findPeerInfo(e.userid);

            webrtcdev.log(" RTCConn onleave user", e, " his peerinfo ", peerinfo, " rom webcallpeers ", webcallpeers);
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
            webrtcdev.warn(" RTCConn on close conversation ", e);
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
            webrtcdev.log("[start] on File start ", file);
            webrtcdev.log("[start] on File start description  , name :", file.name, " from -> ", file.userid, " to ->", file.remoteUserId);

            //alert ( "send fille to " + file.remoteUserId , findPeerInfo(file.remoteUserId).name);

            let progressid = file.uuid + "_" + file.userid + "_" + file.remoteUserId;
            let peerinfo = findPeerInfo(file.userid);
            // check if not already present ,
            // done to include one entry even if same file is being sent to multiple particpants
            if (!peerinfo.filearray.includes("name : file.name")) {
                // add to peerinfo file array
                peerinfo.filearray.push({
                    "pid": progressid,
                    "name": file.name,
                    "status": "progress",
                    "from": file.userid,
                    "to": file.remoteUserId
                });

                // create multiple instances  , also pass file from and file to for the progress bars
                addProgressHelper(file.uuid, peerinfo, file.name, file.maxChunks, file, "fileBoxClass", file.userid, file.remoteUserId);
            }
            onFileShareStart(file);
        },

        rtcConn.onFileProgress = function (e) {
            //.log("[start] on File progress uuid : ", e.uuid , " , name :", e.name ,
            //   " from -> ", e.userid , " to ->" , e.remoteUserId);
            try {
                // if the file has already recahed max chunks then exit
                if (e.currentPosition > e.maxChunks) return;

                var progressid = e.uuid + "_" + e.userid + "_" + e.remoteUserId;
                var r = progressHelper[progressid];
                // webrtcdev.log("[start] on File progress ",
                //     " progresshelper id - " , progressid ,
                //     "currentPosition - " , e.currentPosition ,
                //     "maxchunks - ", e.maxChunks ,
                //     "progress.max - " , r.progress.max);

                r && (r.progress.value = e.currentPosition || e.maxChunks || r.progress.max, updateLabel(r.progress, r.label));
            } catch (err) {
                webrtcdev.error("[sessionmanager] Problem in onFileProgress ", err);
            }
        },

        rtcConn.onFileEnd = function (file) {
            webrtcdev.log("[start] On file End description , file :", file, " from -> ", file.userid, " to ->", file.remoteUserId);

            //alert ( "end file to " + file.remoteUserId , findPeerInfo(file.remoteUserId).name);

            var progressid = file.uuid + "_" + file.userid + "_" + file.remoteUserId;
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
            if (peerinfo != null) {
                for (x in peerinfo.filearray)
                    if (peerinfo.filearray[x].name == filename && peerinfo.filearray[x].pid == progressid) {
                        //update filearray status to finished
                        peerinfo.filearray[x].status = "finished";

                        // Hide the stop upload button for this file
                        var stopuploadbutton = document.getElementById("stopuploadButton" + progressid);
                        if (stopuploadbutton) stopuploadbutton.hidden = true;
                    }
            }

            // if all file progress bars with the name are finsihed
            //- tbd

            // Display on File Viewer and List
            webrtcdev.log("[start] onFileEnd - Display on File Viewer and List -", file.url, filename, file.type);
            displayFile(file.uuid, peerinfo, file.url, filename, file.type);

            webrtcdev.log("[sessionmanager] onFileEnd - Display List -", filename + file.uuid, document.getElementById(filename + file.uuid));
            // if the file is from me ( orignal share ) then diaply listing in viewbox just one
            if (selfuserid == file.userid && document.getElementById(filename + file.uuid)) {
                return;
            }
            displayList(file.uuid, peerinfo, file.url, filename, file.type);
            onFileShareEnded(file);

            //start the pending transfer from pendingFileTransfer.push(file);
            if (pendingFileTransfer.length >= pendingFileTransferlimit) {
                webrtcdev.log("resuming pending/paused file ", pendingFileTransfer[0]);
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
            uuid: rtcConn.userid,
            name: selfusername || "",
            color: selfcolor || "",
            email: selfemail || "",
            role: role || "participant"
        },

        rtcConn.socketMessageEvent = 'RTCMultiConnection-Message',
        rtcConn.socketCustomEvent = 'RTCMultiConnection-Custom-Message',

        rtcConn.enableFileSharing = true,
        rtcConn.filesContainer = document.body || document.documentElement,

        rtcConn.iceServers = webrtcdevIceServers,

        webrtcdev.log(" [sessionmanager] rtcConn : ", rtcConn);

        //tempuserid = supportSessionRefresh();

        // if(this.turn!=null && this.turn !="none"){
        //     if (!webrtcdevIceServers) {
        //         return;
        //     }
        //     webrtcdev.info(" WebRTC dev ICE servers ", webrtcdevIceServers);
        //     rtcConn.iceServers = webrtcdevIceServers;
        //     //window.clearInterval(repeatInitilization);
        // }

        if (rtcConn)
            resolve("done");
        else
            reject("failed");
    })
    .catch((err) => {
        webrtcdev.error("setRtcConn", err);
        reject(err);
    });
}

/*
* Support Session Refresh
*/
function supportSessionRefresh() {
    //alert(" old Userid " + localStorage.getItem("userid") + " | old channel  "+ localStorage.getItem("channel") );
    webrtcdev.log(" [sessionmanager ] check for session refresh/user refreshed",
        " Channel in local stoarge - ", localStorage.getItem("channel"),
        " Current Channel  - ", rtcConn.channel,
        " match ", localStorage.getItem("channel") == rtcConn.channel);

    if (localStorage.getItem("channel") == rtcConn.channel && localStorage.getItem("userid")) {
        webrtcdev.log(" [sessionmanager ] supportSessionRefresh - rejoining with old user id " + localStorage.getItem("userid"));
        selfuserid = localStorage.getItem("userid");
        shownotification("Refreshing the Session");
        return selfuserid;
    }
    //return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
    return rtcConn.userid;
}

/*
* Check Microphone and Camera Devices
*/
// function checkDevices(resolveparent, rejectparent, incoming, outgoing) {
//     listDevices();
// }


/**
 * set Widgets.
 */
var setWidgets = function (rtcConn) {

    return new Promise(function (resolve, reject) {

        // ---------------------------------- Chat Widget --------------------------------------------------
        if (chatobj.active) {
            if (chatobj.inputBox && chatobj.inputBox.text_id && document.getElementById(chatobj.inputBox.text_id)) {
                webrtcdev.log("[sessionmanager]Assign chat Box ");
                assignChatBox(chatobj);
            } else {
                webrtcdev.log("[sessionmanager]Create chat Box ");
                createChatBox(chatobj);
            }
            webrtcdev.log("[sessionmanager] chat widget loaded ");
        } else {
            webrtcdev.log("[sessionmanager] chat widget not loaded ");
        }

        // ---------------------------------- Screen record Widget --------------------------------------------------
        if (screenrecordobj && screenrecordobj.active && role != "inspector") {
            if (screenrecordobj.button.id && document.getElementById(screenrecordobj.button.id)) {
                webrtcdev.log("[sessionmanager] Assign Record Button ");
                assignScreenRecordButton(screenrecordobj);
            } else {
                webrtcdev.log("[sessionmanager] Create Record Button ");
                createScreenRecordButton(screenrecordobj);
            }
            webrtcdev.log(" [sessionmanager] screen record widget loaded ");
        } else if (screenrecordobj && !screenrecordobj.active) {
            if (screenrecordobj.button && screenrecordobj.button.id && document.getElementById(screenrecordobj.button.id)) {
                document.getElementById(screenrecordobj.button.id).className = "inactiveButton";
            }
            webrtcdev.warn("[sessionmanager] screen record widget not loaded ");
        }

        // ---------------------------------- Screenshare Widget --------------------------------------------------
        if (screenshareobj.active) {
            //................ TBD
            if (screenrecordobj.button.id && document.getElementById(screenrecordobj.button.id)) {
                webrtcdev.log("[sessionmanager] Assign Record Button ");
                assignScreenShareButton(screenshareobj.button.shareButton);
            } else {
                webrtcdev.log("[sessionmanager] Create Record Button ");
                createScreenShareButton();
            }
            webrtcdev.log(" [sessionmanager]screen share widget loaded ");
        } else {
            webrtcdev.warn("[sessionmanager] screen share widget not loaded ");
        }

        // ---------------------------------- Reconnect Widget --------------------------------------------------
        if (reconnectobj && reconnectobj.active) {
            if (reconnectobj.button.id && document.getElementById(reconnectobj.button.id)) {
                webrtcdev.log("[sessionmanager] Rconnect Button Assigned");
                assignButtonRedial(reconnectobj.button.id);
            } else {
                webrtcdev.log("[sessionmanager]Rconnect Button created");
                createButtonRedial(reconnectobj);
            }
            webrtcdev.log(" [sessionmanager]reconnect widget loacded ");
        } else if (reconnectobj && !reconnectobj.active) {
            if (reconnectobj.button && reconnectobj.button.id && document.getElementById(reconnectobj.button.id)) {
                document.getElementById(reconnectobj.button.id).className = "inactiveButton";
            }
            webrtcdev.warn(" [sessionmanager] reconnect widget not loaded ");
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
            webrtcdev.log(" [sessionmanager]listen in widget loaded ");
        } else if (listeninobj && !listeninobj.active) {
            if (listeninobj.button.id && document.getElementById(listeninobj.button.id)) {
                document.getElementById(listeninobj.button.id).className = "inactiveButton";
            }
            webrtcdev.warn("[sessionmanager] listenin widget not loaded ");
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
            webrtcdev.log("[sessionmanager] draw widget loaded ");
        } else if (drawCanvasobj && !drawCanvasobj.active) {
            if (drawCanvasobj.button && drawCanvasobj.button.id && document.getElementById(drawCanvasobj.button.id)) {
                document.getElementById(drawCanvasobj.button.id).className = "inactiveButton";
            }
            webrtcdev.warn("[sessionmanager] draw widget not loaded ");
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

            webrtcdev.log("[sessionmnagare] fileshareobj "),
                rtcConn.enableFileSharing = true;
            // //rtcConn.filesContainer = document.body || document.documentElement;
            // /*setFileProgressBarHandlers(rtcConn);*/
            rtcConn.filesContainer = document.getElementById(fileshareobj.fileShareContainer);
            if (fileshareobj.button.id && document.getElementById(fileshareobj.button.id)) {
                assignFileShareButton(fileshareobj);
            } else {
                createFileShareButton(fileshareobj);
            }
            webrtcdev.log(" [sessionmanager] File sharing widget loaded ");
        } else {
            webrtcdev.warn("[sessionmanager] File sharing widget not loaded ");
        }

        // ---------------------------------- stats Widget --------------------------------------------------
        if (statisticsobj && statisticsobj.active) {
            try {
                document.getElementById(statisticsobj.statsConainer).innerHTML = "";
            } catch (e) {
                webrtcdev.error("[sessionmanager] statisticsobj statsConainer not found", e);
            }
        }

        // ---------------------------------- Help Widget --------------------------------------------------
        if (helpobj && helpobj.active) {
            try {
                document.getElementById(helpobj.helpContainer).innerHTML = "";
            } catch (err) {
                webrtcdev.error("[sessionmanager] helpobj helpContainer not found", err);
            }
        }
        resolve("success");
    });
};


/**
 * Open a WebRTC socket channel
 * @method
 * @name opneWebRTC
 * @param {string} channel
 * @param {string} userid
 */
var openWebRTC = function (channel, userid, maxallowed) {
    webrtcdev.info("[sessionmanager] -openWebRTC channel: ", channel);

    socket.emit("open-channel", {
        channel: channel,
        sender: userid,
        maxAllowed: maxallowed
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
var connectWebRTC = function (type, channel, selfuserid, remoteUsers) {
    webrtcdev.info(" [sessionmanager] ConnectWebRTC type : ", type, " , Channel :", channel,
        " , self-Userid : ", selfuserid, " , and remote users : ", remoteUsers);
    if (debug) showUserStats();

    /*void(document.title = channel);*/
    if (fileshareobj.active) {

        try {
            var _peerinfo = findPeerInfo(selfuserid);
            if (!_peerinfo) throw "self peerinfo missing in webcallpeers for " + selfuserid;

            // Create File Sharing Div 
            if (fileshareobj.props.fileShare == "single") {
                createFileSharingDiv(_peerinfo);
                //max diaply the local / single fileshare 
                document.getElementById(_peerinfo.fileShare.outerbox).style.width = "100%";
                // hide the remote fileshare
                //document.getElementById(_peerinfo.fileShare.outerbox).style.width="100%";
            } else if (fileshareobj.props.fileShare == "divided") {

                // create local File sharing window 
                //Do not create file share and file viewer for inspector's own session 
                if (role != "inspector") {
                    webrtcdev.log(" [sessionmanager] creating local file sharing");
                    createFileSharingDiv(_peerinfo);
                } else {
                    webrtcdev.log("[sessionmanager] Since it is an inspector's own session , not creating local File viewer and list");
                }

                // create remotes File sharing window 
                for (x in webcallpeers) {
                    if (webcallpeers[x].userid != selfuserid && webcallpeers[x].role != "inspector") {
                        webrtcdev.log(" [start connectWebRTC] creating remote file sharing ");
                        createFileSharingDiv(webcallpeers[x]);
                    }
                }

                // on connect webrtc request old file from peerconnection session
                if (fileshareobj.sendOldFiles) {
                    requestOldFiles();
                }

            } else {
                webrtcdev.error("[sessionmanager] fileshareobj.props.fileShare undefined ");
            }

            // Creating File listing div 
            if (fileshareobj.props.fileList == "single") {
                document.getElementById(_peerinfo.fileList.outerbox).style.width = "100%";
            } else if (fileshareobj.props.fileShare != "single") {
                webrtcdev.log("No Seprate div created for this peer since fileshare container is single");
            } else {
                webrtcdev.error("fileshareobj.props.fileShare undefined ");
            }

        } catch (err) {
            webrtcdev.error("[sessionmanager] connectwebrtc -", err)
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
var joinWebRTC = function (channel, userid) {
    shownotification("Joining an existing session " + channel);
    webrtcdev.info(" [sessionmanager] joinWebRTC channel: ", channel);

    if (debug) showUserStats();

    socket.emit("join-channel", {
        channel: channel,
        sender: userid,
        extra: {
            userid: userid,
            name: selfusername || "",
            color: selfcolor || "",
            email: selfemail || "",
            role: role || "participant"
        }
    });
};

/**
 * cleares local storage varibles
 * @method
 * @name clearCaches
 */
this.clearCaches = clearCaches = function () {
    localStorage.clear();
}
