
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

var iceServers=[];

var signaler,screen, roomid;

function getToken() {
    return Math.round(Math.random() * 9999999999) + 9999999999;
}


function webrtcdevScreenShare(){

    try{
        roomid= "screenshare"+"_"+getToken()+"_"+rtcMultiConnection.channel;
        screen = new Screen(roomid);

        screen.openSignalingChannel = function(callback) {
            var n = io.connect("/"+rtcMultiConnection.channel);
            n.channel = roomid;
            return n.on('message', callback);
        };

        screen.onaddstream = function(e) {
            document.getElementById(screenshareobj.screenshareContainer).innerHTML="";
            document.getElementById(screenshareobj.screenshareContainer).appendChild(e.video);
            document.getElementById(screenshareobj.screenshareContainer).hidden=false;
            if(e.type!="remote"){
                screen.broadcast(roomid);
            }
            createScreenViewButton();
        };

        /*screen.check();*/

        screen.onscreen = function(screen) {
            alert("onscreen  "+screen);
            if (self.detectedRoom) return;
            self.detectedRoom = true;
            self.view(screen);
        };

        screen.onuserleft = function(userid) {
            document.getElementById(screenshareobj.screenshareContainer).hidden=true;
            /*       
            var video = document.getElementById(userid);
            if(video) {
               // video.parentNode.removeChild(video);
            }*/
        };

        console.log("----------- screen" , screen);

    }catch(e){
        console.log("------------screenshare not supported ", e);
        $("#screenShareButton").hide();
        $("#viewScreenShareButton").hide();
    }
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
            screen.sharescr(roomid);
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

function displayScreen(stream){
    

    var video = document.createElement('video');
    video.id = 'self';
    video[isFirefox ? 'mozSrcObject' : 'src'] = isFirefox ? stream : URL.createObjectURL(stream);
    video.autoplay = true;
    video.controls = true;
    video.play();

    /*    
    var screenshareContainer = document.getElementById(screenshareobj.screenshareContainer);
    screenshareContainer.appendChild(video);*/

    screen.onaddstream({
        video: video,
        stream: stream,
        userid: 'self',
        type: 'local'
    });
}

function shareScreen(chromeMediaSourceId){

    var screen_constraints = {
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId:chromeMediaSourceId,
                maxWidth: window.screen.width > 1920 ? window.screen.width : 1920,
                maxHeight: window.screen.height > 1080 ? window.screen.height : 1080
            },
            optional: []
        }
    };
    navigator.getUserMedia(screen_constraints, 
        function(stream) {
            console.log(stream);
            /*
            stream.onended = function() {
                console.log("ended screen");
                if (self.onuserleft) self.onuserleft('self');
                changeScreenshareButtonStatus("on");
            };
            */
            displayScreen(stream);
        }, function(error) {
            if (isChrome && location.protocol === 'http:') {
                shownotification('You\'re not testing it on SSL origin (HTTPS domain) ');
            } else if (isChrome) {
                shownotification('Screen capturing is either denied or not supported. Please install chrome extension for screen capturing');
            } else if (isFirefox) {
                shownotification(Firefox_Screen_Capturing_Warning);
            }
            console.error(error);
    });
}

function getSourceId(callback) {
    if (!callback) throw '"callback" parameter is mandatory.';
    if(sourceId) return callback(sourceId);
    window.postMessage('get-sourceId', '*');
    console.log("posted getsource-ID");
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
            console.log(event.data.sourceId);
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

    // if following function is defined, it will be called if screen capturing extension seems available
    DetectRTC.screen.onScreenCapturingExtensionAvailable = function() {
        // hide inline-install button
        alert("onScreenCapturingExtensionAvailable , hide inline installation button ");
    };
}

