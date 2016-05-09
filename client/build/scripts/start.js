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
var localVideo = document.getElementsByName('localVideo')[0];
var miniVideo = document.getElementsByName('miniVideo')[0];
var remoteVideo = document.getElementsByName('remoteVideo')[0];

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

var audio=!0 , video =!0 , data =!0;
var outgoingAudio =!0 , outgoingVideo=!0;

/************************ audio video ***************************************/
var searchParams = new URLSearchParams(window.location);
console.log(searchParams.get('audio'),searchParams.get('video')) ;

if(searchParams.get('audio')==0){
    outgoingAudio=0;
}

if(searchParams.get('video')==0){
    outgoingVideo=0;
}

if(searchParams.get('role')){
    console.log(role);
}
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
    video: video,
    audio: audio,
    data:  data
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
        
        if(outgoingAudio!=0 && outgoingVideo!=0)
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
    //uuid , userid , fileurl , filename , filetype , length
    rtcMultiConnection.send({
        type:datatype, 
        message:datasnapshot  , 
        name : dataname});

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
function attachControlButtons(videoElement, streamid , controlBarName , snapshotViewer){

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
                for(i in webcallpeers ){
                    if(webcallpeers[i].userid==rtcMultiConnection.userid){
                        var snapshotname = "snapshot"+ new Date().getTime();
                        webcallpeers[i].filearray.push(snapshotname);
                        var numFile= document.createElement("div");
                        numFile.value= webcallpeers[i].filearray.length;

                        syncSnapshot(datasnapshot , "imagesnapshot" , snapshotname );
                        displayList(rtcMultiConnection.uuid , rtcMultiConnection.userid ,datasnapshot , snapshotname , "imagesnapshot");
                        displayFile(rtcMultiConnection.uuid , rtcMultiConnection.userid, datasnapshot , snapshotname, "imagesnapshot");
                    }
                }
            });         
        };

        //add the Record button
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
                recordButton.innerHTML=" Stop ";
                rtcMultiConnection.streams[streamid].startRecording({
                    audio: true,
                    video: true
                });
            }else if(recordButton.innerHTML==" Stop "){
                recordButton.innerHTML=" Record ";
                rtcMultiConnection.streams[streamid].stopRecording(function (dataRecordedVideo) {
                    for(i in webcallpeers ){
                        if(webcallpeers[i].userid==rtcMultiConnection.userid){
                            var recordVideoname = "recordedvideo"+ new Date().getTime();
                            webcallpeers[i].filearray.push(recordVideoname);
                            var numFile= document.createElement("div");
                            numFile.value= webcallpeers[i].filearray.length;

                            syncSnapshot(dataRecordedVideo , "videoRecording" , recordVideoname );
                            displayList(rtcMultiConnection.uuid , rtcMultiConnection.userid  ,dataRecordedVideo , recordVideoname , "videoRecording");
                            displayFile(rtcMultiConnection.uuid , rtcMultiConnection.userid , dataRecordedVideo , recordVideoname, "videoRecording");

                        }
                    }
                }, {audio:true, video:true} );
            }
        };    


        var controlBar= document.createElement("div");
        controlBar.id=controlBarName;
        controlBar.setAttribute("style" , "float:left;margin-left: 20px;");
        controlBar.name= streamid;
        controlBar.appendChild(videoButton);
        controlBar.appendChild(audioButton);
        controlBar.appendChild(snapshotButton);
        controlBar.appendChild(recordButton);
        controlBar.setAttribute("style" , "-webkit-transform: rotateY(180deg)");

        videoElement.parentNode.appendChild(controlBar);        
}

var localStream , localStreamId, remoteStream , remoteStreamId;

