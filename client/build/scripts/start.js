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
var n="tara181989@gmail.com";

var usersList       = document.getElementById("userslist");
var numbersOfUsers  = document.getElementById("numbersofusers");
var usersContainer  = document.getElementById("usersContainer");

var localUserId=null , remoteUserId=null;



var card = document.getElementById('card');
var containerDiv;
var main = document.querySelector('#main');
var smaller = document.querySelector('#smaller');
var webcallpeers=[];


// DOM objects
var localVideo =null, miniVideo=null, remoteVideos=[];

var WebRTCdom= function(  _local , _remotearr ){
    localVideo = document.getElementsByName(_local)[0];
    miniVideo = document.getElementsByName(_remotearr[0])[0];
    for(var x=1;x<_remotearr.length;x++){
        remoteVideos.push(document.getElementsByName(_remotearr[x])[0]);
    }
    console.log(" remoteVideos " , remoteVideos)
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

function waitForRemoteVideo(_remoteStream , _remoteVideo , _localVideo  , _miniVideo ) {
    // Call the getVideoTracks method via adapter.js.
    console.log(" _remoteStream" , _remoteStream);
    console.log(" _remoteVideo" , _remoteVideo);

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
    setTimeout(function() {
        _localVideo.src = '';
    }, 500);
    setTimeout(function() {
        _miniVideo.style.opacity = 1;
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

var incomingAudio =true , incomingVideo =true , incomingData = true;
var outgoingAudio =true , outgoingVideo =true , outgoingData = true;
var chat=true , fileShare=true ,  screenrecord=true , screenshare =true;
var role="participant";

var WebRTCdev= function( 
    _incomingAudio , _incomingVideo , _incomingData,
    _outgoingAudio, _outgoingVideo , _outgoingData,
    _chat , _fileShare ,  _screenrecord , _screenshare
    ){

    incomingAudio = _incomingAudio , 
    incomingVideo = _incomingVideo , 
    incomingData  = _incomingData
    outgoingAudio = _outgoingAudio, 
    outgoingVideo = _outgoingVideo , 
    outgoingData  = _outgoingData,
    chat          = _chat , 
    fileShare     = _fileShare , 
    screenrecord  = _screenrecord , 
    screenshare   = _screenshare

}


/************************ audio video from URL  ***************************************/
var searchParams = new URLSearchParams(window.location);

if(searchParams.get('audio')=="0"){
    outgoingAudio=false;
}

if(searchParams.get('video')=="0"){
    outgoingVideo=false;
}

if(searchParams.get('role')){
    role=searchParams.get('role')
}

/************************ validating role
admin
participant
inspector
viewer
broadcaster
debugger
***************************************/
switch(role){
    case "inspector":
        $("#local").hide();
        $("#remote").show(); 
        $("button").prop('disabled', false);
    break;
    default:
        console.log("Role ", role);
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

var tempc = location.href.replace(/\/|:|#|\?|\$|\^|%|\.|`|~|!|\+|@|\[|\||]|\|*. /g, '').split('\n').join('').split('\r').join('');
if(role=="inspector"){
    tempc=tempc.substring(0,tempc.indexOf("appname") );
}
rtcMultiConnection.channel=tempc;

rtcMultiConnection.preventSSLAutoAllowed = false;
rtcMultiConnection.autoReDialOnFailure = true;
rtcMultiConnection.setDefaultEventsForMediaElement = false;

rtcMultiConnection.session = {
    video: incomingVideo,
    audio: incomingAudio,
    data:  incomingData
}, 

rtcMultiConnection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: !0,
    OfferToReceiveVideo: !0
}, 

rtcMultiConnection.customStreams = {}, 

rtcMultiConnection.autoCloseEntireSession = !1, 

rtcMultiConnection.autoTranslateText = !1, 

rtcMultiConnection.maxParticipantsAllowed = 4, 

rtcMultiConnection.setDefaultEventsForMediaElement = !1; 

rtcMultiConnection.blobURLs = {};

console.log(rtcMultiConnection);

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

var islocalStream = 1;

/* *************************************8
Snapshot
************************************************/

function syncSnapshot(datasnapshot , datatype , dataname ){
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
var arrFilesharingBoxes=[];

function attachFilesharingButtons(i , 
    listContainerName , shareContainerName , shareBoxName,
    minbuttonName , maxButtonName, closeButtonName
    ){
        document.getElementsByName(listContainerName)[0].id=webcallpeers[i].fileListContainer;
        document.getElementsByName(shareContainerName)[0].id=webcallpeers[i].fileSharingContainer;  
        document.getElementsByName(shareBoxName)[0].id=webcallpeers[i].fileSharingSubContents.fileSharingBox;

        var minButton=document.getElementsByName(minbuttonName)[0];
        minButton.id=webcallpeers[i].fileSharingSubContents.minButton;
        minButton.setAttribute("lastClickedBy" ,'');
        minButton.onclick=function(){
            resizeFV(webcallpeers[i].userid, minButton.id , arrFilesharingBoxes);
        }
        
        var maxButton=document.getElementsByName("maxButton1")[0];
        maxButton.id=webcallpeers[i].fileSharingSubContents.maxButton;
        maxButton.setAttribute("lastClickedBy" ,'');
        maxButton.onclick=function(){
            maxFV(webcallpeers[i].userid, maxButton.id , arrFilesharingBoxes , webcallpeers[i].fileSharingSubContents.fileSharingBox);
        }

        var closeButton =document.getElementsByName("closeButton1")[0];
        closeButton.id=webcallpeers[i].fileSharingSubContents.closeButton;
        closeButton.setAttribute("lastClickedBy" ,'');
        closeButton.onclick=function(){
            closeFV(webcallpeers[i].userid, closeButton.id , webcallpeers[i].fileSharingContainer);
        }
}

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
        snapshotButton.innerHTML="Snapshot";
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
        recordButton.className="pull-right glyphicon glyphicon-facetime-video btn btn-default mediaButton";
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
        //controlBar.setAttribute("style" , "-webkit-transform: rotateY(180deg)");

        videoElement.parentNode.appendChild(controlBar);        
}

var localStream , localStreamId, remoteStream , remoteStreamId;

function updateWebCallView(peerInfo){
    console.log(" webcallpeers -----------" , webcallpeers);

    if(peerInfo.name=="localVideo"){

        localStream     =   webcallpeers[0].stream;
        localStreamId   =   webcallpeers[0].streamid ;

        $("#local").show();
        $("#remote").hide();

        attachMediaStream(localVideo, webcallpeers[0].stream);
        localVideo.muted = true;
        localVideo.id= webcallpeers[0].userid;
        localVideo.style.opacity = 1;

        attachControlButtons(localVideo , 
            webcallpeers[0].streamid ,
            webcallpeers[0].controlBarName,
            webcallpeers[0].fileSharingContainer);
    }else if(peerInfo.name=="remoteVideo") {
        numpeers= webcallpeers.length;

        $("#local").hide();
        $("#remote").show();
        
        remoteStream=webcallpeers[numpeers-1].stream;

        for(x  in webcallpeers)
            arrFilesharingBoxes.push(webcallpeers[x].fileSharingSubContents.fileSharingBox);

        if(miniVideo.played.length==0 && outgoingVideo){
            //transfer video controls from local video to minivideoelement
            reattachMediaStream(miniVideo, localVideo);
            miniVideo.id=webcallpeers[0].videoContainer;
            miniVideo.muted =   true;
            if( typeof videoWidth!='undefined' ){
                miniVideo.setAttribute("width",videoWidth);
            }
            //if(miniVideo.parentNode.querySelector("#"+webcallpeers[0].controlBarName)!=null){
            attachControlButtons(miniVideo, 
                webcallpeers[0].streamid ,
                webcallpeers[0].controlBarName,
                webcallpeers[0].fileSharingContainer); 

            if(fileShare)
                attachFilesharingButtons( 0,
                    "widget-filelisting-container1", "widget-filesharing-container1" ,"filesharing1Box" ,
                     "minButton1", "maxButton1" , "closeButton1" ); 
        }
        console.log("remoteVideos---- " , remoteVideos , (numpeers-2) , remoteVideos[numpeers-2]);
        attachMediaStream(remoteVideos[numpeers-2], webcallpeers[numpeers-1].stream);
        waitForRemoteVideo(remoteStream , remoteVideos[numpeers-2] , localVideo  , miniVideo );
        
        if( typeof videoWidth!='undefined' ){
            remoteVideos[numpeers-2].setAttribute("width",videoWidth);
        }

        if(!$("#"+webcallpeers[numpeers-1].controlBarName).length){
            attachControlButtons(remoteVideos[numpeers-2], 
                webcallpeers[numpeers-1].streamid ,
                webcallpeers[numpeers-1].controlBarName,
                webcallpeers[numpeers-1].fileSharingContainer);
        }

        if(fileShare)
            attachFilesharingButtons( numpeers-1,
                "widget-filelisting-container"+numpeers, "widget-filesharing-container"+numpeers ,"filesharing"+numpeers+"Box" ,
                 "minButton"+numpeers, "maxButton"+numpeers, "closeButton"+numpeers ); 

    }
}

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
};

var whoIsTyping = document.querySelector("#who-is-typing");
var repeatFlagShowButton =null, repeatFlagHideButton =null, repeatFlagRemoveButton=null ;

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
                console.log(" unrecognizable message from peer  ",e);
            break;

        }

    } 
    return;
};

var sessions = {};
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
    
    //webcallpeers.pop();
    //    $("#" + e.userid).remove(), 

    shownotification(e.extra.username + " left the conversation.");
    //rtcMultiConnection.playRoleOfInitiator()
    for(x in webcallpeers){
        if(webcallpeers[x].userid=e.userid)
            webcallpeers.splice(x,1);
    }
};