// a middle-agent between public API and the Signaler object
Screen = function(channel) {
    var self = this;
    this.channel = channel || location.href.replace(/\/|:|#|%|\.|\[|\]/g, '');

    function initSignaler(roomid) {
        signaler = new Signaler(self, (roomid && roomid.length) || self.channel);
    }

    var Firefox_Screen_Capturing_Warning = 'Make sure that you are using Firefox Nightly and you enabled: media.getusermedia.screensharing.enabled flag from about:config page. You also need to add your domain in "media.getusermedia.screensharing.allowed_domains" flag.';

    this.sharescr = function(roomid) {
        getSourceId(shareScreen);
    };

    this.onscreen = function(room) {
        if (self.detectedRoom) return;
        self.detectedRoom = true;
        self.view(room);
    };

    this.broadcast=function(roomid){
       !signaler && initSignaler(roomid);
        signaler.broadcast({
            roomid: roomid , 
            userid: self.userid
        });
    };

    this.view = function(room) {
        !signaler && initSignaler();
        signaler.join({
            to: room.userid,
            roomid: room.roomid
        });
    };

    this.check = initSignaler;
};

// it is a backbone objectc
function Signaler(root, roomid) {
    var socket;

    // unique identifier for the current user
    var userid = root.userid || getToken();

    if (!root.userid) {
        root.userid = userid;
    }

    // self instance
    var signaler = this;

    // object to store all connected peers
    var peers = {};

    // object to store ICE candidates for answerer
    var candidates = {};

    var numberOfParticipants = 0;

    // it is called when your signaling implementation fires "onmessage"
    this.onmessage = function(message) {
        // if new room detected
        console.log("Signaler this.onmessage ", roomid ,  message);
        if(message.roomid!=null && message.userid!=null){
            screen_roomid =message.roomid;
            screen_userid =message.userid;
            console.log("incoming shared screen");
        }
        if (message.roomid == roomid && message.broadcasting && !signaler.sentParticipationRequest){
            screen.onscreen(message);
        }else {
            // for pretty logging
            console.debug(JSON.stringify(message, function(key, value) {
                if (value.sdp) {
                    console.log(value.sdp.type, '————', value.sdp.sdp);
                    return '';
                } else return value;
            }, '————'));
        }

        // if someone shared SDP
        if (message.sdp && message.to == userid)
            this.onsdp(message);

        // if someone shared ICE
        if (message.candidate && message.to == userid)
            this.onice(message);

        // if someone sent participation request
        if (message.participationRequest && message.to == userid) {
            var _options = options;
            _options.to = message.userid;
            _options.stream = root.stream;
            peers[message.userid] = Offer.createOffer(_options);
            numberOfParticipants++;
            if (root.onNumberOfParticipantsChnaged) root.onNumberOfParticipantsChnaged(numberOfParticipants);
        }
    };

    // if someone shared SDP
    this.onsdp = function(message) {
        var sdp = JSON.parse(message.sdp);

        if (sdp.type == 'offer') {
            var _options = options;
            _options.stream = root.stream;
            _options.sdp = sdp;
            _options.to = message.userid;
            peers[message.userid] = Answer.createAnswer(_options);
        }

        if (sdp.type == 'answer') {
            peers[message.userid].setRemoteDescription(sdp);
        }
    };

    // if someone shared ICE
    this.onice = function(message) {
        message.candidate = JSON.parse(message.candidate);

        var peer = peers[message.userid];
        if (!peer) {
            var candidate = candidates[message.userid];
            if (candidate) candidates[message.userid][candidate.length] = message.candidate;
            else candidates[message.userid] = [message.candidate];
        } else {
            peer.addIceCandidate(message.candidate);

            var _candidates = candidates[message.userid] || [];
            if (_candidates.length) {
                for (var i = 0; i < _candidates.length; i++) {
                    peer.addIceCandidate(_candidates[i]);
                }
                candidates[message.userid] = [];
            }
        }
    };

    // it is passed over Offer/Answer objects for reusability
    var options = {
        onsdp: function(sdp, to) {
            console.log('local-sdp', JSON.stringify(sdp.sdp, null, '\t'));

            signaler.signal({
                sdp: JSON.stringify(sdp),
                to: to
            });
        },
        onicecandidate: function(candidate, to) {
            signaler.signal({
                candidate: JSON.stringify(candidate),
                to: to
            });
        },
        onaddstream: function(stream, _userid) {
            alert("options onaddstream");
            console.log('onaddstream>>>>>>'+ stream);
            //document.getElementById("viewScreenShareButton").disabled=false;
            /*document.getElementById("viewScreenShareButton").removeAttribute("disabled");*/

            stream.onended = function() {
                if (root.onuserleft) root.onuserleft(_userid);
            };

            var video = document.createElement('video');
            video.id = _userid;
            video[isFirefox ? 'mozSrcObject' : 'src'] = isFirefox ? stream : window.webkitURL.createObjectURL(stream);
            video.autoplay = true;
            video.controls = true;
            video.play();

            function onRemoteStreamStartsFlowing() {
                if (isMobileDevice) {
                    return afterRemoteStreamStartedFlowing();
                }

                if (!(video.readyState <= HTMLMediaElement.HAVE_CURRENT_DATA || video.paused || video.currentTime <= 0)) {
                    afterRemoteStreamStartedFlowing();
                } else
                    setTimeout(onRemoteStreamStartsFlowing, 300);
            }

            function afterRemoteStreamStartedFlowing() {
                if (!screen.onaddstream) return;
                screen.onaddstream({
                    video: video,
                    stream: stream,
                    userid: _userid,
                    type: 'remote'
                });
            }

            onRemoteStreamStartsFlowing();
        }
    };

    // call only for session initiator
    this.broadcast = function(_config) {
        signaler.roomid = _config.roomid || getToken();

        if (_config.userid) {
            userid = _config.userid;
        }

        signaler.isbroadcaster = true;
        alert("signaler broadcast"+ signaler.roomid);

        (function transmit() {
            signaler.signal({
                roomid: signaler.roomid,
                broadcasting: true
            });

            if (!signaler.stopBroadcasting && !root.transmitOnce)
                setTimeout(transmit, 3000);
        })();

        // if broadcaster leaves; clear all JSON files from Firebase servers
        if (socket.onDisconnect) socket.onDisconnect().remove();
    };

    // called for each new participant
    this.join = function(_config) {
        signaler.roomid = _config.roomid;
        this.signal({
            participationRequest: true,
            to: _config.to
        });
        signaler.sentParticipationRequest = true;
    };

    window.addEventListener('beforeunload', function() {
        leaveScreenRoom();
    }, false);

    window.addEventListener('keyup', function(e) {
        if (e.keyCode == 116) {
            leaveScreenRoom();
        }
    }, false);

    function leaveScreenRoom() {
        signaler.signal({
            leaving: true
        });

        /*           
        rtcMultiConnection.removeStream({
            screen: true,  // it will remove all screen streams
            stop: true     // ask to stop old stream
        });*/
        
        rtcMultiConnection.removeStream(roomid);

        socket.emit("leave-channel", {
            channel: roomid,
            sender: rtcMultiConnection.userid
        });

        // stop broadcasting room
        if (signaler.isbroadcaster) signaler.stopBroadcasting = true;

        // leave user media resources
        if (root.stream) root.stream.stop();

        // if firebase; remove data from their servers
        if (window.Firebase) socket.remove();

        changeScreenshareButtonStatus("on");
        alert("Leaving");
    }

    root.leave = leaveScreenRoom;

    // custom signaling implementations
    // e.g. WebSocket, Socket.io, SignalR, WebSycn, XMLHttpRequest, Long-Polling etc.
    socket = root.openSignalingChannel(function(message) {
        message = JSON.parse(message);

        var isRemoteMessage = false;
        if (typeof userid === 'number' && parseInt(message.userid) != userid) {
            isRemoteMessage = true;
        }
        if (typeof userid === 'string' && message.userid + '' != userid) {
            isRemoteMessage = true;
        }

        if (isRemoteMessage) {
            if (message.to) {
                if (typeof userid == 'number') message.to = parseInt(message.to);
                if (typeof userid == 'string') message.to = message.to + '';
            }

            if (!message.leaving) signaler.onmessage(message);
            else {
                root.onuserleft(message.userid);
                numberOfParticipants--;
                if (root.onNumberOfParticipantsChnaged) root.onNumberOfParticipantsChnaged(numberOfParticipants);
            }
        }
    });

    // method to signal the data
    this.signal = function(data) {
        data.userid = userid;
        socket.send(JSON.stringify(data));
    };

}



var optionalArgument = {
    optional: [{
        DtlsSrtpKeyAgreement: true
    }]
};


function getIceServersAsArray(iceServers){
    if (!isNull(iceServers)) {
        console.log(toStr(iceServers));
        var iceTransports='all';
        var iceCandidates = this.rtcMultiConnection.candidates;

        var stun = iceCandidates.stun;
        var turn = iceCandidates.turn;
        var host = iceCandidates.host;

        if (!isNull(iceCandidates.reflexive)) stun = iceCandidates.reflexive;
        if (!isNull(iceCandidates.relay)) turn = iceCandidates.relay;

        if (!host && !stun && turn) {
            iceTransports = 'relay';
        } else if (!host && !stun && !turn) {
            iceTransports = 'none';
        }

        this.iceServers = {
            iceServers: iceServers,
            iceTransports: iceTransports
        };
    } else {
        iceServers = null;
    }

    console.log('ScreenSharing --> rtc-configuration', toStr(this.iceServers));    

    return this.iceServers;
}

function onSdpSuccess() {}

function onSdpError(e) {
    console.error('sdp error:', e);
}

var offerConstraints = {
    optional: [],
    mandatory: {
        OfferToReceiveAudio: false,
        OfferToReceiveVideo: false
    }
};
var Offer = {
    createOffer: function(config) {
        iceServers=getIceServersAsArray(webrtcdevIceServers);
        var peer = new RTCPeerConnection(iceServers, optionalArgument);

        peer.addStream(config.stream);
        peer.onicecandidate = function(event) {
            if (event.candidate) config.onicecandidate(event.candidate, config.to);
        };

        peer.createOffer(function(sdp) {
            sdp.sdp = setBandwidth(sdp.sdp);
            peer.setLocalDescription(sdp);
            config.onsdp(sdp, config.to);
        }, onSdpError, offerConstraints);

        this.peer = peer;

        return this;
    },
    setRemoteDescription: function(sdp) {
        console.log("Screen share-->setting Offer remote descriptions", sdp.sdp);
        this.peer.setRemoteDescription(new RTCSessionDescription(sdp), onSdpSuccess, onSdpError);
    },
    addIceCandidate: function(candidate) {
        console.log("Screen share-->adding ice", candidate.candidate);
        this.peer.addIceCandidate(new RTCIceCandidate({
            sdpMLineIndex: candidate.sdpMLineIndex,
            candidate: candidate.candidate
        }));
    }
};

var answerConstraints = {
    optional: [],
    mandatory: {
        OfferToReceiveAudio: false,
        OfferToReceiveVideo: true
    }
};
var Answer = {
    createAnswer: function(config) {
        iceServers=getIceServersAsArray(webrtcdevIceServers);
        var peer = new RTCPeerConnection(iceServers, optionalArgument);

        peer.onaddstream = function(event) {
            config.onaddstream(event.stream, config.to);
        };
        peer.onicecandidate = function(event) {
            if (event.candidate) config.onicecandidate(event.candidate, config.to);
        };

        peer.setRemoteDescription(new RTCSessionDescription(config.sdp), onSdpSuccess, onSdpError);
        peer.createAnswer(function(sdp) {
            sdp.sdp = setBandwidth(sdp.sdp);
            peer.setLocalDescription(sdp);
            config.onsdp(sdp, config.to);
        }, onSdpError, answerConstraints);

        this.peer = peer;
        return this;
    },
    addIceCandidate: function(candidate) {
        this.peer.addIceCandidate(new RTCIceCandidate({
            sdpMLineIndex: candidate.sdpMLineIndex,
            candidate: candidate.candidate
        }));
    }
};

function setBandwidth(sdp) {
    if (isFirefox) return sdp;
    if (isMobileDevice) return sdp;

    // https://cdn.rawgit.com/muaz-khan/RTCMultiConnection/master/RTCMultiConnection-v3.0/dev/BandwidthHandler.js
    if (typeof BandwidthHandler !== 'undefined') {
        window.isMobileDevice = isMobileDevice;
        window.isFirefox = isFirefox;

        var bandwidth = {
            screen: 300, // 300kbits minimum
            video: 256 // 256kbits (both min-max)
        };
        var isScreenSharing = false;

        sdp = BandwidthHandler.setApplicationSpecificBandwidth(sdp, bandwidth, isScreenSharing);
        sdp = BandwidthHandler.setVideoBitrates(sdp, {
            min: bandwidth.video,
            max: bandwidth.video
        });
        return sdp;
    }

    // removing existing bandwidth lines
    sdp = sdp.replace(/b=AS([^\r\n]+\r\n)/g, '');

    // "300kbit/s" for screen sharing
    sdp = sdp.replace(/a=mid:video\r\n/g, 'a=mid:video\r\nb=AS:300\r\n');

    return sdp;
}