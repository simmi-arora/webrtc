/**************************************************************
Screenshare 
****************************************************************/
'use strict';
"use strict";

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
 * function set up Srcreens share session RTC peer connection 
 * @method
 * @name webrtcdevPrepareScreenShare
 * @param {function} callback
 */
function webrtcdevPrepareScreenShare(screenRoomid ){

    localStorage.setItem("screenRoomid " , screenRoomid);
    webrtcdev.log("[screenshare JS] webrtcdevPrepareScreenShare - screenRoomid : " , screenRoomid);
    webrtcdev.log("[screenshare JS] webrtcdevPrepareScreenShare - filling up iceServers : " , turn , webrtcdevIceServers);

    scrConn             = new RTCMultiConnection(),
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
            getElementById(screenshareobj.screenshareContainer).appendChild(nameBox);
        }

        if(event.type=="remote" && event.type!="local"){
            // Remote got screen share stream 
            shownotificationWarning("started streaming remote's screen");
            webrtcdev.log("[screensharejs] on stream remote ");

            if(event.stream.streamid){
                webrtcdev.log("remote screen event.stream.streamId " + event.stream.streamId);
                screenStreamId=event.stream.streamid;                    
            }else if(event.streamid){
                webrtcdev.log("remote screen event.streamid " + event.streamid);
                screenStreamId=event.streamid;  
            }

            var video = document.createElement('video');
            var stream = event.stream;
            attachMediaStream(video, stream);
            //video.id = peerInfo.videoContainer;
            getElementById(screenshareobj.screenshareContainer).appendChild(video);
            getElementById(screenshareobj.screenshareContainer).hidden=false;
            rtcConn.send({
                type:"screenshare", 
                screenid: screenRoomid,
                message:"screenshareStartedViewing"
            });

        }else{
            // Local got screen share stream 
            shownotificationWarning("started streaming local screen");
            webrtcdev.log("[screenshareJS] on stream local ");

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
    },

    scrConn.onstreamended = function(event) {
        if(event)
            webrtcdev.log("[screenshare JS] onstreamended -" , event);
    
        if(getElementById(screenshareobj.screenshareContainer)){
            getElementById(screenshareobj.screenshareContainer).innerHTML="";
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
        webrtcdev.log("[screensharejs] scrConn onopen - " , scrConn.connectionType);
    },

    scrConn.onerror = function (err) {    
        webrtcdev.error("[screensharejs] scrConn error - " , err);
    },

    scrConn.onEntireSessionClosed = function(event){
        webrtcdev.log("[screensharejs] scrConn onEntireSessionClosed - " , event);
    },

    scrConn.socketMessageEvent = 'scrRTCMultiConnection-Message',
    scrConn.socketCustomEvent = 'scrRTCMultiConnection-Custom-Message';

    if(turn && turn!='none'){
        if(!webrtcdevIceServers) {
            webrtcdev.error("[screensharejs] ICE server not found yet in screenshare session");
            alert("ICE server not found yet in screenshare session ");
        }
        scrConn.iceServers  = webrtcdevIceServers;      
    } 
    webrtcdev.log("[screenshare JS] webrtcdevpreparescreenshare calling callback for socket.io operations");
    return;
}

/**
 * Prepares screenshare , send open channel and handled open channel reponse ,calls getusermedia in callback
 * @method
 * @name webrtcdevSharescreen
 */
