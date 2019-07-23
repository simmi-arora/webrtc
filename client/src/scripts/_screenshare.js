/**************************************************************
Screenshare 
****************************************************************/
'use strict';
"use strict";
var chromeMediaSource = 'screen';
var sourceId , screen_constraints , screenStreamId;
var isFirefox = typeof window.InstallTrigger !== 'undefined';
var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
var isChrome = !!window.chrome && !isOpera;
// var isMobileDevice = !!navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile/i);

var screenCallback ;
var iceServers=[];
var signaler,screen,screenRoomid;
var screenShareButton ;
var screenShareStreamLocal = null;

/**
 * function to get the sourceID from chorme extension 
 * @method
 * @name getSourceId
 * @param {function} callback
 * @param {string} audioPlusTab
 */
/* getsourceID in RTCmtulconn has been commented to make the below one active */
function getSourceId(callback, audioPlusTab) {
    webrtcdev.info("[screenshareJS] getSourceId from extension via postMessage to background");
    if (!callback)
        throw '"callback" parameter is mandatory.';

    window.postMessage("webrtcdev-extension-getsourceId", "*");
}

/**
 * function to get the sourceID from chorme extension 
 * @method
 * @name getSourceId
 * @param {function} callback
 * @param {string} audioPlusTab
 */
function getChromeExtensionStatus(extensionid, callback) {
    if (2 != arguments.length && (callback = extensionid, extensionid = window.RMCExtensionID || "ajhifddimkapgcifgcodmmfdlknahffk"), isFirefox)
        return callback("not-chrome");
    
    if(!extensionid)
        return callback("Null extensionID");

    try{
        var image = document.createElement("img");
        image.src = "chrome-extension://" + extensionid + "/icon.png",
        image.onload = function() {
            webrtcdev.info("[screenshareJS] getChromeExtensionStatus , screenshare extension " , image.src);
            chromeMediaSource = "screen",
            window.postMessage("webrtcdev-extension-presence", "*"),
            setTimeout(function() {
                callback("screen" == chromeMediaSource ? extensionid == extensionid ? "installed-enabled" : "installed-disabled" : "installed-enabled")
            }, 2e3);
        },
        image.onerror = function() {
            webrtcdev.error("No screenshare extension " , image.src);
            callback("not-installed");
        }
    }catch(e){
        webrtcdev.error("Screenshare extension image not found chrome-extension://" , extensionid , "/icon.png" , e)
        callback("not-installed");
    }
}

/**
 * function to find if chromeMedia source is desktop or screen
 * @method
 * @name isChromeExtensionAvailable
 * @param {function} callback
 */
function isChromeExtensionAvailable(callback) {
    if (callback) {
        if (isFirefox)
            return isFirefoxExtensionAvailable(callback);
        if ("desktop" == chromeMediaSource)
            return callback(!0);
        window.postMessage("webrtcdev-extension-presence", "*"),
        setTimeout(function() {
            callback("screen" == chromeMediaSource ? !1 : !0)
        }, 2e3)
    }
}

/**
 * function set up Srcreens share session RTC peer connection 
 * @method
 * @name webrtcdevPrepareScreenShare
 * @param {function} callback
 */