/********************************************************************************** 
		Session call 
************************************************************************************/
// connecting to signaling medium
// rtcMultiConnection.connect();

opneWebRTC=function(){
    alert("open webrtc ");
    shownotification("Making a new session ");
    rtcMultiConnection.open();

        socket.emit("new-channel", {
            channel: rtcMultiConnection.channel,
            sender: rtcMultiConnection.userid
        });
}

joinWebRTC=function(){
    alert("join webrtc ");
    shownotification("Joing an existing session ");
    rtcMultiConnection.join();

        socket.emit("join-channel", {
            channel: rtcMultiConnection.channel,
            sender: rtcMultiConnection.userid
        });
}

function startcall() {
    //rtcMultiConnection.open();
     
    rtcMultiConnection.extra = {
        username: t,
        color: "ffffff",
        useredisplayListmail: n
    };

    var o = "/";
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
        alert("openSignalingChannel");

        var t = e.channel || this.channel;
        console.log("Channel ----------" ,t);

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
    $("#"+element).html(getFileElementDisplayByType(filetype , fileurl , filename));
}


function syncButton(buttonId){
    var buttonElement= document.getElementById(buttonId);
    console.log(buttonElement.getAttribute("lastClickedBy") , (buttonElement.getAttribute("lastClickedBy")!=rtcMultiConnection.userid) , buttonElement.getAttribute("lastClickedBy")!='' );

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
        console.log("Synced with peer " , buttonElement.getAttribute("lastClickedBy"));
    }
}

