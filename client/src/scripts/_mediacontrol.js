/**********************************
 Detect Webcam
 **********************************/

function detectWebcam(callback) {
    let md = navigator.mediaDevices;
    if (!md || !md.enumerateDevices) return callback(false);
    md.enumerateDevices().then(devices => {
        callback(devices.some(device => 'videoinput' === device.kind));
    })
}

/************************************
 webrtc get media
 ***********************************/

/*
* Get Audio and Video Stream Media
*/
function getCamMedia(rtcConn) {
    rtcConn.dontAttachStream = false,
        rtcConn.dontCaptureUserMedia = false,
        rtcConn.dontGetRemoteStream = false;

    webrtcdev.log(" [startJS] getCamMedia  role :", role);
    return new Promise(function (resolve, reject) {
        if (role == "inspector") {
            console.log("[startJS] getCamMedia  - Joining as inspector without camera Video");
        } else if (outgoingVideo) {
            webrtcdev.log("[startJS] getCamMedia  - Capture Media ");
            rtcConn.getUserMedia();  // not wait for the rtc conn on media stream or on error 
        } else {
            webrtcdev.error(" [startJS] getCamMedia - dont Capture outgoing video ", outgoingVideo);
            onNoCameraCard();
        }
        resolve("success");
    }).catch(
        (reason) => {
            webrtcdev.error('[startJS] getCamMedia  - rejected promise (' + reason + ')');
        });
}

function waitForRemoteVideo(_remoteStream, _remoteVideo, _localVideo, _miniVideo) {
    var videoTracks = _remoteStream.getVideoTracks();
    if (videoTracks.length === 0 || _remoteVideo.currentTime > 0) {
        transitionToActive(_remoteVideo, _localVideo, _miniVideo);
    } else {
        setTimeout(function () {
            waitForRemoteVideo(_remoteStream, _remoteVideo, _localVideo, _miniVideo)
        }, 100);
    }
}

function transitionToActive(_remoteVideo, _localVideo, _miniVideo) {
    _remoteVideo.style.opacity = 1;
    if (localVideo != null) {
        setTimeout(function () {
            _localVideo.src = '';
        }, 500);
    }
    if (miniVideo != null) {
        setTimeout(function () {
            _miniVideo.style.opacity = 1;
        }, 1000);
    }
}

function transitionToWaiting() {
    card.style.webkitTransform = 'rotateY(0deg)';
    setTimeout(function () {
        localVideo.src = miniVideo.src;
        localVideo.muted = true;
        miniVideo.src = '';
        remoteVideo.src = '';
        localVideo.style.opacity = 1;
    }, 500);
    miniVideo.style.opacity = 0;
    remoteVideo.style.opacity = 0;
}

function attachMediaStream(element, stream) {
    try {
        webrtcdev.log("[ Mediacontrol - attachMediaStream ] ",
            "element.srcObject", typeof element.src, typeof element.srcObject,
            " || stream " + stream);

        if (stream) {
            //if (typeof element.src == 'string') {
            //    element.src = URL.createObjectURL(stream);
            //}else if (typeof element.srcObject == 'object') {
            element.srcObject = stream;
            //}else{
            //    webrtcdev.log('Error attaching stream to element.' , element , stream);
            //}

            element.play();
            webrtcdev.log(" Media Stream attached to ", element, " succesfully");
        } else {
            //element.src = "";
            webrtcdev.debug(" Media Stream not attached to ", element, " as stream is not valid ", stream);
        }

    } catch (e) {
        webrtcdev.error(" [ Mediacontrol - attachMediaStream ]  error", e);
    }

}

function reattachMediaStream(to, from) {
    to.src = from.src;
}