function webrtcdevPrepareScreenShare(callback){
    webrtcdev.log("[screenshareJS] webrtcdevPrepareScreenShare ");

    var time        = new Date().getUTCMilliseconds(); 
    if(screenRoomid == null)
        screenRoomid = "screenshare"+"_"+sessionid+"_"+time;

    localStorage.setItem("screenRoomid " , screenRoomid);
    webrtcdev.log("[screenshare JS] webrtcdevPrepareScreenShare" + screenRoomid);
    webrtcdev.log("[screenshare JS] filling up iceServers " , turn , webrtcdevIceServers);

    scrConn  = new RTCMultiConnection(),
    scrConn.channel     = screenRoomid,
    scrConn.socketURL   = location.hostname+":8085/" ,
    scrConn.session = {
        screen: true,
        oneway: true
    },
    scrConn.sdpConstraints.mandatory = {
        OfferToReceiveAudio: false,
        OfferToReceiveVideo: true
    },
    // scrConn.dontCaptureUserMedia = false,

    scrConn.onMediaError = function(error, constraints) {
        webrtcdev.error(error, constraints);
        shownotificationWarning(error.name);
    },

    scrConn.onstream = function(event) {
        webrtcdev.log("[screenshareJS] on stream in _screenshare :" , event);

        if (debug) {
            var nameBox = document.createElement("span");
            nameBox.innerHTML = "<br/>" + screenRoomid + "<br/>";
            document.getElementById(screenshareobj.screenshareContainer).appendChild(nameBox);
        }

        // if(event.stream.isScreen){
            if(event.type=="remote" && event.type!="local"){
                shownotificationWarning("started streaming remote's screen");
                webrtcdev.log("[screensharejs] on stream remote ");
                var userid = event.userid;
                var type = event.type;
                var stream = event.stream;
                if(event.stream.streamid){
                    webrtcdev.log("remote screen event.stream.streamId " + event.stream.streamId);
                    screenStreamId=event.stream.streamid;                    
                }else if(event.streamid){
                    webrtcdev.log("remote screen event.streamid " + event.streamid);
                    screenStreamId=event.streamid;  
                }

                var video = document.createElement('video');
                //video.autoplay="autoplay";
                attachMediaStream(video, stream);
                //video.id = peerInfo.videoContainer;
                document.getElementById(screenshareobj.screenshareContainer).appendChild(video);
                document.getElementById(screenshareobj.screenshareContainer).hidden=false;
                rtcConn.send({
                    type:"screenshare", 
                    screenid: screenRoomid,
                    message:"screenshareStartedViewing"
                });

            }else{
                shownotificationWarning("started streaming local screen");
                webrtcdev.log("[screenshareJS] on stream local ")
                //screenshareNotification("","screenshareBegin"); 
                rtcConn.send({
                    type:"screenshare", 
                    screenid: screenRoomid,
                    screenStreamid: screenStreamId,
                    message:"startscreenshare"
                });

            }

            //createScreenViewButton();

            // Event Listner for Screen share stream started 
            onScreenShareStarted();

            /*scrConn.videosContainer.appendChild(event.mediaElement);
            event.mediaElement.play();
            setTimeout(function() {
                event.mediaElement.play();
            }, 5000);*/
        //}
    },

    scrConn.onstreamended = function(event) {
        if(event)
            webrtcdev.log("[screenshare JS] onstreamended -" , event);
    
        if(document.getElementById(screenshareobj.screenshareContainer)){
            document.getElementById(screenshareobj.screenshareContainer).innerHTML="";
        }

        scrConn.removeStream(screenStreamId);
        if(screenShareButton){
            screenShareButton.className = screenshareobj.button.shareButton.class_off;
            screenShareButton.innerHTML = screenshareobj.button.shareButton.html_off;
        }
        //removeScreenViewButton();

        // event listener for Screen share stream ended 
        onScreenShareSEnded();
    },
    
    scrConn.onopen = function (event) {    
        webrtcdev.log("[screensharejs ] scrConn onopen - " , scrConn.connectionType);
    },

    scrConn.onerror = function (err) {    
        webrtcdev.error("[screensharejs ]scrConn error - " , err);
    },

    scrConn.onEntireSessionClosed = function(event){
        webrtcdev.log("[screensharejs ] scrConn onEntireSessionClosed " , event);
    },

    scrConn.socketMessageEvent = 'scrRTCMultiConnection-Message',
    scrConn.socketCustomEvent = 'scrRTCMultiConnection-Custom-Message';

    if(turn && turn!='none'){
        if(!webrtcdevIceServers) {
            alert(" [screenshare JS] ICE server not found yet in screenshare session ");
        }
        scrConn.iceServers  = webrtcdevIceServers;      
    } 

    webrtcdev.info("[screensharejs] srcConn" , scrConn);
    webrtcdev.log("[screenshare JS] webrtcdevscreenshare calling callback for socket.io operations");
    //alert(" Preparing Screenshare "+ screenRoomid);
    setTimeout(callback(screenRoomid), 3000);
}

