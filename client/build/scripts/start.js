/**************************************************************************************
        peerconnection 
****************************************************************************/
var RTCPeerConnection = null;

var webrtcDetectedBrowser = null;
var webrtcDetectedVersion = null;
var usersList       = document.getElementById("userslist");
var numbersOfUsers  = document.getElementById("numbersofusers");
var usersContainer  = document.getElementById("usersContainer");

var tempuserid = guid();

var sessions = {};

/**
 * Represents a webrtc dom startup.
 * @constructor
 * @param {json} _localObj - The title of the book.
 * @param {json} _remoteObj - The author of the book.
 * @param {json} incoming - The title of the book.
 * @param {json} outgoing - The author of the book.
 */
var WebRTCdom= function(  _localObj , _remoteObj , incoming, outgoing){

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

    /* When user is single */
    localobj=_localObj;
    localVideo = localobj.video;

    /* when user is in conference */
    remoteobj=_remoteObj;
    var _remotearr=_remoteObj.videoarr;

    /* first video container in remotearr belonsg to user */
    if(outgoingVideo){
        selfVideo = _remotearr[0];
    }

    /* create arr for remote peers videos */
    if(!remoteobj.dynamicVideos){
        for(var x=1;x<_remotearr.length;x++){
            remoteVideos.push(_remotearr[x]);    
        }
    }


    if(localobj.hasOwnProperty('userdetails')){
        console.log("userdetails " , localobj.userdetails);
        selfusername = (localobj.userdetails.username  == undefined ? "user": localobj.userdetails.username);
        selfcolor    = (localobj.userdetails.usercolor == undefined ? "orange": localobj.userdetails.usercolor);
        selfemail    = (localobj.userdetails.useremail == undefined ? "noemail": localobj.userdetails.useremail);
    }
};