/* ************* file Listing container button functions --------------- */

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

/*
function downloadVideoScreenRecording(fileurl , filename){
      return  document.getElementById("display"+filename).src;
}
*/

var downloadVideoScreenRecording = (function (fileurl, filename ) {
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
                        webcallpeers[i].filearray.push(recordVideoname);
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

$("#inspectorlink").val(window.location+'?appname=webrtcwebcall&role=inspector&audio=0&video=0');
$("#channelname").val(rtcMultiConnection.channel);
$("#userid").val(rtcMultiConnection.userid);

$("#isAudio").val(rtcMultiConnection.session.audio);
$("#isVideo").val(rtcMultiConnection.session.video);
$("#isData").val(rtcMultiConnection.session.data);

$("#btnGetPeers").click(function(){
   // $("#alllpeerinfo").html(JSON.stringify(webcallpeers,null,6));
   $("#alllpeerinfo").empty();
/*   for(x in webcallpeers){
        $("#allpeerinfo").append( webcallpeers[x].userid+" "+webcallpeers[x].videoContainer)
        $("#allpeerinfo").append('<br/>');
   }*/

   $('#allpeerinfo').append('<pre contenteditable>'+JSON.stringify(webcallpeers, null, 2)+'<pre>');
});

$("#btnDebug").click(function(){
    //window.open().document.write('<pre>'+rtcMultiConnection+'<pre>');
    $("#allwebrtcdevinfo").empty();
    $('#allwebrtcdevinfo').append('<pre contenteditable>'+rtcMultiConnection+'<pre>');
});

function getAllPeerInfo(){
    console.log(webcallpeers);
}


/******************************************************************************/