/**
 * Prepares screenshare , send open channel and handled open channel reponse ,calls getusermedia in callback
 * @method
 * @name webrtcdevSharescreen
 */
function webrtcdevSharescreen() {
    webrtcdev.log("[screenshare JS] webrtcdevSharescreen , preparing screenshare by initiating ScrConn");

    webrtcdevPrepareScreenShare(function(scrroomid){
        webrtcdev.log("[screenshare JS] call back from webrtcdevPrepareScreenShare , turn dontCaptureUserMedia to false");
        //var selfuserid = "temp_"+(new Date().getUTCMilliseconds());
        //scrConn.dontCaptureUserMedia = false,
        scrConn.getUserMedia();
        scrConn.open(scrroomid, function() {
            if(socket){
                webrtcdev.log("[screenshare JS] Event : open-channel-screenshare with ", socket.io.uri);
                socket.emit("open-channel-screenshare", {
                    channel    : scrroomid,
                    sender     : selfuserid,
                    maxAllowed : 6
                });
                shownotification("Making a new session for screenshare" + scrroomid);
            }else{
                webrtcdev.error("socket doesnt exist ");
            }
        });

        socket.on("open-channel-screenshare-resp",function(event) {
            webrtcdev.log("[screenshare JS] Event Handler : open-channel-screenshare-response " , event);
            if(event) connectScrWebRTC("open" , scrroomid, selfuserid, []); 
        });
    });
    /*    
    if(Object.keys(scrConn.streamEvents).length>2){   
        scrConn.addStream({
            screen: true,
            oneway: true
        });
        shownotification(" ReStarting Screenshare session "+roomid);
        rtcMultiConnection.send({
            type:"screenshare", 
            message:roomid
        });
        return ;
    }*/

    //webrtcdev.log("webrtcdevscreenshare . srcConn = " , scrConn , " | rtcConn = " ,  rtcConn);
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
function connectScrWebRTC(type, scrroomid , userid , remoteUsers){
    webrtcdev.log("[screenshare JS] connectScrWebRTC -> " , type, scrroomid , userid , remoteUsers);
    if(type=="open"){
        scrConn.openOrJoin(scrroomid);
        shownotification("Connected to "+ scrroomid + " for screenshare ");
    }else if(type=="join"){
        scrConn.join(scrroomid);
        shownotification("Connected with existing Screenshare channel "+ scrroomid);
    }else{
        shownotification("Connection type not found for Screenshare ");
        webrtcdev.error("[screenshare JS] connectScrWebRTC - Connection type not found for Screenshare ");
    }
}

/**
 * get screen contrsiants for get user media on screen 
 * @method
 * @name webrtcdevScreenConstraints
 * @param {string} chromeMediaSourceId
 */
function webrtcdevScreenConstraints(chromeMediaSourceId) {
    webrtcdev.log("[screenshare JS] webrtcdevScreenConstraits  - chromeMediaSourceId: ", chromeMediaSourceId);
    screen_constraints = {
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: chromeMediaSourceId,
                maxWidth: window.screen.width > 1920 ? window.screen.width : 1920,
                maxHeight: window.screen.height > 1080 ? window.screen.height : 1080
            },
            optional: []
        }
    };
    
    try {
        webrtcdev.log("[screenshare JS] screen getusermedia ");
        navigator.getUserMedia(screen_constraints ,
            function stream(event) {
                webrtcdev.log("[screenshare JS] screen stream event and container "  , event , screenshareobj.screenshareContainer);
                //scrConn.onstream(event);
                //screenStreamId = event.streamid;
                //var videosContainer = document.createElement("video");
                //videosContainer.src = window.URL.createObjectURL(event);
                //container.appendChild(videosContainer);
                //videosContainer.appendChild(event.mediaElement);
                var stream = event;
                screenShareStreamLocal = event;
                webrtcdev.log("[screenshare JS] Stream from getUserMedia" , stream);
                stream.type = "local",
                //scrConn.setStreamEndHandler(stream),
                getRMCMediaElement(stream, function(mediaElement) {
                    webrtcdev.log("[screenshare JS] getRMCMediaElement Callback , streamid = " + stream.streamid +" ,  id = " + stream.id);
                    if(stream.streamid){
                        webrtcdev.log("[screenshare JS] getRMCMediaElement Callback  ,  using streamid");
                        mediaElement.id = stream.streamid,
                        mediaElement.muted = !0,
                        mediaElement.volume = 0,
                        -1 === scrConn.attachStreams.indexOf(stream) && scrConn.attachStreams.push(stream),
                        "undefined" != typeof StreamsHandler && StreamsHandler.setHandlers(stream, !0, scrConn),
                        scrConn.streamEvents[stream.streamid] = {
                            stream: stream,
                            type: "local",
                            mediaElement: mediaElement,
                            userid: scrConn.userid,
                            extra: scrConn.extra,
                            streamid: stream.streamid,
                            blobURL: mediaElement.src || URL.createObjectURL(stream),
                            /*blobURL: mediaElement.src || mediaElement.srcObject ,*/
                            isAudioMuted: !0
                        };
                        scrConn.onstream(scrConn.streamEvents[stream.streamid])
                    }else if(stream.id){
                        webrtcdev.log("[screenshare JS] getRMCMediaElement Callback  ,  using id");
                        mediaElement.id = stream.id,
                        mediaElement.muted = !0,
                        mediaElement.volume = 0,
                        -1 === scrConn.attachStreams.indexOf(stream) && scrConn.attachStreams.push(stream),
                        "undefined" != typeof StreamsHandler && StreamsHandler.setHandlers(stream, !0, scrConn),
                        scrConn.streamEvents[stream.id] = {
                            stream: stream,
                            type: "local",
                            mediaElement: mediaElement,
                            userid: scrConn.userid,
                            extra: scrConn.extra,
                            streamid: stream.id,
                            blobURL: mediaElement.src || URL.createObjectURL(stream),
                            /*blobURL: mediaElement.src || mediaElement.srcObject ,*/
                            isAudioMuted: !0
                        };
                        webrtcdev.log(" [screenshare JS] Stream object  " , scrConn.streamEvents[stream.id]);
                        /*setHarkEvents(scrConn, scrConn.streamEvents[stream.streamid]),*/
                        /*setMuteHandlers(scrConn, scrConn.streamEvents[stream.streamid]),*/
                        scrConn.onstream(scrConn.streamEvents[stream.id])
                    }else{
                        alert("screenshare has neither streamid not id");
                    }
                }, scrConn);
            },
            function error(err) {
                webrtcdev.error("[screenshare JS] Error in webrtcdevScreenConstraints " , err);
                if (isChrome && location.protocol === 'http:') {
                    alert('Please test this WebRTC experiment on HTTPS.');
                } else if(isChrome) {
                    alert('Screen capturing is either denied or not supported. Please install chrome extension for screen capturing or run chrome with command-line flag: --enable-usermedia-screen-capturing');
                } else if(!!navigator.mozGetUserMedia) {
                    alert(Firefox_Screen_Capturing_Warning);
                }
            }
        );
   }catch(e){
        webrtcdev.log("[screenshare JS] Error in webrtcdevScreenConstraints " , err);
   }

}

