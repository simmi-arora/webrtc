/**************************************************************
 Screenshare
 ****************************************************************/
'use strict';
"use strict";

var sourceId, screen_constraints, screenStreamId;
var isFirefox = typeof window.InstallTrigger !== 'undefined';
var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
var isChrome = !!window.chrome && !isOpera;
// var isMobileDevice = !!navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile/i);

var screenCallback;
var iceServers = [];
var signaler, screen, screenRoomid;
var screenShareButton;
var screenShareStreamLocal = null;


/**
 * function set up Srcreens share session RTC peer connection
 * @method
 * @name webrtcdevPrepareScreenShare
 * @param {function} callback
 */
function webrtcdevPrepareScreenShare(screenRoomid) {

    localStorage.setItem("screenRoomid ", screenRoomid);
    webrtcdev.log("[screenshare JS] webrtcdevPrepareScreenShare - screenRoomid : ", screenRoomid);
    webrtcdev.log("[screenshare JS] webrtcdevPrepareScreenShare - filling up iceServers : ", turn, webrtcdevIceServers);

    scrConn = new RTCMultiConnection(),
        scrConn.channel = screenRoomid,
        scrConn.socketURL = location.hostname + ":8085/" ,
        scrConn.session = {
            screen: true,
            oneway: true
        },
        scrConn.sdpConstraints.mandatory = {
            OfferToReceiveAudio: false,
            OfferToReceiveVideo: true
        },
        // scrConn.dontCaptureUserMedia = false,

        scrConn.onMediaError = function (error, constraints) {
            webrtcdev.error(error, constraints);
            shownotificationWarning(error.name);
        },

        scrConn.onstream = function (event) {
            webrtcdev.log("[screenshareJS] on stream in _screenshare :", event);

            if (debug) {
                var nameBox = document.createElement("span");
                nameBox.innerHTML = "<br/>" + screenRoomid + "<br/>";
                getElementById(screenshareobj.screenshareContainer).appendChild(nameBox);
            }

            if (event.type == "remote" && event.type != "local") {
                // Remote got screen share stream
                shownotificationWarning("started streaming remote's screen");
                webrtcdev.log("[screensharejs] on stream remote ");

                if (event.stream.streamid) {
                    webrtcdev.log("remote screen event.stream.streamId " + event.stream.streamId);
                    screenStreamId = event.stream.streamid;
                } else if (event.streamid) {
                    webrtcdev.log("remote screen event.streamid " + event.streamid);
                    screenStreamId = event.streamid;
                }

                var video = document.createElement('video');
                var stream = event.stream;
                attachMediaStream(video, stream);
                //video.id = peerInfo.videoContainer;
                getElementById(screenshareobj.screenshareContainer).appendChild(video);
                getElementById(screenshareobj.screenshareContainer).hidden = false;
                rtcConn.send({
                    type: "screenshare",
                    screenid: screenRoomid,
                    message: "screenshareStartedViewing"
                });

            } else {
                // Local got screen share stream
                shownotificationWarning("started streaming local screen");
                webrtcdev.log("[screenshareJS] on stream local ");

                rtcConn.send({
                    type: "screenshare",
                    screenid: screenRoomid,
                    screenStreamid: screenStreamId,
                    message: "startscreenshare"
                });
            }

            //createScreenViewButton();

            // Event Listner for Screen share stream started
            onScreenShareStarted();
        },

        scrConn.onstreamended = function (event) {
            if (event)
                webrtcdev.log("[screenshare JS] onstreamended -", event);

            if (screenShareButton) {
                screenShareButton.className = screenshareobj.button.shareButton.class_off;
                screenShareButton.innerHTML = screenshareobj.button.shareButton.html_off;
            }
            //removeScreenViewButton();

            // event listener for Screen share stream ended
            onScreenShareSEnded();
        },

        scrConn.onopen = function (event) {
            webrtcdev.log("[screensharejs] scrConn onopen - ", scrConn.connectionType);
        },

        scrConn.onerror = function (err) {
            webrtcdev.error("[screensharejs] scrConn error - ", err);
        },

        scrConn.onEntireSessionClosed = function (event) {
            webrtcdev.log("[screensharejs] scrConn onEntireSessionClosed - ", event);
        },

        scrConn.socketMessageEvent = 'scrRTCMultiConnection-Message',
        scrConn.socketCustomEvent = 'scrRTCMultiConnection-Custom-Message';

    if (turn && turn != 'none') {
        if (!webrtcdevIceServers) {
            webrtcdev.error("[screensharejs] ICE server not found yet in screenshare session");
            alert("ICE server not found yet in screenshare session ");
        }
        scrConn.iceServers = webrtcdevIceServers;
    }

    return scrConn;
}

/**
 * Prepares screenshare , send open channel and handled open channel reponse ,calls getusermedia in callback
 * @method
 * @name webrtcdevSharescreen
 */