var WebRTCdev= function(session, widgets){
    sessionid  = session.sessionid;
    socketAddr = session.socketAddr;
    turn    = (session.hasOwnProperty('turn')?session.turn:null);
    console.log("widgets ", widgets);

    if(turn!=null ){
        getICEServer( turn.username ,turn.secretkey , turn.domain,
                        turn.application , turn.room , turn.secure); 
    }

    if(widgets){

        if(widgets.debug)           debug           = widgets.debug;

        if(widgets.chat)            chatobj         = widgets.chat;

        if(widgets.fileShare)       fileshareobj    = widgets.fileShare;

        if(widgets.screenrecord)    screenrecordobj = widgets.screenrecord;

        if(widgets.screenshare)     screenshareobj  = widgets.screenshare;

        if(widgets.snapshot)        snapshotobj     = widgets.snapshot;

        if(widgets.videoRecord)     videoRecordobj  = widgets.videoRecord;

        if(widgets.reconnect)       reconnectobj    = widgets.reconnect;

        if(widgets.drawCanvas)      drawCanvasobj   = widgets.drawCanvas;

        if(widgets.texteditor)      texteditorobj   = widgets.texteditor;

        if(widgets.codeeditor)      codeeditorobj   = widgets.codeeditor;

        if(widgets.mute)            muteobj         = widgets.mute;

        if(widgets.timer)           timerobj        = widgets.timer;

        if(widgets.cursor)          cursorobj       = widgets.cursor;

        if(widgets.fullscreen)      fullscreenobj   = widgets.fullscreen;
    }

    return {
        sessionid:sessionid,
        socketAddr:socketAddr,
        turn: turn,
        widgets:widgets,
        startwebrtcdev:function() {
            
            rtcConn = new RTCMultiConnection(sessionid);
            
            if(turn!='none'){
                if(!webrtcdevIceServers) {
                    return;
                }
                rtcConn.iceServers=webrtcdevIceServers;       
                window.clearInterval(repeatInitilization);
            }  

            /*checkDevices(rtcConn);*/
            rtcConn.extra = {
                uuid : tempuserid,
                name : localobj.userdetails.username,
                color: localobj.userdetails.usercolor,
                email: localobj.userdetails.useremail
            },
            rtcConn.channel=sessionid,
            rtcConn.userid = tempuserid,
            rtcConn.preventSSLAutoAllowed = false,
            rtcConn.autoReDialOnFailure = true,
            rtcConn.setDefaultEventsForMediaElement = false,
            rtcConn.customStreams = {}, 
            rtcConn.autoCloseEntireSession = !1, 
            rtcConn.autoTranslateText = !1, 
            rtcConn.maxParticipantsAllowed = (remoteobj.maxAllowed=="unlimited"?256:remoteobj.maxAllowed), 
            rtcConn.blobURLs = {},
            rtcConn.dontCaptureUserMedia = true,
            /*
            rtcConn.onNewParticipant = function(participantId, userPreferences) {
                console.log("onNewParticipant" ,participantId ,userPreferences);
                if(webcallpeers.length<=remoteobj.maxAllowed){
                    updatePeerInfo(userPreferences.extra.uuid ,"Peer" , "#BFD9DA" , "", "remote");
                }else{
                    shownotification("Another user is trying to join this channel but max count [ "+remoteobj.maxAllowed +" ] is reached");
                }
                rtcConn.acceptParticipationRequest(participantId, userPreferences);
            };*/
            rtcConn.onstream = function(event) {
                var peerinfo=findPeerInfo(event.userid);
                peerinfo.type=event.type;
                peerinfo.stream=event.stream;
                peerinfo.streamid=event.stream.streamid;
                updateWebCallView(peerinfo);
            }, 

            rtcConn.onUserIdAlreadyTaken = function(useridAlreadyTaken, yourNewUserId) {
                // seems room is already opened
                connection.join(useridAlreadyTaken);
            };

            rtcConn.onstreamended = function(event) {
                event.isScreen ? $("#" + event.userid + "_screen").remove() : $("#" + event.userid).remove()
            }, 

            rtcConn.onconnected = function(event) {
                // event.peer.addStream || event.peer.getConnectionStats
                console.log('rtcConn.onconnected ......between you and', event.userid);
            },

            rtcConn.onopen = function(event) {                                 
                if(timer){
                   startsessionTimer(timerobj);
                   shareTimePeer();
                }
                shownotification(event.extra.name + " joined session ");
                onSessionConnect();
            },

            rtcConn.onNewSession = function(event) {
                /*  startsessionTimer();  */
                console.log('rtcConn.onNewSession : ', event);
            },

            rtcConn.onRequest = function(event) {
                console.log(" OnRequest ", event);
                rtcConn.accept(event)
            }, 

            rtcConn.onmessage = function(e) {
                console.log(" on message ", e);
                if(e.data.typing){
                    updateWhotyping(e.extra.name + " is typing ...") ;
                }else if(e.data.stoppedTyping){
                    updateWhotyping("");
                }else{
                    switch(e.data.type){
                        case "screenshare":
                            
                            if(e.data.message=="stoppedscreenshare"){
                                shownotification("Screenshare has stopped : " + e.data.screenStreamid);
                                //createScreenViewButton();
                                var button=document.getElementById(screenshareobj.button.shareButton.id);
                                button.innerHTML="Screen share";
                                button.parentNode.setAttribute("style","background:#2e6da4");
                                button.disabled = false;

                                scrConn.onstreamended();
                                scrConn.removeStream(e.data.screenStreamid);
                                scrConn.close();
                            }else{
                                shownotification("screen is getting shared "+ e.data.message);
                                //createScreenViewButton();
                                var button=document.getElementById(screenshareobj.button.shareButton.id);
                                button.innerHTML="Peer sharing";
                                button.parentNode.setAttribute("style","background:rgba(46, 109, 164, 0.35)");
                                button.disabled = true;
                                
                                screenRoomid=e.data.message;
                                var selfuserid="temp_"+(new Date().getUTCMilliseconds());
                                webrtcdevPrepareScreenShare(function(screenRoomid){
                                    //scrConn.join(screenRoomid);  
                                     connectScrWebRTC("join" , screenRoomid, selfuserid, []); 
                                });                             
                            }

                        break;
                        case "chat":
                            updateWhotyping(e.extra.name+ " has send message");
                            addNewMessage({
                                header: e.extra.name,
                                message: e.data.message,
                                userinfo: getUserinfo(rtcConn.blobURLs[e.userid], "chat-message.png"),
                                color: e.extra.color
                            }); 
                        break;
                        case "imagesnapshot":
                            var peerinfo=findPeerInfo( e.userid );
                            displayList( null , peerinfo , e.data.message , e.data.name , "imagesnapshot" );
                            displayFile( null , peerinfo , e.data.message , e.data.name , "imagesnapshot");
                        break;
                        case "videoRecording":
                            var peerinfo=findPeerInfo( e.userid );
                            displayList( null , peerinfo , e.data.message , e.data.name , "videoRecording" );
                            displayFile( null , peerinfo , e.data.message , e.data.name , "videoRecording");
                        break;
                        case "videoScreenRecording":
                            var peerinfo=findPeerInfo( e.userid );
                            displayList( null , peerinfo , e.data.message , e.data.name , "videoScreenRecording" );
                            displayFile( null , peerinfo , e.data.message , e.data.name , "videoScreenRecording");
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
                            CanvasDesigner.syncData( e.data.draw );
                        break;
                        case "texteditor":
                            receiveWebrtcdevTexteditorSync(e.data.data);
                        break;
                        case "codeeditor":
                            receiveWebrtcdevCodeeditorSync(e.data.data);
                        break;
                        case "pointer":
                            var element = document.getElementById("cursor2");
                            placeCursor( element , e.data.corX , e.data.corY );
                        break;
                        case "timer":
                            startPeersTime(e.data.time , e.data.zone);
                        break;
                        case "buttonclick":
                            var buttonElement= document.getElementById(e.data.buttonName);
                            if ( buttonElement.getAttribute("lastClickedBy") != rtcConn.userid ){
                                buttonElement.setAttribute("lastClickedBy" , e.userid);
                                buttonElement.click();
                            }
                        break;
                        default:
                            console.log(" unrecognizable message from peer  ",e);
                        break;
                    }
                } 
                return;
            },

            rtcConn.sendMessage = function(event) {
                console.log(" sendMessage ", event);
                event.userid = rtcConn.userid, 
                event.extra = rtcConn.extra, 
                rtcConn.sendCustomMessage(event)
            }, 

            rtcConn.onEntireSessionClosed = function(event) {
                rtcConn.attachStreams.forEach(function(stream) {
                    stream.stop();
                });   
            },

            rtcConn.onclose = function(e) {
                console.log(" RTCConn on close conversation " ,e);
                /*alert(e.extra.name + "closed ");*/
            },

            rtcConn.onleave = function(e) {
                /*
                addNewMessage({
                    header: e.extra.name,
                    message: e.extra.name + " left session.",
                    userinfo: getUserinfo(rtcConn.blobURLs[e.userid], "info.png"),
                    color: e.extra.color
                }), */
                console.log(" RTCConn  on leave Left conversation " ,e , findPeerInfo(e.userid));
                if(e.extra.name !="undefined")
                    shownotification(e.extra.name + "  left the conversation.");
                //rtcConn.playRoleOfInitiator()
                destroyWebCallView(findPeerInfo(e.userid), function(result){
                    if(result)
                        removePeerInfo(e.userid);
                });
            },

            rtcConn.takeSnapshot = function(userid, callback) {
                takeSnapshot({
                    userid: userid,
                    connection: connection,
                    callback: callback
                });
            },

            rtcConn.onFileStart = function(file) {
                console.log("on File start "+ file.name);
                var peerinfo=findPeerInfo(file.userid);
                addProgressHelper(file.uuid , peerinfo , file.name , file.maxChunks,  "fileBoxClass");
            }, 

            rtcConn.onFileProgress = function(e) {
                var r = progressHelper[e.uuid];
                r && (r.progress.value = e.currentPosition || e.maxChunks || r.progress.max, updateLabel(r.progress, r.label))
            }, 

            rtcConn.onFileEnd = function(file) {
                console.log("On file End "+ file.name );
                var peerinfo=findPeerInfo(file.userid);
                if(peerinfo!=null)
                    peerinfo.filearray.push(file.name);
                displayFile(file.uuid , peerinfo , file.url , file.name , file.type);
                displayList(file.uuid , peerinfo , file.url , file.name , file.type);
            };

            if(chatobj.active){
                /* 
               if(chatobj.button.id && document.getElementById(chatobj.button.id)){
                    assignChatButon(chatobj);
                }else{
                    createChatButton(chatobj);
                }*/

                if(chatobj.inputBox.text_id && document.getElementById(chatobj.inputBox.text_id)){
                    assignChatBox(chatobj);
                }else{
                    createChatBox(chatobj);
                }

                console.log("start-chatobj --> " , chatobj);
            }

            if(screenrecordobj.active){
                if(screenrecordobj.button.id && document.getElementById(screenrecordobj.button.id)){
                    assignScreenRecordButton(screenrecordobj);
                }else{
                    createScreenRecordButton();
                }
            }

            if(screenshareobj.active){
                detectExtensionScreenshare(screenshareobj.extensionID); 
            }   

            if(reconnectobj.active){
                if(reconnectobj.button.id && document.getElementById(reconnectobj.button.id)){
                    assignButtonRedial(reconnectobj.button.id);
                }else{
                    createButtonRedial();
                }
            }

            if(timerobj.active){
                startTime();
                timeZone();
                activateBttons(timerobj);
            }

            if(drawCanvasobj.active){
                createdrawButton();
            }

            if(texteditorobj.active){
                createTextEditorButton();
            }

            if(codeeditorobj.active){
                createCodeEditorButton();
            }

            //if(cursorobj.active){
              //  assignButtonCursor(cursorobj.button.id);
            //}

            if(fileshareobj.active){
                rtcConn.enableFileSharing = true;
                /*setFileProgressBarHandlers(rtcConn);*/
                rtcConn.filesContainer = document.getElementById(fileshareobj.fileShareContainer);
                if(fileshareobj.button.id && document.getElementById(fileshareobj.button.id)){
                    assignFileShareButton(fileshareobj);
                }else{
                    createFileShareButton(fileshareobj);
                }
            }

            setSettingsAttributes( rtcConn );
            startSession(rtcConn);
        },
        connectionObj : rtcConn
    };
};