function getRMCMediaElement(stream, callback, connection) {
    webrtcdev.log("[screenshare JS] getRMCMediaElement "  , stream , connection);
    var isAudioOnly = !1;
    stream.getVideoTracks && !stream.getVideoTracks().length && (isAudioOnly = !0);
    var mediaElement = document.createElement(isAudioOnly ? "audio" : "video");
    /*        
    mediaElement[isFirefox ? "mozSrcObject" : "src"] = isFirefox ? stream : window.URL.createObjectURL(stream),
        [Deprecation] URL.createObjectURL with media streams is deprecated and will be removed in M68, around July 2018. 
        Please use HTMLMediaElement.srcObject instead. 
        See https://www.chromestatus.com/features/5618491470118912 for more details.*/

    return  ( 
        mediaElement["src"] = stream,
        mediaElement.controls = !0,
        isFirefox && mediaElement.addEventListener("ended", function() {
            if (currentUserMediaRequest.remove(stream.idInstance), "local" === stream.type) {
                StreamsHandler.onSyncNeeded(stream.streamid, "ended"),
                connection.attachStreams.forEach(function(aStream, idx) {
                    stream.streamid === aStream.streamid && delete connection.attachStreams[idx]
                });
                var newStreamsArray = [];
                connection.attachStreams.forEach(function(aStream) {
                    aStream && newStreamsArray.push(aStream)
                }),
                connection.attachStreams = newStreamsArray;
                var streamEvent = connection.streamEvents[stream.streamid];
                if (streamEvent)
                    return void connection.onstreamended(streamEvent);
                this.parentNode && this.parentNode.removeChild(this)
            }
        }, !1),
    mediaElement.play(),
    void callback(mediaElement))
}

