/*-----------------------------------------------------------------------------------*/
/*                        stats JS                                                   */
/*-----------------------------------------------------------------------------------*/

function getStats(mediaStreamTrack, callback, interval) {
    var peer = this;
    //webrtcdev.log("----getStats-----", arguments[0] , arguments[1] ,arguments[2] , arguments[3])
    if (arguments[0] instanceof RTCMultiConnection) {
        peer = arguments[0];
        
        if(!!navigator.mozGetUserMedia) {
            mediaStreamTrack = arguments[1];
            callback = arguments[2];
            interval = arguments[3];
        }

        if (!(mediaStreamTrack instanceof MediaStreamTrack) && !!navigator.mozGetUserMedia) {
            throw '2nd argument is not instance of MediaStreamTrack.';
        }
    } else if (!(mediaStreamTrack instanceof MediaStreamTrack) && !!navigator.mozGetUserMedia) {
        throw '1st argument is not instance of MediaStreamTrack.';
    }

    var globalObject = {
        audio: {},
        video: {}
    };

    var nomore = false;

    (function getPrivateStats() {
        _getStats(function(results) {
            var result = {
                audio: {},
                video: {},
                results: results,
                nomore: function() {
                    nomore = true;
                }
            };

            for (var i = 0; i < results.length; ++i) {
                var res = results[i];

                if(res.datachannelid && res.type === 'datachannel') {
                    result.datachannel = {
                        state: res.state // open or connecting
                    }
                }

                if(res.type === 'googLibjingleSession') {
                    result.isOfferer = res.googInitiator;
                }

                if(res.type == 'googCertificate') {
                    result.encryption = res.googFingerprintAlgorithm;
                }

                if (res.googCodecName == 'opus' && res.bytesSent) {
                    var kilobytes = 0;
                    if(!!res.bytesSent) {
                        if (!globalObject.audio.prevBytesSent) {
                            globalObject.audio.prevBytesSent = res.bytesSent;
                        }

                        var bytes = res.bytesSent - globalObject.audio.prevBytesSent;
                        globalObject.audio.prevBytesSent = res.bytesSent;

                        kilobytes = bytes / 1024;
                    }

                    if(!result.audio) {
                        result.audio = res;
                    }
                    
                    result.audio.availableBandwidth = kilobytes.toFixed(1);
                }

                if (res.googCodecName == 'VP8') {
                    // if(!globalObject.)
                    // bytesReceived
                    // packetsReceived
                    // timestamp
                    var kilobytes = 0;
                    if(!!res.bytesSent) {
                        if (!globalObject.video.prevBytesSent) {
                            globalObject.video.prevBytesSent = res.bytesSent;
                        }

                        var bytes = res.bytesSent - globalObject.video.prevBytesSent;
                        globalObject.video.prevBytesSent = res.bytesSent;

                        kilobytes = bytes / 1024;
                    }

                    if(!result.video) {
                        result.video = res;
                    }

                    result.video.availableBandwidth = kilobytes.toFixed(1);

                    if(res.googFrameHeightReceived && res.googFrameWidthReceived) {
                        result.resolutions = {
                            width: res.googFrameWidthReceived,
                            height: res.googFrameHeightReceived
                        };
                    }
                }

                if (res.type == 'VideoBwe') {
                    result.video.bandwidth = {
                        googActualEncBitrate: res.googActualEncBitrate,
                        googAvailableSendBandwidth: res.googAvailableSendBandwidth,
                        googAvailableReceiveBandwidth: res.googAvailableReceiveBandwidth,
                        googRetransmitBitrate: res.googRetransmitBitrate,
                        googTargetEncBitrate: res.googTargetEncBitrate,
                        googBucketDelay: res.googBucketDelay,
                        googTransmitBitrate: res.googTransmitBitrate
                    };
                }

                // res.googActiveConnection means either STUN or TURN is used.

                if (res.type == 'googCandidatePair' && res.googActiveConnection == 'true') {
                    result.connectionType = {
                        local: {
                            candidateType: res.googLocalCandidateType,
                            ipAddress: res.googLocalAddress
                        },
                        remote: {
                            candidateType: res.googRemoteCandidateType,
                            ipAddress: res.googRemoteAddress
                        },
                        transport: res.googTransportType
                    };
                }

                var systemNetworkType = ((navigator.connection || {}).type || 'unknown').toString().toLowerCase();

                if(res.type === 'localcandidate') {
                    if(!result.connectionType) {
                        result.connectionType = {};
                    }

                    result.connectionType.local = {
                        candidateType: res.candidateType,
                        ipAddress: res.ipAddress + ':' + res.portNumber,
                        networkType: res.networkType/* || systemNetworkType */ || 'unknown',
                        transport: res.transport
                    }
                }

                if(res.type === 'remotecandidate') {
                    if(!result.connectionType) {
                        result.connectionType = {};
                    }
                    
                    result.connectionType.local = {
                        candidateType: res.candidateType,
                        ipAddress: res.ipAddress + ':' + res.portNumber,
                        networkType: res.networkType || systemNetworkType,
                        transport: res.transport
                    }
                }
            }

            try {
                if(peer.iceConnectionState.search(/failed|closed/gi) !== -1) {
                    nomore = true;
                }
            }
            catch(e) {
                nomore = true;
            }

            if(nomore === true) {
                if(result.datachannel) {
                    result.datachannel.state = 'close';
                }
                result.ended = true;
            }

            callback(result);

            // second argument checks to see, if target-user is still connected.
            if (!nomore) {
                typeof interval != undefined && interval && setTimeout(getPrivateStats, interval || 1000);
            }
        });
    })();

    // a wrapper around getStats which hides the differences (where possible)
    // following code-snippet is taken from somewhere on the github
    function _getStats(cb) {
        // if !peer or peer.signalingState == 'closed' then return;
        webrtcdev.log( "peer " , peer);
        if(!peer.getStats()) return;

        if (!!navigator.mozGetUserMedia) {
            peer.getStats(
                mediaStreamTrack,
                function(res) {
                    var items = [];
                    res.forEach(function(result) {
                        items.push(result);
                    });
                    cb(items);
                },
                cb
            );
        } else {
            peer.getStats(function(res) {
                var items = [];
                res.result().forEach(function(result) {
                    var item = {};
                    result.names().forEach(function(name) {
                        item[name] = result.stat(name);
                    });
                    item.id = result.id;
                    item.type = result.type;
                    item.timestamp = result.timestamp;
                    items.push(item);
                });
                cb(items);
            });
        }
    };
}