/**
 * event handler for when session is connected with a peer
 * @method
 * @name onSessionConnect
 */
var onSessionConnect=function(){
    //alert("on session connect do anothing ");
    //eventhandler for session onConnect , overwrite in client lib 
    console.log(" On session connect ");
};

/**
 * function to start session with socket
 * @method
 * @name startSession
 * @param {object} connection
 */
function startSession(rtcConn){
    console.log("==========startSession"  , rtcConn);
    var addr = "/";

    if(socketAddr!="/"){
        addr = socketAddr;
    }

    socket = io.connect(addr);

    /*
     socket.emit("register-channel", {
        channel: rtcConn.channel
    }); */          
    
    shownotification(" Checking status of  : "+ sessionid);

    socket.emit("presence", {
        channel: sessionid
    });

    socket.on("presence", function(event) {
        console.log("PRESENCE -----------> ", event);
        event ?  joinWebRTC(sessionid, selfuserid) 
        : opneWebRTC(sessionid, selfuserid);
    });

    socket.on("open-channel-resp",function(event) {
        console.log("opened-channel" , event);
       if(event) connectWebRTC("open" , sessionid, selfuserid, []); 
    });

    socket.on("join-channel-resp",function(event) {
        console.log("joined-channel" , event ,"existing memebers ", event.users);
        if(event.status)
            connectWebRTC("join" ,sessionid, selfuserid , event.users); 
        else
            shownotification(event.msgtype+" : "+ event.message);
    });

    socket.on("channel-event",function(event) {
        console.log("channel-event" , event);
        if(event.type=="new-join"){
            if(event.status){
                updatePeerInfo(event.data.sender ,event.data.extra.name , "#BFD9DA" , event.data.extra.email, "remote");
                shownotification(event.type);
            }else{
                shownotification(event.msgtype+" : "+ event.message);
            }
        }
    });

}