function webrtcdevViewscreen(roomid){
    scrConn.join(roomid);
}

/**
 * function stop screen share session RTC peer connection 
 * @method
 * @name webrtcdevStopShareScreen
 */
function webrtcdevStopShareScreen(){
    try{
        /*
        scrConn.removeStream({
            screen: true,  // it will remove all screen streams
            stop: true     // ask to stop old stream
        });*/
        if(screenshareobj.screenshareContainer)
            document.getElementById(screenshareobj.screenshareContainer).innerHTML="";

        rtcConn.send({
            type:"screenshare", 
            screenid: screenRoomid,
            screenStreamid: screenStreamId,
            message:"stoppedscreenshare"
        });

        window.postMessage("webrtcdev-extension-stopsource", "*");
        //scrConn.onstreamended();
        //scrConn.close();
        scrConn.closeEntireSession();
        webrtcdev.log("[screenshare JS] Sender stopped: screenRoomid "+ screenRoomid +" || Screen stoppped "  , scrConn , document.getElementById(screenshareobj.screenshareContainer));
        
        if(screenShareStreamLocal){
            screenShareStreamLocal.stop();
            screenShareStreamLocal=null;        
        }
        //scrConn.videosContainer.hidden=true;
        /*scrConn.leave();*/
        //removeScreenViewButton();

    }catch(e){
        webrtcdev.error(e);
    }
}

/**
 * find if view button is provided or need to be created 
 * @method
 * @name createOrAssignScreenviewButton
 */
function createOrAssignScreenviewButton(){
    if(screenshareobj.button.viewButton.id && document.getElementById(screenshareobj.button.viewButton.id)) 
        let button =document.getElementById(screenshareobj.button.viewButton.id);
        assignScreenViewButton(button);
    else
        createScreenViewButton();
}

/**
 * create the view button for screnshare
 * @method
 * @name createScreenViewButton
 */
function createScreenViewButton(){
    if(document.getElementById("viewScreenShareButton"))
        return;
    var viewScreenShareButton= document.createElement("span");
    viewScreenShareButton.className=screenshareobj.button.viewButton.class_off;
    viewScreenShareButton.innerHTML=screenshareobj.button.viewButton.html_off;
    viewScreenShareButton.id="viewScreenShareButton";
    webrtcdevViewscreen(screenRoomid);
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

    if(document.getElementById("topIconHolder_ul")){
        var li =document.createElement("li");
        li.appendChild(viewScreenShareButton);
        document.getElementById("topIconHolder_ul").appendChild(li);
    }
}

/**
 * assign the view button for screnshare with existing buttom dom
 * @method
 * @name assignScreenViewButton
 */
