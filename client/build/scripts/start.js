var usersList       = document.getElementById("userslist");
var numbersOfUsers  = document.getElementById("numbersofusers");
var usersContainer  = document.getElementById("usersContainer");

var card = document.getElementById('card');
var main = document.querySelector('#main');
var smaller = document.querySelector('#smaller');

var whoIsTyping = document.querySelector("#who-is-typing");
var WebRTCdom= function(  _localObj , _remoteObj ){

    localobj=_localObj;
    var _local=_localObj.localVideo;
    var _localVideoClass=_localObj.videoClass;

    remoteobj=_remoteObj;
    var _remotearr=_remoteObj.remotearr;
    var _remotearrClass= _remoteObj.videoClass;

    if(_local!=null){
        localVideo = document.getElementsByName(_local)[0];    
    }

    for(var x=0;x<_remotearr.length;x++){
        remoteVideos.push(document.getElementsByName(_remotearr[x])[0]);    
    }

    if(localobj.hasOwnProperty('userdetails')){
        username    = (localobj.userdetails.username ==undefined ? "user": localobj.userdetails.username);
        usecolor    = localobj.userdetails.usercolor;
        useremail   = localobj.userdetails.useremail;
    }
};

var WebRTCdev= function(session, incoming, outgoing, widgets){
    sessionid     = session.sessionid;
    socketAddr    = session.socketAddr;

    console.log("session.hasOwnProperty('turn')" ,  session.hasOwnProperty('turn'));

    turn    = (session.hasOwnProperty('turn')?session.turn:null);
    
    if(turn!=null ){
        getICEServer( turn.username ,turn.secretkey , turn.domain,
                        turn.application , turn.room , turn.secure); 
    }

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

    if(widgets){

        if(widgets.chat)            chatobj         = widgets.chat

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
    }
};

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


