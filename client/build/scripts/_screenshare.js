
/****************************************8
screenshare
***************************************/
var chromeMediaSource = 'screen';
var sourceId;
var isFirefox = typeof window.InstallTrigger !== 'undefined';
var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
var isChrome = !!window.chrome && !isOpera;
/*navigator.getUserMedia = navigator.mozGetUserMedia || navigator.webkitGetUserMedia;*/
/*var isFirefox = !!navigator.mozGetUserMedia;
var isChrome = !!navigator.webkitGetUserMedia;*/
var isMobileDevice = !!navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile/i);

var screen_constraints;
var connection ;

var DetectRTC = {};

var screenCallback;

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

var iceServers=[];

var signaler,screen, roomid;

/*getSourceId(shareScreen);*/

function shareScreen(chromeMediaSourceId){
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
    
    roomid= "screenshare"+"_"+rtcMultiConnection.channel;
    connection.openOrJoin(roomid, function(isRoomExists, roomid) {
        if(!isRoomExists) {
            console.log("room doesnt exists ");
        }
    });
}

function stopShareScreen(){
    connection.removeStream({
        screen: true,  // it will remove all screen streams
        stop: true     // ask to stop old stream
    });
}

function sharescr(roomid) {

    connection.addStream({
        screen: true,
        oneway: true
    });

    connection.videosContainer = document.getElementById(screenshareobj.screenshareContainer);
    connection.onstream = function(event) {
        connection.videosContainer.appendChild(event.mediaElement);
        connection.videosContainer.hidden=false;
        event.mediaElement.play();
        setTimeout(function() {
            event.mediaElement.play();
        }, 5000);
    };
}

function webrtcdevScreenShare(){
    alert("WebRTC Dev Screen Share ");

    connection  = new RTCMultiConnection(rtcMultiConnection.channel);
    connection.socketURL = "https://"+location.hostname+":8086/";
    connection.socketMessageEvent = 'screen-sharing-demo';

    connection.session = {
        screen: true,
        oneway: true
    };

    connection.sdpConstraints.mandatory = {
        OfferToReceiveAudio: false,
        OfferToReceiveVideo: false
    };

}

function createScreenViewButton(){
    var viewScreenShareButton= document.createElement("span");
    viewScreenShareButton.className=screenshareobj.button.viewButton.class_on;
    viewScreenShareButton.innerHTML=screenshareobj.button.viewButton.html_on;;
    viewScreenShareButton.id="viewScreenShareButton";
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

function hideScreenViewButton(){
    document.getElementById("viewScreenShareButton").hidden=true;
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
            sharescr(roomid);
            screenShareButton.className=screenshareobj.button.shareButton.class_on;
            screenShareButton.innerHTML=screenshareobj.button.shareButton.html_on;
        }else if(screenShareButton.className==screenshareobj.button.shareButton.class_on){
            var elem = document.getElementById("viewScreenShareButton");
            elem.parentElement.removeChild(elem);
            screenShareButton.className=screenshareobj.button.shareButton.class_off;
            screenShareButton.innerHTML=screenshareobj.button.shareButton.html_off;
            hideScreenViewButton();
            screen.leaveScreenRoom();
        }
    };
    var li =document.createElement("li");
    li.appendChild(screenShareButton);
    document.getElementById("topIconHolder_ul").appendChild(li);
}

function changeScreenshareButtonStatus(status){
    var screenShareButton= document.getElementById("screenShareButton");
    if(status=="on"){
        var elem = document.getElementById("viewScreenShareButton");
        elem.parentElement.removeChild(elem);
        screenShareButton.className=screenshareobj.button.shareButton.class_off;
        screenShareButton.innerHTML=screenshareobj.button.shareButton.html_off;
        hideScreenViewButton();
    }else if (status=="off"){
        screen.sharescr(roomid);
        screenShareButton.className=screenshareobj.button.shareButton.class_on;
        screenShareButton.innerHTML=screenshareobj.button.shareButton.html_on;
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
            shareScreen(event.data.sourceId);
        }
    }
}

function detectExtensionScreenshare(extensionID){
    var extensionid = extensionID;

    DetectRTC.screen.getChromeExtensionStatus(extensionid, function(status) {
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

        webrtcdevScreenShare();
    });


}