function assignScreenViewButton(button){
    /*    
    if(document.getElementById(screenshareobj.button.viewButton.id))
        return;*/
    webrtcdevViewscreen(screenRoomid);
    button.onclick = function() {
        if(button.className==screenshareobj.button.viewButton.class_off){
            document.getElementById(screenshareobj.screenshareContainer).hidden=false;
            button.className=screenshareobj.button.viewButton.class_on;
            button.innerHTML=screenshareobj.button.viewButton.html_on;
        }else if(button.className==screenshareobj.button.viewButton.class_on){
            document.getElementById(screenshareobj.screenshareContainer).hidden=true;
            button.className=screenshareobj.button.viewButton.class_off;
            button.innerHTML=screenshareobj.button.viewButton.html_off;
        }
    };
}

/**
 * if viewScreenShareButton button exists , remove it
 * @method
 * @name removeScreenViewButton
 */
function removeScreenViewButton(){
    if(document.getElementById("viewScreenShareButton")){
        var elem = document.getElementById("viewScreenShareButton");
        elem.parentElement.removeChild(elem);
    }
    return;
}

/**
 * depricated after chrome removed inline installation : creates inline installation button for chrome 
 * @method
 * @name createScreenInstallButton
 */
function createScreenInstallButton(extensionID){
    var button= document.createElement("span");
    button.className = screenshareobj.button.installButton.class_off;
    button.innerHTML = screenshareobj.button.installButton.html_off;
    button.id="screeninstallButton";
    button.onclick = function(e) {    
        chrome.webstore.install("https://chrome.google.com/webstore/detail/"+extensionID,
        function(){
            webrtcdev.log("Chrome extension inline installation - success. createOrAssignScreenshareButton with " , screenshareobj);
            button.hidden = true;
            getSourceId(function () { }, true);
            createOrAssignScreenshareButton(screenshareobj);

        },function (err){
            webrtcdev.log("Chrome extension inline installation - fail " , err);
        });
        // Prevent the opening of the Web Store page
        e.preventDefault();
    };
    var li =document.createElement("li");
    li.appendChild(button);
    document.getElementById("topIconHolder_ul").appendChild(li);
}

function assignScreenInstallButton(extensionID) {
    var button = document.getElementById(screenshareobj.button.installButton.id);
    button.onclick= function(e) {    
        chrome.webstore.install("https://chrome.google.com/webstore/detail/"+extensionID,
            function(){
                webrtcdev.log("Chrome extension inline installation - success from assignScreenInstallButton. Now createOrAssignScreenshareButton with " , screenshareobj);
                button.hidden = true;
                getSourceId(function () { }, true);
                createOrAssignScreenshareButton(screenshareobj);
            },function (e){
                webrtcdev.error("Chrome extension inline installation - fail " , e);
            });
        // Prevent the opening of the Web Store page
        e.preventDefault();
    }
}

/**
 * If not screenshare widget enbaled or the platfom is not supported for chrome extensions , hide screen instal button
 * @method
 * @name hideScreenInstallButton
 */
function hideScreenInstallButton(){
    var button=document.getElementById(screenshareobj.button.installButton.id);
    button.hidden=true;
    button.setAttribute("style","display:none");
}

/**
 * If button id are present then assign sreen share button or creatr a new one
 * @method
 * @name createOrAssignScreenshareButton
 * @param {json} screenshareobject
 */
function createOrAssignScreenshareButton(screenshareobj){
    webrtcdev.log( "createOrAssignScreenshareButton " , screenshareobj);
    if(screenshareobj.button.shareButton.id && document.getElementById(screenshareobj.button.shareButton.id)) {
        assignScreenShareButton(screenshareobj.button.shareButton);
        hideScreenInstallButton();
        showScreenShareButton();
    }    
    else{
        createScreenShareButton();
    }
}

/**
 * create Screen share Button
 * @method
 * @name createScreenshareButton
 */
