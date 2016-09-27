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

var connection , screenCallback ;
var iceServers=[];
var signaler,screen,roomid;

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
    roomid= "screenshare"+"_"+sessionid;
    connection  = new RTCMultiConnection();
    connection.socketURL = socketAddr;
    connection.socketMessageEvent = 'screen-sharing-demo';
    connection.session = {
        screen: true,
        oneway: true
    };
    connection.iceServers=rtcConn.iceServers;
    connection.sdpConstraints.mandatory = {
        OfferToReceiveAudio: false,
        OfferToReceiveVideo: false
    };
    connection.videosContainer = document.getElementById(screenshareobj.screenshareContainer);
    connection.onstream = function(event) {
        console.log(" on stream in _screenshare :" , event);
        if(event.stream.isScreen){
            document.getElementById(screenshareobj.screenshareContainer).innerHTML="";
            createScreenViewButton();
            screenStreamId = event.streamid;
            connection.videosContainer.appendChild(event.mediaElement);
            event.mediaElement.play();
            setTimeout(function() {
                event.mediaElement.play();
            }, 5000);
        }
    };
    connection.onstreamended = function(event) {
        console.log(" onstreamended in _screenshare :" , event);
        document.getElementById(screenshareobj.screenshareContainer).innerHTML="";
        connection.removeStream(screenStreamId);
        connection.videosContainer.hidden=true;
/*        screenShareButton.className=screenshareobj.button.shareButton.class_off;
        screenShareButton.innerHTML=screenshareobj.button.shareButton.html_off;*/
        removeScreenViewButton();
    };
}

function webrtcdevScreenConstraints(chromeMediaSourceId){
    screen_constraints = {
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
    };
    console.log(screen_constraints , connection);
    connection.getScreenConstraints = function(callback) {
        alert("getScreenConstraints");
        screen_constraints = connection.modifyScreenConstraints(screen_constraints);
        console.log("screen_constraints", screen_constraints);
        callback(false, screen_constraints);
        return;
    };
}

function webrtcdevSharescreen(roomid) {

    /*    
    if(Object.keys(connection.streamEvents).length>2){   
        connection.addStream({
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
    /*connection.captureUserMedia();*/
    /*newly opeend session*/
    connection.open(roomid, function() {
        shownotification(" Making a new session for screenshare"+roomid);
        rtcConn.send({
            type:"screenshare", 
            message:roomid
        });
    });
}

function webrtcdevViewscreen(roomid){
    connection.join(roomid);
}

function webrtcdevStopShareScreen(){
    /*
    connection.removeStream({
        screen: true,  // it will remove all screen streams
        stop: true     // ask to stop old stream
    });*/
    window.postMessage("webrtcdev-extension-stopsource", "*");
    connection.removeStream(screenStreamId);
    connection.videosContainer.hidden=true;
    /*connection.leave();*/
    removeScreenViewButton();
}
function createOrAssignScreenshareButton(){
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
    webrtcdevViewscreen(roomid);
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

    var li =document.createElement("li");
    li.appendChild(viewScreenShareButton);
    document.getElementById("topIconHolder_ul").appendChild(li);
}

function assignScreenViewButton(){
/*    if(document.getElementById(screenshareobj.button.viewButton.id))
        return;*/
    var button =document.getElementById(screenshareobj.button.viewButton.id);
    webrtcdevViewscreen(roomid);
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
    var elem = document.getElementById("viewScreenShareButton");
    elem.parentElement.removeChild(elem);
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
    var screenShareButton;
    screenShareButton= document.createElement("span");
    screenShareButton.className=screenshareobj.button.shareButton.class_off;
    screenShareButton.innerHTML=screenshareobj.button.shareButton.html_off;
    screenShareButton.id="screenShareButton";
    screenShareButton.onclick = function(event) {    
        if(screenShareButton.className==screenshareobj.button.shareButton.class_off){
            webrtcdevSharescreen(roomid);
            screenShareButton.className=screenshareobj.button.shareButton.class_on;
            screenShareButton.innerHTML=screenshareobj.button.shareButton.html_on;
            alert("webrtcdevscreenshare");
        }else if(screenShareButton.className==screenshareobj.button.shareButton.class_on){
            screenShareButton.className=screenshareobj.button.shareButton.class_off;
            screenShareButton.innerHTML=screenshareobj.button.shareButton.html_off;
            webrtcdevStopShareScreen();
        }
    };
    var li =document.createElement("li");
    li.appendChild(screenShareButton);
    document.getElementById("topIconHolder_ul").appendChild(li);
}

function assignScreenShareButton(){
    var button=document.getElementById(screenshareobj.button.shareButton.id);
    button.onclick= function(event) {    
        if(button.className==screenshareobj.button.shareButton.class_off){
            webrtcdevSharescreen(roomid);
            button.className=screenshareobj.button.shareButton.class_on;
            button.innerHTML=screenshareobj.button.shareButton.html_on;
        }else if(button.className==screenshareobj.button.shareButton.class_on){
            button.className=screenshareobj.button.shareButton.class_off;
            button.innerHTML=screenshareobj.button.shareButton.html_off;
            webrtcdevStopShareScreen();
        }
    }
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
            createOrAssignScreenshareButton();
        }
        
        if(status == 'installed-disabled') {
            shownotification("chrome extension is installed but disabled.");
            createOrAssignScreenshareButton();
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