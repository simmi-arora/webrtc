/**************************************************************************************
        peerconnection 
****************************************************************************/
var RTCPeerConnection = null;

var webrtcDetectedBrowser = null;
var webrtcDetectedVersion = null;
var rtcMultiConnection ;

var usersList       = document.getElementById("userslist");
var numbersOfUsers  = document.getElementById("numbersofusers");
var usersContainer  = document.getElementById("usersContainer");

var card = document.getElementById('card');
var main = document.querySelector('#main');
var smaller = document.querySelector('#smaller');
var userid = guid();

var whoIsTyping = document.querySelector("#who-is-typing");

var sessions = {};

var WebRTCdom= function(  _localObj , _remoteObj , incoming, outgoing){

    if(incoming){
        incomingAudio = incoming.audio ; 
        incomingVideo = incoming.video ; 
        incomingData  = incoming.data  ;  
    }

    if(outgoing){
        outgoingAudio = outgoing.audio ; 
        outgoingVideo = outgoing.video ; 
        outgoingData  = outgoing.data ;
    }

    /* When user is single */
    localobj=_localObj;
    localVideo = localobj.video;

    /* when user is in conference */
    remoteobj=_remoteObj;
    var _remotearr=_remoteObj.videoarr;

    /* first video container in remotearr belonsg to user */
    if(outgoingVideo){
        selfVideo = _remotearr[0];
    }
    /* create arr for remote peers viseo */
    for(var x=1;x<_remotearr.length;x++){
        remoteVideos.push(_remotearr[x]);    
    }

    if(localobj.hasOwnProperty('userdetails')){
        console.log("userdetails " , localobj.userdetails);
    }
};

