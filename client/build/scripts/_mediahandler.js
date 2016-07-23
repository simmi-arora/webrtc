/*var getUserMedia = null;
var attachMediaStream = null;
var reattachMediaStream = null;

if (navigator.mozGetUserMedia) {
    webrtcDetectedBrowser = "firefox";
    webrtcDetectedVersion = parseInt(navigator.userAgent.match(/Firefox\/([0-9]+)\./)[1]);
    RTCPeerConnection = mozRTCPeerConnection;
    RTCSessionDescription = mozRTCSessionDescription;
    RTCIceCandidate = mozRTCIceCandidate;
    
    getUserMedia = navigator.mozGetUserMedia.bind(navigator);

    attachMediaStream = function(element, stream) {
        element.mozSrcObject = stream;
        element.play();
    };
    reattachMediaStream = function(to, from) {
        to.mozSrcObject = from.mozSrcObject;
        to.play();
    };

    MediaStream.prototype.getVideoTracks = function() {
        return [];
    };
    MediaStream.prototype.getAudioTracks = function() {
        return [];
    };
} else if (navigator.webkitGetUserMedia) {
    webrtcDetectedBrowser = "chrome";
    webrtcDetectedVersion =  parseInt(navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)[2]);
    RTCPeerConnection = webkitRTCPeerConnection;
    RTCSessionDescription = window.RTCSessionDescription;
    RTCIceCandidate = window.RTCIceCandidate;    

    getUserMedia = navigator.webkitGetUserMedia.bind(navigator);

    attachMediaStream = function(element, stream) {
        if (typeof element.srcObject !== 'undefined') {
            element.srcObject = stream;
        } else if (typeof element.mozSrcObject !== 'undefined') {
            element.mozSrcObject = stream;
        } else if (typeof element.src !== 'undefined') {
            element.src = URL.createObjectURL(stream);
        } else {
            console.log('Error attaching stream to element.');
        }
    };
    reattachMediaStream = function(to, from) {
        to.src = from.src;
    };

    if (!webkitMediaStream.prototype.getVideoTracks) {
        webkitMediaStream.prototype.getVideoTracks = function() {
            return this.videoTracks;
        };
        webkitMediaStream.prototype.getAudioTracks = function() {
            return this.audioTracks;
        };
    }
    
    // New syntax of getXXXStreams method in M26.
    if (!webkitRTCPeerConnection.prototype.getLocalStreams) {
        webkitRTCPeerConnection.prototype.getLocalStreams = function() {
            return this.localStreams;
        };
        webkitRTCPeerConnection.prototype.getRemoteStreams = function() {
            return this.remoteStreams;
        };
    }
} else {
    console.log("Browser does not appear to be WebRTC-capable");
}*/


