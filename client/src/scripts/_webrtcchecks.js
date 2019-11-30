/*-----------------------------------------------------------------------------------*/
/*                        webrtc checks JS                                           */

/*-----------------------------------------------------------------------------------*/

/**
 * function to updateStats
 * @method
 * @name updateStats
 * @param {object} connection
 */
function updateStats(obj) {
    webrtcdev.info(" =============================== check Devices ==========================================");

    // Update Stats if active
    if (statisticsobj && statisticsobj.active) {
        // getStats(event.stream.getVideoTracks() , function(result) {
        //     document.getElementById("network-stats-body").innerHTML = result;        
        // } , 20000);
        document.getElementById(statisticsobj.statsConainer).innerHTML += JSON.stringify(obj);
        document.getElementById(statisticsobj.statsConainer).innerHTML += JSON.stringify(obj.bandwidth);
        document.getElementById(statisticsobj.statsConainer).innerHTML += JSON.stringify(obj.codecs);

        alert("detect RTC appended ");
    }

}

/**
 * function to check browser support for webrtc apis
 * @name checkWebRTCSupport
 * @param {object} connection
 */
function checkWebRTCSupport(obj) {

    webrtcdev.info(" Browser ", obj.browser.name + obj.browser.fullVersion);

    if (obj.isWebRTCSupported) {
        // seems WebRTC compatible client
    } else {

    }

    if (obj.isAudioContextSupported) {
        // seems Web-Audio compatible client
    }

    if (obj.isScreenCapturingSupported) {
        // seems WebRTC screen capturing feature is supported on this client
    }

    if (obj.isSctpDataChannelsSupported) {
        // seems WebRTC SCTP data channels feature are supported on this client
    }

    if (obj.isRtpDataChannelsSupported) {
        // seems WebRTC (old-fashioned) RTP data channels feature are supported on this client
    }

}

/*-----------------------------------------------------------------------------------*/