/**
 * function to check devices like speakers , webcam ,  microphone etc
 * @method
 * @name checkDevices
 * @param {object} connection
 */
function checkDevices(obj){
    console.log(" obj.DetectRTC  " , obj.DetectRTC);
    if(obj.DetectRTC.hasMicrophone) {
        // seems current system has at least one audio input device
        console.log("has Microphone");
    }else{
        console.log("doesnt have  hasMicrophone");
    }

    if(obj.DetectRTC.hasSpeakers) {
        console.log("has Speakers");
        // seems current system has at least one audio output device
    }else{
        console.log("doesnt have  Speakers");
    }

    if(obj.DetectRTC.hasWebcam) {
        console.log("has Webcam");
        // seems current system has at least one video input device
    }else{
        console.log("doesnt have Webcam");
    }
}

/**
 * function to check browser support for webrtc apis
 * @name checkWebRTCSupport
 * @param {object} connection
 */
function checkWebRTCSupport(obj){
    if(obj.DetectRTC.isWebRTCSupported) {
    // seems WebRTC compatible client
    }

    if(obj.DetectRTC.isAudioContextSupported) {
        // seems Web-Audio compatible client
    }

    if(obj.DetectRTC.isScreenCapturingSupported) {
        // seems WebRTC screen capturing feature is supported on this client
    }

    if(obj.DetectRTC.isSctpDataChannelsSupported) {
        // seems WebRTC SCTP data channels feature are supported on this client
    }

    if(obj.DetectRTC.isRtpDataChannelsSupported) {
        // seems WebRTC (old-fashioned) RTP data channels feature are supported on this client
    }
}



