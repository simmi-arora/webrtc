/**************************************************************
Screenshare 
****************************************************************/
'use strict';
"use strict";
var chromeMediaSource = 'screen';
var sourceId , screen_constraints , screenStreamId;
var isFirefox = typeof window.InstallTrigger !== 'undefined';
var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
var isChrome = !!window.chrome && !isOpera;
var isMobileDevice = !!navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile/i);

var scrConn , screenCallback ;
var iceServers=[];
var signaler,screen,screenRoomid;
var screenShareButton ;
/* getsourceID in RTCmtulconn has been commented to make the below one active */
function getSourceId(callback, audioPlusTab) {
    if (!callback)
        throw '"callback" parameter is mandatory.';
    return sourceId ? (callback(sourceId),
    void (sourceId = null )) : (screenCallback = callback, void window.postMessage("webrtcdev-extension-getsourceId", "*"))
    /*audioPlusTab ? void window.postMessage("audio-plus-tab", "*") : void window.postMessage("webrtcdev-extension-getsourceId", "*"))*/
};

function getChromeExtensionStatus(extensionid, callback) {
    if (2 != arguments.length && (callback = extensionid,
    extensionid = window.RMCExtensionID || "ajhifddimkapgcifgcodmmfdlknahffk"),
    isFirefox)
        return callback("not-chrome");
    var image = document.createElement("img");
    image.src = "chrome-extension://" + extensionid + "/icon.png",
    image.onload = function() {
        chromeMediaSource = "screen",
        window.postMessage("webrtcdev-extension-presence", "*"),
        setTimeout(function() {
            callback("screen" == chromeMediaSource ? extensionid == extensionid ? "installed-enabled" : "installed-disabled" : "installed-enabled")
        }, 2e3)
    }
    ,
    image.onerror = function() {
        callback("not-installed")
    }
}

function isChromeExtensionAvailable(callback) {
    if (callback) {
        if (isFirefox)
            return isFirefoxExtensionAvailable(callback);
        if ("desktop" == chromeMediaSource)
            return callback(!0);
        window.postMessage("webrtcdev-extension-presence", "*"),
        setTimeout(function() {
            callback("screen" == chromeMediaSource ? !1 : !0)
        }, 2e3)
    }
}

function webrtcdevPrepareScreenShare(){
    screenRoomid= "screenshare"+"_"+sessionid;
    scrConn  = new RTCMultiConnection(screenRoomid);
    scrConn.channel=screenRoomid;
    scrConn.sessionid=screenRoomid;
    scrConn.socketURL = socketAddr;
    scrConn.socketMessageEvent = 'screen-sharing-demo';
    scrConn.session = {
        screen: true,
        oneway: true
    };
    scrConn.iceServers=rtcConn.iceServers;
    scrConn.sdpConstraints.mandatory = {
        OfferToReceiveAudio: false,
        OfferToReceiveVideo: true
    };
    scrConn.dontCaptureUserMedia = false;
    scrConn.onstream = function(event) {
        console.log(" on stream in _screenshare :" , event);
        //if(event.stream.isScreen){
            //alert(" scrConn on stream isScreen"+event.type);
            if(event.type=="remote" && event.type!="local"){
                var userid=event.userid;
                var type=event.type;
                var stream=event.stream;
                screenStreamId=event.stream.streamid;

                var video = document.createElement('video');
                video.autoplay="autoplay";
                attachMediaStream(video, stream);
                //video.id = peerInfo.videoContainer;
                document.getElementById(screenshareobj.screenshareContainer).appendChild(video);
            }
            //createScreenViewButton();

            /*scrConn.videosContainer.appendChild(event.mediaElement);
            event.mediaElement.play();
            setTimeout(function() {
                event.mediaElement.play();
            }, 5000);*/
        //}
    };
    scrConn.onstreamended = function(event) {
        if(event)
            console.log(" onstreamended in _screenshare :" , event);
    
        if(document.getElementById(screenshareobj.screenshareContainer))
            document.getElementById(screenshareobj.screenshareContainer).innerHTML="";
        scrConn.removeStream(screenStreamId);
        //scrConn.videosContainer.hidden=true;
        screenShareButton.className=screenshareobj.button.shareButton.class_off;
        screenShareButton.innerHTML=screenshareobj.button.shareButton.html_off;
        //removeScreenViewButton();
    };
}