var WebRTCdev= function(session, widgets){
    sessionid  = session.sessionid;
    socketAddr = session.socketAddr;
    turn    = (session.hasOwnProperty('turn')?session.turn:null);
    console.log("widgets ", widgets);

    if(turn!=null ){
        getICEServer( turn.username ,turn.secretkey , turn.domain,
                        turn.application , turn.room , turn.secure); 
    }

    if(widgets){

        if(widgets.debug)           debug           = widgets.debug;

        if(widgets.chat)            chatobj         = widgets.chat;

        if(widgets.fileShare)       fileshareobj    = widgets.fileShare;

        if(widgets.screenrecord)    screenrecordobj = widgets.screenrecord;

        if(widgets.screenshare)     screenshareobj  = widgets.screenshare;

        if(widgets.snapshot)        snapshotobj     = widgets.snapshot;

        if(widgets.videoRecord)     videoRecordobj  = widgets.videoRecord;

        if(widgets.reconnect)       reconnectobj    = widgets.reconnect;

        if(widgets.drawCanvas)      drawCanvasobj   = widgets.drawCanvas;

        if(widgets.texteditor)      texteditorobj   = widgets.texteditor;

        if(widgets.codeeditor)      codeeditorobj   = widgets.codeeditor;

        if(widgets.mute)            muteobj         = widgets.mute;

        if(widgets.timer)           timer           = widgets.timer;
    }

    return {
        startwebrtcdev:function() {
            
            rtcMultiConnection= new RTCMultiConnection(sessionid);
            
            if(turn!='none'){
                if(!webrtcdevIceServers) {
                    return;
                }
                rtcMultiConnection.iceServers=webrtcdevIceServers;       
                window.clearInterval(repeatInitilization);
            }  

            checkDevices(rtcMultiConnection);
            rtcMultiConnection.extra = {
                uuid :userid,
                name: localobj.userdetails.username,
                color: localobj.userdetails.usercolor,
                email: localobj.userdetails.useremail
            },
            rtcMultiConnection.channel=sessionid,
            rtcMultiConnection.userid = userid,
            rtcMultiConnection.preventSSLAutoAllowed = false,
            rtcMultiConnection.autoReDialOnFailure = true,
            rtcMultiConnection.setDefaultEventsForMediaElement = false,
            rtcMultiConnection.customStreams = {}, 
            rtcMultiConnection.autoCloseEntireSession = !1, 
            rtcMultiConnection.autoTranslateText = !1, 
            rtcMultiConnection.maxParticipantsAllowed = remoteobj.maxAllowed, 
            rtcMultiConnection.setDefaultEventsForMediaElement = !1,
            rtcMultiConnection.blobURLs = {},
 
            rtcMultiConnection.session = {
                video: incomingVideo,
                audio: incomingAudio,
                data:  incomingData
            },

            rtcMultiConnection.sdpConstraints.mandatory = {
                OfferToReceiveAudio: !0,
                OfferToReceiveVideo: !0
            },

            rtcMultiConnection.onstream = function(event) {
                var flagPeerExists=false;
                var x=0;
                for(x=0;x<webcallpeers.length; x++){
                    if(webcallpeers[x].userid==event.extra.uuid) {
                        flagPeerExists=true;
                        break;
                    }
                }

                if(!flagPeerExists){
                    updatePeerInfo(event.extra.uuid , "Peer" , "#BFD9DA" , "", "remote");
                }

                if(webcallpeers[x].userid==event.extra.uuid){
                    webcallpeers[x].name=event.type+"Video";
                    webcallpeers[x].stream=event.stream;
                    webcallpeers[x].streamid=event.stream.streamid;
                    updateWebCallView(webcallpeers[x]);
                    return;
                }
            }, 

            rtcMultiConnection.onstreamended = function(event) {
                event.isScreen ? $("#" + event.userid + "_screen").remove() : $("#" + event.userid).remove()
            }, 

            rtcMultiConnection.onconnected = function(event) {
                // event.peer.addStream || event.peer.getConnectionStats
                console.log('rtcMultiConnection.onconnected ......between you and', event.userid);
            },

            rtcMultiConnection.onopen = function(event) {
                if(timer)
                   startsessionTimer(timer);

                if(webcallpeers.length<=remoteobj.maxAllowed){
                    console.log('rtcMultiConnection.onopen ......On open with : ', event);
                    updatePeerInfo(event.extra.uuid ,"Peer" , "#BFD9DA" , "", "remote");
                    shownotification(event.extra.username + " joined channel ");
                }else{
                    shownotification("Another user is trying to join this channel but max count [ "+remoteobj.maxAllowed +" ] is reached");
                }
            },

            rtcMultiConnection.onNewSession = function(event) {
                /*  startsessionTimer();  */
                console.log('rtcMultiConnection.onNewSession ......On open with : ', event);
            },

            rtcMultiConnection.onRequest = function(event) {
                console.log(" OnRequest ", event);
                rtcMultiConnection.accept(event)
            }, 

            rtcMultiConnection.onmessage = function(e) {
                if(e.data.typing){
                    void(whoIsTyping.innerHTML = e.extra.username + " is typing ...") ;
                }else if(e.data.stoppedTyping){
                    void(whoIsTyping.innerHTML = "");
                }else{
                    switch(e.data.type){
                        case "screenshare":
                            shownotification("screen is getting shared "+ e.data.message);
                            createScreenViewButton();
                        break;
                        case "chat":
                            whoIsTyping.innerHTML = "";
                            addNewMessage({
                                header: e.extra.username,
                                message: e.data.message,
                                userinfo: getUserinfo(rtcMultiConnection.blobURLs[e.userid], "chat-message.png"),
                                color: e.extra.color
                            }); 
                            void(document.title = e.data.message);
                        break;
                        case "imagesnapshot":
                            displayList( null , e.userid , e.data.message , e.data.name , "imagesnapshot" );
                            displayFile( null , e.userid , e.data.message , e.data.name , "imagesnapshot");
                        break;
                        case "videoRecording":
                            displayList( null , e.userid , e.data.message , e.data.name , "videoRecording" );
                            displayFile( null , e.userid , e.data.message , e.data.name , "videoRecording");
                        break;
                        case "videoScreenRecording":
                            displayList( null , e.userid , e.data.message , e.data.name , "videoScreenRecording" );
                            displayFile( null , e.userid , e.data.message , e.data.name , "videoScreenRecording");
                        break;
                        case "file":
                            addNewMessage({
                                header: e.extra.username,
                                message: e.data.message,
                                userinfo: getUserinfo(rtcMultiConnection.blobURLs[e.userid], "chat-message.png"),
                                color: e.extra.color
                            }); 
                        break;
                        case "canvas":
                            CanvasDesigner.syncData( e.data.draw );
                        break;
                        case "texteditor":
                            receiveWebrtcdevTexteditorSync(e.data.data);
                        break;
                        case "codeeditor":
                            receiveWebrtcdevCodeeditorSync(e.data.data);
                        break;
                        case "pointer":
                            placeCursor("cursor2" , e.data.corX , e.data.corY);
                        break;
                        case "buttonclick":
                            var buttonElement= document.getElementById(e.data.buttonName);
                            if ( buttonElement.getAttribute("lastClickedBy") != rtcMultiConnection.userid ){
                                buttonElement.setAttribute("lastClickedBy" , e.userid);
                                buttonElement.click();
                            }
                        break;

                        default:
                            console.log(" unrecognizable message from peer  ",e);
                        break;
                    }

                } 
                return;
            },

            rtcMultiConnection.sendMessage = function(event) {
                console.log(" sendMessage ", event);
                event.userid = rtcMultiConnection.userid, 
                event.extra = rtcMultiConnection.extra, 
                rtcMultiConnection.sendCustomMessage(event)
            }, 

            rtcMultiConnection.onEntireSessionClosed = function(event) {
                rtcMultiConnection.attachStreams.forEach(function(stream) {
                    stream.stop();
                });   
            },

            rtcMultiConnection.onclose = rtcMultiConnection.onleave = function(e) {
                addNewMessage({
                    header: e.extra.username,
                    message: e.extra.username + " left session.",
                    userinfo: getUserinfo(rtcMultiConnection.blobURLs[e.userid], "info.png"),
                    color: e.extra.color
                }), 
                
                shownotification(e.extra.username + " left the conversation.");
                //rtcMultiConnection.playRoleOfInitiator()
                for(x in webcallpeers){
                    if(webcallpeers[x].userid=e.userid)
                        webcallpeers.splice(x,1);
                }
            },

            rtcMultiConnection.takeSnapshot = function(userid, callback) {
                takeSnapshot({
                    userid: userid,
                    connection: connection,
                    callback: callback
                });
            },

            rtcMultiConnection.onFileStart = function(file) {
                
                addNewFileLocal({
                    userid : rtcMultiConnection.userid,
                    header: 'User local',
                    message: 'File shared',
                    userinfo: getUserinfo(rtcMultiConnection.blobURLs[rtcMultiConnection.userid], "images/share-files.png"),
                    callback: function(r) {        }
                });
                
                addProgressHelper(file.uuid , file.userid , file.name , file.maxChunks,  "fileBoxClass");
            }, 

            rtcMultiConnection.onFileProgress = function(e) {

                var r = progressHelper[e.uuid];
                r && (r.progress.value = e.currentPosition || e.maxChunks || r.progress.max, updateLabel(r.progress, r.label))
            }, 

            rtcMultiConnection.onFileEnd = function(e) {

                for(i in webcallpeers ){
                    if(webcallpeers[i].userid==e.userid){
                        webcallpeers[i].filearray.push(e.name);
                    }
                }

                displayFile(e.uuid , e.userid , e.url , e.name , e.type);
                displayList(e.uuid , e.userid , e.url , e.name , e.type);
            };

            if(chatobj.active){
                createChatButton(chatobj);
            }

            if(screenrecordobj.active){
                createScreenRecordButton();
            }

            if(screenshareobj.active){
                detectExtensionScreenshare(screenshareobj.extensionID); 
            }   

            if(reconnectobj.active){
                createButtonRedial();
            }

            if(drawCanvasobj.active){
                createdrawButton();
            }

            if(texteditorobj.active){
                createTextEditorButton();
            }

            if(codeeditorobj.active){
                createCodeEditorButton();
            }

            if(fileshareobj.active){
                rtcMultiConnection.enableFileSharing = true;
                rtcMultiConnection.filesContainer = document.getElementById(fileshareobj.fileShareContainer);
                createFileShareButton(fileshareobj);
            }

            if(selfuserid==null){
                selfuserid   = rtcMultiConnection.userid;
                selfusername = (localobj.userdetails.username  == undefined ? "user": localobj.userdetails.username);
                selfcolor    = (localobj.userdetails.usercolor == undefined ? "user": localobj.userdetails.usercolor);
                selfemail    = (localobj.userdetails.useremail == undefined ? "user": localobj.userdetails.useremail);

                console.log("selfuserid and call updatepeer info update for self ",selfuserid);
                updatePeerInfo( selfuserid, selfusername ,selfcolor, selfemail, "local" );
            }
            
            var addr = "/";
            if(socketAddr!="/"){
                addr = socketAddr;
            }

            socket = io.connect(addr);
 
            /*
             socket.emit("register-channel", {
                channel: rtcMultiConnection.channel
            }); */          

            socket.emit("presence", {
                channel: rtcMultiConnection.channel
            });

            socket.on("presence", function(event) {
                console.log("PRESENCE -----------> ", event);
                event ?  joinWebRTC(rtcMultiConnection.channel, selfuserid) 
                : opneWebRTC(rtcMultiConnection.channel, selfuserid);
            });  

            socket.on("opened-channel",function(event) {
                console.log("opened-channel" , event);
               if(event) connectWebRTC("open" , rtcMultiConnection.channel, selfuserid); 
            });

            socket.on("joined-channel",function(event) {
                console.log("joined-channel" , event);
               if(event) connectWebRTC("join" , rtcMultiConnection.channel, selfuserid); 
            });
            /*
            socket.on("joined-channel",function(event) {
               if(event) changeUserid(selfuserid); 
            });
            */

            setSettingsAttributes();
        }
    };

};