function error(arg1 , arg2){
    console.log(arg1, arg2);
}

function getElement(e) {
    return document.querySelector(e)
}

function getRandomColor() {
    for (var e = "0123456789ABCDEF".split(""), t = "#", n = 0; 6 > n; n++) t += e[Math.round(15 * Math.random())];
    return t
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}


function getUserinfo(e, t) {
    return e ? '<video src="' + e + '" autoplay></vide>' : '<img src="' + t + '">';
}

function fireClickEvent(e) {
    var t = new MouseEvent("click", {
        view: window,
        bubbles: !0,
        cancelable: !0
    });
    e.dispatchEvent(t)
}

function bytesToSize(e) {
    var t = ["Bytes", "KB", "MB", "GB", "TB"];
    if (0 == e) return "0 Bytes";
    var n = parseInt(Math.floor(Math.log(e) / Math.log(1024)));
    return Math.round(e / Math.pow(1024, n), 2) + " " + t[n]
}

/***************************************************
video handling 
*********************************************************/

function appendVideo(e, style) {
    createVideoContainer(e, style, function(div) {
        var video = document.createElement('video');
        video.className = style;
        video.setAttribute('style', 'height:auto;opacity:1;');
        video.controls=false;
        video.id = e.userid;
        video.src = URL.createObjectURL(e.stream);
        viden.hidden=false;
        var remote = document.getElementById('remote');
        div.appendChild(video);
        video.play();
    });
}

function createVideoContainer(e, style, callback) {
    var div = document.createElement('div');
    div.setAttribute('style', style || 'float:left;opacity: 1;width: 32%;');
    remote.insertBefore(div, remote.firstChild);
    if (callback) callback(div);
}