function webrtcdevSharescreen(scrroomid) {
    webrtcdev.log("[screenshareJS] webrtcdevSharescreen, preparing screenshare by initiating ScrConn , scrroomid - ", scrroomid);

    return new Promise((resolve, reject) => {
        scrConn = webrtcdevPrepareScreenShare(scrroomid)
        resolve(scrroomid);
    })
        .then(function (scrroomid) {
            if (socket) {
                webrtcdev.log("[screenshare JS] open-channel-screenshare on - ", socket.io.uri);
                socket.emit("open-channel-screenshare", {
                    channel: scrroomid,
                    sender: selfuserid,
                    maxAllowed: 6
                });
                shownotification("Making a new session for screenshare" + scrroomid);
            } else {
                webrtcdev.error("[screenshare JS] parent socket doesnt exist ");
            }

            socket.on("open-channel-screenshare-resp", function (event) {
                webrtcdev.log("[screenshare JS] open-channel-screenshare-response -", event);
                if (event.status && event.channel == scrroomid) {
                    scrConn.open(scrroomid, function () {
                        webrtcdev.log("[screenshare JS] webrtcdevSharescreen, opened up room for screen share ");
                    });
                }
            });
        });
}

/**
 * update info about a peer in list of peers (webcallpeers)
 * @method
 * @name updatePeerInfo
 * @param {string} userid
 * @param {string} username
 * @param {string} usercolor
 * @param {string} type
 */
function connectScrWebRTC(type, scrroomid) {
    webrtcdev.log("[screenshareJS] connectScrWebRTC, first preparing screenshare by initiating ScrConn , scrroomid - ", scrroomid);

    return new Promise((resolve, reject) => {
        webrtcdevPrepareScreenShare(scrroomid)
        resolve(scrroomid);
    })
        .then(function (scrroomid) {
            webrtcdev.log("[screenshare JS] connectScrWebRTC -> ", type, scrroomid);
            if (type == "join") {
                scrConn.join(scrroomid);
                shownotification("Connected with existing Screenshare channel " + scrroomid);
            } else {
                shownotification("Connection type not found for Screenshare ");
                webrtcdev.error("[screenshare JS] connectScrWebRTC - Connection type not found for Screenshare ");
            }
        });
}

/**
 * view screen being shared
 * @method
 * @name webrtcdevViewscreen
 * @param {string} roomid
 */
function webrtcdevViewscreen(roomid) {
    scrConn.join(roomid);
}

/**
 * function stop screen share session RTC peer connection
 * @method
 * @name webrtcdevStopShareScreen
 */
function webrtcdevStopShareScreen() {
    try {

        rtcConn.send({
            type: "screenshare",
            message: "stoppedscreenshare"
        });

        scrConn.closeEntireSession();
        webrtcdev.log("[screenshare JS] Sender stopped: screenRoomid ", screenRoomid,
            "| Screen stoppped ", scrConn,
            "| container ", getElementById(screenshareobj.screenshareContainer));

        if (screenShareStreamLocal) {
            screenShareStreamLocal.stop();
            screenShareStreamLocal = null;
        }

        let stream1 = scrConn.streamEvents.selectFirst()
        stream1.stream.getTracks().forEach(track => track.stop());

        webrtcdevCleanShareScreen();
    } catch (err) {
        webrtcdev.error("[screensharejs] webrtcdevStopShareScreen - ", err);
    }
}

/**
 * function clear screen share session RTC peer connection
 * @method
 * @name webrtcdevCleanShareScreen
 */
function webrtcdevCleanShareScreen(streamid) {
    try {
        scrConn.onstreamended();
        scrConn.removeStream(streamid);
        scrConn.close();
        scrConn = null;

        if (screenshareobj.screenshareContainer && getElementById(screenshareobj.screenshareContainer)) {
            getElementById(screenshareobj.screenshareContainer).innerHTML = "";
        }

    } catch (err) {
        webrtcdev.error("[screensharejs] webrtcdevStopShareScreen - ", err);
    }
}

/*
 * shows screenscre rtc conn of ongoing webrtc call 
 * @method
 * @name showScrConn
 */
this.showScrConn = function () {
    if (scrConn) {
        webrtcdev.info(" =========================================================================");
        webrtcdev.info(" srcConn : ", scrConn);
        webrtcdev.info(" srcConn.peers.getAllParticipants() : ", scrConn.peers.getAllParticipants());
        webrtcdev.info(" =========================================================================");
    } else {
        webrtcdev.debug(" Screen share is not active ");
    }
}


/**
 * Alert boxes for user if screen share isnt working
 * @method
 * @name screenshareNotification
 */
function resetAlertBox() {
    getElementById("alertBox").hidden = false;
    getElementById("alertBox").innerHTML = "";
}