function webrtcdevSharescreen(roomid) {
    /*    
    if(Object.keys(scrConn.streamEvents).length>2){   
        scrConn.addStream({
            screen: true,
            oneway: true
        });
        shownotification(" ReStarting Screenshare session "+roomid);
        rtcMultiConnection.send({
            type:"screenshare", 
            message:roomid
        });
        return ;
    }*/

    scrConn.dontCaptureUserMedia = false;
    //scrConn.captureUserMedia();
    //scrConn.getUserMedia();
    scrConn.open(screenRoomid, function() {
        shownotification(" Making a new session for screenshare"+screenRoomid);
    });

    socket.emit("open-channel-screenshare", {
        channel    : screenRoomid,
        sender     : "temp",
        maxAllowed : 6
    });

    socket.on("open-channel-screenshare-resp",function(event) {
        console.log("opened-channel-screenshare" , event);
       if(event) connectScrWebRTC("open" , screenRoomid, selfuserid, []); 
    });

    console.log("RTCConn in screenshare "  , rtcConn);
    rtcConn.send({
        type:"screenshare", 
        message:screenRoomid
    });

    console.log("webrtcdevscreenshare" , scrConn , rtcConn);
}

connectScrWebRTC=function(type, channel , userid , remoteUsers){
    console.log("connectScrWebRTC -> " , type, channel , userid , remoteUsers);
    if(type=="open"){
        scrConn.connect(screenRoomid);
        shownotification("Connected to "+ screenRoomid);
    }else if(type=="join"){
        scrConn.join(screenRoomid);
        shownotification("Connected with existing channel");
    }else{
        shownotification("Connection type not found");
    }
}

function webrtcdevScreenConstraints(chromeMediaSourceId){
/*    screen_constraints = {
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: chromeMediaSourceId,
                maxWidth: window.screen.width > 1920 ? window.screen.width : 1920,
                maxHeight: window.screen.height > 1080 ? window.screen.height : 1080
            },
            optional: []
        }
    };*/
    
    //screen_constraints = scrConn.modifyScreenConstraints(screen_constraints);
    
    /*    
    scrConn.getScreenConstraints = function(callback) {
        alert("getScreenConstraints");
        screen_constraints = scrConn.modifyScreenConstraints(screen_constraints);
        console.log("screen_constraints", screen_constraints);
        callback(false, screen_constraints);
        return;
    };*/
   

    navigator.getUserMedia(
        {
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: chromeMediaSourceId,
                    maxWidth: window.screen.width > 1920 ? window.screen.width : 1920,
                    maxHeight: window.screen.height > 1080 ? window.screen.height : 1080
                },
                optional: []
            }
        },
        function stream(event) {
            console.log("screen stream "  , event , screenshareobj.screenshareContainer);
            //scrConn.onstream(event);
            //var container = document.getElementById(screenshareobj.screenshareContainer);
            //console.log("videosContainer "  , container);
            //screenStreamId = event.streamid;
            //var videosContainer=document.createElement("video");
            //videosContainer.src = window.URL.createObjectURL(event);
            //container.appendChild(videosContainer);
            //videosContainer.appendChild(event.mediaElement);
            var stream=event;
            stream.type = "local",
            scrConn.setStreamEndHandler(stream),
            getRMCMediaElement(stream, function(mediaElement) {
                mediaElement.id = stream.streamid,
                mediaElement.muted = !0,
                mediaElement.volume = 0,
                -1 === scrConn.attachStreams.indexOf(stream) && scrConn.attachStreams.push(stream),
                "undefined" != typeof StreamsHandler && StreamsHandler.setHandlers(stream, !0, scrConn),
                scrConn.streamEvents[stream.streamid] = {
                    stream: stream,
                    type: "local",
                    mediaElement: mediaElement,
                    userid: scrConn.userid,
                    extra: scrConn.extra,
                    streamid: stream.streamid,
                    blobURL: mediaElement.src || URL.createObjectURL(stream),
                    isAudioMuted: !0
                },
                /*setHarkEvents(scrConn, scrConn.streamEvents[stream.streamid]),*/
                /*setMuteHandlers(scrConn, scrConn.streamEvents[stream.streamid]),*/
                scrConn.onstream(scrConn.streamEvents[stream.streamid])
            }, scrConn);

        },
        function error(err) {
            if (isChrome && location.protocol === 'http:') {
                alert('Please test this WebRTC experiment on HTTPS.');
            } else if(isChrome) {
                alert('Screen capturing is either denied or not supported. Please install chrome extension for screen capturing or run chrome with command-line flag: --enable-usermedia-screen-capturing');
            } else if(!!navigator.mozGetUserMedia) {
                alert(Firefox_Screen_Capturing_Warning);
            }
        }
    );
    

}

    function getRMCMediaElement(stream, callback, connection) {
        var isAudioOnly = !1;
        stream.getVideoTracks && !stream.getVideoTracks().length && (isAudioOnly = !0);
        var mediaElement = document.createElement(isAudioOnly ? "audio" : "video");
        return  (mediaElement[isFirefox ? "mozSrcObject" : "src"] = isFirefox ? stream : window.URL.createObjectURL(stream),
        mediaElement.controls = !0,
        isFirefox && mediaElement.addEventListener("ended", function() {
            if (currentUserMediaRequest.remove(stream.idInstance),
            "local" === stream.type) {
                StreamsHandler.onSyncNeeded(stream.streamid, "ended"),
                connection.attachStreams.forEach(function(aStream, idx) {
                    stream.streamid === aStream.streamid && delete connection.attachStreams[idx]
                });
                var newStreamsArray = [];
                connection.attachStreams.forEach(function(aStream) {
                    aStream && newStreamsArray.push(aStream)
                }),
                connection.attachStreams = newStreamsArray;
                var streamEvent = connection.streamEvents[stream.streamid];
                if (streamEvent)
                    return void connection.onstreamended(streamEvent);
                this.parentNode && this.parentNode.removeChild(this)
            }
        }, !1),
        mediaElement.play(),
        void callback(mediaElement))
    }