function webrtcdevSharescreen(scrroomid) {
    webrtcdev.log("[screenshareJS] webrtcdevSharescreen, preparing screenshare by initiating ScrConn , scrroomid - " , scrroomid);

    return new Promise((resolve, reject) => { 
        webrtcdevPrepareScreenShare(scrroomid)
        resolve(scrroomid);
    })
    .then(function(scrroomid){
        if(socket){
            webrtcdev.log("[screenshare JS] Event : open-channel-screenshare with ", socket.io.uri);
            socket.emit("open-channel-screenshare", {
                channel    : scrroomid,
                sender     : selfuserid,
                maxAllowed : 6
            });
            shownotification("Making a new session for screenshare" + scrroomid);
        }else{
            webrtcdev.error("[screenshare JS] webrtcdevSharescreen -  socket doesnt exist ");
        }

        socket.on("open-channel-screenshare-resp",function(event) {
            webrtcdev.log("[screenshare JS] webrtcdevSharescreen Event Handler : open-channel-screenshare-response " , event);
             if (event.status && event.channel == sessionid) {
                scrConn.open(scrroomid, function() {   
                     webrtcdev.log("[screenshare JS] webrtcdevSharescreen - to open up room for screen share ");
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
function connectScrWebRTC(type, scrroomid ){
     webrtcdev.log("[screenshareJS] connectScrWebRTC, first preparing screenshare by initiating ScrConn , scrroomid - " , scrroomid);

    return new Promise((resolve, reject) => { 
        webrtcdevPrepareScreenShare(scrroomid)
        resolve(scrroomid);
    })
    .then(function(scrroomid){
        webrtcdev.log("[screenshare JS] connectScrWebRTC -> " , type, scrroomid );
        if(type=="join"){
            scrConn.join(scrroomid);
            shownotification("Connected with existing Screenshare channel "+ scrroomid);
        }else{
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

        if(screenshareobj.screenshareContainer)
            document.getElementById(screenshareobj.screenshareContainer).innerHTML="";

        rtcConn.send({
            type:"screenshare", 
            message:"stoppedscreenshare"
        });
        //scrConn.onstreamended();
        //scrConn.close();
        scrConn.closeEntireSession();
        webrtcdev.log("[screenshare JS] Sender stopped: screenRoomid ", screenRoomid ,
                      "| Screen stoppped "  , scrConn , 
                      "| container " , document.getElementById(screenshareobj.screenshareContainer));
        
        if(screenShareStreamLocal){
            screenShareStreamLocal.stop();
            screenShareStreamLocal=null;        
        }
        //scrConn.videosContainer.hidden=true;
        /*scrConn.leave();*/
        //removeScreenViewButton();

        var stream1 = scrConn.streamEvents.selectFirst()
        stream1.stream.getTracks().forEach(track => track.stop());

    }catch(err){
        webrtcdev.error("[screensharejs] webrtcdevStopShareScreen - ", err);
    }
}

/**
 * function clear screen share session RTC peer connection 
 * @method
 * @name webrtcdevCleanShareScreen
 */
function webrtcdevCleanShareScreen(streamid){
    try{
        scrConn.onstreamended();
        scrConn.removeStream(streamid);
        scrConn.close();
        scrConn = null;
    }catch(err){
        webrtcdev.error("[screensharejs] webrtcdevStopShareScreen - ", err);
    }
}

/**
 * find if view button is provided or need to be created 
 * @method
 * @name createOrAssignScreenviewButton
 */
function createOrAssignScreenviewButton(){
    if(screenshareobj.button.viewButton.id && document.getElementById(screenshareobj.button.viewButton.id)) {
        let button = document.getElementById(screenshareobj.button.viewButton.id);
        assignScreenViewButton(button);
    }else{
        createScreenViewButton();
    }
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
            let time     = new Date().getUTCMilliseconds(); 
            screenRoomid = "screenshare"+"_"+sessionid+"_"+time;
            webrtcdevSharescreen(screenRoomid);
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
    
    button.onclick = function(event) {
        if(button.className == scrshareBtn.class_off){
            let time     = new Date().getUTCMilliseconds(); 
            screenRoomid = "screenshare"+"_"+sessionid+"_"+time;
            // after posting message to obtain source Id from chrome extension wait for response 
            webrtcdevSharescreen(screenRoomid);
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


function showScrConn(){
    if(scrConn){
        webrtcdev.info(" =========================================================================");
        webrtcdev.info(" srcConn : "  , scrConn);
        webrtcdev.info(" srcConn.peers.getAllParticipants() : " , scrConn.peers.getAllParticipants());
        webrtcdev.info(" =========================================================================");
    }else{
        webrtcdev.debug(" Screen share is not active ");
    }
}




/**
 * Alert boxes for user if screen share isnt working 
 * @method
 * @name screenshareNotification
 */
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