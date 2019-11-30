function listDevices() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        webrtcdev.warn("enumerateDevices() not supported.");
        return;
    }
    //List cameras and microphones.
    navigator.mediaDevices.enumerateDevices()
        .then(function (devices) {
            devices.forEach(function (device) {
                webrtcdev.log("[sessionmanager] checkDevices ", device.kind, ": ", device.label, " id = ", device.deviceId);
            });
        })
        .catch(function (err) {
            webrtcdev.error('[sessionmanager] checkDevices ', err.name, ": ", err.message);
        });
}
/**********************************
 Detect Webcam
 **********************************/

/**
 * Detect if webcam is accesible by browser
 * @method
 * @name detectWebcam
 * @param {function} callback
 */
function detectWebcam(callback) {
    let md = navigator.mediaDevices;
    if (!md || !md.enumerateDevices) return callback(false);
    md.enumerateDevices().then(devices => {
        callback(devices.some(device => 'videoinput' === device.kind));
    });
}

/**
 * Detect if Mic is accesible by browser
 * @method
 * @name detectMic
 * @param {function} callback
 */
function detectMic(callback) {
    let md = navigator.mediaDevices;
    if (!md || !md.enumerateDevices) return callback(false);
    md.enumerateDevices().then(devices => {
        callback(devices.some(device => 'audioinput' === device.kind));
    });
}


async function getVideoPermission(){
    // navigator.getUserMedia({ audio: false, video: true}, function(){
    //     outgoingVideo = false;
    // }, function(){
    //  outgoingVideo = false;
    // });
    let stream = null;
    try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true})
        if (stream.getVideoTracks().length > 0) {
            //code for when none of the devices are available
            webrtcdev.log("--------------------------------- Video Permission obtained ");
            outgoingVideo = true;
            return;
        }
    } catch(err) {
        webrtcdev.error(err.name + ": " + err.message);
    }
    outgoingVideo = false;
    return;
}


async function getAudioPermission(){
    let stream = null;
    try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false})
        if (stream.getAudioTracks().length > 0) {
            //code for when none of the devices are available
            webrtcdev.log("--------------------------------- Audio Permission obtained ");
            outgoingAudio = true;
            return;
        }
    } catch(err) {
        webrtcdev.error(err.name + ": " + err.message);
    }
    outgoingAudio = false;
    return;
}
/************************************
 webrtc get media
 ***********************************/

/**
 * get Video and micrpphone stream media
 * @method
 * @name getCamMedia
 * @param {json} rtcConn
 */
function getCamMedia(rtcConn) {
    rtcConn.dontAttachStream = false,
    rtcConn.dontGetRemoteStream = false;

    webrtcdev.log(" [startJS] getCamMedia  role :", role);

    webrtcdev.log(" start getusermedia - outgoingVideo " + outgoingVideo + " outgoingAudio "+ outgoingAudio );
    return new Promise(function (resolve, reject) {
        if (role == "inspector") {
            rtcConn.dontCaptureUserMedia = true;
            console.log("[startJS] getCamMedia  - Joining as inspector without camera Video");
        } else if (outgoingVideo && outgoingAudio) {
            rtcConn.dontCaptureUserMedia = false;
            webrtcdev.log("[startJS] getCamMedia  - Capture Media ");
            rtcConn.getUserMedia();  // not wait for the rtc conn on media stream or on error 
        } else if (!outgoingVideo && outgoingAudio) {
            rtcConn.dontCaptureUserMedia = false;
            // alert(" start  getCamMedia  - Dont Capture Webcam, only Mic");
            webrtcdev.warn("[startJS] getCamMedia  - Dont Capture Webcam only Mic ");
            rtcConn.getUserMedia();  // not wait for the rtc conn on media stream or on error
        } else {
            rtcConn.dontCaptureUserMedia = true;
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

/**
 * attach media stream to dom element
 * @method
 * @name attachMediaStream
 * @param {string} remvid
 * @param {stream} stream
 */
function attachMediaStream(remvid, stream) {
    try {
        let element = "";
        webrtcdev.log("[ Mediacontrol - attachMediaStream ] element " , remvid);
        if ((document.getElementsByName(remvid)).length > 0){
            element = document.getElementsByName(remvid)[0];
        } else if(remvid.video){
            element = remvid.video;
        } else if(remvid.nodeName == "VIDEO") {
            element = remvid;
        }else{
            return ;
        }

        webrtcdev.log("[ Mediacontrol - attachMediaStream ] stream " , stream);
        if (stream) {
            // if (typeof element.src == 'string') {
            //    element.src = URL.createObjectURL(stream);
            // }else if (typeof element.srcObject == 'object') {
            //     element.srcObject = stream;
            // }else{
            //    webrtcdev.log('Error attaching stream to element.' , element , stream);
            // }
            element.srcObject = stream;
            element.play();
            webrtcdev.log("[ Mediacontrol - attachMediaStream ] Media Stream attached to ", element, " successfully");
        } else {
            if ('srcObject' in element) {
                element.srcObject = null;
            } else {
                // Avoid using this in new browsers, as it is going away.
                element.src = null;
            }
            webrtcdev.warn("[ Mediacontrol - attachMediaStream ] Media Stream empty '' attached to ", element, " as stream is not valid ", stream);
        }

    } catch(err) {
        webrtcdev.error(" [ Mediacontrol - attachMediaStream ]  error", err);
    }
}

function reattachMediaStream(to,from) {
    to.src = from.src;
}