function webrtcdevViewscreen(roomid){
    scrConn.join(roomid);
}

function webrtcdevStopShareScreen(){
    /*
    scrConn.removeStream({
        screen: true,  // it will remove all screen streams
        stop: true     // ask to stop old stream
    });*/
    window.postMessage("webrtcdev-extension-stopsource", "*");
    scrConn.onstreamended();
    scrConn.removeStream(screenStreamId);
    //scrConn.videosContainer.hidden=true;
    /*scrConn.leave();*/
    removeScreenViewButton();
}
function createOrAssignScreenviewButton(){
    if(screenshareobj.button.viewButton.id && document.getElementById(screenshareobj.button.viewButton.id)) 
        assignScreenViewButton();
    else
        createScreenViewButton();
}
function createScreenViewButton(){
    if(document.getElementById("viewScreenShareButton"))
        return;
    var viewScreenShareButton= document.createElement("span");
    viewScreenShareButton.className=screenshareobj.button.viewButton.class_off;
    viewScreenShareButton.innerHTML=screenshareobj.button.viewButton.html_off;
    viewScreenShareButton.id="viewScreenShareButton";
    webrtcdevViewscreen(screenRoomid);
    viewScreenShareButton.onclick = function() {
        if(viewScreenShareButton.className==screenshareobj.button.viewButton.class_off){
            document.getElementById(screenshareobj.screenshareContainer).hidden=false;
            viewScreenShareButton.className=screenshareobj.button.viewButton.class_on;
            viewScreenShareButton.innerHTML=screenshareobj.button.viewButton.html_on;
        }else if(viewScreenShareButton.className==screenshareobj.button.viewButton.class_on){
            document.getElementById(screenshareobj.screenshareContainer).hidden=true;
            viewScreenShareButton.className=screenshareobj.button.viewButton.class_off;
            viewScreenShareButton.innerHTML=screenshareobj.button.viewButton.html_off;
        }
    };

    if(document.getElementById("topIconHolder_ul")){
        var li =document.createElement("li");
        li.appendChild(viewScreenShareButton);
        document.getElementById("topIconHolder_ul").appendChild(li);
    }

}

function assignScreenViewButton(){
/*    if(document.getElementById(screenshareobj.button.viewButton.id))
        return;*/
    var button =document.getElementById(screenshareobj.button.viewButton.id);
    webrtcdevViewscreen(screenRoomid);
    button.onclick = function() {
        if(button.className==screenshareobj.button.viewButton.class_off){
            document.getElementById(screenshareobj.screenshareContainer).hidden=false;
            button.className=screenshareobj.button.viewButton.class_on;
            button.innerHTML=screenshareobj.button.viewButton.html_on;
        }else if(button.className==screenshareobj.button.viewButton.class_on){
            document.getElementById(screenshareobj.screenshareContainer).hidden=true;
            button.className=screenshareobj.button.viewButton.class_off;
            button.innerHTML=screenshareobj.button.viewButton.html_off;
        }
    };
}

function removeScreenViewButton(){
    if(document.getElementById("viewScreenShareButton")){
        var elem = document.getElementById("viewScreenShareButton");
        elem.parentElement.removeChild(elem);
    }
    return;
}

