/**
 * function to check devices like speakers , webcam ,  microphone etc
 * @method
 * @name checkDevices
 * @param {object} connection
 */
function checkDevices(obj){

    if(obj.hasMicrophone) {
        // seems current system has at least one audio input device
        webrtcdev.info("has Microphone");
    }else{
        webrtcdev.error("doesnt have  hasMicrophone");
    }

    if(obj.hasSpeakers) {
        webrtcdev.info("has Speakers");
        // seems current system has at least one audio output device
    }else{
        webrtcdev.error("doesnt have  Speakers");
    }

    if(obj.hasWebcam) {
        webrtcdev.info("has Webcam");
        // seems current system has at least one video input device
    }else{
        webrtcdev.error("doesnt have Webcam");
    }

    webrtcdev.log(" Audio Input Device " );
    for( x in obj.audioInputDevices) webrtcdev.info(obj.audioInputDevices[x]);

    webrtcdev.log(" Audio Output Device " );
    for( x in obj.audioOutputDevices) webrtcdev.info(obj.audioOutputDevices[x]);        

    webrtcdev.log(" Video Input Device " );
    for( x in obj.videoInputDevices) webrtcdev.info(obj.videoInputDevices[x]);  

    webrtcdev.info(" Screen Device " + obj.displayResolution); 
}

/**
 * function to check browser support for webrtc apis
 * @name checkWebRTCSupport
 * @param {object} connection
 */
function checkWebRTCSupport(obj){

    webrtcdev.info(" Browser " , obj.browser.name + obj.browser.fullVersion );

    if(obj.isWebRTCSupported) {
    // seems WebRTC compatible client
    }else{

    }

    if(obj.isAudioContextSupported) {
        // seems Web-Audio compatible client
    }

    if(obj.isScreenCapturingSupported) {
        // seems WebRTC screen capturing feature is supported on this client
    }

    if(obj.isSctpDataChannelsSupported) {
        // seems WebRTC SCTP data channels feature are supported on this client
    }

    if(obj.isRtpDataChannelsSupported) {
        // seems WebRTC (old-fashioned) RTP data channels feature are supported on this client
    }

}