function checkDevices(obj){
    console.log(" obj.DetectRTC  " , obj.DetectRTC);
    if(obj.DetectRTC.hasMicrophone) {
        // seems current system has at least one audio input device
        console.log("has Microphone");
    }else{
        console.log("doesnt have  hasMicrophone");
    }

    if(obj.DetectRTC.hasSpeakers) {
        console.log("has Speakers");
        // seems current system has at least one audio output device
    }else{
        console.log("doesnt have  Speakers");
    }

    if(obj.DetectRTC.hasWebcam) {
        console.log("has Webcam");
        // seems current system has at least one video input device
    }else{
        console.log("doesnt have Webcam");
    }
}

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

function shownotification(message){
    var alertDiv =document.createElement("div");
    alertDiv.className="alert alert-success fade in";
    alertDiv.innerHTML='<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+ message;

    document.getElementById("alertBox").hidden=false;
    document.getElementById("alertBox").innerHTML="";
    document.getElementById("alertBox").appendChild(alertDiv);

    setTimeout(function() {
        document.getElementById("alertBox").hidden=true;
    }, 3000);
}

function error(arg1 , arg2){
    console.log(arg1, arg2);
}

function getElement(e) {
    return document.querySelector(e)
}

function getRandomColor() {
    for (var e = "0123456789ABCDEF".split(""), t = "#", n = 0; 6 > n; n++) t += e[Math.round(15 * Math.random())];
    return t
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}