function getUserinfo(e, t) {
    return e ? '<video src="' + e + '" autoplay></vide>' : '<img src="' + t + '">'
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


/**************************************************8
Timer 
***************************************************/
function startsessionTimer(){
    var cd = $('#countdownSecond');
    var cdm = $('#countdownMinutes');
    var c = parseInt(cd.text(),10);
    var m =  parseInt(cdm.text(),10);
    //alert(" Time for session validy is "+m +" minutes :"+ c+ " seconds");
    timer(cd , c , cdm ,  m);  
}

function timer(cd , c , cdm , m ){
    console.log(m);
    var interv = setInterval(function() {
        c--;
        cd.html(c);

        if (c == 0) {
            c = 60;
            m--;  
            $('#countdownMinutes').html(m);
            if(m<0)  {
                clearInterval(interv); 
                //alert("time over");
            }                     
        }
    }, 1000);
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

function waitForRemoteVideo(_remoteStream , _remoteVideo , _localVideo  , _miniVideo ) {
    var videoTracks = _remoteStream.getVideoTracks();
    if (videoTracks.length === 0 || _remoteVideo.currentTime > 0) {
        transitionToActive(_remoteVideo ,_localVideo ,  _miniVideo);
    } else {
        setTimeout(function(){
            waitForRemoteVideo(_remoteStream , _remoteVideo , _localVideo  , _miniVideo )
        }, 100);
    }
}

function transitionToActive(_remoteVideo ,_localVideo ,  _miniVideo) {
    _remoteVideo.style.opacity = 1;
    //card.style.webkitTransform = 'rotateY(180deg)';
    if(localVideo!=null){
        setTimeout(function() {
            _localVideo.src = '';
        }, 500); 
    }
    if(miniVideo!=null){
        setTimeout(function() {
            _miniVideo.style.opacity = 1;
        }, 1000); 
    }
}

function transitionToWaiting() {
    card.style.webkitTransform = 'rotateY(0deg)';
    setTimeout(function() {
        localVideo.src = miniVideo.src;
        localVideo.muted = true;
        miniVideo.src = '';
        remoteVideo.src = '';
        localVideo.style.opacity = 1;
    }, 500);
    miniVideo.style.opacity = 0;
    remoteVideo.style.opacity = 0;
}

// Set the video displaying in the center of window.
/*window.onresize = function() {
    var aspectRatio;
    if (remoteVideo.style.opacity === '1') {
        aspectRatio = remoteVideo.videoWidth / remoteVideo.videoHeight;
    } else if (localVideo.style.opacity === '1') {
        aspectRatio = localVideo.videoWidth / localVideo.videoHeight;
    } else {
        return;
    }
    var innerHeight = this.innerHeight;
    var innerWidth = this.innerWidth;
    var videoWidth = innerWidth < aspectRatio * window.innerHeight ?
        innerWidth : aspectRatio * window.innerHeight;
    var videoHeight = innerHeight < window.innerWidth / aspectRatio ?
        innerHeight : window.innerWidth / aspectRatio;

    containerDiv = document.getElementById("usersContainer");
    containerDiv.style.width    = videoWidth + 'px';
    containerDiv.style.height   = videoHeight + 'px';
    containerDiv.style.left     = (innerWidth - videoWidth) / 2 + 'px';
    containerDiv.style.top      = (innerHeight - videoHeight) / 2 + 'px';
};*/

/*function enterFullScreen() {
    usersContainer.webkitRequestFullScreen();
}*/


/************************************
control Buttons 
*******************************************************************/
var arrFilesharingBoxes=[];

function attachControlButtons(videoElement, streamid , controlBarName , snapshotViewer){
    var controlBar= document.createElement("div");
    controlBar.id=controlBarName;
    controlBar.setAttribute("style","float:left;margin-left: 20px;");
    controlBar.name= streamid;
    if(muteobj.active){
        if(muteobj.audio){
            controlBar.appendChild(createAudioMuteButton(controlBarName));
        }
        if(muteobj.video){
            controlBar.appendChild(createVideoMuteButton(controlBarName));        
        }
    }
    if(snapshotobj.active){
        controlBar.appendChild(createSnapshotButton(controlBarName));
    }
    if(videoRecordobj.active){
        controlBar.appendChild(createRecordButton(controlBarName));
    }

    var nameBox=document.createElement("span");
    nameBox.innerHTML=selfuserid;
    controlBar.appendChild(nameBox);

    videoElement.parentNode.appendChild(controlBar);        
}

var localStream , localStreamId, remoteStream , remoteStreamId;

function updateWebCallView(peerInfo){

    alert("updateWebCallView "+ peerInfo.name);
    if(peerInfo.name=="localVideo"){

        localStream     =   webcallpeers[0].stream;
        localStreamId   =   webcallpeers[0].streamid ;

        $("#local").show();
        $("#remote").hide();

        if(localVideo){
            attachMediaStream(localVideo, webcallpeers[0].stream);
            localVideo.muted = true;
            localVideo.id= webcallpeers[0].userid;
            localVideo.style.opacity = 1;
            attachControlButtons(localVideo , 
                webcallpeers[0].streamid ,
                webcallpeers[0].controlBarName,
                webcallpeers[0].fileSharingContainer);
        }
    }else if(peerInfo.name=="remoteVideo") {
        var pi = 0;
        var vi = 0;

        $("#local").hide();
        $("#remote").show();
    
        for(x in webcallpeers)
            arrFilesharingBoxes.push(webcallpeers[x].fileSharingSubContents.fileSharingBox);

        if( outgoingVideo ){
            /*adding local video to index 0 */
            if( remoteVideos[0].played.length==0 ){
                reattachMediaStream(remoteVideos[0], localVideo);
                remoteVideos[0].id=webcallpeers[0].videoContainer;
                remoteVideos[0].muted =   true;

                //if(miniVideo.parentNode.querySelector("#"+webcallpeers[0].controlBarName)!=null){
                attachControlButtons(remoteVideos[0], 
                    webcallpeers[0].streamid ,
                    webcallpeers[0].controlBarName,
                    webcallpeers[0].fileSharingContainer); 

                if(remoteVideos[0].hidden){
                    remoteVideos[0].hidden=false;
                }

                if(fileshareobj.active){
                    createFileSharingDiv(0);
                }
            }
            vi++;
            pi++;
        }else{
            pi++;
        }

        /*get the next empty empty index of video and pointer in video array */
        for(var v=vi;v< remoteVideos.length;v++){
            if(remoteVideos[v].src){
                vi++;
                pi++;
            }
            console.log(" vi " + vi + " || pi "+ pi); 
        }

        if(remoteobj.remoteVideoCount=="unlimited"){
            var video = document.createElement('video');
            video.autoplay="autoplay";
            remoteVideos[vi]=video;
            document.getElementById(remoteobj.remoteVideoContainer).appendChild(video);
        }

        attachMediaStream(remoteVideos[vi], webcallpeers[pi].stream);
        attachControlButtons(remoteVideos[vi] , 
            webcallpeers[pi].streamid ,
            webcallpeers[pi].controlBarName,
            webcallpeers[pi].fileSharingContainer); 

        if(outgoingVideo)
            waitForRemoteVideo(webcallpeers[pi].stream , remoteVideos[vi] , localVideo  , remoteVideos[0] );
        else
            waitForRemoteVideo(webcallpeers[pi].stream , remoteVideos[vi] , null  , null );

        if(remoteVideos[vi].hidden){
            remoteVideos[vi].hidden=false;
        }

        if(fileshareobj.active){
            createFileSharingDiv(pi);
        }

        console.log("webcallpeers " , webcallpeers);
    }
}


/**************************************************************************************
        peerconnection 
****************************************************************************/
var RTCPeerConnection = null;
var getUserMedia = null;
var attachMediaStream = null;
var reattachMediaStream = null;
var webrtcDetectedBrowser = null;
var webrtcDetectedVersion = null;
var rtcMultiConnection ;

if (navigator.mozGetUserMedia) {
    webrtcDetectedBrowser = "firefox";
    webrtcDetectedVersion = parseInt(navigator.userAgent.match(/Firefox\/([0-9]+)\./)[1]);
    RTCPeerConnection = mozRTCPeerConnection;
    RTCSessionDescription = mozRTCSessionDescription;
    RTCIceCandidate = mozRTCIceCandidate;
    
    if(outgoingVideo && outgoingAudio)
    getUserMedia = navigator.mozGetUserMedia.bind(navigator);

    attachMediaStream = function(element, stream) {
        console.log("Attaching media stream");
        element.mozSrcObject = stream;
        element.play();
    };
    reattachMediaStream = function(to, from) {
        console.log("Reattaching media stream");
        to.mozSrcObject = from.mozSrcObject;
        to.play();
    };

    MediaStream.prototype.getVideoTracks = function() {
        return [];
    };
    MediaStream.prototype.getAudioTracks = function() {
        return [];
    };
} else if (navigator.webkitGetUserMedia) {
    webrtcDetectedBrowser = "chrome";
    webrtcDetectedVersion =  parseInt(navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)[2]);
    RTCPeerConnection = webkitRTCPeerConnection;
    RTCSessionDescription = window.RTCSessionDescription;
    RTCIceCandidate = window.RTCIceCandidate;    

    if(outgoingVideo && outgoingAudio)
    getUserMedia = navigator.webkitGetUserMedia.bind(navigator);

    attachMediaStream = function(element, stream) {
        if (typeof element.srcObject !== 'undefined') {
            element.srcObject = stream;
        } else if (typeof element.mozSrcObject !== 'undefined') {
            element.mozSrcObject = stream;
        } else if (typeof element.src !== 'undefined') {
            element.src = URL.createObjectURL(stream);
        } else {
            console.log('Error attaching stream to element.');
        }
    };
    reattachMediaStream = function(to, from) {
        to.src = from.src;
    };
    // The representation of tracks in a stream is changed in M26.
    // Unify them for earlier Chrome versions in the coexisting period.
    if (!webkitMediaStream.prototype.getVideoTracks) {
        webkitMediaStream.prototype.getVideoTracks = function() {
            return this.videoTracks;
        };
        webkitMediaStream.prototype.getAudioTracks = function() {
            return this.audioTracks;
        };
    }
    // New syntax of getXXXStreams method in M26.
    if (!webkitRTCPeerConnection.prototype.getLocalStreams) {
        webkitRTCPeerConnection.prototype.getLocalStreams = function() {
            return this.localStreams;
        };
        webkitRTCPeerConnection.prototype.getRemoteStreams = function() {
            return this.remoteStreams;
        };
    }
} else {
    console.log("Browser does not appear to be WebRTC-capable");
}

/********************************************************************************** 
        Session call 
************************************************************************************/
// connecting to signaling medium
// rtcMultiConnection.connect();
opneWebRTC=function(){
    shownotification("Making a new session ");
    rtcMultiConnection.open();
    socket.emit("new-channel", {
        channel: rtcMultiConnection.channel,
        sender: rtcMultiConnection.userid
    });
}

joinWebRTC=function(){
    shownotification("Joing an existing session ");
    rtcMultiConnection.join({
        audio: outgoingVideo,
        video: outgoingVideo
    });
    socket.emit("join-channel", {
        channel: rtcMultiConnection.channel,
        sender: rtcMultiConnection.userid
    });
}

leaveWebRTC=function(){
    shownotification("Leaving the session ");
}

/*********************************************8
ICE
**************************************************/

var iceServers=[];
var repeatInitilization = null;

function startcall(){
    if(turn=='none'){
        startwebrtcdev();
    }else if(turn!=null && turn!='none'){
        repeatInitilization = window.setInterval(startwebrtcdev, 1000);     
    }
}

function updatePeerInfo(userid , type , uuid ){
    alert("updatePeerInfo" +userid);
    peerInfo={ 
        name : "Video",
        videoContainer : "video"+userid,
        videoHeight : null,
        videoClassName: null,
        uuid: uuid,
        userid : userid , 
        stream : null,
        streamid : null,
        fileSharingContainer : "widget-filesharing-container"+userid,
        fileSharingSubContents:{
            fileSharingBox: "widget-filesharing-box"+userid,
            minButton: "widget-filesharing-minbutton"+userid,
            maxButton: "widget-filesharing-maxbutton"+userid,
            closeButton: "widget-filesharing-closebutton"+userid
        },
        fileListContainer : "widget-filelisting-container"+userid,
        controlBarName: "control-video"+userid,
        filearray : []
    };
    
    webcallpeers.push(peerInfo);
}

function startwebrtcdev() {
    //rtcMultiConnection.open();

    rtcMultiConnection= new RTCMultiConnection(sessionid);
    if(turn!='none'){
        if(!webrtcdevIceServers) {
            return;
        }
        rtcMultiConnection.iceServers=webrtcdevIceServers;       
        window.clearInterval(repeatInitilization);
    }  

    rtcMultiConnection.extra = {
        username: username,
        color: useremail,
        useredisplayListmail: usercolor
    };

    rtcMultiConnection.channel=sessionid;
    rtcMultiConnection.preventSSLAutoAllowed = false;
    rtcMultiConnection.autoReDialOnFailure = true;
    rtcMultiConnection.setDefaultEventsForMediaElement = false;
    rtcMultiConnection.customStreams = {}, 
    rtcMultiConnection.autoCloseEntireSession = !1, 
    rtcMultiConnection.autoTranslateText = !1, 
    rtcMultiConnection.maxParticipantsAllowed = 4, 
    rtcMultiConnection.setDefaultEventsForMediaElement = !1; 
    rtcMultiConnection.blobURLs = {},
     
    rtcMultiConnection.session = {
        video: incomingVideo,
        audio: incomingAudio,
        data:  incomingData
    },

    rtcMultiConnection.sdpConstraints.mandatory = {
        OfferToReceiveAudio: !0,
        OfferToReceiveVideo: !0
    },

    rtcMultiConnection.openSignalingChannel = function(e) {
        var t = e.channel || this.channel;
        socket.emit("namespace", {
            channel: t,
            sender: rtcMultiConnection.userid
        });

        var n = io.connect(o+t);    
        n.channel = o+t, 
        n.on("connect", function() {
            e.callback && e.callback(n)
        }), 
        n.send = function(e) {
            n.emit("message", {
                sender: rtcMultiConnection.userid,
                data: e
            })
        }, 
        n.on("message", e.onmessage), 
        n.on("disconnect", "datalost");
    },

    rtcMultiConnection.onstream = function(e) {
        alert(" got stream from "+ e.userid);
        console.log("OnStream ------------",e);
        for(x in webcallpeers){
            if(webcallpeers[x].userid==e.userid){
                alert("updated in webcallpeers");
                webcallpeers[x].name=e.type+"Video";
                webcallpeers[x].stream=e.stream;
                webcallpeers[x].streamid=e.stream.streamid;
                updateWebCallView(webcallpeers[x]);
            }
        }
    }, 

    rtcMultiConnection.onstreamended = function(e) {
        e.isScreen ? $("#" + e.userid + "_screen").remove() : $("#" + e.userid).remove()
    }, 

    rtcMultiConnection.onmessage = function(e) {
        if(e.data.typing){
            void(whoIsTyping.innerHTML = e.extra.username + " is typing ...") ;
        }else if(e.data.stoppedTyping){
            void(whoIsTyping.innerHTML = "");
        }else{
            switch(e.data.type){
                case "chat":
                    whoIsTyping.innerHTML = "";
                    addNewMessage({
                        header: e.extra.username,
                        message: e.data.message,
                        userinfo: getUserinfo(rtcMultiConnection.blobURLs[e.userid], "chat-message.png"),
                        color: e.extra.color
                    }); 
                    void(document.title = e.data.message);
                break;
                case "imagesnapshot":
                    displayList( null , e.userid , e.data.message , e.data.name , "imagesnapshot" );
                    displayFile( null , e.userid , e.data.message , e.data.name , "imagesnapshot");
                break;
                case "videoRecording":
                    displayList( null , e.userid , e.data.message , e.data.name , "videoRecording" );
                    displayFile( null , e.userid , e.data.message , e.data.name , "videoRecording");
                break;
                case "videoScreenRecording":
                    displayList( null , e.userid , e.data.message , e.data.name , "videoScreenRecording" );
                    displayFile( null , e.userid , e.data.message , e.data.name , "videoScreenRecording");
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

    rtcMultiConnection.onNewSession = function(e) {
        console.log(e);
        sessions[e.sessionid] || (sessions[e.sessionid] = e, e.join());
        updatePeerInfo(e.userid , e.type , e.uuid );
        shownotification(e.extra.username + " joined new sessoin ");
    }, 

    rtcMultiConnection.onopen = function(e) {
        //startsessionTimer();
        //numbersOfUsers.innerHTML = parseInt(numbersOfUsers.innerHTML) + 1 ; 
        alert("onopen-> Peers :"+e.userid+ " || Self :"+ selfuserid);
        updatePeerInfo(e.userid , e.type , e.uuid );
        shownotification(e.extra.username + " joined channel ");
    },

    rtcMultiConnection.onRequest = function(e) {
        rtcMultiConnection.accept(e)
    }, 

    rtcMultiConnection.onCustomMessage = function(e) {
        
        if (e.hasCamera || e.hasScreen) {
            var t = e.extra.username + " enabled webcam.";
            e.hasScreen && (e.session.oneway = !0, 
                            rtcMultiConnection.sendMessage({
                                renegotiate: !0,
                                streamid: e.streamid,
                                session: e.session
                            }), 
                            t = e.extra.username + " is ready to share screen.")
        }
        if (e.hasMic && (e.session.oneway = !0, 
                        rtcMultiConnection.sendMessage({
                            renegotiate: !0,
                            streamid: e.streamid,
                            session: e.session
                        })), 
                        e.renegotiate) {
                            var n = rtcMultiConnection.customStreams[e.streamid];
                            n && rtcMultiConnection.peers[e.userid].renegotiate(n, e.session)
                        }
    }, 

    rtcMultiConnection.sendMessage = function(e) {
        e.userid = rtcMultiConnection.userid, 
        e.extra = rtcMultiConnection.extra, 
        rtcMultiConnection.sendCustomMessage(e)
    }, 

    rtcMultiConnection.onclose = rtcMultiConnection.onleave = function(e) {
        addNewMessage({
            header: e.extra.username,
            message: e.extra.username + " left session.",
            userinfo: getUserinfo(rtcMultiConnection.blobURLs[e.userid], "info.png"),
            color: e.extra.color
        }), 
        
        //    webcallpeers.pop();
        //    $("#" + e.userid).remove(), 

        shownotification(e.extra.username + " left the conversation.");
        //rtcMultiConnection.playRoleOfInitiator()
        for(x in webcallpeers){
            if(webcallpeers[x].userid=e.userid)
                webcallpeers.splice(x,1);
        }
    },

    rtcMultiConnection.onFileStart = function(e) {

        addNewFileLocal({
            userid : rtcMultiConnection.userid,
            header: 'User local',
            message: 'File shared',
            userinfo: getUserinfo(rtcMultiConnection.blobURLs[rtcMultiConnection.userid], "images/share-files.png"),
            callback: function(r) {        }
        });
        
        addProgressHelper(e.uuid , e.userid , e.name , e.maxChunks,  "fileBoxClass");
    }, 

    rtcMultiConnection.onFileProgress = function(e) {
        var r = progressHelper[e.uuid];
        r && (r.progress.value = e.currentPosition || e.maxChunks || r.progress.max, updateLabel(r.progress, r.label))
    }, 

    rtcMultiConnection.onFileEnd = function(e) {
        /*
        if (!progressHelper[e.uuid]) {
            console.error("No such progress-helper element exists.", e);
            //return void console.error("No such progress-helper element exists.", e);
        }*/
        for(i in webcallpeers ){
            if(webcallpeers[i].userid==e.userid){
                webcallpeers[i].filearray.push(e.name);
            }
        }

        displayFile(e.uuid , e.userid , e.url , e.name , e.type);
        displayList(e.uuid , e.userid , e.url , e.name , e.type);
    };

    if(selfuserid==null){
        alert(" updaing selfuserid" + selfuserid);
        selfuserid=rtcMultiConnection.userid;
        updatePeerInfo( selfuserid, rtcMultiConnection.type , rtcMultiConnection.uuid );
    }

    var o = "/";
    if(socketAddr!="/"){
        o = socketAddr;
    }

    socket = io.connect(o);
        socket.emit("presence", {
        channel: rtcMultiConnection.channel,
        useremail: n,
        username: t
    });

    socket.on("presence", function(e) {
        e ?  joinWebRTC() : opneWebRTC()
    });  

    setSettingsAttributes();

    if(chatobj.active){
        createChatButton();
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
        createTextEditorBtton();
    }

    if(codeeditorobj.active){
        createCodeEditorButton();
    }
};




/**********************************
Reconnect 
****************************************/
/*
add code hetre for redial 
*/

/******************************************************************
Record 
******************************************************************/
/*var recordButton= document.getElementById("recordButton");
recordButton.onclick = function() {
    
    if(recordButton.innerHTML==" Record "){
        recordButton.innerHTML=" Stop Recording ";
        rtcMultiConnection.streams[remoteStreamId].startRecording({
            audio: true,
            video: true
        });
    }else if(recordButton.innerHTML==" Stop Recording "){
        recordButton.innerHTML=" Record ";
        rtcMultiConnection.streams[remoteStreamId].stopRecording(function (blob) {
                var mediaElement = document.createElement('video'); 
                mediaElement.src = URL.createObjectURL(blob.video); 
                mediaElement.setAttribute("controls","controls");  
                document.getElementById("rightVideo").appendChild(mediaElement); 

            // POST both audio/video "Blobs" to PHP/other server using single FormData/XHR2
            // blob.audio  --- audio blob
            // blob.video  --- video blob
        }, {audio:true, video:true} );
    }
};    
*/



/************************************************************************
Track Call Record 
*************************************************************************/

function sendCallTraces(){

}

/*try{
    var screenshareBox = document.getElementById('screenshareBox');
    var recorder = new CanvasRecorder(screenshareBox, {
        disableLogs: false
    });

    var videoElement = document.querySelector('video');
    function playVideo(callback) {
        function successCallback(stream) {
            videoElement.onloadedmetadata = function() {
                callback();
            };
            videoElement.srcObject = stream;
            videoElement.play();
        }

        function errorCallback(error) {
            console.error('get-user-media error', error);
            callback();
        }

        var mediaConstraints = { video: true };
        getUserMedia(mediaConstraints).then(successCallback).catch(errorCallback);
    }

}catch( e){
    console.error(" Canvas recorder is not defined " , e);
}*/




/************************* ICE NAT TURN *******************************/

function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        xhr = null;
    }
    return xhr;
}

function getICEServer(username , secretkey , domain , appname , roomname , secure){
    console.log(" TURN -------------" , username , secretkey , domain , appname , roomname , secure);
    var url = 'https://service.xirsys.com/ice';
    var xhr = createCORSRequest('POST', url);
    xhr.onload = function () {
        console.log(xhr.responseText);
        if(JSON.parse(xhr.responseText).d==null){
            webrtcdevIceServers="err";
            shownotification(" media not able to pass through "+ JSON.parse(xhr.responseText).e);
        }else{
            webrtcdevIceServers=JSON.parse(xhr.responseText).d.iceServers;
            console.log("iceserver got" ,webrtcdevIceServers );
        }
    };
    xhr.onerror = function () {
        console.error('Woops, there was an error making xhr request.');
    };
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    /* xhr.send('ident=muazkh&secret=59d93f26-5b89-11e5-babe-d61aeb366a63&domain=webrtcexperiment-webrtc.netdna-ssl.com&application=default&room=default&secure=1');*/
    xhr.send('ident='+username+'&secret='+secretkey +
        '&domain='+domain +'&application='+appname+
        '&room='+ roomname+'&secure='+secure);
}