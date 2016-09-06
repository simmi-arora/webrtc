/**************************************************************************************
        peerconnection 
****************************************************************************/
var RTCPeerConnection = null;

var webrtcDetectedBrowser = null;
var webrtcDetectedVersion = null;
var rtcMultiConnection ;

var usersList       = document.getElementById("userslist");
var numbersOfUsers  = document.getElementById("numbersofusers");
var usersContainer  = document.getElementById("usersContainer");

var tempuserid = guid();

var sessions = {};

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

        if(widgets.timer)           timer           = widgets.timer;
    }

    return {
        startwebrtcdev:function() {
            
            rtcMultiConnection= new RTCMultiConnection(sessionid);
            
            if(turn!='none'){
                if(!webrtcdevIceServers) {
                    return;
                }
                rtcMultiConnection.iceServers=webrtcdevIceServers;       
                window.clearInterval(repeatInitilization);
            }  

            /*checkDevices(rtcMultiConnection);*/
            rtcMultiConnection.extra = {
                uuid : tempuserid,
                name : localobj.userdetails.username,
                color: localobj.userdetails.usercolor,
                email: localobj.userdetails.useremail
            },
            rtcMultiConnection.channel=sessionid,
            rtcMultiConnection.userid = tempuserid,
            rtcMultiConnection.preventSSLAutoAllowed = false,
            rtcMultiConnection.autoReDialOnFailure = true,
            rtcMultiConnection.setDefaultEventsForMediaElement = false,
            rtcMultiConnection.customStreams = {}, 
            rtcMultiConnection.autoCloseEntireSession = !1, 
            rtcMultiConnection.autoTranslateText = !1, 
            rtcMultiConnection.maxParticipantsAllowed = (remoteobj.maxAllowed=="unlimited"?256:remoteobj.maxAllowed), 
            rtcMultiConnection.blobURLs = {},
            rtcMultiConnection.dontCaptureUserMedia = true,
            /*
            rtcMultiConnection.onNewParticipant = function(participantId, userPreferences) {
                console.log("onNewParticipant" ,participantId ,userPreferences);
                if(webcallpeers.length<=remoteobj.maxAllowed){
                    updatePeerInfo(userPreferences.extra.uuid ,"Peer" , "#BFD9DA" , "", "remote");
                }else{
                    shownotification("Another user is trying to join this channel but max count [ "+remoteobj.maxAllowed +" ] is reached");
                }
                rtcMultiConnection.acceptParticipationRequest(participantId, userPreferences);
            };*/
            rtcMultiConnection.onstream = function(event) {
                var peerinfo=findPeerInfo(event.userid);
                peerinfo.type=event.type;
                peerinfo.stream=event.stream;
                peerinfo.streamid=event.stream.streamid;
                updateWebCallView(peerinfo);
            }, 

            rtcMultiConnection.onUserIdAlreadyTaken = function(useridAlreadyTaken, yourNewUserId) {
                // seems room is already opened
                connection.join(useridAlreadyTaken);
            };

            rtcMultiConnection.onstreamended = function(event) {
                event.isScreen ? $("#" + event.userid + "_screen").remove() : $("#" + event.userid).remove()
            }, 

            rtcMultiConnection.onconnected = function(event) {
                // event.peer.addStream || event.peer.getConnectionStats
                console.log('rtcMultiConnection.onconnected ......between you and', event.userid);
            },

            rtcMultiConnection.onopen = function(event) {                                 
                if(timer)
                   startsessionTimer(timer);
                shownotification(event.extra.name + " joined session ");
            },

            rtcMultiConnection.onNewSession = function(event) {
                /*  startsessionTimer();  */
                console.log('rtcMultiConnection.onNewSession : ', event);
            },

            rtcMultiConnection.onRequest = function(event) {
                console.log(" OnRequest ", event);
                rtcMultiConnection.accept(event)
            }, 

            rtcMultiConnection.onmessage = function(e) {
                console.log(" on message ", e);
                if(e.data.typing){
                    updateWhotyping(e.extra.name + " is typing ...") ;
                }else if(e.data.stoppedTyping){
                    updateWhotyping("");
                }else{
                    switch(e.data.type){
                        case "screenshare":
                            shownotification("screen is getting shared "+ e.data.message);
                            createScreenViewButton();
                        break;
                        case "chat":
                            updateWhotyping(e.extra.name+ " has send message");
                            addNewMessage({
                                header: e.extra.name,
                                message: e.data.message,
                                userinfo: getUserinfo(rtcMultiConnection.blobURLs[e.userid], "chat-message.png"),
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
                                header: e.extra.username,
                                message: e.data.message,
                                userinfo: getUserinfo(rtcMultiConnection.blobURLs[e.userid], "chat-message.png"),
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
                            placeCursor("cursor2" , e.data.corX , e.data.corY);
                        break;
                        case "buttonclick":
                            var buttonElement= document.getElementById(e.data.buttonName);
                            if ( buttonElement.getAttribute("lastClickedBy") != rtcMultiConnection.userid ){
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

            rtcMultiConnection.sendMessage = function(event) {
                console.log(" sendMessage ", event);
                event.userid = rtcMultiConnection.userid, 
                event.extra = rtcMultiConnection.extra, 
                rtcMultiConnection.sendCustomMessage(event)
            }, 

            rtcMultiConnection.onEntireSessionClosed = function(event) {
                rtcMultiConnection.attachStreams.forEach(function(stream) {
                    stream.stop();
                });   
            },

            rtcMultiConnection.onclose = rtcMultiConnection.onleave = function(e) {
                addNewMessage({
                    header: e.extra.name,
                    message: e.extra.name + " left session.",
                    userinfo: getUserinfo(rtcMultiConnection.blobURLs[e.userid], "info.png"),
                    color: e.extra.color
                }), 
                
                shownotification(e.extra.name + " left the conversation.");
                //rtcMultiConnection.playRoleOfInitiator()
                for(x in webcallpeers){
                    if(webcallpeers[x].userid=e.userid)
                        webcallpeers.splice(x,1);
                }
            },

            rtcMultiConnection.takeSnapshot = function(userid, callback) {
                takeSnapshot({
                    userid: userid,
                    connection: connection,
                    callback: callback
                });
            },

            rtcMultiConnection.onFileStart = function(file) {
                console.log("on File start "+ file.name);
                var peerinfo=findPeerInfo(file.userid);
                addProgressHelper(file.uuid , peerinfo , file.name , file.maxChunks,  "fileBoxClass");
            }, 

            rtcMultiConnection.onFileProgress = function(e) {
                var r = progressHelper[e.uuid];
                r && (r.progress.value = e.currentPosition || e.maxChunks || r.progress.max, updateLabel(r.progress, r.label))
            }, 

            rtcMultiConnection.onFileEnd = function(file) {
                console.log("On file End "+ file.name );
                var peerinfo=findPeerInfo(file.userid);
                if(peerinfo!=null)
                    peerinfo.filearray.push(file.name);
                displayFile(file.uuid , peerinfo , file.url , file.name , file.type);
                displayList(file.uuid , peerinfo , file.url , file.name , file.type);
            };

            if(chatobj.active){
                createChatButton(chatobj);
                createChatBox(chatobj);
            }

            if(screenrecordobj.active){
                createScreenRecordButton();
            }

            if(screenshareobj.active){
                detectExtensionScreenshare(screenshareobj.extensionID); 
            }   

            if(reconnectobj.active){
                createButtonRedial();
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

            if(fileshareobj.active){
                rtcMultiConnection.enableFileSharing = true;
                /*setFileProgressBarHandlers(rtcMultiConnection);*/
                rtcMultiConnection.filesContainer = document.getElementById(fileshareobj.fileShareContainer);
                createFileShareButton(fileshareobj);
            }

            var addr = "/";
            if(socketAddr!="/"){
                addr = socketAddr;
            }

            socket = io.connect(addr);
 
            /*
             socket.emit("register-channel", {
                channel: rtcMultiConnection.channel
            }); */          

            socket.emit("presence", {
                channel: rtcMultiConnection.channel
            });

            socket.on("presence", function(event) {
                console.log("PRESENCE -----------> ", event);
                event ?  joinWebRTC(rtcMultiConnection.channel, selfuserid) 
                : opneWebRTC(rtcMultiConnection.channel, selfuserid);
            });

            socket.on("open-channel-resp",function(event) {
                console.log("opened-channel" , event);
               if(event) connectWebRTC("open" , rtcMultiConnection.channel, selfuserid, []); 
            });

            socket.on("join-channel-resp",function(event) {
                console.log("joined-channel" , event ,"existing memebers ", event.users);
                if(event.status)
                    connectWebRTC("join" , rtcMultiConnection.channel, selfuserid , event.users); 
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

            setSettingsAttributes();
        }
    };
};

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

function shownotification(message){
    var alertDiv =document.createElement("div");
    alertDiv.className="alert alert-success fade in";
    alertDiv.innerHTML='<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+ message;

    document.getElementById("alertBox").hidden=false;
    document.getElementById("alertBox").innerHTML="";
    document.getElementById("alertBox").appendChild(alertDiv);

    setTimeout(function() {
        document.getElementById("alertBox").hidden=true;
    }, 3000);
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
control Buttons 
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

    var controlBar= document.createElement("div");
    controlBar.id = controlBarName;
    controlBar.setAttribute("style","float:left;margin-left: 20px;");
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

    if(debug){
        var nameBox=document.createElement("span");
        nameBox.innerHTML=vid.id;
        controlBar.appendChild(nameBox);  
    }

    vid.parentNode.appendChild(controlBar);        
}

function updateWebCallView(peerInfo){
    if(peerInfo.vid.indexOf("videolocal") > -1){
        $("#"+localobj.videoContainer).show();
        $("#"+remoteobj.videoContainer).hide();
        if(localVideo){
            var vid = document.getElementsByName(localVideo)[0];
            vid.muted = true;
            vid.style.opacity = 1;
            vid.setAttribute("style","width: 90%!important; border: 5px solid "+peerInfo.color);
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
                selfvid.muted = true;
                selfvid.setAttribute("style","border: 5px solid "+webcallpeers[0].color);
                attachControlButtons( selfvid, webcallpeers[0]); 
                attachUserDetails( selfvid, webcallpeers[0]); 
                if(fileshareobj.active){
                    createFileSharingDiv(webcallpeers[0]);
                }
            }
        }

        /*get the next empty index of video and pointer in video array */
        var vi=0;
        for(var v=0;v<remoteVideos.length;v++){
            if(remoteVideos[v].src){
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
            console.log("remote video not unlimited " , remoteVideos[vi]);
        }

        attachMediaStream(remvid, peerInfo.stream);
        remvid.id = peerInfo.videoContainer;
        remvid.setAttribute("style","border: 5px solid "+peerInfo.color);
        attachControlButtons(remvid, peerInfo); 
        attachUserDetails( remvid, peerInfo); 
        if(fileshareobj.active){
            createFileSharingDiv(peerInfo);
        }
    }
}

/********************************************************************************** 
        Session call 
************************************************************************************/
opneWebRTC=function(channel , userid){
    rtcMultiConnection.open(channel);
    socket.emit("open-channel", {
        channel    : channel,
        sender     : tempuserid,
        maxAllowed : remoteobj.maxAllowed
    });
    shownotification(" Making a new session ");
}

connectWebRTC=function(type, channel , userid , remoteUsers){
    if(type=="open"){
        rtcMultiConnection.connect(channel);
        shownotification("Connected to new channel");
    }else if(type=="join"){
        rtcMultiConnection.join(channel);
        shownotification("Connected with existing channel");
    }else{
        shownotification("Connection type not found");
    }

    void(document.title = channel);

    rtcMultiConnection.dontCaptureUserMedia = false,

    rtcMultiConnection.getUserMedia();

    rtcMultiConnection.session = {
        video: incomingVideo,
        audio: incomingAudio,
        data:  incomingData
    }

    rtcMultiConnection.sdpConstraints.mandatory = {
        OfferToReceiveAudio: !0,
        OfferToReceiveVideo: !0
    }

    if(selfuserid == null){
        selfuserid = rtcMultiConnection.userid;
        updatePeerInfo( selfuserid, selfusername ,selfcolor, selfemail, "local" );
        if(tempuserid!=selfuserid)
            socket.emit("update-channel", {
                type    : "change-userid",
                channel : rtcMultiConnection.channel,
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

}

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

leaveWebRTC=function(){
    shownotification("Leaving the session ");
}




var repeatInitilization = null;

function startcall(obj){
    if(turn=='none'){
        obj.startwebrtcdev();
    }else if(turn!=null && turn!='none'){
        repeatInitilization = window.setInterval(obj.startwebrtcdev, 1000);     
    }
}

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

    console.log("updated peerInfo: " ,peerInfo);
    webcallpeers.push(peerInfo);
}

function findPeerInfo(userid){
    var peerInfo;
/*    if(rtcMultiConnection.userid==userid){
        console.log("PeerInfo is found for initiator", webcallpeers[0]);
        return webcallpeers[0];
    }
*/
    for(x in webcallpeers){
        if(webcallpeers[x].userid==userid) {
            peerInfo=webcallpeers[x];
            console.log("PeerInfo is found for userid", peerInfo);
            return peerInfo;
        }
    }
    return null;
}

function showStatus(){
    console.log(rtcMultiConnection);
    console.log(webcallpeers);
}

