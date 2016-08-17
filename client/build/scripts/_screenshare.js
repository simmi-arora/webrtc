/**************************************************************
Screenshare 
****************************************************************/

var chromeMediaSource = 'screen';
var sourceId , screen_constraints , screenStreamId;
var isFirefox = typeof window.InstallTrigger !== 'undefined';
var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
var isChrome = !!window.chrome && !isOpera;
var isMobileDevice = !!navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile/i);

var connection ;
var DetectRTC = {};
var screenCallback;
var iceServers=[];
var signaler,screen,roomid;

DetectRTC.screen = {
    
    chromeMediaSource: 'screen',

    getSourceId: function (callback) {
        screenCallback = callback;
        window.postMessage('get-sourceId', '*');
    },

    onMessageCallback: function (data) {

        // "cancel" button is clicked
        if (data == 'PermissionDeniedError') {
            DetectRTC.screen.chromeMediaSource = 'PermissionDeniedError';
            if (screenCallback) return screenCallback('PermissionDeniedError');
            else throw new Error('PermissionDeniedError');
        }

        // extension notified his presence
        if (data == 'rtcmulticonnection-extension-loaded') {
            DetectRTC.screen.chromeMediaSource = 'desktop';
        }

        // extension shared temp sourceId
        if (data.sourceId) {
            alert("data  sourceId");
            DetectRTC.screen.sourceId = data.sourceId;
            if (screenCallback) screenCallback(DetectRTC.screen.sourceId);
        }
    },

    getChromeExtensionStatus: function (extensionid, callback) {     
        var image = document.createElement('img');
        image.src = 'chrome-extension://' + extensionid + '/icon.png';
        image.onload = function () {
            DetectRTC.screen.chromeMediaSource = 'screen';
            window.postMessage('are-you-there', '*');
            setTimeout(function () {
                if (DetectRTC.screen.chromeMediaSource == 'screen') {
                    callback('installed-disabled');
                } else{
                    callback('installed-enabled');
                }
            }, 2000);
        };
        image.onerror = function () {
            callback('not-installed');
        };
    },

    onScreenCapturingExtensionAvailable : function() {
        alert("onScreenCapturingExtensionAvailable , hide inline installation button ");
    }
};

function captureSourceId() {
    var extensionid=props.extensionID;
    DetectRTC.screen.getChromeExtensionStatus(extensionid,function (status) {
        if (status != 'installed-enabled') {
            window.parent.postMessage({
                chromeExtensionStatus: status
            }, '*');
            return;
        }

        DetectRTC.screen.getSourceId(function (sourceId) {
            window.parent.postMessage({
                chromeMediaSourceId: sourceId
            }, '*');
        });
    });
}

/*getSourceId(shareScreen);*/
function webrtcdevPrepareScreenShare(){

    roomid= "screenshare"+"_"+rtcMultiConnection.channel;
    connection  = new RTCMultiConnection();
    connection.socketURL = socketAddr;
    connection.socketMessageEvent = 'screen-sharing-demo';

    connection.session = {
        screen: true,
        oneway: true
    };

    connection.iceServers=rtcMultiConnection.iceServers;
    connection.sdpConstraints.mandatory = {
        OfferToReceiveAudio: false,
        OfferToReceiveVideo: false
    };

    console.log("webrtcdevPrepareScreenShare connection -> " , connection);
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

    connection.getScreenConstraints = function(callback) {
        screen_constraints = connection.modifyScreenConstraints(screen_constraints);
        console.log("screen_constraints", screen_constraints);
        callback(false, screen_constraints);
        return;
    };
}

function webrtcdevSharescreen(roomid) {

    /*
    connection.addStream({
        screen: true,
        oneway: true
    });*/
    connection.videosContainer = document.getElementById(screenshareobj.screenshareContainer);
    connection.onstream = function(event) {
        console.log(" on stream in _screenshare :" , event);
        if(event.stream.isScreen){
            createScreenViewButton();
            screenStreamId= event.streamid;
            connection.videosContainer.appendChild(event.mediaElement);
            event.mediaElement.play();
            setTimeout(function() {
                event.mediaElement.play();
            }, 5000);
        }
    };

    connection.onstreamended = function(event) {
        console.log(" onstreamended in _screenshare :" , event);
        connection.removeStream(screenStreamId);
        connection.videosContainer.hidden=true;
    };

    connection.open(roomid, function() {
        shownotification(" Making a new session "+roomid);
        rtcMultiConnection.send({
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
    connection.removeStream(screenStreamId);
    connection.videosContainer.hidden=true;
    removeScreenViewButton();
}

function createScreenViewButton(){
    if(document.getElementById("viewScreenShareButton"))
        return;
    var viewScreenShareButton= document.createElement("span");
    viewScreenShareButton.className=screenshareobj.button.viewButton.class_off;
    viewScreenShareButton.innerHTML=screenshareobj.button.viewButton.html_off;;
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

function removeScreenViewButton(){
    var elem = document.getElementById("viewScreenShareButton");
    elem.parentElement.removeChild(elem);
}

function createScreenInstallButton(extensionID){
    var screenShareButton= document.createElement("span");
        screenShareButton.className=screenshareobj.button.installButton.class_off;
        screenShareButton.innerHTML=screenshareobj.button.installButton.html_off;
        screenShareButton.id="screeninstallButton";
        screenShareButton.onclick = function(e) {    
            chrome.webstore.install("https://chrome.google.com/webstore/detail/"+extensionID,
            function(){
                console.log("Chrome extension inline installation - success");
                screenShareButton.hidden=true;
                createScreenshareButton();
            },function (err){
                console.log("Chrome extension inline installation - fail " , err);
            });
            // Prevent the opening of the Web Store page
            e.preventDefault();
        };
        var li =document.createElement("li");
        li.appendChild(screenShareButton);
        document.getElementById("topIconHolder_ul").appendChild(li);
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
        }else if(screenShareButton.className==screenshareobj.button.shareButton.class_on){
            webrtcdevStopShareScreen();
            screenShareButton.className=screenshareobj.button.shareButton.class_off;
            screenShareButton.innerHTML=screenshareobj.button.shareButton.html_off;
        }
    };
    var li =document.createElement("li");
    li.appendChild(screenShareButton);
    document.getElementById("topIconHolder_ul").appendChild(li);
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

    rtcMultiConnection.getChromeExtensionStatus(extensionID, function(status) {
        console.log( "detectExtensionScreenshare for ", extensionID, " -> " , status);

        if(status == 'installed-enabled') {
            createScreenshareButton();
        }
        
        if(status == 'installed-disabled') {
            // chrome extension is installed but disabled.
            shownotification("chrome extension is installed but disabled.");
            createScreenshareButton();
        }
        
        if(status == 'not-installed') {
            // chrome extension is not installed
            createScreenInstallButton(extensionID);
        }
        
        if(status == 'not-chrome') {
            // using non-chrome browser
        }

        webrtcdevPrepareScreenShare();
    });
}