/************************************
        control Buttons and User Detaisl attchmenet to Video Element
*******************************************/
function attachUserDetails(vid,peerinfo){
    var nameBox=document.createElement("span");
    nameBox.className="well well-sm";
    nameBox.setAttribute("style","background-color:"+ peerinfo.color);
    nameBox.innerHTML=peerinfo.name+"<br/>";

    /*vid.parentNode.appendChild(nameBox); */
    vid.parentNode.insertBefore(nameBox, vid.parentNode.firstChild);
}

function attachControlButtons( vid ,  peerinfo){

    var stream = peerinfo.stream;
    var streamid = peerinfo.streamid;
    var controlBarName =  peerinfo.controlBarName;
    var snapshotViewer =  peerinfo.fileSharingContainer ;

    //Preventing multple control bars 
    var c=vid.parentNode.childNodes;
    for (i = 0; i < c.length; i++) {
        console.log("ChildNode of video Parent " , c[i]);
        if(c[i].nodeName=="DIV" && c[i].id!=undefined){
            if( c[i].id.indexOf("control")>-1 ){
                alert("control bar exists already delete the previos one before adding new one");
                vid.parentNode.removeChild(c[i]);
            }
        }
    }


    var controlBar= document.createElement("div");
    controlBar.id = controlBarName;
    controlBar.className= "videoControlBarClass";
    if(muteobj.active){
        if(muteobj.audio.active){
            controlBar.appendChild(createAudioMuteButton(controlBarName , peerinfo));
        }
        if(muteobj.video.active){
            controlBar.appendChild(createVideoMuteButton(controlBarName , peerinfo));        
        }
    }
    
    if(snapshotobj.active){
        controlBar.appendChild(createSnapshotButton(controlBarName , peerinfo));
    }

    if(videoRecordobj.active){
        controlBar.appendChild(createRecordButton(controlBarName, peerinfo, streamid, stream ));
    }

    if(cursorobj.active){
        //assignButtonCursor(cursorobj.button.id);
        controlBar.appendChild(createCursorButton(controlBarName, peerinfo ));
    }

    if(fullscreenobj.active){
        controlBar.appendChild(createFullScreenButton(controlBarName, peerinfo, streamid, stream ));
    }

    if(debug){
        var nameBox=document.createElement("span");
        nameBox.innerHTML=vid.id;
        controlBar.appendChild(nameBox);  
    }

    vid.parentNode.appendChild(controlBar);        
}