function createScreenInstallButton(extensionID){
    var button= document.createElement("span");
    button.className=screenshareobj.button.installButton.class_off;
    button.innerHTML=screenshareobj.button.installButton.html_off;
    button.id="screeninstallButton";
    button.onclick = function(e) {    
        chrome.webstore.install("https://chrome.google.com/webstore/detail/"+extensionID,
        function(){
            console.log("Chrome extension inline installation - success");
            button.hidden=true;
            createOrAssignScreenshareButton();
        },function (err){
            console.log("Chrome extension inline installation - fail " , err);
        });
        // Prevent the opening of the Web Store page
        e.preventDefault();
    };
    var li =document.createElement("li");
    li.appendChild(button);
    document.getElementById("topIconHolder_ul").appendChild(li);
}

function assignScreenInstallButton(){
    var button=document.getElementById(screenshareobj.button.installButton.id);
    button.onclick= function(e) {    
        chrome.webstore.install("https://chrome.google.com/webstore/detail/"+extensionID,
            function(){
                console.log("Chrome extension inline installation - success");
                screenShareButton.hidden=true;
                createOrAssignScreenshareButton();
            },function (err){
                console.log("Chrome extension inline installation - fail " , err);
            });
        // Prevent the opening of the Web Store page
        e.preventDefault();
    }
}

function hideScreenInstallButton(){
    var button=document.getElementById(screenshareobj.button.installButton.id);
    button.hidden=true;
    button.setAttribute("style","display:none");
}

function createOrAssignScreenshareButton(){
    if(screenshareobj.button.shareButton.id && document.getElementById(screenshareobj.button.shareButton.id)) 
    {
        assignScreenShareButton();
        hideScreenInstallButton();
    }    
    else
        createScreenShareButton();
}

function createScreenshareButton(){
    screenShareButton= document.createElement("span");
    screenShareButton.className=screenshareobj.button.shareButton.class_off;
    screenShareButton.innerHTML=screenshareobj.button.shareButton.html_off;
    screenShareButton.id="screenShareButton";
    screenShareButton.onclick = function(event) {    
        if(screenShareButton.className==screenshareobj.button.shareButton.class_off){
            webrtcdevSharescreen(screenRoomid);
            screenShareButton.className=screenshareobj.button.shareButton.class_on;
            screenShareButton.innerHTML=screenshareobj.button.shareButton.html_on;
        }else if(screenShareButton.className==screenshareobj.button.shareButton.class_on){
            screenShareButton.className=screenshareobj.button.shareButton.class_off;
            screenShareButton.innerHTML=screenshareobj.button.shareButton.html_off;
            webrtcdevStopShareScreen();
        }
    };
    var li =document.createElement("li");
    li.appendChild(screenShareButton);
    document.getElementById("topIconHolder_ul").appendChild(li);
    return screenShareButton;
}

function assignScreenShareButton(){
    var button=document.getElementById(screenshareobj.button.shareButton.id);
    button.onclick= function(event) {    
        if(button.className==screenshareobj.button.shareButton.class_off){
            webrtcdevSharescreen(screenRoomid);
            button.className=screenshareobj.button.shareButton.class_on;
            button.innerHTML=screenshareobj.button.shareButton.html_on;
        }else if(button.className==screenshareobj.button.shareButton.class_on){
            button.className=screenshareobj.button.shareButton.class_off;
            button.innerHTML=screenshareobj.button.shareButton.html_off;
            webrtcdevStopShareScreen();
        }
    }
    return button;
}

window.addEventListener('message', onScreenshareExtensionCallback);

function onScreenshareExtensionCallback(event){
    console.log("onScreenshareExtensionCallback" , event);

    if (event.data.chromeExtensionStatus) {
       console.log(event.data.chromeExtensionStatus);
    }

    if (event.data.sourceId) {
        if (event.data.sourceId === 'PermissionDeniedError') {
            console.log('permission-denied');
        } else{
            webrtcdevScreenConstraints(event.data.sourceId);
        }
    }
}

function detectExtensionScreenshare(extensionID){

    getChromeExtensionStatus(extensionID, function(status) {
        console.log( "detectExtensionScreenshare for ", extensionID, " -> " , status);
        console.log(" screenshareobj " , screenshareobj);

        if(status == 'installed-enabled') {
            var screenShareButton=createOrAssignScreenshareButton();
            hideScreenInstallButton();
        }
        
        if(status == 'installed-disabled') {
            shownotification("chrome extension is installed but disabled.");
            var screenShareButton=createOrAssignScreenshareButton();
            hideScreenInstallButton();
        }
        
        if(status == 'not-installed') {
            if(screenshareobj.button.installButton.id && document.getElementById(screenshareobj.button.installButton.id)) 
                assignScreenInstallButton(extensionID);
            else
                createScreenInstallButton(extensionID);
        }
        
        if(status == 'not-chrome') {
            // using non-chrome browser
        }

        webrtcdevPrepareScreenShare();
    });
}