function getUserinfo(e, t) {
    return e ? '<video src="' + e + '" autoplay></vide>' : '<img src="' + t + '">'
}

function fireClickEvent(e) {
    var t = new MouseEvent("click", {
        view: window,
        bubbles: !0,
        cancelable: !0
    });
    e.dispatchEvent(t)
}

function bytesToSize(e) {
    var t = ["Bytes", "KB", "MB", "GB", "TB"];
    if (0 == e) return "0 Bytes";
    var n = parseInt(Math.floor(Math.log(e) / Math.log(1024)));
    return Math.round(e / Math.pow(1024, n), 2) + " " + t[n]
}

/***************************************************
video handling 
*********************************************************/

function appendVideo(e, style) {
    createVideoContainer(e, style, function(div) {
        var video = document.createElement('video');
        video.className = style;
        video.setAttribute('style', 'height:auto;opacity:1;');
        video.id = e.userid;
        video.src = URL.createObjectURL(e.stream);
        viden.hidden=false;
        var remote = document.getElementById('remote');
        div.appendChild(video);
        video.play();
    });
}

function createVideoContainer(e, style, callback) {
    var div = document.createElement('div');
    div.setAttribute('style', style || 'float:left;opacity: 1;width: 32%;');
    remote.insertBefore(div, remote.firstChild);
    if (callback) callback(div);
}