function updateWebCallView(peerInfo){
    console.log("peerInfo" , peerInfo);

    if(peerInfo.vid.indexOf("videolocal") > -1){
        $("#"+localobj.videoContainer).show();
        $("#"+remoteobj.videoContainer).hide();
        if(localVideo){
            var vid = document.getElementsByName(localVideo)[0];
            vid.muted = true;
            vid.style.opacity = 1;
            vid.className=localobj.videoClass;
            attachMediaStream(vid, peerInfo.stream);
        }
    }else if(peerInfo.vid.indexOf("videoremote") > -1) {

        $("#"+localobj.videoContainer).hide();
        $("#"+remoteobj.videoContainer).show();
    
        /* handling local video transistion to active */
        if( outgoingVideo ){
            /*chk if local video is added to conf , else adding local video to index 0 */
            var selfvid = document.getElementsByName(selfVideo)[0];
            var localvid = document.getElementsByName(localVideo)[0];

            if(selfvid.played.length==0){
                if(localvid.played.lebth>0)
                    reattachMediaStream(selfvid, localvid);
                else
                    attachMediaStream(selfvid, webcallpeers[0].stream);
                selfvid.id = webcallpeers[0].videoContainer;
                selfvid.className=remoteobj.videoClass;
                selfvid.muted = true;
                attachControlButtons( selfvid, webcallpeers[0]); 
                if(localobj.userDisplay)
                    attachUserDetails( selfvid, webcallpeers[0]); 
                if(fileshareobj.active){
                    createFileSharingDiv(webcallpeers[0]);
                }
            }
        }

        /*get the next empty index of video and pointer in video array */
        var vi=0;
        for(var v=0;v<remoteVideos.length;v++){
            console.log("Remote Video index array " , v , " || ", remoteVideos[v] , document.getElementsByName(remoteVideos[v])  , document.getElementsByName(remoteVideos[v]).src);
            if(document.getElementsByName(remoteVideos[v])[0].src){
                vi++;
            }
        }

        var remvid;
        if(remoteobj.maxAllowed=="unlimited"){
            var video = document.createElement('video');
            video.autoplay="autoplay";
            remoteVideos[vi]=video;
            document.getElementById(remoteobj.dynamicVideos.videoContainer).appendChild(video);
            remvid=remoteVideos[vi];
        }else{
            remvid=document.getElementsByName(remoteVideos[vi])[0];
            console.log("remote video not unlimited " , remvid);
        }

        attachMediaStream(remvid, peerInfo.stream);
        remvid.id = peerInfo.videoContainer;
        remvid.className=remoteobj.videoClass;
        attachControlButtons(remvid, peerInfo); 

        if(remoteobj.userDisplay)
            attachUserDetails( remvid, peerInfo); 
        
        if(fileshareobj.active){

            if(fileshareobj.props.fileShare){
                if(fileshareobj.props.fileShare=="divided")
                    createFileSharingDiv(peerInfo);
                else if(fileshareobj.props.fileShare=="single")
                    console.log("No Seprate div created for this peer  s fileshare container is single");
                else
                    console.log("props undefined ");
            }
        }
    }
}

/********************************************************************************** 
        Session call and Updateing Peer Info
************************************************************************************/
var repeatInitilization = null;

/**
 * find information about a peer form array of peers basedon userid
 * @method
 * @name findPeerInfo
 * @param {string} userid
 */