function updateWebCallView(){
    console.log(" webcallpeers" , webcallpeers);

    if(webcallpeers.length==1){

        localStream     =   webcallpeers[0].stream;
        localStreamId   =   webcallpeers[0].streamid ;

        $("#localVideo").show();
        $("#remote").hide();
        $("#controlremoteVideo").hide();
        $("#controlminiVideo").hide();

        attachMediaStream(localVideo, webcallpeers[0].stream);
        localVideo.muted = true;
        localVideo.id= webcallpeers[0].userid;
        localVideo.style.opacity = 1;

        attachControlButtons(localVideo , 
            webcallpeers[0].streamid ,
            webcallpeers[0].controlBarName,
            webcallpeers[0].fileSharingContainer);

        $("#widget-filesharing1").attr("name" , webcallpeers[0].userid);

    }else {

        $("#local").hide();
        $("#localVideo").hide();
        $("#controllocalVideo").hide();
        $("#remote").show();

        remoteStream    =   webcallpeers[0].stream;
        
        if(miniVideo.played.length==0){
            
            //gtransfer video controls from local video to minivideo
            reattachMediaStream(miniVideo, localVideo);
            miniVideo.id=webcallpeers[0].videoContainer;
            miniVideo.muted =   true;
/*          miniVideo.setAttribute('data-id', webcallpeers[0].userid);*/
            if( typeof videoWidth!='undefined' ){
                miniVideo.setAttribute("width",videoWidth);
            }

            //if(miniVideo.parentNode.querySelector("#"+webcallpeers[0].controlBarName)!=null){
            attachControlButtons(miniVideo, 
                webcallpeers[0].streamid ,
                webcallpeers[0].controlBarName,
                webcallpeers[0].fileSharingContainer); 


            document.getElementsByName("widget-filelisting-container1")[0].id=webcallpeers[0].fileListContainer;
            document.getElementsByName("widget-filesharing-container1")[0].id=webcallpeers[0].fileSharingContainer;  
        }

        attachMediaStream(remoteVideo, webcallpeers[webcallpeers.length-1].stream);
        waitForRemoteVideo();
        remoteVideo.setAttribute('data-id', webcallpeers[webcallpeers.length-1].userid);
        if( typeof videoWidth!='undefined' ){
            miniVideo.setAttribute("width",videoWidth);
        }

        if(!$("#controlremotevideo").length){
            attachControlButtons(remoteVideo, 
                webcallpeers[webcallpeers.length-1].streamid ,
                webcallpeers[webcallpeers.length-1].controlBarName,
                webcallpeers[webcallpeers.length-1].fileSharingContainer);
        }

        document.getElementsByName("widget-filelisting-container2")[0].id=webcallpeers[webcallpeers.length-1].fileListContainer;
        document.getElementsByName("widget-filesharing-container2")[0].id=webcallpeers[webcallpeers.length-1].fileSharingContainer;
        
        //$("widget-filesharing2").attr("name" , webcallpeers[webcallpeers.length-1].userid);
        
        if( typeof videoWidth!='undefined' ){
            remoteVideo.setAttribute("width",videoWidth);
        }
    }
}

rtcMultiConnection.onstream = function(e) {

    if (e.type == 'local') {
        console.log("LocalStream ------------",e  );
        webcallpeers.push({ 
            name : "localVideo",
            videoContainer : "video"+e.userid,
            videoHeight : null,
            videoClassName: null,
            uuid: e.uuid,
            userid : e.userid , 
            stream : e.stream ,
            streamid : e.stream.streamid , 
            fileSharingContainer : "widget-filesharing-container"+e.userid,
            fileListContainer : "widget-filelisting-container"+e.userid,
            controlBarName: "control-video"+e.userid,
            filearray : []
        });
    }

    if (e.type == 'remote'){
        console.log("Remote ------------", e );
        webcallpeers.push({ 
            name : "remoteVideo",
            videoContainer : "video"+e.userid,
            videoHeight : null,
            videoClassName: null,
            uuid : e.uuid,
            userid:  e.userid , 
            stream : e.stream ,
            streamid : e.stream.streamid , 
            fileSharingContainer : "widget-filesharing-container"+e.userid,
            fileListContainer : "widget-filelisting-container"+e.userid,
            controlBarName: "control-video"+e.userid,
            filearray: []
        }); 
    }
    
    updateWebCallView();
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
        displayList( null , e.userid , e.data.message , e.data.name , "imagesnapshot" );
        displayFile( null , e.userid , e.data.message , e.data.name , "imagesnapshot");
    }else if(e.data.type=="videoScreenRecording"){
        displayList( null , e.userid , e.data.message , e.data.name , "imagesnapshot" );
        displayFile( null , e.userid , e.data.message , e.data.name , "imagesnapshot");
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
    
    webcallpeers.pop();

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
        useredisplayListmail: n
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
        n.on("disconnect", "datalost");
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
    console.log(" on File End " , e.userid);

    for(i in webcallpeers ){
        if(webcallpeers[i].userid==e.userid){

            webcallpeers[i].filearray.push(e.name);
            var numFile= document.createElement("div");
            numFile.value= webcallpeers[i].filearray.length;

            displayList(e.uuid , webcallpeers[i].userid , e.url , e.name , e.type);
            displayFile(e.uuid , webcallpeers[i].userid , e.url , e.name , e.type);
       
        }
    }
};

function simulateClick(buttonName){
    document.getElementById(buttonName).click(); 
    console.log(buttonName);
    return true;
}