/************************************
control Buttons 
*******************************************************************/

function attachControlButtons( userid  , vid ,  peerinfo){

    var stream = peerinfo.stream;
    var streamid = peerinfo.streamid;
    var controlBarName =  peerinfo.controlBarName;
    var snapshotViewer =  peerinfo.fileSharingContainer ;

    var controlBar= document.createElement("div");
    controlBar.id = controlBarName;
    controlBar.setAttribute("style","float:left;margin-left: 20px;");
    if(muteobj.active){
        if(muteobj.audio.active){
            controlBar.appendChild(createAudioMuteButton(controlBarName , peerinfo));
        }
        if(muteobj.video.active){
            controlBar.appendChild(createVideoMuteButton(controlBarName , peerinfo));        
        }
    }
    if(snapshotobj.active){
        controlBar.appendChild(createSnapshotButton(controlBarName , peerinfo));
    }
    if(videoRecordobj.active){
        controlBar.appendChild(createRecordButton(controlBarName, streamid, stream));
    }

    if(debug){
        var nameBox=document.createElement("span");
        nameBox.innerHTML=userid;
        controlBar.appendChild(nameBox);  
    }

    vid.parentNode.appendChild(controlBar);        
}

function updateWebCallView(peerInfo){
    if(peerInfo.vid.indexOf("videolocal") > -1){
        $("#"+localobj.videoContainer).show();
        $("#"+remoteobj.videoContainer).hide();
        if(localVideo){
            var vid = document.getElementsByName(localVideo)[0];
            vid.muted = true;
            vid.style.opacity = 1;
            vid.setAttribute("style","width: 90%!important; border: 5px solid "+peerInfo.color);
            attachMediaStream(vid, peerInfo.stream);
        }
    }else if(peerInfo.vid.indexOf("videoremote") > -1) {

        $("#"+localobj.videoContainer).hide();
        $("#"+remoteobj.videoContainer).show();
    
        /* handling local video transistion to active */
        if( outgoingVideo ){
            /*chk if local video is added to conf , else adding local video to index 0 */
            var selfvid = document.getElementsByName(selfVideo)[0];
            var localvid = document.getElementsByName(localVideo)[0];

            if(selfvid.played.length==0){
                if(localvid.played.lebth>0)
                    reattachMediaStream(selfvid, localvid);
                else
                    attachMediaStream(selfvid, webcallpeers[0].stream);
                selfvid.id = webcallpeers[0].videoContainer;
                selfvid.muted = true;
                selfvid.setAttribute("style","border: 5px solid "+webcallpeers[0].color);
                attachControlButtons( selfvid.id, selfvid, webcallpeers[0]); 

                if(fileshareobj.active){
                    createFileSharingDiv(webcallpeers[0]);
                }
            }
        }

        /*get the next empty index of video and pointer in video array */
        var vi=0;
        for(var v=0;v<remoteVideos.length;v++){
            if(remoteVideos[v].src){
                vi++;
            }
        }

        var remvid;
        if(remoteobj.maxAllowed=="unlimited"){
            var video = document.createElement('video');
            video.autoplay="autoplay";
            remoteVideos[vi]=video;
            document.getElementById(remoteobj.videoContainer).appendChild(video);
            remvid=remoteVideos[vi];
        }else{
            remvid=document.getElementsByName(remoteVideos[vi])[0];
            console.log("remote video not unlimited " , remoteVideos[vi]);
        }

        attachMediaStream(remvid, peerInfo.stream);
        remvid.id = peerInfo.videoContainer;
        remvid.setAttribute("style","border: 5px solid "+peerInfo.color);
        attachControlButtons(remvid.id, remvid, peerInfo); 

        if(fileshareobj.active){
            createFileSharingDiv(peerInfo);
        }
    }
}

/********************************************************************************** 
        Session call 
************************************************************************************/
changeUserid=function(userid){
    rtcMultiConnection.userid=userid;
}

opneWebRTC=function(channel , userid){
    rtcMultiConnection.open(channel);
    socket.emit("open-channel", {
        channel    : channel,
        sender     : userid,
        maxAllowed : remoteobj.maxAllowed
    });
    shownotification(" Making a new session ");
}