function createScreenshareButton(){
    screenShareButton= document.createElement("span");
    screenShareButton.className = screenshareobj.button.shareButton.class_off;
    screenShareButton.innerHTML = screenshareobj.button.shareButton.html_off;
    screenShareButton.id="screenShareButton";
    screenShareButton.onclick = function(event) {    
        if(screenShareButton.className==screenshareobj.button.shareButton.class_off){
            webrtcdevSharescreen();
            screenShareButton.className=screenshareobj.button.shareButton.class_on;
            screenShareButton.innerHTML=screenshareobj.button.shareButton.html_on;
        }else if(screenShareButton.className==screenshareobj.button.shareButton.class_on){
            screenShareButton.className=screenshareobj.button.shareButton.class_off;
            screenShareButton.innerHTML=screenshareobj.button.shareButton.html_off;
            webrtcdevStopShareScreen();
        }else{
            webrtcdev.log( "[svreenshare js] createScreenshareButton ,classname neither on nor off" , creenShareButton.className);
        }
    };
    var li =document.createElement("li");
    li.appendChild(screenShareButton);
    document.getElementById("topIconHolder_ul").appendChild(li);
    return screenShareButton;
}


/**
 * If button id are present then assign sreen share button or creatr a new one
 * @method
 * @name assignScreenShareButton
 * @param {json} scrshareBtn
 */
function assignScreenShareButton(scrshareBtn){
    webrtcdev.log("assignScreenShareButton");
    let button = document.getElementById(scrshareBtn.id);
    if(debug) {
        // let debugbuttonid = document.createElement("div"); 
        // debugbuttonid.innerHTML(debugbuttonid);
        //button.appendChild("<div>"+button.id+"</div>");

        // let debugbuttonstatus = document.createElement("div");
        // debugbuttonstatus.id= button.id+"buttonstatus";
        //button.appendChild("<div id="+button.id+"buttonstatus"+"></div>");
    }
    button.onclick = function(event) {
        if(button.className == scrshareBtn.class_off){
            // getSourceId(function () { }, true);
            webrtcdevSharescreen();
            button.className = scrshareBtn.class_on;
            button.innerHTML = scrshareBtn.html_on;
            //f(debug) document.getElementById(button.id+"buttonstatus").innerHTML("Off");
        }else if(button.className == scrshareBtn.class_on){
            button.className = scrshareBtn.class_off;
            button.innerHTML = scrshareBtn.html_off;
            webrtcdevStopShareScreen();
            //if(debug) document.getElementById(button.id+"buttonstatus").innerHTML("On");
        }else{
            webrtcdev.warn("[svreenshare js] createScreenshareButton ,classname neither on nor off" , creenShareButton.className);
        }
    }
    return button;
}

function hideScreenShareButton(){
    var button=document.getElementById(screenshareobj.button.shareButton.id);
    button.hidden=true;
    button.setAttribute("style","display:none");
}

function showScreenShareButton(){
    var button=document.getElementById(screenshareobj.button.shareButton.id);
    button.removeAttribute("hidden");
    button.setAttribute("style","display:block");
}

/*
//shifted to start.js
window.addEventListener('message', onScreenshareExtensionCallback);*/

function onScreenshareExtensionCallback(event){
    webrtcdev.log("[screenshare Js] onScreenshareExtensionCallback" , event);

    if (event.data.chromeExtensionStatus) {
       webrtcdev.log("event.data.chromeExtensionStatus ", event.data.chromeExtensionStatus);
    }

    if (event.data.sourceId) {
        if (event.data.sourceId === 'PermissionDeniedError') {
            webrtcdev.error('permission-denied');
        } else{
            webrtcdevScreenConstraints(event.data.sourceId);
        }
    }
}

/**
 * Detects if extension is installed
 * @method
 * @name detectExtension
 * @param {id} extensionID
 * @param {callback} callback
 */
function detectExtension(extensionID , callback){
    webrtcdev.log("[screenshare Js] detectExtension  ", extensionID);
    return getChromeExtensionStatus(extensionID, function (status) {  
        //log sttaus 
        webrtcdev.log("[screenshare Js] extension status ", status);
        //reset extension's local storage objects 
        webrtcdev.log("[screenshare Js] reset extension ", extensionID);
        if (status !="not-installed")
            window.postMessage("reset-webrtcdev-extension", "*");
        callback(status);
    });
}