function merge(mergein, mergeto) {
    if (!mergein) mergein = {};
    if (!mergeto) return mergein;

    for (var item in mergeto) {
        mergein[item] = mergeto[item];
    }
    return mergein;
}

if (typeof module !== 'undefined'/* && !!module.exports*/) {
    module.exports = getStats;
}

if(typeof window !== 'undefined') {
    window.getStats = getStats;
}



function activateBandwidthButtons(timerobj){
    if(document.getElementById("minimizeBandwidthButton")){
        var button= document.getElementById("minimizeBandwidthButton");
        button.onclick=function(e){
            if(document.getElementById("bandwidthContainer").hidden)
                document.getElementById("bandwidthContainer").hidden=false;
            else
                document.getElementById("bandwidthContainer").hidden=true;
        }  
    }
}

/**
 * shows status of ongoing webrtc call
 * @method
 * @name showStatus
 * @param {obj} conn
 */
function showStatus(){
    getStats(rtcConn, function(result) {
        webrtcdev.info("[stats]",result.connectionType.remote.ipAddress);
        webrtcdev.info("[stats]",result.connectionType.remote.candidateType);
        webrtcdev.info("[stats]",result.connectionType.transport);
    } , 10000);
    webrtcdev.info("[stats] WebcallPeers " , webcallpeers);
}

/**
 * shows stats of ongoing webrtc call 
 * @method
 * @name showStatus
 * @param {obj} conn
 */
function showRtpstats(){
    try{
        for( x=0; x<rtcConn.peers.getLength(); x++){
            var pid =  rtcConn.peers.getAllParticipants()[x];
            var arg = JSON.stringify(rtcConn.peers[pid] , undefined, 2);
            document.getElementById(statisticsobj.statsConainer).innerHTML += "<pre >"+ arg + "</pre>";        
        }
    }catch(e){
        webrtcdev.error("[stats] rtpstats" , e);
    }

}
/*
 * shows rtc conn of ongoing webrtc call 
 * @method
 * @name showRtcConn
 */
function showRtcConn(){
    if(rtcConn){
        webrtcdev.info(" =========================================================================");
        webrtcdev.info("[stats] rtcConn : " , rtcConn);
        webrtcdev.info("[stats] rtcConn.peers.getAllParticipants() : " , rtcConn.peers.getAllParticipants());
        webrtcdev.info(" =========================================================================");
    }else{
        webrtcdev.debug(" rtcConn doesnt exist ");
    }
}

/*
 * shows rtcp capabilities of transceivers webrtc call 
 * @method
 * @name showRTCPcapabilities
 * @param {obj} conn
 */
function showRTCPcapabilities(){
    let str = ""; 
    str += RTCRtpSender.getCapabilities('audio');
    str += RTCRtpSender.getCapabilities('video');

    str += RTCRtpSender.getCapabilities('audio');
    str += RTCRtpSender.getCapabilities('video');

    document.getElementById(statisticsobj.statsConainer).innerHTML += "<pre >"+ str + "</pre>";    
}


/*
check MediaStreamTrack
    MediaTrackSupportedConstraints, 
    MediaTrackCapabilities, 
    MediaTrackConstraints 
    MediaTrackSettings
*/
function getstatsMediaDevices(){
    webrtcdev.log("[stats] getSupportedConstraints - " , navigator.mediaDevices.getSupportedConstraints());
}



/*-----------------------------------------------------------------------------------*/