function startCall(obj){
    if(turn=='none'){
        obj.startwebrtcdev();
    }else if(turn!=null && turn!='none'){
        repeatInitilization = window.setInterval(obj.startwebrtcdev, 1000);     
    }
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
function updatePeerInfo(userid , username , usecolor , useremail,  type ){
    console.log("updating peerInfo: " , userid , type);
    for(x in webcallpeers){
        if(webcallpeers[x].userid==userid) {
            console.log("UserID is already existing , webcallpeers");
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
        controlBarName: "control-video"+userid,
        filearray : [],
        vid : "video"+type+"_"+userid
    };

    if(fileshareobj.active){

        if(fileshareobj.props.fileShare=="single"){
            peerInfo.fileShare={
                outerbox: "widget-filesharing-box",
                container : "widget-filesharing-container",
                minButton: "widget-filesharing-minbutton",
                maxButton: "widget-filesharing-maxbutton",
                closeButton: "widget-filesharing-closebutton"
            };
        }else{
            peerInfo.fileShare={
                outerbox: "widget-filesharing-box"+userid,
                container : "widget-filesharing-container"+userid,
                minButton: "widget-filesharing-minbutton"+userid,
                maxButton: "widget-filesharing-maxbutton"+userid,
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
    console.log("updated peerInfo: " ,peerInfo);
    webcallpeers.push(peerInfo);
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
function removePeerInfo(userid){
    console.log(" Before  " , webcallpeers);
    console.log("removing peerInfo: " , userid);
    webcallpeers.splice(userid, 1);
    console.log(" After " , webcallpeers);
}

function destroyWebCallView(peerInfo , callback){
    console.log(" [destroyWebCallView] peerInfo" , peerInfo);
    if(document.getElementById(peerInfo.videoContainer))
        document.getElementById(peerInfo.videoContainer).src="";
    
    if(fileshareobj.active){
        if(fileshareobj.props.fileShare){
            if(fileshareobj.props.fileShare=="divided")
                console.log("dont remove it now ");
                //createFileSharingDiv(peerInfo);
            else if(fileshareobj.props.fileShare=="single")
                console.log("No Seprate div created for this peer  s fileshare container is single");
            else
                console.log("props undefined ");
        }
    }

    callback(true);
}

/**
 * find information about a peer form array of peers basedon userid
 * @method
 * @name findPeerInfo
 * @param {string} userid
 */
function findPeerInfo(userid){
    var peerInfo;
    /*    
    if(rtcConn.userid==userid){
        console.log("PeerInfo is found for initiator", webcallpeers[0]);
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
 * shows status of ongoing webrtc call
 * @method
 * @name showStatus
 * @param {obj} conn
 */
function showStatus(conn){
    console.log("======================status of " , rtcConn);

    getStats(rtcConn, function(result) {
        alert("getstats Result");
        console.log(result.connectionType.remote.ipAddress);
        console.log(result.connectionType.remote.candidateType);
        console.log(result.connectionType.transport);
    });

    alert( "got stats " , result.connectionType.transport);

    console.log("WebcallPeers " , webcallpeers);
}

/**
 * Open a WebRTC socket channel
 * @method
 * @name opneWebRTC
 * @param {string} channel
 * @param {string} userid
 */
opneWebRTC=function(channel , userid){
    rtcConn.open(channel);
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
connectWebRTC=function(type, channel , userid , remoteUsers){
    if(type=="open"){
        rtcConn.connect(channel);
        shownotification("Connected to new channel");
    }else if(type=="join"){
        rtcConn.connectionDescription=rtcConn.join(channel);
        shownotification("Connected with existing channel");
    }else{
        shownotification("Connection type not found");
    }

    void(document.title = channel);

    rtcConn.dontCaptureUserMedia = false,

    rtcConn.getUserMedia();

    rtcConn.session = {
        video: incomingVideo,
        audio: incomingAudio,
        data:  incomingData
    }

    rtcConn.sdpConstraints.mandatory = {
        OfferToReceiveAudio: outgoingAudio,
        OfferToReceiveVideo: outgoingVideo
    }

    if(selfuserid == null){
        selfuserid = rtcConn.userid;
        updatePeerInfo( selfuserid, selfusername ,selfcolor, selfemail, "local" );
        if(tempuserid!=selfuserid)
            socket.emit("update-channel", {
                type    : "change-userid",
                channel : rtcConn.channel,
                sender  : selfuserid,
                extra:{
                    old : tempuserid,
                    new : selfuserid
                }
            });
    }

    for (x in remoteUsers){
        updatePeerInfo(remoteUsers[x] ,"Peer" , "#BFD9DA" , "", "remote");
    }

    localStorage.setItem("channel", channel);
    localStorage.setItem("userid", userid);
    localStorage.setItem("remoteUsers", remoteUsers);
}


/**
 * function to join w webrtc socket channel
 * @method
 * @name joinWebRTC
 * @param {string} channel
 * @param {string} userid
 */
joinWebRTC=function(channel , userid){
    shownotification("Joining an existing session ");
    socket.emit("join-channel", {
        channel: channel,
        sender: (selfuserid==null?tempuserid:selfuserid),
        extra: {
            userid:(selfuserid==null?tempuserid:selfuserid),
            name:selfusername,
            color:selfcolor,
            email:selfemail
        }
    });
}


/**
 * function to leave a webrtc socket channel
 * @method
 * @name leaveWebRTC
 */
leaveWebRTC=function(){
    shownotification("Leaving the session ");
}

window.onload=function(){

    console.log( "Local Storage Channel " ,   localStorage.getItem("channel"));
};

window.onunload=function(){

    console.log(    localStorage.getItem("channel"));
};

function showRtcConn(){
    console.log(" rtcConn : "  , rtcConn);
    console.log(" rtcConn.peers.getAllParticipants() : " , rtcConn.peers.getAllParticipants());
}