function displayList(uuid , userid , fileurl , filename , filetype ){

    var element , elementPeer , listlength;
    for(i in webcallpeers ){
        if(webcallpeers[i].userid==userid){
           element=webcallpeers[i].fileListContainer;
           listlength=webcallpeers[i].filearray.length;
        }
        else
            elementPeer= webcallpeers[i].fileListContainer;
    }
    console.log(element , " || ", elementPeer);

    var name = document.createElement("div");
    name.innerHTML = listlength +"   " + filename ;
    name.id="name"+filename;

    var downloadButton = document.createElement("div");
    downloadButton.setAttribute("class" , "btn btn-primary");
    downloadButton.setAttribute("style", "color:white");
    if(filetype=="videoScreenRecording"){
        downloadButton.innerHTML='Download';
        downloadButton.onclick=function(){
            downloadVideoScreenRecording(URL.createObjectURL(fileurl), filename+"webm");
        };
    }else{
        downloadButton.innerHTML='<a href="' +fileurl + '" download="' + filename + '" style="color:white" > Download </a>';
    }

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
            hideFile(uuid , element , fileurl , filename , filetype);
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

    switch(filetype) {
        
        case "imagesnapshot":
            r=document.createElement("div");
            r.id=filename;
            document.getElementById(element).appendChild(r);
        break;
        case "videoRecording":
            r=document.createElement("div");
            r.id=filename;  
            document.getElementById(element).appendChild(r);         
        break;
        case "videoScreenRecording":
            r=document.createElement("div");
            r.id=filename;  
            document.getElementById(element).appendChild(r);         
        break;
        default:
            r = progressHelper[uuid].div;
    }
/*    if(filetype=="imagesnapshot" || filetype=="videoRecording" || filetype=="videoScreenRecording"){
        r=document.createElement("div");
        r.id=filename;
    }else{
        r = progressHelper[uuid].div;
    }
*/
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
        }else if(filetype.indexOf("video")>-1){
            var video = document.createElement("video");
            if(fileurl.video!=undefined ){
                video.src = URL.createObjectURL(fileurl.video); 
            }else{
                video.src = URL.createObjectURL(fileurl); 
            }
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

function displayFile( uuid , userid , fileurl , filename , filetype ){
    var element;
    for(i in webcallpeers ){
        if(webcallpeers[i].userid==userid)
           element=webcallpeers[i].fileSharingContainer;
    }

    /*
    var r;
    if(filetype!="imagesnapshot" && filetype!="videoRecording" && filetype!="videoScreenRecording"){
        r = progressHelper[uuid].div;
    }else{
        r=document.createElement("div");
        document.getElementById(element).appendChild(r);
    //}*/

    $("#"+element).html( 
        getFileElementDisplayByType(filetype , fileurl , filename)
        /*
        setTimeout(function() {
            r = r.parentNode.parentNode.parentNode
        }, 10)*/
    );

}


function showFile( uuid , element , fileurl , filename , filetype ){
    $("#"+element).html( getFileElementDisplayByType(filetype , fileurl , filename));
}

function hideFile( uuid , element , fileurl , filename , filetype ){
    if($("#"+element).has("#display"+filename)){
        $("#"+element).html("");
        element.innerHTML="";
        console.log("hidefile " ,filename , " from " , element);
    }else{
        console.log(" file is not displayed to hide  ");
    }

}

function removeFile(element){
    console.log("removeFile " ,element);
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

/*
document.getElementById("closeButton1").onclick=function(){
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
        document.getElementById("screenshare").innerHTML="";
        document.getElementById("screenshare").appendChild(e.video);
        document.getElementById("screenshare").hidden=false;
        
        screen.openSignalingChannel = function(callback) {
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

/************************************************************************
Canvas Record 
*************************************************************************/
/*function downloadVideoScreenRecording(fileurl , filename){
      return  document.getElementById("display"+filename).src;
}
*/

var downloadVideoScreenRecording = (function (fileurl, filename ) {
    alert(filename , fileurl);
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (data, fileName) {
        var json = JSON.stringify(fileurl),
            blob = new Blob([json], {type: "octet/stream"}),
            url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    };
}());

function syncVideoScreenRecording(data , datatype , dataname ){
    rtcMultiConnection.send({type:datatype, message:data  , name : dataname});
}

try{
    var elementToShare = document.getElementById('elementToShare');
    var recorder = new CanvasRecorder(elementToShare, {
        disableLogs: false
    });

    document.getElementById('ScreenRecordButton').onclick = function() {
        var recordButton= document.getElementById('ScreenRecordButton');
        if(recordButton.innerHTML==" Record "){
            recordButton.innerHTML=" Stop Recording ";
            playVideo(function() {
                recorder.record();    
            });
        }else if(recordButton.innerHTML==" Stop Recording "){
            recordButton.innerHTML=" Record ";
            recorder.stop(function(dataRecordedVideo) {
                for(i in webcallpeers ){
                    if(webcallpeers[i].userid==rtcMultiConnection.userid){
                        var recordVideoname = "recordedScreenvideo"+ new Date().getTime();
                        fileArray1.push(recordVideoname);
                        webcallpeers[i].filearray.push(e.name);
                        var numFile= document.createElement("div");
                        numFile.value= webcallpeers[i].filearray.length;

                        syncVideoScreenRecording(dataRecordedVideo , "videoScreenRecording" , recordVideoname);
                        displayList(rtcMultiConnection.uuid , rtcMultiConnection.userid , dataRecordedVideo, recordVideoname , "videoScreenRecording");
                        displayFile(rtcMultiConnection.uuid , rtcMultiConnection.userid , dataRecordedVideo, recordVideoname , "videoScreenRecording");
                    }
                }
            });
            
        }
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

}catch( e){
    console.error(" Canvas recorder is not defined ");
}

/******************* help and settings ***********************/
$("#settingsContainer").html(
    '<a href='+window.location+'?role=inspector&audio=0&video=0>Inspector View </a>'
);

/******************************************************************************/

$('document').ready(function(){
  startcall();
});
