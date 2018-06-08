/**
 * function to check devices like speakers , webcam ,  microphone etc
 * @method
 * @name checkDevices
 * @param {object} connection
 */
function checkDevices(obj){
    webrtcdev.log(" obj.DetectRTC  " , obj.DetectRTC);
    if(obj.DetectRTC.hasMicrophone) {
        // seems current system has at least one audio input device
        webrtcdev.log("has Microphone");
    }else{
        webrtcdev.log("doesnt have  hasMicrophone");
    }

    if(obj.DetectRTC.hasSpeakers) {
        webrtcdev.log("has Speakers");
        // seems current system has at least one audio output device
    }else{
        webrtcdev.log("doesnt have  Speakers");
    }

    if(obj.DetectRTC.hasWebcam) {
        webrtcdev.log("has Webcam");
        // seems current system has at least one video input device
    }else{
        webrtcdev.log("doesnt have Webcam");
    }
}

/**
 * function to check browser support for webrtc apis
 * @name checkWebRTCSupport
 * @param {object} connection
 */
function checkWebRTCSupport(obj){
    if(obj.DetectRTC.isWebRTCSupported) {
    // seems WebRTC compatible client
    }

    if(obj.DetectRTC.isAudioContextSupported) {
        // seems Web-Audio compatible client
    }

    if(obj.DetectRTC.isScreenCapturingSupported) {
        // seems WebRTC screen capturing feature is supported on this client
    }

    if(obj.DetectRTC.isSctpDataChannelsSupported) {
        // seems WebRTC SCTP data channels feature are supported on this client
    }

    if(obj.DetectRTC.isRtpDataChannelsSupported) {
        // seems WebRTC (old-fashioned) RTP data channels feature are supported on this client
    }
}