function showSrcConn(){
    webrtcdev.log(" srcConn : "  , srcConn);
    webrtcdev.log(" srcConn.peers.getAllParticipants() : " , srcConn.peers.getAllParticipants());
}

function resetAlertBox(){
    document.getElementById("alertBox").hidden=false;
    document.getElementById("alertBox").innerHTML="";
}

var counterBeforeFailureNotice=0;
function screenshareNotification(message , type){

    if(document.getElementById("alertBox")){
        
        document.getElementById("alertBox").innerHTML="";

        if(type=="screenshareBegin"){

            var alertDiv =document.createElement("div");
            resetAlertBox();
            alertDiv.className="alert alert-info";
            alertDiv.innerHTML='<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+ "You have begun sharing screen , waiting for peer to view";
            document.getElementById("alertBox").appendChild(alertDiv);

            setTimeout(function() {
                var alertDiv = document.createElement("div");
                resetAlertBox();
                alertDiv.className="alert alert-danger";
                alertDiv.innerHTML='<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+ "Peer was not able to view screen , please retry";
                document.getElementById("alertBox").appendChild(alertDiv);
            }, 20000);

        }else if(type=="screenshareStartedViewing"){
                
            var alertDiv =document.createElement("div");
            resetAlertBox();
            alertDiv.className="alert alert-success";
            alertDiv.innerHTML='<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+ "Peer has started viewing screen ";        
            document.getElementById("alertBox").appendChild(alertDiv);

        }else if(type=="screenshareError"){

            var alertDiv = document.createElement("div");
            resetAlertBox();
            alertDiv.className="alert alert-danger";
            alertDiv.innerHTML='<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+ "There was a error while sharing screen , please contact support ";
            document.getElementById("alertBox").appendChild(alertDiv);

        }else{
            // Handle these msgs too : TBD
        }

    }else{
        alert(message);
    }
}


/**
 * Install widnow
 * @method
 * @name createExtensionInstallWindow
 */
function createExtensionInstallWindow (){
    try{
        var modalBox = document.createElement("div");
        modalBox.className = "modal fade";
        modalBox.setAttribute("role", "dialog");
        modalBox.id = "screensharedialog";

        var modalinnerBox = document.createElement("div");
        modalinnerBox.className = "modal-dialog";

        var modal = document.createElement("div");
        modal.className = "modal-content";

        var modalheader = document.createElement("div");
        modalheader.className = "modal-header";

        var closeButton = document.createElement("button");
        closeButton.className = "close";
        closeButton.setAttribute("data-dismiss", "modal");
        closeButton.innerHTML = "&times;";

        var title = document.createElement("h4");
        title.className = "modal-title";
        title.innerHTML = "Install Ample Chat chrome extension";

        modalheader.appendChild(title);
        modalheader.appendChild(closeButton);


        var modalbody = document.createElement("div");
        modalbody.className = "modal-body";

        var div = document.createElement("div");
        div.innerHTML = "Click this link to install " +
                        "<a href='https://chrome.google.com/webstore/detail/jpcjjkpbiepbmhklnjoahacppaemhmpd' target='_blank'> Ample Chat Extension </a> "+
                        "which enbles screen share and session record features. "+
                        "<br/> Please reload this session after extension installation ";

        modalbody.appendChild(div);

        modal.appendChild(modalheader);
        modal.appendChild(modalbody);

        modalinnerBox.appendChild(modal);
        modalBox.appendChild(modalinnerBox);

        if(document.getElementById("mainDiv")){
            var mainDiv = document.getElementById("mainDiv");
            mainDiv.appendChild(modalBox);

            //document.getElementById("screensharedialog").showModal();
            $("#screensharedialog").modal("show");            
        }

    }catch(e){
        webrtcdev.error("[ createExtensionInstallWindow - Screenshare.js]" , e); 
    }
                                
}