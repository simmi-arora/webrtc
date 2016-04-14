function shownotification(message){
   // alert(message);
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


/********************************************************************
    global variables
**********************************************************************/

var t = " ";
var o = "/";
var e= null;
var n="serviceexchange@serviceexchange.com";

var usersList       = document.getElementById("userslist");
var numbersOfUsers  = document.getElementById("numbersofusers");
var usersContainer  = document.getElementById("usersContainer");

var localUserId=null , remoteUserId=null;
// DOM objects
var localVideo = document.getElementById('localVideo');
var miniVideo = document.getElementById('miniVideo');
var remoteVideo = document.getElementById('remoteVideo');
var card = document.getElementById('card');
var containerDiv;
var main = document.querySelector('#main');
var smaller = document.querySelector('#smaller');
var webcallpeers=[];

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
        video.className = 'other-videos';
        video.setAttribute('style', 'height:auto;opacity:1;');
        video.id = e.userid;
        video.src = URL.createObjectURL(e.stream);
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

function waitForRemoteVideo() {
    console.log("waitForRemoteVideo");
    // Call the getVideoTracks method via adapter.js.
    var videoTracks = remoteStream.getVideoTracks();
    if (videoTracks.length === 0 || remoteVideo.currentTime > 0) {
        transitionToActive();
    } else {
        setTimeout(waitForRemoteVideo, 100);
    }
}

function transitionToActive() {
    remoteVideo.style.opacity = 1;
    card.style.webkitTransform = 'rotateY(180deg)';
    setTimeout(function() {
        localVideo.src = '';
    }, 500);
    setTimeout(function() {
        miniVideo.style.opacity = 1;
    }, 1000);
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


/* *************************************************************************************
		peerconnection 
****************************************************************************/
var RTCPeerConnection = null;
var getUserMedia = null;
var attachMediaStream = null;
var reattachMediaStream = null;
var webrtcDetectedBrowser = null;
var webrtcDetectedVersion = null;

var rtcMultiConnection = new RTCMultiConnection;

rtcMultiConnection.preventSSLAutoAllowed = false;
rtcMultiConnection.autoReDialOnFailure = true;
rtcMultiConnection.setDefaultEventsForMediaElement = false;

rtcMultiConnection.session = {
    video: !0,
    audio: !0,
    data:  !0
}, 

rtcMultiConnection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: !0,
    OfferToReceiveVideo: !0
}, 

rtcMultiConnection.customStreams = {}, 

rtcMultiConnection.autoCloseEntireSession = !1, 

rtcMultiConnection.autoTranslateText = !1, 

rtcMultiConnection.maxParticipantsAllowed = 3, 

rtcMultiConnection.setDefaultEventsForMediaElement = !1; 

rtcMultiConnection.blobURLs = {};

if (navigator.mozGetUserMedia) {
    console.log("This appears to be Firefox");
    webrtcDetectedBrowser = "firefox";
    webrtcDetectedVersion = parseInt(navigator.userAgent.match(/Firefox\/([0-9]+)\./)[1]);
    RTCPeerConnection = mozRTCPeerConnection;
    RTCSessionDescription = mozRTCSessionDescription;
    RTCIceCandidate = mozRTCIceCandidate;
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
    console.log("This appears to be Chrome");
    webrtcDetectedBrowser = "chrome";
    webrtcDetectedVersion =  parseInt(navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)[2]);
    RTCPeerConnection = webkitRTCPeerConnection;
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

var numberOfRemoteVideos = 0;

var islocalStream = 1;

function getPeerId(e ){
    for (var key in e.peers) {
        if(key!=e.userid){
            return key;
        }
    }
}
/* *************************************8
Snapshot
************************************************/

function syncSnapshot(datasnapshot , datatype , dataname ){
    rtcMultiConnection.send({type:datatype, message:datasnapshot  , name : dataname});
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
function attachControlButtons(videoElement, streamid , snapshotViewer){

        console.log(videoElement , " : "  , streamid);
        var referenceNode= document.getElementById(videoElement);

        //add the video mute button
        var videoButton=document.createElement("span");
        videoButton.id="videoButton";
        videoButton.setAttribute("data-val","mute");
        videoButton.setAttribute("title", "Toggle Video");
        videoButton.setAttribute("data-placement", "bottom");
        videoButton.setAttribute("data-toggle", "tooltip");
        videoButton.setAttribute("data-container", "body");
        videoButton.className="pull-right glyphicon glyphicon-eye-open btn btn-default videoButtonClass mediaButton";   
        videoButton.innerHTML="Video On";     
        videoButton.onclick= function(event) {
            if("mute" == this.getAttribute("data-val") ){
                this.setAttribute("data-val", "unmute"); 
                rtcMultiConnection.streams[streamid].mute({
                    video: !0
                });
                videoButton.innerHTML="Video Off";
                videoButton.className="pull-right glyphicon glyphicon-eye-close  btn btn-default videoButtonClass mediaButton";   
            } 
            else{
                this.setAttribute("data-val", "mute"); 
                rtcMultiConnection.streams[streamid].unmute({
                    video: !0
                });
                videoButton.innerHTML="Video On";
                videoButton.className="pull-right glyphicon glyphicon-eye-open btn btn-default videoButtonClass mediaButton";   
            }  
        }; 

        //add the audio mute button
        var audioButton=document.createElement("span");
        audioButton.id="audioButton";
        audioButton.setAttribute("data-val","mute");
        audioButton.setAttribute("title", "Toggle Audio");
        audioButton.setAttribute("data-placement", "bottom");
        audioButton.setAttribute("data-toggle", "tooltip");
        audioButton.setAttribute("data-container", "body");
        audioButton.className="pull-right glyphicon glyphicon-volume-up btn btn-default mediaButton";
        audioButton.innerHTML="Audio On";
        audioButton.onclick = function() {
            if("mute" == this.getAttribute("data-val") ){
                this.setAttribute("data-val", "unmute"); 
                /*
                rtcMultiConnection.streams[streamid].mute({
                    audio: !0
                });*/
                audioButton.innerHTML="Audio Off";
                audioButton.className="pull-right glyphicon glyphicon-volume-off btn btn-default mediaButton";
            } 
            else{
                this.setAttribute("data-val", "mute"); 
                /*                
                rtcMultiConnection.streams[streamid].unmute({
                    audio: !0
                });*/
                audioButton.innerHTML="Audio On";
                audioButton.className="pull-right glyphicon glyphicon-volume-up btn btn-default mediaButton";
            }             
        };

        //add the snapshot button
        var snapshotButton=document.createElement("div");
        snapshotButton.id="snapshotButton";
        snapshotButton.setAttribute("title", "Snapshot");
        snapshotButton.setAttribute("data-placement", "bottom");
        snapshotButton.setAttribute("data-toggle", "tooltip");
        snapshotButton.setAttribute("data-container", "body");
        snapshotButton.className="pull-right glyphicon glyphicon-camera btn btn-default mediaButton";
        snapshotButton.innerHTML="Snap-shot";
        snapshotButton.onclick = function() {
            rtcMultiConnection.streams[streamid].takeSnapshot(function(datasnapshot) {
                    var snapshotname = "snapshot"+ new Date().getTime();
                    fileArray1.push(snapshotname);
                    var numFile= document.createElement("div");
                    numFile.value= fileArray1.length;
                        //displaySnapshot(snapshotViewer, datasnapshot);
                    syncSnapshot(datasnapshot , "imagesnapshot" , snapshotname );
                    displayList(rtcMultiConnection.uuid ,  "widget-filesharing-container1"  ,datasnapshot , snapshotname , "imagesnapshot" , fileArray1.length);
                    displayFile(rtcMultiConnection.uuid , "widget-filesharing-container1" , datasnapshot , snapshotname, "imagesnapshot");

            });         
        };



        //add the snapshot button
        var recordButton=document.createElement("div");
        recordButton.id="recordButton";
        recordButton.setAttribute("title", "Record");
        recordButton.setAttribute("data-placement", "bottom");
        recordButton.setAttribute("data-toggle", "tooltip");
        recordButton.setAttribute("data-container", "body");
        recordButton.className="pull-right glyphicon glyphicon-refresh btn btn-default mediaButton";
        recordButton.innerHTML=" Record ";
        recordButton.onclick = function() {
            
            if(recordButton.innerHTML==" Record "){
                recordButton.innerHTML=" Stop Recording ";
                rtcMultiConnection.streams[streamid].startRecording({
                    audio: true,
                    video: true
                });
            }else if(recordButton.innerHTML==" Stop Recording "){
                recordButton.innerHTML=" Record ";
                rtcMultiConnection.streams[streamid].stopRecording(function (dataRecordedVideo) {
                        /*
                        var mediaElement = document.createElement('video'); 
                        mediaElement.src = URL.createObjectURL(blob.video); 
                        mediaElement.setAttribute("controls","controls");  
                        document.getElementById("rightVideo").appendChild(mediaElement); */
                    var recordVideoname = "recordedvideo"+ new Date().getTime();
                    fileArray1.push(recordVideoname);
                    var numFile= document.createElement("div");
                    numFile.value= fileArray1.length;

                    syncSnapshot(dataRecordedVideo , "imagesnapshot" , recordVideoname );
                    displayList(rtcMultiConnection.uuid ,  "widget-filesharing-container1"  ,dataRecordedVideo , recordVideoname , "videoRecording" , fileArray1.length);
                    displayFile(rtcMultiConnection.uuid , "widget-filesharing-container1" , dataRecordedVideo , recordVideoname, "videoRecording");

                    // POST both audio/video "Blobs" to PHP/other server using single FormData/XHR2
                    // blob.audio  --- audio blob
                    // blob.video  --- video blob
                }, {audio:true, video:true} );
            }
        };    


        var controlBar= document.createElement("div");
        controlBar.id="control"+videoElement;
        controlBar.setAttribute("style" , "float:left;margin-left: 20px;");
        controlBar.name= streamid;
        controlBar.appendChild(videoButton);
        controlBar.appendChild(audioButton);
        controlBar.appendChild(snapshotButton);
        controlBar.appendChild(recordButton);

        if(typeof mediaControlButtonsPosition!='undefined' && mediaControlButtonsPosition=="bottom"){
            referenceNode.parentNode.appendChild(controlBar);
            //referenceNode.parentNode.insertBefore(controlBar, referenceNode.nextSibling);
            //referenceNode.= controlBar+ referenceNode;
            //referenceNode.parentNode.insertBefore(controlBar, referenceNode.firstChild);
        }else{
            referenceNode.parentNode.insertBefore(controlBar, referenceNode.parentNode.firstChild);
        }
        
}

var localStream , localStreamId, remoteStream , remoteStreamId;

rtcMultiConnection.onstream = function(e) {

    if (e.type == 'local') {

        webcallpeers.push({ 
            name : "localVideo",
            userid : e.userid , 
            streamid : e.stream.streamid , 
            fileSharingcontainer : "widget-filesharing-container1"
        });

        $("#remote").hide();
        $("#controlremoteVideo").hide();
        $("#controlminiVideo").hide();

        $("#localVideo").show();
        localStream = e.stream;
        localStreamId=e.stream.streamid;

        attachMediaStream(localVideo, e.stream);
        localVideo.muted = true;
        localVideo.style.opacity = 1;
        localUserId = e.userid;

        if(document.getElementById("controllocalVideo")==null){
            attachControlButtons("localVideo" , e.stream.streamid , "widget-filesharing-container1");
        }
        
        document.getElementById("controllocalVideo").setAttribute("style" , "-webkit-transform: rotateY(180deg)");
        
        //$("#controllocalVideo").insertBefore($"#localVideo" );
        /*document.getElementById("widget-filesharing1").setAttribute("name" , localUserId);*/
       $("#widget-filesharing1").attr("name" , localUserId);
    }

    if (e.type == 'remote'){
        remoteUserId = getPeerId(e);
        /*document.getElementById("widget-filesharing2").setAttribute("name" , remoteUserId);*/
        $("widget-filesharing2").attr("name" , remoteUserId);
        numberOfRemoteVideos++;
        $("#localVideo").hide();
        $("#controllocalVideo").hide();
        $("#remote").show();
        remoteStream=e.stream;
        remoteStreamId= e.stream.streamid;
        if ( numberOfRemoteVideos == 1) {
            remoteStream = e.stream;
            reattachMediaStream(miniVideo, localVideo);
            miniVideo.muted = true;
            attachMediaStream(remoteVideo, e.stream);
            waitForRemoteVideo();
            remoteVideo.setAttribute('data-id', e.userid);

            if( typeof videoWidth!='undefined' ){
                miniVideo.setAttribute("width",videoWidth);
                remoteVideo.setAttribute("width",videoWidth);
            }
            //attachControlButtons("remoteVideo", e.stream.streamid , "widget-filesharing-container2");

            if(document.getElementById("controlremoteVideo")==null){
                attachControlButtons("remoteVideo", e.stream.streamid , "widget-filesharing-container2")
            }
        
            webcallpeers.push({ 
                name: "remoteVideo" , 
                userid: e.userid , 
                streamid : e.stream.streamid , 
                fileSharingcontainer : "widget-filesharing-container2"
            });

            miniVideo.setAttribute('data-id', rtcMultiConnection.userid);
            for(i in webcallpeers ){
                if(webcallpeers[i].name=="localVideo")
                    attachControlButtons("miniVideo", webcallpeers[i].streamid , "widget-filesharing-container1");
            }
            
        } else{
            console.log("  numberof Remotes is  more than one ");

            remoteStream = e.stream;
            reattachMediaStream(miniVideo, localVideo);
            miniVideo.muted = true;
            attachMediaStream(remoteVideo, e.stream);
            waitForRemoteVideo();
            remoteVideo.setAttribute('data-id', e.userid);
            attachControlButtons("remoteVideo", e.stream.streamid , "widget-filesharing-container2");
            
            webcallpeers.push({ 
                name: "remoteVideo" , 
                userid: e.userid , 
                streamid : e.stream.streamid , 
                fileSharingcontainer : "widget-filesharing-container2"
            });

            miniVideo.setAttribute('data-id', rtcMultiConnection.userid);
            for(i in webcallpeers ){
                if(webcallpeers[i].name=="localVideo")
                    attachControlButtons("miniVideo", webcallpeers[i].streamid , "widget-filesharing-container1");
            }

        }/*else if(numberOfRemoteVideos == 2){
            appendVideo(e, 'opacity: 1;position: fixed;bottom: 0;z-index: 1;width: 32%;');
        }else if (numberOfRemoteVideos == 3) {
            appendVideo(e, 'opacity: 1;position: fixed;top: 0;z-index: 1;width: 32%;');
        }else if (e.type == 'remote' && numberOfRemoteVideos == 4) {
            appendVideo(e, 'opacity: 1;position: fixed;top: 0;z-index: 1;width: 32%;right:0;');
        }*/

    }
}, 

rtcMultiConnection.onstreamended = function(e) {
    e.isScreen ? $("#" + e.userid + "_screen").remove() : $("#" + e.userid).remove()
}, 

rtcMultiConnection.onopen = function(e) {
    console.log( e.extra.username + " Joined the conversation."), 
    startsessionTimer();
    numbersOfUsers.innerHTML = parseInt(numbersOfUsers.innerHTML) + 1 ; 
};

var whoIsTyping = document.querySelector("#who-is-typing");
var repeatFlagShowButton =null, repeatFlagHideButton =null, repeatFlagRemoveButton=null ;

rtcMultiConnection.onmessage = function(e) {

    if(e.data.typing){
        void(whoIsTyping.innerHTML = e.extra.username + " is typing ...") ;
    }else if(e.data.stoppedTyping){
        void(whoIsTyping.innerHTML = "");
    }else if(e.data.type == "chat"){
        whoIsTyping.innerHTML = "";
        addNewMessage({
            header: e.extra.username,
            message: e.data.message,
            userinfo: getUserinfo(rtcMultiConnection.blobURLs[e.userid], "chat-message.png"),
            color: e.extra.color
        }); 
        void(document.title = e.data.message);
    }else if(e.data.type=="imagesnapshot"){
         displayList( rtcMultiConnection.uuid , "widget-filesharing-container2" , e.data.message , e.data.name , "imagesnapshot" , fileArray1.length);
         displayFile( rtcMultiConnection.uuid , "widget-filesharing-container2" , e.data.message , e.data.name , "imagesnapshot");
        /*
        addNewMessage({
            header: e.extra.username,
            message: e.data.message,
            userinfo: getUserinfo(rtcMultiConnection.blobURLs[e.userid], "chat-message.png"),
            color: e.extra.color
        }); */
    }else if(e.data.type == "file"){
        addNewMessage({
            header: e.extra.username,
            message: e.data.message,
            userinfo: getUserinfo(rtcMultiConnection.blobURLs[e.userid], "chat-message.png"),
            color: e.extra.color
        }); 
    }else if(e.data.type=="canvas"){
        CanvasDesigner.syncData( e.data.draw );
    }else if(e.data.type=="pointer"){
        placeCursor("cursor2" , e.data.corX , e.data.corY);
    }else if(e.data.type=="shareFileShow"){
        document.getElementById("showButton"+e.data._filename).click();
    }else if(e.data.type=="shareFileHide"){
         document.getElementById("hideButton"+e.data._filename).click();
    }else if(e.data.type=="shareFileRemove"){
       document.getElementById("removeButton"+e.data._filename).click();
    }
    return;
};

var sessions = {};
rtcMultiConnection.onNewSession = function(e) {
    sessions[e.sessionid] || (sessions[e.sessionid] = e, e.join())
}, 

rtcMultiConnection.onRequest = function(e) {
    rtcMultiConnection.accept(e)
}, 

rtcMultiConnection.onCustomMessage = function(e) {
    
    if (e.hasCamera || e.hasScreen) {
        var t = e.extra.username + " enabled webcam.";
        e.hasScreen && (e.session.oneway = !0, rtcMultiConnection.sendMessage({
            renegotiate: !0,
            streamid: e.streamid,
            session: e.session
        }), t = e.extra.username + " is ready to share screen.")
    }
    if (e.hasMic && (e.session.oneway = !0, rtcMultiConnection.sendMessage({
            renegotiate: !0,
            streamid: e.streamid,
            session: e.session
        })), e.renegotiate) {
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
    
    $("#" + e.userid).remove(), 

    shownotification(e.extra.username + " left the conversation."), 
    rtcMultiConnection.playRoleOfInitiator()
};


/********************************************************************************** 
		Session call 
************************************************************************************/
// connecting to signaling medium
// rtcMultiConnection.connect();

function startcall() {
    //rtcMultiConnection.open();
     
    rtcMultiConnection.extra = {
        username: t,
        color: "ffffff",
        useremail: n
    };

    var o = "/";
    socket = io.connect(o), 

    socket.on("presence", function(e) {
        e ? 
        (shownotification("Joing an existing session "),  rtcMultiConnection.connect()) : 
        (shownotification("Making a new session "), rtcMultiConnection.open())
    }),  

    socket.emit("presence", {
        channel: rtcMultiConnection.channel,
        useremail: n,
        username: t
    }), 

    //Code to open  signalling channel 
    rtcMultiConnection.openSignalingChannel = function(e) {

        var t = e.channel || this.channel;
        io.connect(o).emit("new-channel", {
            channel: t,
            sender: rtcMultiConnection.userid
        });

        var n = io.connect(o + t);    
        n.channel = t, 

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
        
        n.on("disconnect", "datalost")
    }
};

/********************************************************************************8
        Chat
**************************************************************************************/
function addMessageLineformat(){

}

function addMessageBlockFormat(){

}

function addNewMessage(e) {

    if ("" != e.message && " " != e.message) {
        /*      
        var t = document.createElement("div");
        t.className = "user-activity user-activity-left remoteMessageClass", 
        /*t.innerHTML = '<div class="chatusername">' + e.header + "</div>";*/

        var n = document.createElement("div");
        n.className = "user-activity user-activity-left remoteMessageClass";
        //t.appendChild(n), 
        n.innerHTML= e.message, 
        //$("#all-messages").append(n),
        /*      
        $("#all-messages").scrollTop($("#all-messages")[0].scrollHeight) */
        document.getElementById("all-messages").insertBefore(n, document.getElementById("all-messages").firstChild);
    }
}

function addNewMessagelocal(e) {

    if ("" != e.message && " " != e.message) {
/*      var t = document.createElement("div");
        t.className = "user-activity user-activity-right localMessageClass", 
        t.innerHTML = '<div class="chatusername">' + e.header + "</div>";
*/
        var n = document.createElement("div");
        n.className = "user-activity user-activity-right localMessageClass", 
        
        //t.appendChild(n), 
        n.innerHTML= e.message, 
        //$("#all-messages").append(n), 
       /* $("#all-messages").scrollTop($("#all-messages")[0].scrollHeight) */
       document.getElementById("all-messages").insertBefore(n, document.getElementById("all-messages").firstChild);
    }
}

function sendChatMessage(){
    var msg=document.getElementById("chatInput").value;
    addNewMessagelocal({
                header: rtcMultiConnection.extra.username,
                message: msg,
                userinfo: getUserinfo(rtcMultiConnection.blobURLs[rtcMultiConnection.userid], "chat-message.png"),
                color: rtcMultiConnection.extra.color
            });
    rtcMultiConnection.send({type:"chat", message:msg });
    document.getElementById("chatInput").value = "";
}

$("#chatInput").keypress(function(e) {
    if (e.keyCode == 13) {
        sendChatMessage();
    }
})

$('#send').click( function() {
    sendChatMessage();
    return false; 
});

//$('#chatbox').height($( "#leftVideo" ).height());
$('#chatbox').css('max-height', $( "#leftVideo" ).height()+ 80);
$('#chatBoard').css('max-height', $( "#leftVideo" ).height());
$("#chatBoard").css("overflow-y" , "scroll");

/***************************************************************88
File sharing 
******************************************************************/

/*$('#file').onchange = function() {
    alert("file onchange");
    var file = this.files[0];
    rtcMultiConnection.send(file);
};*/
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

var progressHelper = {};
var fileArray1=[] , fileArray2=[] ;

rtcMultiConnection.onFileStart = function(e) {
    addNewFileLocal({
        header: 'User local',
        message: 'File shared',
        userinfo: getUserinfo(rtcMultiConnection.blobURLs[rtcMultiConnection.userid], "images/share-files.png"),
        callback: function(r) {        }
    });

    if(localUserId==e.userid){
        var n = document.createElement("div");
        n.title = e.name,
        n.id = e.uuid+e.name,
        n.setAttribute("class", "fileBoxClass"),
        n.innerHTML = "<label>0%</label><progress></progress>", 
        document.getElementById("widget-filesharing1").appendChild(n),              
        progressHelper[e.uuid] = {
            div: n,
            progress: n.querySelector("progress"),
            label: n.querySelector("label")
        }, 
        progressHelper[e.uuid].progress.max = e.maxChunks
    }else{
        var n = document.createElement("div");
        n.title = e.name, 
        n.id = e.uuid+e.name,
        n.setAttribute("class", "fileBoxClass"),
        n.innerHTML = "<label>0%</label><progress></progress>", 
        document.getElementById("widget-filesharing2").appendChild(n),              
        progressHelper[e.uuid] = {
            div: n,
            progress: n.querySelector("progress"),
            label: n.querySelector("label")
        }, 
        progressHelper[e.uuid].progress.max = e.maxChunks        
    }

}, 

rtcMultiConnection.onFileProgress = function(e) {
    var r = progressHelper[e.uuid];
    r && (r.progress.value = e.currentPosition || e.maxChunks || r.progress.max, updateLabel(r.progress, r.label))
}, 


rtcMultiConnection.onFileEnd = function(e) {
    if (!progressHelper[e.uuid]) 
        return void console.error("No such progress-helper element exists.", e);

    if(localUserId==e.userid){
        fileArray1.push(e.name);
        var numFile= document.createElement("div");
        numFile.value= fileArray1.length;

        displayList(e.uuid ,  "widget-filesharing-container1" ,e.url , e.name , e.type , fileArray1.length);
        displayFile(e.uuid , "widget-filesharing-container1" , e.url , e.name , e.type);
    }
    else{
        fileArray2.push(e.name);
        var numFile= document.createElement("div");
        numFile.value= fileArray2.length;

        displayList(e.uuid ,  "widget-filesharing-container2" , e.url , e.name  , e.type , fileArray2.length);
        displayFile(e.uuid , "widget-filesharing-container2" , e.url , e.name , e.type);
    }    

};

function displayList(uuid , element , fileurl , filename , filetype , length){
    var r;
    if(filetype!="imagesnapshot"){
        r = progressHelper[uuid].div;
    }else{
        r=document.createElement("div");
        document.getElementById(element).appendChild(r);
        /*
        if(localUserId==rtcMultiConnection.userid){
            document.getElementById("widget-filesharing1").appendChild(r);           
        }else{
            document.getElementById("widget-filesharing2").appendChild(r);                 
        }*/
        
    }

    var name = document.createElement("div");
    name.innerHTML = length +"   " + filename ;
    name.id="name"+filename;
    var elementPeer=null;

    if(element=="widget-filesharing-container1"){
        elementPeer="widget-filesharing-container2";
    }else if(element== "widget-filesharing-container2"){
        elementPeer="widget-filesharing-container1"
    }

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
            showFile(uuid , element , fileurl , filename , filetype);
            rtcMultiConnection.send({
                type:"shareFileShow", 
                _uuid: uuid , 
                _element: elementPeer,
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
            hideFile(uuid , element , fileurl , filename , filetype);
            rtcMultiConnection.send({
                type:"shareFileHide", 
                _uuid: uuid , 
                _element: elementPeer,
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
            element = event.target.parentNode.id;
            console.log("about to be hidden ", filename);
            document.getElementById("hideButton"+filename).click();
            removeFile(element);
            rtcMultiConnection.send({
                type:"shareFileRemove", 
                _element: element,
                _filename : filename
            });  
            repeatFlagRemoveButton=filename;
        }else if(repeatFlagRemoveButton == filename){
            repeatFlagRemoveButton= "";
        }  
        
    };

    r.innerHTML="";
    r.appendChild(name);
    r.appendChild(downloadButton);
    r.appendChild(showButton);
    r.appendChild(hideButton);
    r.appendChild(removeButton);
}

function displayFile( uuid , element , fileurl , filename , filetype ){
    
    var r;
    if(filetype!="imagesnapshot"){
        r = progressHelper[uuid].div;
    }else{
        r=document.createElement("div");

        if(localUserId==rtcMultiConnection.userid){
            document.getElementById("widget-filesharing1").appendChild(r);           
        }else{
            document.getElementById("widget-filesharing2").appendChild(r);                 
        }
    }


    var image= document.createElement("img");
    image.src= fileurl;
    image.style.width="100%";
    image.title=filename;
    image.id= "display"+filename;

    var iframe= document.createElement("iframe");
    iframe.src= fileurl;
    iframe.className= "viewerIframeClass";
    iframe.title= filename;
    iframe.id= "display"+filename;


    if(filetype.indexOf("msword")>-1 || filetype.indexOf("officedocument")>-1) {
        var divNitofcation= document.createElement("div");
        divNitofcation.className="alert alert-warning";
        divNitofcation.innerHTML= "Microsoft and Libra word file cannt be opened in browser";
        document.getElementById(element).innerHTML="";
        document.getElementById(element).appendChild(divNitofcation);
        return;
    }else{
        $("#"+element).html( 
            (filetype.indexOf("image")>-1) ? image : iframe  , 
            setTimeout(function() {
                r = r.parentNode.parentNode.parentNode
            }, 10)
        );
    }
}

function showFile( uuid , element , fileurl , filename , filetype ){

    var image= document.createElement("img");
    image.src= fileurl;
    image.style.width="100%";
    image.title=filename;
    image.id= "display"+filename;

    var iframe= document.createElement("iframe");
    iframe.src= fileurl;
    iframe.className= "viewerIframeClass";
    iframe.title= filename;
    iframe.id= "display"+filename;

    console.log("filetype" , filetype);

    if(filetype.indexOf("msword")>-1 || filetype.indexOf("officedocument")>-1) {
        var divNitofcation= document.createElement("div");
        divNitofcation.className="alert alert-warning";
        divNitofcation.innerHTML= "Microsoft and Libra word file cannt be opened in browser";
        document.getElementById(element).innerHTML="";
        document.getElementById(element).appendChild(divNitofcation);
        return;
    }else{
        $("#"+element).html( (filetype.indexOf("image")>-1 )? image : iframe );
    } 
}

function hideFile( uuid , element , fileurl , filename , filetype ){
    if($("#"+element).has("#display"+filename)){
        $("#"+element).html("");
    }
}

function removeFile(element){
    document.getElementById(element).hidden=true;
}

function closeFV(id){
    document.getElementById(id).innerHTML="";
}

function minFV(){
    document.getElementById("filesharing1Box").hidden=false;
    document.getElementById("filesharing2Box").hidden=false;

    document.getElementById("filesharing1Box").style.width="50%";
    document.getElementById("filesharing2Box").style.width="50%";
}

function maxFV(id){
    if(id=="filesharing1Box"){
        document.getElementById("filesharing1Box").hidden=false;
        document.getElementById("filesharing1Box").style.width="100%";
        document.getElementById("filesharing2Box").hidden=true;
    }else if( id=="filesharing2Box"){
        document.getElementById("filesharing2Box").hidden=false;
        document.getElementById("filesharing2Box").style.width="100%";
        document.getElementById("filesharing1Box").hidden=true;
    }
}

$( "#closeButton1" ).click(function() {
  closeFV("widget-filesharing-container1");
});

$( "#closeButton2" ).click(function() {
  closeFV("widget-filesharing-container2");
});
/*document.getElementById("closeButton1").onclick=function(){
    closeFV("widget-filesharing-container1");
};

document.getElementById("closeButton2").onclick=function(){
   closeFV("widget-filesharing-container2");
};*/

$( "#minButton1" ).click(function() {
  minFV();
});
$( "#minButton2" ).click(function() {
  minFV();
});
$( "#maxButton1" ).click(function() {
  maxFV("filesharing1Box");
});
$( "#maxButton2" ).click(function() {
  maxFV("filesharing2Box");
});
/*document.getElementById("minButton1").onclick=function(){
    console.log(" minButton1");
    minFV();
};

document.getElementById("minButton2").onclick=function(){
    console.log(" minButton2");
    minFV();
};

document.getElementById("maxButton1").onclick=function(){
    console.log(" maxButton1");
    maxFV("filesharing1Box");
};

document.getElementById("maxButton2").onclick=function(){
    console.log(" maxButton2");
    maxFV("filesharing2Box");
};*/
/**************************************************************************8
draw 
******************************************************************************/
try{
    CanvasDesigner.addSyncListener(function(data) {
        rtcMultiConnection.send({type:"canvas", draw:data});
    });

    CanvasDesigner.setSelected('pencil');

    CanvasDesigner.setTools({
        pencil: true,
        eraser: true
    });

    CanvasDesigner.appendTo(document.getElementById('widget-container'));
}catch( e){
    $("#drawButton").hide();
    console.log(" Canvas drawing not supported ");
    console.log(e);
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

document.getElementById("reconnectButton").addEventListener("click", function(){
    var r = confirm("Do you want to reconnet ?");
    if (r == true) {
       location.reload();
    } else {
       //do nothing
    }
});

/****************************************8
screenshare
***************************************/
 var screen;
try{
    screen = new Screen("screen"+rtcMultiConnection.channel);

    // get shared screens
    screen.onaddstream = function(e) {
        //document.body.appendChild(e.video);
        console.log("screen video ",e);
        document.getElementById("screenshare").innerHTML="";
        document.getElementById("screenshare").appendChild(e.video);
        document.getElementById("screenshare").hidden=false;
        
        screen.openSignalingChannel = function(callback) {
            //return io.connect().on('message', callback);
            //alert( " screen open signalling "+ rtcMultiConnection.channel);
            var n= io.connect("/"+rtcMultiConnection.channel);
            n.channel = t;
            return n.on('message', callback);
        };
    };

    screen.check();

    // to stop sharing screen
    // screen.leave();

    // if someone leaves; just remove his video
    screen.onuserleft = function(userid) {
        document.getElementById("screenshare").hidden=true;
        /*       
        var video = document.getElementById(userid);
        if(video) {
           // video.parentNode.removeChild(video);
        }*/
    };


    screen.onscreen = function(screen) {
        console.log( " onscreen " , screen );
        if (self.detectedRoom) return;
        self.detectedRoom = true;
        self.view(screen);
    };

}catch(e){
    console.log("------------screenshare not supported ");
    $("#screenShareButton").hide();
    $("#viewScreenShareButton").hide();
    console.log(e);
}


var isScreenOn=0;
document.getElementById('screenShareButton').onclick = function() {
    if(isScreenOn==0){
        screen.share('screenShareVilageExperts');
        isScreenOn=1;
    }else if(isScreenOn ==1){
        screen.leave();
        isScreenOn=0;
    }
};

var screen_roomid , screen_userid;

document.getElementById('viewScreenShareButton').onclick = function() {
    screen.view({roomid:screen_roomid , userid:screen_userid});
};
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

/***************************************************************
Canvas Record 
*************************************************************************/
var elementToShare = document.getElementById('elementToShare');
var recorder = new CanvasRecorder(elementToShare, {
    disableLogs: false
});
document.getElementById('start').onclick = function() {
    document.getElementById('start').disabled = true;

    playVideo(function() {
        recorder.record();    
        setTimeout(function() {
            document.getElementById('stop').disabled = false;
        }, 1000);
    });
};
document.getElementById('stop').onclick = function() {
    this.disabled = true;
    recorder.stop(function(blob) {
        var video = document.createElement('video');
        video.src = URL.createObjectURL(blob);
        video.setAttribute('style', 'height: 100%; position: absolute; top:0;');
        document.body.appendChild(video);
        video.controls = true;
        video.play();
    });
};
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

    navigator.mediaDevices.getUserMedia(mediaConstraints).then(successCallback).catch(errorCallback);
}
/******************************************************************************/

$('document').ready(function(){
  startcall();
});