connectWebRTC=function(type, channel , userid){
    if(type=="open"){
        rtcMultiConnection.connect(channel);
        /*changeUserid(userid);*/
        shownotification("Connected to new channel");
    }else if(type=="join"){
        rtcMultiConnection.join(channel);
        /*changeUserid(userid);*/
        shownotification("Connected with existing channel");
    }else{
        shownotification("Connection type not found");
    }

}

joinWebRTC=function(channel , userid){
    shownotification("Joining an existing session ");
    socket.emit("join-channel", {
        channel: channel,
        sender: userid
    });
}

leaveWebRTC=function(){
    shownotification("Leaving the session ");
}

/*********************************************8
ICE
**************************************************/

var iceServers=[];
var repeatInitilization = null;

function startcall(obj){
    if(turn=='none'){
        obj.startwebrtcdev();
    }else if(turn!=null && turn!='none'){
        repeatInitilization = window.setInterval(obj.startwebrtcdev, 1000);     
    }
}

function updatePeerInfo(userid , username , usecolor , useremail,  type ){
    console.log("updating peerInfo: " , userid , type);
    for(x in webcallpeers){
        if(webcallpeers[x].userid==userid) {
            console.log("UserID is already existing , webcallpeers");
            return;
        }
    }

    peerInfo={ 
        videoContainer : "video"+userid,
        videoHeight : null,
        videoClassName: null,
        userid : userid , 
        name  :  username,
        color : usecolor,
        email : useremail,
        fileSharingContainer : "widget-filesharing-container"+userid,
        fileSharingSubContents:{
            fileSharingBox: "widget-filesharing-box"+userid,
            minButton: "widget-filesharing-minbutton"+userid,
            maxButton: "widget-filesharing-maxbutton"+userid,
            closeButton: "widget-filesharing-closebutton"+userid
        },
        fileListContainer : "widget-filelisting-container"+userid,
        controlBarName: "control-video"+userid,
        filearray : [],
        vid : "video"+type+"_"+userid
    };
    console.log("updated peerInfo: " ,peerInfo);
    webcallpeers.push(peerInfo);
}

function showStatus(){
    console.log(rtcMultiConnection);
    console.log(webcallpeers);
}

/************************* ICE NAT TURN *******************************/

function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        xhr = null;
    }
    return xhr;
}

function getICEServer(username , secretkey , domain , appname , roomname , secure){
    console.log(" TURN -------------" , username , secretkey , domain , appname , roomname , secure);
    var url = 'https://service.xirsys.com/ice';
    var xhr = createCORSRequest('POST', url);
    xhr.onload = function () {
        console.log(xhr.responseText);
        if(JSON.parse(xhr.responseText).d==null){
            webrtcdevIceServers="err";
            shownotification(" media not able to pass through "+ JSON.parse(xhr.responseText).e);
        }else{
            webrtcdevIceServers=JSON.parse(xhr.responseText).d.iceServers;
            console.log("iceserver got" ,webrtcdevIceServers );
        }
    };
    xhr.onerror = function () {
        console.error('Woops, there was an error making xhr request.');
    };
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    /* xhr.send('ident=muazkh&secret=59d93f26-5b89-11e5-babe-d61aeb366a63&domain=webrtcexperiment-webrtc.netdna-ssl.com&application=default&room=default&secure=1');*/
    xhr.send('ident='+username+'&secret='+secretkey +
        '&domain='+domain +'&application='+appname+
        '&room='+ roomname+'&secure='+secure);
}

function attachMediaStream(element, stream) {
    console.log("element.src", typeof element.srcObject, typeof element.src );
    if (typeof element.src == 'string') {
        element.src = URL.createObjectURL(stream);
    }else if (typeof element.srcObject == 'object') {
        element.srcObject = stream;
    }else{
        console.log('Error attaching stream to element.' , element , stream);
    }
}


function reattachMediaStream(to, from) {
    to.src = from.src;
}


/**************************************************************
Screenshare 
****************************************************************/

function detectExtensionScreenshare(extensionID){

    rtcMultiConnection.getChromeExtensionStatus(extensionID, function(status) {
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

        webrtcdevPrepareScreenShare();
    });
}