/**
 * function to check devices like speakers , webcam ,  microphone etc
 * @method
 * @name checkDevices
 * @param {object} connection
 */
function checkDevices(obj){

    if(obj.hasMicrophone) {
        // seems current system has at least one audio input device
        webrtcdev.log("has Microphone");
    }else{
        webrtcdev.log("doesnt have  hasMicrophone");
    }

    if(obj.hasSpeakers) {
        webrtcdev.log("has Speakers");
        // seems current system has at least one audio output device
    }else{
        webrtcdev.log("doesnt have  Speakers");
    }

    if(obj.hasWebcam) {
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

    webrtcdev.log(" Browser " , obj.browser.name + obj.browser.fullVersion );

    if(obj.isWebRTCSupported) {
    // seems WebRTC compatible client
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


        webrtcdev.log(" Audio Input Device " );
        // for( x in detectRTC.audioInputDevices) 
        console.log(obj.audioInputDevices);

        webrtcdev.log(" Audio Output Device " );
        for( x in obj.audioOutputDevices) webrtcdev.log(x);        

        webrtcdev.log(" Video Input Device " );
        for( x in obj.videoInputDevices) webrtcdev.log(x);  

        webrtcdev.log(" Screen Device " + obj.displayResolution); 
}