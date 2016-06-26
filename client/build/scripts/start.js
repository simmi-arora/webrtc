var WebRTCdom= function(  _localObj , _remoteObj ){

    var _local=_localObj.localVideo;
    var _localVideoClass=_localObj.videoClass;
    var _localVideoUserDisplay= _localObj.userDisplay;
    var _localVideoMetaDisplay= _localObj.userMetaDisplay;

    var _remotearr=_remoteObj.remotearr;
    var _remotearrClass= _remoteObj.videoClass;
    var _remoteVideoUserDisplay= _remoteObj.userDisplay;
    var _remoteVideoMetaDisplay= _remoteObj.userMetaDisplay;

    if(_local!=null){
        localVideo = document.getElementsByName(_local)[0];
        for(var x=0;x<_remotearr.length;x++){
            remoteVideos.push(document.getElementsByName(_remotearr[x])[0]);
        }     
    }else{
        for(var x=0;x<_remotearr.length;x++){
            remoteVideos.push(document.getElementsByName(_remotearr[x])[0]);
        }     
    }
    console.log(remoteVideos);
};

var WebRTCdev= function(session, incoming, outgoing, widgets){
    sessionid     = session.sessionid;
    socketAddr    = session.socketAddr;
    turn          = session.turn;
    
    if(turn){
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

        if(widgets.chat)            chatobj=widgets.chat

        if(widgets.fileShare)       fileshareobj = widgets.fileShare;

        if(widgets.screenrecord)    screenrecordobj = widgets.screenrecord;

        if(widgets.screenshare)     screenshareobj = widgets.screenshare;

        if(widgets.snapshot)        snapshotobj = widgets.snapshot;

        if(widgets.videoRecord)     videoRecordobj = widgets.videoRecord;

        if(widgets.reconnect)       reconnectobj = widgets.reconnect;

        if(widgets.drawCanvas)      drawCanvasobj = widgets.drawCanvas;

        if(widgets.mute)            muteobj=widgets.mute;
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
    // Call the getVideoTracks method via adapter.js.

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


var islocalStream = 1;

/* *************************************8
Snapshot
************************************************/

function syncSnapshot(datasnapshot , datatype , dataname ){
    rtcMultiConnection.send({
        type:datatype, 
        message:datasnapshot, 
        name : dataname
    });
}

/*function displaySnapshot(snapshotViewer , datasnapshot){
    var snaspshot=document.createElement("img");
    snaspshot.src = datasnapshot;
    document.getElementById(snapshotViewer).appendChild(snaspshot);
    console.log("snaspshot ",datasnapshot);
}*/

/************************************
control Buttons 
*******************************************************************/
var arrFilesharingBoxes=[];

function createFileSharingDiv(i){
    /*--------------------------------add for File Share --------------------*/
    var fileSharingBox=document.createElement("div");
    fileSharingBox.className= "col-sm-6 fileViewing1Box";
    fileSharingBox.id=webcallpeers[i].fileSharingSubContents.fileSharingBox;

    var fileControlBar=document.createElement("p");
    fileControlBar.appendChild(document.createTextNode("File Viewer"));

    var minButton= document.createElement("span");
    minButton.className="btn btn-default glyphicon glyphicon-import closeButton";
    minButton.innerHTML="Minimize";
    minButton.id=webcallpeers[i].fileSharingSubContents.minButton;
    minButton.setAttribute("lastClickedBy" ,'');
    minButton.onclick=function(){
        resizeFV(webcallpeers[i].userid, minButton.id , arrFilesharingBoxes);
    }

    var maxButton= document.createElement("span");
    maxButton.className= "btn btn-default glyphicon glyphicon-export closeButton";
    maxButton.innerHTML="Maximize";
    maxButton.id=webcallpeers[i].fileSharingSubContents.maxButton;
    maxButton.setAttribute("lastClickedBy" ,'');
    maxButton.onclick=function(){
        maxFV(webcallpeers[i].userid, maxButton.id , arrFilesharingBoxes , webcallpeers[i].fileSharingSubContents.fileSharingBox);
    }

    var closeButton= document.createElement("span");
    closeButton.className="btn btn-default glyphicon glyphicon-remove closeButton";
    closeButton.innerHTML="Close";
    closeButton.id=webcallpeers[i].fileSharingSubContents.closeButton;
    closeButton.setAttribute("lastClickedBy" ,'');
    closeButton.onclick=function(){
        closeFV(webcallpeers[i].userid, closeButton.id , webcallpeers[i].fileSharingContainer);
    }

    fileControlBar.appendChild(minButton);
    fileControlBar.appendChild(maxButton);
    fileControlBar.appendChild(closeButton);

    var fileSharingContainer= document.createElement("div");
    fileSharingContainer.className="filesharingWidget";
    fileSharingContainer.id=webcallpeers[i].fileSharingContainer;

    var fillerArea=document.createElement("p");
    fillerArea.className="filler";

    fileSharingBox.appendChild(fileControlBar);
    fileSharingBox.appendChild(fileSharingContainer);
    fileSharingBox.appendChild(fillerArea);

    document.getElementById("fileSharingRow").appendChild(fileSharingBox);

    /*--------------------------------add for File List --------------------*/

    var fileListingBox= document.createElement("div");
    fileListingBox.className="col-sm-6  filesharing1Box";

    var fileListingControlBar=document.createElement("p");

    var fileHelpButton= document.createElement("span");
    fileHelpButton.className="btn btn-default glyphicon glyphicon-question-sign closeButton";
    fileHelpButton.innerHTML="Help";

    fileListingControlBar.appendChild(document.createTextNode("List of Uploaded Files"));
    fileListingControlBar.appendChild(fileHelpButton);

    var fileListingContainer= document.createElement("div");
    fileListingContainer.id=webcallpeers[i].fileListContainer;

    var fileProgress = document.createElement("div");

    fileListingBox.appendChild(fileListingControlBar);
    fileListingBox.appendChild(fileListingContainer);
    fileListingBox.appendChild(fileProgress);

    document.getElementById("fileListingRow").appendChild(fileListingBox);
}

function attachControlButtons(videoElement, streamid , controlBarName , snapshotViewer){

        var controlBar= document.createElement("div");
        controlBar.id=controlBarName;
        controlBar.setAttribute("style" , "float:left;margin-left: 20px;");
        controlBar.name= streamid;

        if(muteobj.active){
            if(muteobj.audio){
                var audioButton=document.createElement("span");
                audioButton.id=controlBarName+"audioButton";
                audioButton.setAttribute("data-val","mute");
                audioButton.setAttribute("title", "Toggle Audio");
                audioButton.setAttribute("data-placement", "bottom");
                audioButton.setAttribute("data-toggle", "tooltip");
                audioButton.setAttribute("data-container", "body");
                audioButton.className=muteobj.audio.button.class_on;
                audioButton.innerHTML=muteobj.audio.button.html_on;
                audioButton.onclick = function() {
                    if(audioButton.className == muteobj.audio.button.class_on ){
                        rtcMultiConnection.streams[streamid].mute({
                            audio: !0
                        });
                        audioButton.className=muteobj.audio.button.class_off;
                        audioButton.innerHTML=muteobj.audio.button.html_off;
                    } 
                    else{            
                        rtcMultiConnection.streams[streamid].unmute({
                            audio: !0
                        });
                        audioButton.className=muteobj.audio.button.class_on;
                        audioButton.innerHTML=muteobj.audio.button.html_on;
                    }     
                    syncButton(audioButton.id);        
                };
                controlBar.appendChild(audioButton);
            }
            if(muteobj.video){
                var videoButton=document.createElement("span");
                videoButton.id=controlBarName+"videoButton";
                videoButton.setAttribute("title", "Toggle Video");
                videoButton.setAttribute("data-placement", "bottom");
                videoButton.setAttribute("data-toggle", "tooltip");
                videoButton.setAttribute("data-container", "body");
                videoButton.className=muteobj.video.button.class_on;   
                videoButton.innerHTML=muteobj.video.button.html_on;     
                videoButton.onclick= function(event) {
                    if(videoButton.className == muteobj.video.button.class_on ){
                        rtcMultiConnection.streams[streamid].mute({
                            video: !0
                        });
                        videoButton.innerHTML=muteobj.video.button.html_off;
                        videoButton.className=muteobj.video.button.class_off;   
                    } 
                    else{ 
                        rtcMultiConnection.streams[streamid].unmute({
                            video: !0
                        });
                        videoButton.innerHTML=muteobj.video.button.html_on;
                        videoButton.className=muteobj.video.button.class_on; 
                    }  
                    syncButton(videoButton.id);
                }; 
                controlBar.appendChild(videoButton);        
            }
        }

        if(snapshotobj.active){
            var snapshotButton=document.createElement("div");
            snapshotButton.id=controlBarName+"snapshotButton";
            snapshotButton.setAttribute("title", "Snapshot");
            snapshotButton.setAttribute("data-placement", "bottom");
            snapshotButton.setAttribute("data-toggle", "tooltip");
            snapshotButton.setAttribute("data-container", "body");
            snapshotButton.className=snapshotobj.button.class_on;
            snapshotButton.innerHTML=snapshotobj.button.html_on;
            snapshotButton.onclick = function() {
                rtcMultiConnection.streams[streamid].takeSnapshot(function(datasnapshot) {
                    for(i in webcallpeers ){
                        if(webcallpeers[i].userid==rtcMultiConnection.userid){
                            var snapshotname = "snapshot"+ new Date().getTime();
                            webcallpeers[i].filearray.push(snapshotname);
                            var numFile= document.createElement("div");
                            numFile.value= webcallpeers[i].filearray.length;

                            if(fileshareobj.active){
                                syncSnapshot(datasnapshot , "imagesnapshot" , snapshotname );
                                displayList(rtcMultiConnection.uuid , rtcMultiConnection.userid ,datasnapshot , snapshotname , "imagesnapshot");
                                displayFile(rtcMultiConnection.uuid , rtcMultiConnection.userid, datasnapshot , snapshotname, "imagesnapshot");
                            }else{
                                displayFile(rtcMultiConnection.uuid , rtcMultiConnection.userid, datasnapshot , snapshotname, "imagesnapshot");
                            } 

                        }
                    }
                });         
            };
            controlBar.appendChild(snapshotButton);
        }

        if(videoRecordobj.active){

            //add the Record button
            var recordButton=document.createElement("div");
            recordButton.id=controlBarName+"recordButton";
            recordButton.setAttribute("title", "Record");
            recordButton.setAttribute("data-placement", "bottom");
            recordButton.setAttribute("data-toggle", "tooltip");
            recordButton.setAttribute("data-container", "body");
            recordButton.className=videoRecordobj.button.class_off;
            recordButton.innerHTML=videoRecordobj.button.html_off;
            recordButton.onclick = function() {
                if(recordButton.className==videoRecordobj.button.class_on){
                    recordButton.className=videoRecordobj.button.class_off;
                    recordButton.innerHTML=videoRecordobj.button.html_off;
                    rtcMultiConnection.streams[streamid].startRecording({
                        audio: true,
                        video: true
                    });
                }else if(recordButton.className==videoRecordobj.button.class_off){
                    recordButton.className=videoRecordobj.button.class_on;
                    recordButton.innerHTML=videoRecordobj.button.html_on;
                    rtcMultiConnection.streams[streamid].stopRecording(function (dataRecordedVideo) {
                        for(i in webcallpeers ){
                            if(webcallpeers[i].userid==rtcMultiConnection.userid){
                                var recordVideoname = "recordedvideo"+ new Date().getTime();
                                webcallpeers[i].filearray.push(recordVideoname);
                                var numFile= document.createElement("div");
                                numFile.value= webcallpeers[i].filearray.length;
                                var fileurl=URL.createObjectURL(dataRecordedVideo.video);
                                if(fileshareobj.active){
                                    syncSnapshot(fileurl , "videoRecording" , recordVideoname );
                                    displayList(rtcMultiConnection.uuid , rtcMultiConnection.userid  ,fileurl , recordVideoname , "videoRecording");
                                    displayFile(rtcMultiConnection.uuid , rtcMultiConnection.userid , fileurl , recordVideoname , "videoRecording");
                                }else{
                                    displayFile(rtcMultiConnection.uuid , rtcMultiConnection.userid , fileurl , recordVideoname , "videoRecording");
                                }
                            }
                        }
                    }, {audio:true, video:true} );
                }
            };  
            controlBar.appendChild(recordButton);
        }
   
        //controlBar.setAttribute("style" , "-webkit-transform: rotateY(180deg)");
        videoElement.parentNode.appendChild(controlBar);        
}

var localStream , localStreamId, remoteStream , remoteStreamId;

function updateWebCallView(peerInfo){
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

        for(var v=vi;v< remoteVideos.length;v++){
            if(remoteVideos[v].src){
                vi++;
                pi++;
            } 
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

/*********************************************8
ICE
**************************************************/

var iceServers=[];

/*iceServers.push({
    url: 'stun:stun.l.google.com:19302'
});

iceServers.push({
    url: 'stun:stun.anyfirewall.com:3478'
});

iceServers.push({
    url: 'turn:turn.bistri.com:80',
    credential: 'homeo',
    username: 'homeo'
});

iceServers.push({
    url: 'turn:turn.anyfirewall.com:443?transport=tcp',
    credential: 'webrtc',
    username: 'webrtc'
});*/

var myVar = setInterval(startcall, 1000);

function startcall() {
    //rtcMultiConnection.open();

    rtcMultiConnection= new RTCMultiConnection(sessionid);
    if(turn){
        if(!webrtcdevIceServers) {
            return;
        }else{
            clearInterval(myVar)
        }
        rtcMultiConnection.iceServers=webrtcdevIceServers; 
    }    

    rtcMultiConnection.extra = {
        username: "none",
        color: "ffffff",
        useredisplayListmail: n
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

    rtcMultiConnection.onstream = function(e) {
        var peerInfo=null;

        if (e.type == 'local') {
            console.log("LocalStream ------------",e  );
            peerInfo={ 
                name : "localVideo",
                videoContainer : "video"+e.userid,
                videoHeight : null,
                videoClassName: null,
                uuid: e.uuid,
                userid : e.userid , 
                stream : e.stream ,
                streamid : e.stream.streamid , 
                fileSharingContainer : "widget-filesharing-container"+e.userid,
                fileSharingSubContents:{
                    fileSharingBox: "widget-filesharing-box"+e.userid,
                    minButton: "widget-filesharing-minbutton"+e.userid,
                    maxButton: "widget-filesharing-maxbutton"+e.userid,
                    closeButton: "widget-filesharing-closebutton"+e.userid
                },
                fileListContainer : "widget-filelisting-container"+e.userid,
                controlBarName: "control-video"+e.userid,
                filearray : []
            };
        }else if (e.type == 'remote'){
            console.log("Remote ------------", e );
            peerInfo={ 
                name : "remoteVideo",
                videoContainer : "video"+e.userid,
                videoHeight : null,
                videoClassName: null,
                uuid : e.uuid,
                userid:  e.userid , 
                stream : e.stream ,
                streamid : e.stream.streamid , 
                fileSharingContainer : "widget-filesharing-container"+e.userid,
                fileSharingSubContents:{
                    fileSharingBox: "widget-filesharing-box"+e.userid,
                    minButton: "widget-filesharing-minbutton"+e.userid,
                    maxButton: "widget-filesharing-maxbutton"+e.userid,
                    closeButton: "widget-filesharing-closebutton"+e.userid
                },
                fileListContainer : "widget-filelisting-container"+e.userid,
                controlBarName: "control-video"+e.userid,
                filearray: []
            }; 
        }
        webcallpeers.push(peerInfo);
        updateWebCallView(peerInfo);
    }, 

    rtcMultiConnection.onstreamended = function(e) {
        e.isScreen ? $("#" + e.userid + "_screen").remove() : $("#" + e.userid).remove()
    }, 

    rtcMultiConnection.onopen = function(e) {
        //startsessionTimer();
        //numbersOfUsers.innerHTML = parseInt(numbersOfUsers.innerHTML) + 1 ; 
        console.log(e);
        console.log(rtcMultiConnection);
        shownotification(e.extra.username + " joined channel ");
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
                    alert(" unrecognizable message from peer  ");
                    console.log(" unrecognizable message from peer  ",e);
                break;
            }

        } 
        return;
    },

    rtcMultiConnection.onNewSession = function(e) {
        /*
        sessions[e.sessionid] || (sessions[e.sessionid] = e, 
            e.join({
                audio: outgoingAudio, 
                video: outgoingVideo, 
                data: outgoingData
            }))*/
        sessions[e.sessionid] || (sessions[e.sessionid] = e, e.join())
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

    var o = "/";
    if(socketAddr!="/"){
        o= socketAddr;
    }
    //var o = "https://www.villageexperts.com:8084/";
    //var o = "https://localhost:8084/";

    socket = io.connect(o);
        socket.emit("presence", {
        channel: rtcMultiConnection.channel,
        useremail: n,
        username: t
    });

    socket.on("presence", function(e) {
        e ?  joinWebRTC() : opneWebRTC()
    });  

    //Code to open  signalling channel 
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
    }


    $("#inspectorlink").val(window.location+'?appname=webrtcwebcall&role=inspector&audio=0&video=0');
    $("#channelname").val(rtcMultiConnection.channel);
    $("#userid").val(rtcMultiConnection.userid);

    $("#inAudio").val(incomingAudio);
    $("#inVideo").val(incomingVideo);
    $("#inData").val(incomingData);

    $("#outAudio").val(outgoingAudio);
    $("#outVideo").val(outgoingVideo);
    $("#outData").val(outgoingData);

    $("#btnGetPeers").click(function(){
       // $("#alllpeerinfo").html(JSON.stringify(webcallpeers,null,6));
       $("#alllpeerinfo").empty();
        /*   
        for(x in webcallpeers){
            $("#allpeerinfo").append( webcallpeers[x].userid+" "+webcallpeers[x].videoContainer)
            $("#allpeerinfo").append('<br/>');
        }*/

       $('#allpeerinfo').append('<pre contenteditable>'+JSON.stringify(webcallpeers, null, 2)+'<pre>');
    });

    $("#btnDebug").click(function(){
        //window.open().document.write('<pre>'+rtcMultiConnection+'<pre>');
        $("#allwebrtcdevinfo").empty();
        $('#allwebrtcdevinfo').append('<pre contenteditable>'+rtcMultiConnection+'<pre>');
        console.info(rtcMultiConnection);
    });

    if(chatobj.active){
        var chatButton= document.getElementById("send");
        chatButton.className=chatobj.button.class;
        chatButton.innerHTML= chatobj.button.html;
        chatButton.onclick=function(){
            var chatInput=document.getElementById("chatInput");
            sendChatMessage(chatInput.value);
            chatInput.value = "";
        }
    }

    if(screenrecordobj.active){

        var element = document.body;
        recorder = RecordRTC(element, {
            type: 'canvas',
            showMousePointer: true
        });

        var recordButton= document.createElement("span");
        recordButton.className= screenrecordobj.button.class_off ;
        recordButton.innerHTML= screenrecordobj.button.html_off;
        recordButton .onclick = function() {
            if(recordButton.className==screenrecordobj.button.class_off){
                recordButton.className= screenrecordobj.button.class_on ;
                recordButton.innerHTML= screenrecordobj.button.html_on;
                recorder.startRecording();
            }else if(recordButton.className==screenrecordobj.button.class_on){
                recordButton.className= screenrecordobj.button.class_off ;
                recordButton.innerHTML= screenrecordobj.button.html_off;
                recorder.stopRecording(function(videoURL) {
                    for(i in webcallpeers ){
                        if(webcallpeers[i].userid==rtcMultiConnection.userid){
                            var recordVideoname = "recordedScreenvideo"+ new Date().getTime();
                            webcallpeers[i].filearray.push(recordVideoname);
                            var numFile= document.createElement("div");
                            numFile.value= webcallpeers[i].filearray.length;

                            syncVideoScreenRecording(videoURL , "videoScreenRecording" , recordVideoname);
                            displayList(rtcMultiConnection.uuid , rtcMultiConnection.userid , videoURL, recordVideoname , "videoScreenRecording");
                            displayFile(rtcMultiConnection.uuid , rtcMultiConnection.userid , videoURL, recordVideoname , "videoScreenRecording");
                        }
                    }

                    var recordedBlob = recorder.getBlob();
                    recorder.getDataURL(function(dataRecordedVideo) { 
                        console.log("dataURL " , dataRecordedVideo);
                        /* creates a file */
                    });
                });
                
            }
        };

        var li =document.createElement("li");
        li.appendChild(recordButton);
        document.getElementById("topIconHolder_ul").appendChild(li);
    }

    if(screenshareobj.active){

        detectExtensionScreenshare(screenshareobj.extensionID);
        webrtcdevScreenShare();

        var screenShareButton= document.createElement("span");
        screenShareButton.className=screenshareobj.button.shareButton.class_off;
        screenShareButton.innerHTML=screenshareobj.button.shareButton.html_off;
        screenShareButton.id="screenShareButton";
        screenShareButton.onclick = function() {    
            console.log("screenShareButton", screen);
            if(screenShareButton.className==screenshareobj.button.shareButton.class_off){
                screen.share();
                screenShareButton.className=screenshareobj.button.shareButton.class_on;
                screenShareButton.innerHTML=screenshareobj.button.shareButton.html_on;
            }else if(screenShareButton.className==screenshareobj.button.shareButton.class_on){
                screen.leave();
                
                var elem = document.getElementById("viewScreenShareButton");
                elem.parentElement.removeChild(elem);
                
                screenShareButton.className=screenshareobj.button.shareButton.class_off;
                screenShareButton.innerHTML=screenshareobj.button.shareButton.html_off;
            }
        };

        var li =document.createElement("li");
        li.appendChild(screenShareButton);
        document.getElementById("topIconHolder_ul").appendChild(li);
    }   

    if(reconnectobj.active){
        var reconnectButton= document.createElement("span");
        reconnectButton.className= reconnectobj.button.class;
        reconnectButton.innerHTML= reconnectobj.button.html;
        reconnectButton.onclick=function(){
            var r = confirm("Do you want to reconnet ?");
            if (r == true) {
               location.reload();
            } else {
               //do nothing
            }
        };
        var li =document.createElement("li");
        li.appendChild(reconnectButton);
        document.getElementById("topIconHolder_ul").appendChild(li);
    }

    if(drawCanvasobj.active){
        var drawButton= document.createElement("span");
        drawButton.className=drawCanvasobj.button.class_off ;
        drawButton.innerHTML=drawCanvasobj.button.html_off;
        drawButton.onclick=function(){
            if(drawButton.className==drawCanvasobj.button.class_off){
                drawButton.className= drawCanvasobj.button.class_on ;
                drawButton.innerHTML= drawCanvasobj.button.html_on;
                webrtcdevCanvasDesigner();
                document.getElementById(drawCanvasobj.drawCanvasContainer).hidden=false;
            }else if(drawButton.className==drawCanvasobj.button.class_on){
                drawButton.className= drawCanvasobj.button.class_off ;
                drawButton.innerHTML= drawCanvasobj.button.html_off;
                document.getElementById(drawCanvasobj.drawCanvasContainer).hidden=true;
            }
        };
        var li =document.createElement("li");
        li.appendChild(drawButton);
        document.getElementById("topIconHolder_ul").appendChild(li);
    }
};

/********************************************************************************8
        Chat
**************************************************************************************/
function addMessageLineformat(messageDivclass, message , parent){
        var n = document.createElement("div");
        n.className = messageDivclass; 
        n.innerHTML = message;
        document.getElementById(parent).insertBefore(n, document.getElementById(parent).firstChild);
}

function addMessageBlockFormat(messageheaderDivclass , messageheader ,messageDivclass, message , parent){
    
    var t = document.createElement("div");
    t.className = messageheaderDivclass, 
    t.innerHTML = '<div class="chatusername">' + messageheader + "</div>";

    var n = document.createElement("div");
    n.className = messageDivclass,
    n.innerHTML= message,

    t.appendChild(n),  
    $("#"+parent).append(n);
    /* $("#all-messages").scrollTop($("#all-messages")[0].scrollHeight) */
}

function addNewMessage(e) {
    if ("" != e.message && " " != e.message) {
        addMessageLineformat("user-activity user-activity-right remoteMessageClass" , e.message , "all-messages");
    }
}

function addNewMessagelocal(e) {
    if ("" != e.message && " " != e.message) {
        addMessageLineformat("user-activity user-activity-right localMessageClass" , e.message , "all-messages");
    }
}

function sendChatMessage(msg){
    addNewMessagelocal({
                header: rtcMultiConnection.extra.username,
                message: msg,
                userinfo: getUserinfo(rtcMultiConnection.blobURLs[rtcMultiConnection.userid], "chat-message.png"),
                color: rtcMultiConnection.extra.color
            });
    rtcMultiConnection.send({type:"chat", message:msg });
}

/*$("#chatInput").keypress(function(e) {
    if (e.keyCode == 13) {
        sendChatMessage();
    }
})*/

/*$('#send').click( function() {
    sendChatMessage();
    return false; 
});*/

//$('#chatbox').height($( "#leftVideo" ).height());
$('#chatbox').css('max-height', $( "#leftVideo" ).height()+ 80);
$('#chatBoard').css('max-height', $( "#leftVideo" ).height());
$("#chatBoard").css("overflow-y" , "scroll");

/***************************************************************88
File sharing 
******************************************************************/

var progressHelper = {};

function addProgressHelper(uuid , userid , filename , fileSize,  progressHelperclassName ){
    for(i in webcallpeers ){
        if(webcallpeers[i].userid==userid){
            var n = document.createElement("div");
            n.title = filename,
            n.id = uuid+ filename,
            n.setAttribute("class", progressHelperclassName),
            n.innerHTML = "<label>0%</label><progress></progress>", 
            document.getElementById(webcallpeers[i].fileListContainer).appendChild(n),              
            progressHelper[uuid] = {
                div: n,
                progress: n.querySelector("progress"),
                label: n.querySelector("label")
            }, 
            progressHelper[uuid].progress.max = fileSize;
        }
    }
}


$('#file').change(function() {
    var file = this.files[0];
    rtcMultiConnection.send(file);
});


function addNewFileLocal(e) {
    console.log("add new message ", e);
    if ("" != e.message && " " != e.message) {
    }
}

function addNewFileRemote(e) {
    console.log("add new message ", e);
    if ("" != e.message && " " != e.message) {
    }
}

function updateLabel(e, r) {
    if (-1 != e.position) {
        var n = +e.position.toFixed(2).split(".")[1] || 100;
        r.innerHTML = n + "%"
    }
}

function simulateClick(buttonName){
    document.getElementById(buttonName).click(); 
    console.log("simulateClick on "+buttonName);
    return true;
}

function displayList(uuid , userid , fileurl , filename , filetype ){

    var elementList=null , elementPeerList=null , listlength=null;
    var elementDisplay=null, elementPeerDisplay=null ;

    for(i in webcallpeers ){
        if(webcallpeers[i].userid==userid){
           elementList=webcallpeers[i].fileListContainer;
           elementDisplay= webcallpeers[i].fileSharingContainer;
           listlength=webcallpeers[i].filearray.length;
        }
        else{
            elementPeerList= webcallpeers[i].fileListContainer;
            elementPeerDisplay= webcallpeers[i].fileSharingContainer;
        }
    }

    var name = document.createElement("div");
    name.innerHTML = listlength +"   " + filename ;
    name.id="name"+filename;

    var downloadButton = document.createElement("div");
    downloadButton.setAttribute("class" , "btn btn-primary");
    downloadButton.setAttribute("style", "color:white");
    downloadButton.innerHTML='<a href="' +fileurl + '" download="' + filename + '" style="color:white" > Download </a>';

    var showButton = document.createElement("div");
    showButton.id= "showButton"+filename;
    showButton.setAttribute("class" , "btn btn-primary");
    showButton.innerHTML='show';
    showButton.onclick=function(){
        if(repeatFlagShowButton != filename){
            showFile(uuid , elementDisplay , fileurl , filename , filetype);
            rtcMultiConnection.send({
                type:"shareFileShow", 
                _uuid: uuid , 
                _element: elementPeerDisplay,
                _fileurl : fileurl, 
                _filename : filename, 
                _filetype : filetype
            }); 
            repeatFlagShowButton= filename;       
        }else if(repeatFlagShowButton == filename){
            repeatFlagShowButton= "";
        }
    };

    var hideButton = document.createElement("div");
    hideButton.id= "hideButton"+filename;
    hideButton.setAttribute("class" , "btn btn-primary");
    hideButton.innerHTML='hide';
    hideButton.onclick=function(){
        if(repeatFlagHideButton != filename){
            hideFile(uuid , elementDisplay , fileurl , filename , filetype);
            rtcMultiConnection.send({
                type:"shareFileHide", 
                _uuid: uuid , 
                _element: elementPeerDisplay,
                _fileurl : fileurl, 
                _filename : filename, 
                _filetype : filetype
            });
            repeatFlagHideButton= filename;
        }else if(repeatFlagHideButton == filename){
            repeatFlagHideButton= "";
        }
    };

    var removeButton = document.createElement("div");
    removeButton.id= "removeButton"+filename;
    removeButton.setAttribute("class" , "btn btn-primary");
    removeButton.innerHTML='remove';
    removeButton.onclick=function(event){
        if(repeatFlagRemoveButton != filename){
            hideFile(uuid , elementDisplay , fileurl , filename , filetype);
            var tobeHiddenElement = event.target.parentNode.id;
            rtcMultiConnection.send({
                type:"shareFileRemove", 
                _element: tobeHiddenElement,
                _filename : filename
            });  
            removeFile(tobeHiddenElement);
            repeatFlagRemoveButton=filename;
        }else if(repeatFlagRemoveButton == filename){
            repeatFlagRemoveButton= "";
        }  
    };

    var r;
    if(fileshareobj.active && document.getElementById(elementList)!=null){
        switch(filetype) {
            case "imagesnapshot":
                r=document.createElement("div");
                r.id=filename;
                document.getElementById(elementList).appendChild(r);
            break;
            case "videoRecording":
                r=document.createElement("div");
                r.id=filename;  
                document.getElementById(elementList).appendChild(r);         
            break;
            case "videoScreenRecording":
                r=document.createElement("div");
                r.id=filename;  
                document.getElementById(elementList).appendChild(r);         
            break;
            default:
                r = progressHelper[uuid].div;
        }
    }else{
        r=document.createElement("div");
        r.id=filename;
        document.body.appendChild(r);
    }

    r.innerHTML="";
    r.appendChild(name);
    r.appendChild(downloadButton);
    r.appendChild(showButton);
    r.appendChild(hideButton);
    r.appendChild(removeButton);
}


function getFileElementDisplayByType(filetype , fileurl , filename){
    var elementDisplay;
    
    if(filetype.indexOf("msword")>-1 || filetype.indexOf("officedocument")>-1) {
        var divNitofcation= document.createElement("div");
        divNitofcation.className="alert alert-warning";
        divNitofcation.innerHTML= "Microsoft and Libra word file cannt be opened in browser";
        elementDisplay=divNitofcation;
    }else if(filetype.indexOf("image")>-1){
        var image= document.createElement("img");
        image.src= fileurl;
        image.style.width="100%";
        image.title=filename;
        image.id= "display"+filename; 
        elementDisplay=image;
    }else if(filetype.indexOf("videoScreenRecording")>-1){
        console.log("videoScreenRecording " , fileurl);
        var video = document.createElement("video");
        video.src = fileurl; 
        video.setAttribute("controls","controls");  
        video.style.width="100%";
        video.title=filename;
        video.id= "display"+filename; 
        elementDisplay=video;
    }else if(filetype.indexOf("video")>-1){
        console.log("videoRecording " , fileurl);
        var video = document.createElement("video");
        console.log(fileurl);
        /*            
        try{
            if(fileurl.video!=undefined ){
                video.src = URL.createObjectURL(fileurl.video); 
            }else{
                video.src = URL.createObjectURL(fileurl); 
            }
        }catch(e){*/
            video.src=fileurl;
        /*}*/

        video.setAttribute("controls","controls");  
        video.style.width="100%";
        video.title=filename;
        video.id= "display"+filename; 
        elementDisplay=video;
    }else{
        var iframe= document.createElement("iframe");
        iframe.src= fileurl;
        iframe.className= "viewerIframeClass";
        iframe.title= filename;
        iframe.id= "display"+filename;
        elementDisplay=iframe;
    }
    return  elementDisplay
}

function displayFile( uuid , _userid , _fileurl , _filename , _filetype ){
    var element=null;
    for(i in webcallpeers ){
        if(webcallpeers[i].userid==_userid)
           element=webcallpeers[i].fileSharingContainer;
    }
    console.log(" Display File ---------" ,_userid ," ||", _filename , "||", _filetype ,"||", element);
    if($('#'+ element).length > 0){
        $("#"+element).html(getFileElementDisplayByType(_filetype , _fileurl , _filename));
    }else{
        $( "body" ).append(getFileElementDisplayByType(_filetype , _fileurl , _filename));
    }

}


function syncButton(buttonId){
    var buttonElement= document.getElementById(buttonId);

    for(x in webcallpeers){
        if(buttonElement.getAttribute("lastClickedBy")==webcallpeers[x].userid){
            buttonElement.setAttribute("lastClickedBy" , '');
            return;
        }
    }

    if(buttonElement.getAttribute("lastClickedBy")==''){
        buttonElement.setAttribute("lastClickedBy" , rtcMultiConnection.userid);
        rtcMultiConnection.send({
                type:"buttonclick", 
                buttonName: buttonId
        });
    }
}

/* ************* file Listing container button functions --------------- */

function showFile( uuid , element , fileurl , filename , filetype ){
    $("#"+element).html( getFileElementDisplayByType(filetype , fileurl , filename));
}

function hideFile( uuid , element , fileurl , filename , filetype ){
    if($("#"+element).has("#display"+filename)){
        document.getElementById(element).innerHTML="";
        console.log("hidefile " ,filename , " from " , element);
    }else{
        console.log(" file is not displayed to hide  ");
    }
}

function removeFile(element){
    document.getElementById(element).hidden=true;
}


/* ************* file sharing container button functions --------------- */
function closeFV(userid,  buttonId , selectedFileSharingBox){
    document.getElementById(selectedFileSharingBox).innerHTML="";
    syncButton(buttonId);
}

function resizeFV(userid,  buttonId , arrFilesharingBoxes){
    for ( x in arrFilesharingBoxes){
        document.getElementById(arrFilesharingBoxes[x]).hidden=false;
        document.getElementById(arrFilesharingBoxes[x]).style.width="50%";   
    }
    syncButton(buttonId);
}

function minFV(userid, buttonId , arrFilesharingBoxes){
    for ( x in arrFilesharingBoxes){
        document.getElementById(arrFilesharingBoxes[x]).hidden=false;
        document.getElementById(arrFilesharingBoxes[x]).style.width="50%";
        document.getElementById(arrFilesharingBoxes[x]).style.height="10%";
    }
    syncButton(buttonId);
}

function maxFV(userid,  buttonId , arrFilesharingBoxes, selectedFileSharingBox){
    for ( x in arrFilesharingBoxes){
        if(arrFilesharingBoxes[x]==selectedFileSharingBox){
            document.getElementById(arrFilesharingBoxes[x]).hidden=false;
            document.getElementById(arrFilesharingBoxes[x]).style.width="100%";
        }else{
            document.getElementById(arrFilesharingBoxes[x]).hidden=true;
            document.getElementById(arrFilesharingBoxes[x]).style.width="0%";
        }
    }
    syncButton(buttonId);  
}

/**************************************************************************8
draw 
******************************************************************************/

function webrtcdevCanvasDesigner(){
    try{
        CanvasDesigner.addSyncListener(function(data) {
            rtcMultiConnection.send({type:"canvas", draw:data});
        });

        CanvasDesigner.setSelected('pencil');

        CanvasDesigner.setTools({
            pencil: true,
            eraser: true
        });

        CanvasDesigner.appendTo(document.getElementById(drawCanvasobj.drawCanvasContainer));
    }catch( e){
        console.log(" Canvas drawing not supported ");
        console.log(e);
    }
}

/*******************************
cursor sharing 
************************************/

function placeCursor(element , x_pos, y_pos) {
  var d = document.getElementById(element);
  d.style.position = "absolute";
  d.style.left = x_pos+'px';
  d.style.top = y_pos+'px';
}
  
var cursorX;
var cursorY;

/*document.onmousemove = function(e){
    cursorX = e.pageX;
    cursorY = e.pageY;
}
*/
//setInterval("shareCursor()", 500);

function shareCursor(){
    rtcMultiConnection.send({
        type:"pointer", 
        corX: cursorX , 
        corY: cursorY
    });
    placeCursor("cursor1" , cursorX, cursorY);
}

/**********************************
Reconnect 
****************************************/
/*
add code hetre for redial 
*/

/****************************************8
screenshare
***************************************/
function webrtcdevScreenShare(){

    try{
        screen = new Screen("screen"+rtcMultiConnection.channel);

        console.log("----------- screen" , screen);
        // get shared screens
        screen.onaddstream = function(e) {
            
            document.getElementById(screenshareobj.screenshareContainer).innerHTML="";
            document.getElementById(screenshareobj.screenshareContainer).appendChild(e.video);
            document.getElementById(screenshareobj.screenshareContainer).hidden=false;
            if(e.type!="remote"){
                screen.openSignalingChannel = function(callback) {
                    var n= io.connect("/"+rtcMultiConnection.channel);
                    n.channel = t;
                    return n.on('message', callback);
                };
            }

            var viewScreenShareButton= document.createElement("span");
            viewScreenShareButton.className=screenshareobj.button.viewButton.class_on;
            viewScreenShareButton.innerHTML=screenshareobj.button.viewButton.html_on;;
            viewScreenShareButton.id="viewScreenShareButton";
            viewScreenShareButton.onclick = function() {
                if(viewScreenShareButton.className==screenshareobj.button.viewButton.class_off){
                    /*screen.view({roomid:screen_roomid , userid:screen_userid});*/
                    document.getElementById(screenshareobj.screenshareContainer).hidden=false;
                    viewScreenShareButton.className=screenshareobj.button.viewButton.class_on;
                    viewScreenShareButton.innerHTML=screenshareobj.button.viewButton.html_on;
                }else if(viewScreenShareButton.className==screenshareobj.button.viewButton.class_on){
                    /*screen.leave();*/
                    document.getElementById(screenshareobj.screenshareContainer).hidden=true;
                    viewScreenShareButton.className=screenshareobj.button.viewButton.class_off;
                    viewScreenShareButton.innerHTML=screenshareobj.button.viewButton.html_off;
                }
            };

            var li =document.createElement("li");
            li.appendChild(viewScreenShareButton);
            document.getElementById("topIconHolder_ul").appendChild(li);

        };

        screen.check();

        screen.onuserleft = function(userid) {
            document.getElementById(screenshareobj.screenshareContainer).hidden=true;
            /*       
            var video = document.getElementById(userid);
            if(video) {
               // video.parentNode.removeChild(video);
            }*/
        };

        
        /*
        screen.onscreen = function(screen) {
            alert("onscreen  1"+screen);
            if (self.detectedRoom) return;
            self.detectedRoom = true;
            self.view(screen);
        };*/
    }catch(e){
        console.log("------------screenshare not supported ");
        $("#screenShareButton").hide();
        $("#viewScreenShareButton").hide();
        console.log(e);
    }
}


function detectExtensionScreenshare(extensionID){
    var extensionid = extensionID;
    rtcMultiConnection.DetectRTC.screen.getChromeExtensionStatus(extensionid, function(status) {
        if(status == 'installed-enabled') {
            // chrome extension is installed & enabled.
        }
        
        if(status == 'installed-disabled') {
            // chrome extension is installed but disabled.
        }
        
        if(status == 'not-installed') {
            // chrome extension is not installed
        }
        
        if(status == 'not-chrome') {
            // using non-chrome browser
        }
    });

    // if following function is defined, it will be called if screen capturing extension seems available
    rtcMultiConnection.DetectRTC.screen.onScreenCapturingExtensionAvailable = function() {
        // hide inline-install button
        //alert("onScreenCapturingExtensionAvailable , hide inline installation button ");
    };

    // a middle-agent between public API and the Signaler object
    window.Screen = function(channel) {
        var signaler, self = this;
        this.channel = channel || location.href.replace(/\/|:|#|%|\.|\[|\]/g, '');

        // get alerted for each new meeting
        this.onscreen = function(screen) {
            if (self.detectedRoom) return;
            self.detectedRoom = true;
            self.view(screen);
        };

        function initSignaler(roomid) {
            signaler = new Signaler(self, (roomid && roomid.length) || self.channel);
        }

        function captureUserMedia(callback, extensionAvailable) {
            getScreenId(function(error, sourceId, screen_constraints) {
                navigator.getUserMedia(screen_constraints, function(stream) {
                    stream.onended = function() {
                        if (self.onuserleft) self.onuserleft('self');
                    };

                    self.stream = stream;

                    var video = document.createElement('video');
                    video.id = 'self';
                    video[isFirefox ? 'mozSrcObject' : 'src'] = isFirefox ? stream : window.webkitURL.createObjectURL(stream);
                    video.autoplay = true;
                    video.controls = true;
                    video.play();

                    self.onaddstream({
                        video: video,
                        stream: stream,
                        userid: 'self',
                        type: 'local'
                    });

                    callback(stream);
                }, function(error) {
                    if (isChrome && location.protocol === 'http:') {
                        alert('You\'re not testing it on SSL origin (HTTPS domain) otherwise you didn\'t enable --allow-http-screen-capture command-line flag on canary.');
                    } else if (isChrome) {
                        alert('Screen capturing is either denied or not supported. Please install chrome extension for screen capturing or run chrome with command-line flag: --enable-usermedia-screen-capturing');
                    } else if (isFirefox) {
                        alert(Firefox_Screen_Capturing_Warning);
                    }

                    console.error(error);
                });
            });
        }

        var Firefox_Screen_Capturing_Warning = 'Make sure that you are using Firefox Nightly and you enabled: media.getusermedia.screensharing.enabled flag from about:config page. You also need to add your domain in "media.getusermedia.screensharing.allowed_domains" flag.';

        // share new screen
        this.share = function(roomid) {
            captureUserMedia(function() {
                !signaler && initSignaler(roomid);
                signaler.broadcast({
                    roomid: (roomid && roomid.length) || self.channel,
                    userid: self.userid
                });
            });
        };

        // view pre-shared screens
        this.view = function(room) {
            !signaler && initSignaler();
            signaler.join({
                to: room.userid,
                roomid: room.roomid
            });
        };

        // check pre-shared screens
        this.check = initSignaler;
    };

    // it is a backbone objectc
    function Signaler(root, roomid) {
        var socket;

        // unique identifier for the current user
        var userid = root.userid || getToken();

        if (!root.userid) {
            root.userid = userid;
        }

        // self instance
        var signaler = this;

        // object to store all connected peers
        var peers = {};

        // object to store ICE candidates for answerer
        var candidates = {};

        var numberOfParticipants = 0;

        // it is called when your signaling implementation fires "onmessage"
        this.onmessage = function(message) {
            // if new room detected
            console.log(signaler.sentParticipationRequest);
            console.log(roomid , " " , message);
            if(message.roomid!=null && message.userid!=null){
                screen_roomid =message.roomid;
                screen_userid =message.userid;
                /*shownotification(" Incoming shared screen ");*/
            }
            if (message.roomid == roomid && message.broadcasting && !signaler.sentParticipationRequest){
                screen.onscreen(message);
            }else {
                // for pretty logging
                console.debug(JSON.stringify(message, function(key, value) {
                    if (value.sdp) {
                        console.log(value.sdp.type, '————', value.sdp.sdp);
                        return '';
                    } else return value;
                }, '————'));
            }

            // if someone shared SDP
            if (message.sdp && message.to == userid)
                this.onsdp(message);

            // if someone shared ICE
            if (message.candidate && message.to == userid)
                this.onice(message);

            // if someone sent participation request
            if (message.participationRequest && message.to == userid) {
                var _options = options;
                _options.to = message.userid;
                _options.stream = root.stream;
                peers[message.userid] = Offer.createOffer(_options);

                numberOfParticipants++;

                if (root.onNumberOfParticipantsChnaged) root.onNumberOfParticipantsChnaged(numberOfParticipants);
            }
        };

        // if someone shared SDP
        this.onsdp = function(message) {
            var sdp = JSON.parse(message.sdp);

            if (sdp.type == 'offer') {
                var _options = options;
                _options.stream = root.stream;
                _options.sdp = sdp;
                _options.to = message.userid;
                peers[message.userid] = Answer.createAnswer(_options);
            }

            if (sdp.type == 'answer') {
                peers[message.userid].setRemoteDescription(sdp);
            }
        };

        // if someone shared ICE
        this.onice = function(message) {
            message.candidate = JSON.parse(message.candidate);

            var peer = peers[message.userid];
            if (!peer) {
                var candidate = candidates[message.userid];
                if (candidate) candidates[message.userid][candidate.length] = message.candidate;
                else candidates[message.userid] = [message.candidate];
            } else {
                peer.addIceCandidate(message.candidate);

                var _candidates = candidates[message.userid] || [];
                if (_candidates.length) {
                    for (var i = 0; i < _candidates.length; i++) {
                        peer.addIceCandidate(_candidates[i]);
                    }
                    candidates[message.userid] = [];
                }
            }
        };

        // it is passed over Offer/Answer objects for reusability
        var options = {
            onsdp: function(sdp, to) {
                console.log('local-sdp', JSON.stringify(sdp.sdp, null, '\t'));

                signaler.signal({
                    sdp: JSON.stringify(sdp),
                    to: to
                });
            },
            onicecandidate: function(candidate, to) {
                signaler.signal({
                    candidate: JSON.stringify(candidate),
                    to: to
                });
            },
            onaddstream: function(stream, _userid) {
                console.log('onaddstream>>>>>>'+ stream);
                //document.getElementById("viewScreenShareButton").disabled=false;
                /*document.getElementById("viewScreenShareButton").removeAttribute("disabled");*/

                stream.onended = function() {
                    if (root.onuserleft) root.onuserleft(_userid);
                };

                var video = document.createElement('video');
                video.id = _userid;
                video[isFirefox ? 'mozSrcObject' : 'src'] = isFirefox ? stream : window.webkitURL.createObjectURL(stream);
                video.autoplay = true;
                video.controls = true;
                video.play();

                function onRemoteStreamStartsFlowing() {
                    if (isMobileDevice) {
                        return afterRemoteStreamStartedFlowing();
                    }

                    if (!(video.readyState <= HTMLMediaElement.HAVE_CURRENT_DATA || video.paused || video.currentTime <= 0)) {
                        afterRemoteStreamStartedFlowing();
                    } else
                        setTimeout(onRemoteStreamStartsFlowing, 300);
                }

                function afterRemoteStreamStartedFlowing() {
                    if (!screen.onaddstream) return;
                    screen.onaddstream({
                        video: video,
                        stream: stream,
                        userid: _userid,
                        type: 'remote'
                    });
                }

                onRemoteStreamStartsFlowing();
            }
        };

        // call only for session initiator
        this.broadcast = function(_config) {
            signaler.roomid = _config.roomid || getToken();

            if (_config.userid) {
                userid = _config.userid;
            }

            signaler.isbroadcaster = true;
            (function transmit() {
                signaler.signal({
                    roomid: signaler.roomid,
                    broadcasting: true
                });

                if (!signaler.stopBroadcasting && !root.transmitOnce)
                    setTimeout(transmit, 3000);
            })();

            // if broadcaster leaves; clear all JSON files from Firebase servers
            if (socket.onDisconnect) socket.onDisconnect().remove();
        };

        // called for each new participant
        this.join = function(_config) {
            signaler.roomid = _config.roomid;
            this.signal({
                participationRequest: true,
                to: _config.to
            });
            signaler.sentParticipationRequest = true;
        };

        window.addEventListener('beforeunload', function() {
            leaveRoom();
        }, false);

        window.addEventListener('keyup', function(e) {
            if (e.keyCode == 116) {
                leaveRoom();
            }
        }, false);

        function leaveRoom() {
            signaler.signal({
                leaving: true
            });

            // stop broadcasting room
            if (signaler.isbroadcaster) signaler.stopBroadcasting = true;

            // leave user media resources
            if (root.stream) root.stream.stop();

            // if firebase; remove data from their servers
            if (window.Firebase) socket.remove();
        }

        root.leave = leaveRoom;

        // signaling implementation
        // if no custom signaling channel is provided; use Firebase
        if (!root.openSignalingChannel) {
            if (!window.Firebase) throw 'You must link <https://cdn.firebase.com/v0/firebase.js> file.';

            // Firebase is capable to store data in JSON format
            // root.transmitOnce = true;
            socket = new window.Firebase('https://' + (root.firebase || 'signaling') + '.firebaseIO.com/' + root.channel);
            socket.on('child_added', function(snap) {
                var data = snap.val();

                var isRemoteMessage = false;
                if (typeof userid === 'number' && parseInt(data.userid) != userid) {
                    isRemoteMessage = true;
                }
                if (typeof userid === 'string' && data.userid + '' != userid) {
                    isRemoteMessage = true;
                }

                if (isRemoteMessage) {
                    if (data.to) {
                        if (typeof userid == 'number') data.to = parseInt(data.to);
                        if (typeof userid == 'string') data.to = data.to + '';
                    }

                    if (!data.leaving) signaler.onmessage(data);
                    else {
                        numberOfParticipants--;
                        if (root.onNumberOfParticipantsChnaged) {
                            root.onNumberOfParticipantsChnaged(numberOfParticipants);
                        }

                        root.onuserleft(data.userid);
                    }
                }

                // we want socket.io behavior; 
                // that's why data is removed from firebase servers 
                // as soon as it is received
                // data.userid != userid && 
                if (isRemoteMessage) snap.ref().remove();
            });

            // method to signal the data
            this.signal = function(data) {
                data.userid = userid;
                socket.push(data);
            };
        } else {
            // custom signaling implementations
            // e.g. WebSocket, Socket.io, SignalR, WebSycn, XMLHttpRequest, Long-Polling etc.
            socket = root.openSignalingChannel(function(message) {
                message = JSON.parse(message);

                var isRemoteMessage = false;
                if (typeof userid === 'number' && parseInt(message.userid) != userid) {
                    isRemoteMessage = true;
                }
                if (typeof userid === 'string' && message.userid + '' != userid) {
                    isRemoteMessage = true;
                }

                if (isRemoteMessage) {
                    if (message.to) {
                        if (typeof userid == 'number') message.to = parseInt(message.to);
                        if (typeof userid == 'string') message.to = message.to + '';
                    }

                    if (!message.leaving) signaler.onmessage(message);
                    else {
                        root.onuserleft(message.userid);
                        numberOfParticipants--;
                        if (root.onNumberOfParticipantsChnaged) root.onNumberOfParticipantsChnaged(numberOfParticipants);
                    }
                }
            });

            // method to signal the data
            this.signal = function(data) {
                data.userid = userid;
                socket.send(JSON.stringify(data));
            };
        }
    }

    // reusable stuff
    /*var RTCPeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;*/
    /*
    var RTCSessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;
    var RTCIceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;*/

    navigator.getUserMedia = navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
    //window.URL = window.webkitURL || window.URL;
    /*'webkitURL' is deprecated. Please use 'URL' instead.*/
    
    var isFirefox = !!navigator.mozGetUserMedia;
    var isChrome = !!navigator.webkitGetUserMedia;
    var isMobileDevice = !!navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile/i);

    /*var iceServers = webrtcdevIceServers;*/
    /*var iceServers = rtcMultiConnection.iceServers;*/
    var iceServers=[];

    var optionalArgument = {
        optional: [{
            DtlsSrtpKeyAgreement: true
        }]
    };

    function getToken() {
        return Math.round(Math.random() * 9999999999) + 9999999999;
    }

    function getIceServersAsArray(iceServers){
        if (!isNull(iceServers)) {
            console.log(toStr(iceServers));
            var iceTransports='all';
            var iceCandidates = this.rtcMultiConnection.candidates;

            var stun = iceCandidates.stun;
            var turn = iceCandidates.turn;
            var host = iceCandidates.host;

            if (!isNull(iceCandidates.reflexive)) stun = iceCandidates.reflexive;
            if (!isNull(iceCandidates.relay)) turn = iceCandidates.relay;

            if (!host && !stun && turn) {
                iceTransports = 'relay';
            } else if (!host && !stun && !turn) {
                iceTransports = 'none';
            }

            this.iceServers = {
                iceServers: iceServers,
                iceTransports: iceTransports
            };
        } else {
            iceServers = null;
        }

        console.log('ScreenSharing --> rtc-configuration', toStr(this.iceServers));    

        return this.iceServers;
    }

    function onSdpSuccess() {}

    function onSdpError(e) {
        console.error('sdp error:', e);
    }

    // var offer = Offer.createOffer(config);
    // offer.setRemoteDescription(sdp);
    // offer.addIceCandidate(candidate);
    var offerConstraints = {
        optional: [],
        mandatory: {
            OfferToReceiveAudio: false,
            OfferToReceiveVideo: false
        }
    };

    var Offer = {
        createOffer: function(config) {
            iceServers=getIceServersAsArray(webrtcdevIceServers);
            var peer = new RTCPeerConnection(iceServers, optionalArgument);

            peer.addStream(config.stream);
            peer.onicecandidate = function(event) {
                if (event.candidate) config.onicecandidate(event.candidate, config.to);
            };

            peer.createOffer(function(sdp) {
                sdp.sdp = setBandwidth(sdp.sdp);
                peer.setLocalDescription(sdp);
                config.onsdp(sdp, config.to);
            }, onSdpError, offerConstraints);

            this.peer = peer;

            return this;
        },
        setRemoteDescription: function(sdp) {
            console.log("Screen share-->setting Offer remote descriptions", sdp.sdp);
            this.peer.setRemoteDescription(new RTCSessionDescription(sdp), onSdpSuccess, onSdpError);
        },
        addIceCandidate: function(candidate) {
            console.log("Screen share-->adding ice", candidate.candidate);
            this.peer.addIceCandidate(new RTCIceCandidate({
                sdpMLineIndex: candidate.sdpMLineIndex,
                candidate: candidate.candidate
            }));
        }
    };

    // var answer = Answer.createAnswer(config);
    // answer.setRemoteDescription(sdp);
    // answer.addIceCandidate(candidate);
    var answerConstraints = {
        optional: [],
        mandatory: {
            OfferToReceiveAudio: false,
            OfferToReceiveVideo: true
        }
    };
    var Answer = {
        createAnswer: function(config) {
            iceServers=getIceServersAsArray(webrtcdevIceServers);
            var peer = new RTCPeerConnection(iceServers, optionalArgument);

            peer.onaddstream = function(event) {
                config.onaddstream(event.stream, config.to);
            };
            peer.onicecandidate = function(event) {
                if (event.candidate) config.onicecandidate(event.candidate, config.to);
            };

            peer.setRemoteDescription(new RTCSessionDescription(config.sdp), onSdpSuccess, onSdpError);
            peer.createAnswer(function(sdp) {
                sdp.sdp = setBandwidth(sdp.sdp);
                peer.setLocalDescription(sdp);
                config.onsdp(sdp, config.to);
            }, onSdpError, answerConstraints);

            this.peer = peer;
            return this;
        },
        addIceCandidate: function(candidate) {
            this.peer.addIceCandidate(new RTCIceCandidate({
                sdpMLineIndex: candidate.sdpMLineIndex,
                candidate: candidate.candidate
            }));
        }
    };

    function setBandwidth(sdp) {
        if (isFirefox) return sdp;
        if (isMobileDevice) return sdp;

        // https://cdn.rawgit.com/muaz-khan/RTCMultiConnection/master/RTCMultiConnection-v3.0/dev/BandwidthHandler.js
        if (typeof BandwidthHandler !== 'undefined') {
            window.isMobileDevice = isMobileDevice;
            window.isFirefox = isFirefox;

            var bandwidth = {
                screen: 300, // 300kbits minimum
                video: 256 // 256kbits (both min-max)
            };
            var isScreenSharing = false;

            sdp = BandwidthHandler.setApplicationSpecificBandwidth(sdp, bandwidth, isScreenSharing);
            sdp = BandwidthHandler.setVideoBitrates(sdp, {
                min: bandwidth.video,
                max: bandwidth.video
            });
            return sdp;
        }

        // removing existing bandwidth lines
        sdp = sdp.replace(/b=AS([^\r\n]+\r\n)/g, '');

        // "300kbit/s" for screen sharing
        sdp = sdp.replace(/a=mid:video\r\n/g, 'a=mid:video\r\nb=AS:300\r\n');

        return sdp;
    }


    !window.getScreenId && loadScript('getScreenId.js');
}
/*screen  Object {broadcasting: true, roomid: 11, userid: 10494752123}*/

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
Canvas Record 
*************************************************************************/


function syncVideoScreenRecording(data , datatype , dataname ){
    rtcMultiConnection.send({type:datatype, message:data  , name : dataname});
}

function autorecordScreenVideo(){


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


/******************* help and settings ***********************/


function getAllPeerInfo(){
    console.log(webcallpeers);
}


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
        webrtcdevIceServers=JSON.parse(xhr.responseText).d.iceServers;
        console.log("iceserver got" ,webrtcdevIceServers );
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