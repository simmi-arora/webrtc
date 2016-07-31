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

var WebRTCdom= function(  _localObj , _remoteObj ){

    localobj=_localObj;
    var _local=_localObj.localVideo;
    var _localVideoClass=_localObj.videoClass;

    remoteobj=_remoteObj;
    var _remotearr=_remoteObj.remotearr;
    var _remotearrClass= _remoteObj.videoClass;

    if(_local!=null){
        localVideo = document.getElementsByName(_local)[0];    
    }

    for(var x=0;x<_remotearr.length;x++){
        remoteVideos.push(document.getElementsByName(_remotearr[x])[0]);    
    }

    if(localobj.hasOwnProperty('userdetails')){
        console.log("userdetails " , localobj.userdetails);
        username    = (localobj.userdetails.username == undefined ? "user": localobj.userdetails.username);
        usecolor    = localobj.userdetails.usercolor;
        useremail   = localobj.userdetails.useremail;
    }
};

var WebRTCdev= function(session, incoming, outgoing, widgets){
    sessionid  = session.sessionid;
    socketAddr = session.socketAddr;
    turn    = (session.hasOwnProperty('turn')?session.turn:null);
    console.log("widgets ", widgets);

    if(turn!=null ){
        getICEServer( turn.username ,turn.secretkey , turn.domain,
                        turn.application , turn.room , turn.secure); 
    }

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

    if(widgets){

        if(widgets.chat)            chatobj         = widgets.chat

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
                username: username,
                color: useremail,
                useredisplayListmail: usercolor
            },

            rtcMultiConnection.channel=sessionid,
            rtcMultiConnection.userid = userid,
            rtcMultiConnection.preventSSLAutoAllowed = false,
            rtcMultiConnection.autoReDialOnFailure = true,
            rtcMultiConnection.setDefaultEventsForMediaElement = false,
            rtcMultiConnection.customStreams = {}, 
            rtcMultiConnection.autoCloseEntireSession = !1, 
            rtcMultiConnection.autoTranslateText = !1, 
            rtcMultiConnection.maxParticipantsAllowed = 4, 
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
                console.log("OnStream ------------", event , webcallpeers ,webcallpeers.length);
                var flagPeerExists=false;
                var x=0;
                for(x=0;x<webcallpeers.length; x++){
                    if(webcallpeers[x].userid==event.extra.uuid) {
                        flagPeerExists=true;
                        break;
                    }
                }

                if(!flagPeerExists){
                    updatePeerInfo(event.extra.uuid , "remote");
                }

                console.log(x , webcallpeers ,webcallpeers.length);
                console.log(webcallpeers[x].userid==event.extra.uuid);

                if(webcallpeers[x].userid==event.extra.uuid){
                    webcallpeers[x].name=event.type+"Video";
                    webcallpeers[x].stream=event.stream;
                    webcallpeers[x].streamid=event.stream.streamid;
                    console.log(" ------------",x,"-----",webcallpeers[x]);
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
                /*  startsessionTimer();  */
                console.log('rtcMultiConnection.onopen ......On open with : ', event);
                updatePeerInfo(event.extra.uuid , "remote");
                shownotification(event.extra.username + " joined channel ");
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

            rtcMultiConnection.onFileStart = function(file) {
                alert("File Start ");
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
                alert("File Progress ");
                var r = progressHelper[e.uuid];
                r && (r.progress.value = e.currentPosition || e.maxChunks || r.progress.max, updateLabel(r.progress, r.label))
            }, 

            rtcMultiConnection.onFileEnd = function(e) {
                alert("File End ");
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
                /*createdrawButton();*/
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
                selfuserid = rtcMultiConnection.userid;
                console.log("selfuserid and call updatepeer info update for self ",selfuserid);
                updatePeerInfo( selfuserid, "local" );
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
                event ?  joinWebRTC(rtcMultiConnection.channel, selfuserid) 
                : opneWebRTC(rtcMultiConnection.channel, selfuserid);
            });  

            socket.on("opened-channel",function(event) {
               if(event) connectWebRTC(rtcMultiConnection.channel, selfuserid); 
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


/**************************************************8
Timer 
***************************************************/
function startsessionTimer(){
    var cd = $('#countdownSecond');
    var cdm = $('#countdownMinutes');
    var c = parseInt(cd.text(),10);
    var m =  parseInt(cdm.text(),10);
    //alert(" Time for session validy is "+m +" minutes :"+ c+ " seconds");
    timer(cd , c , cdm ,  m);  
}

function timer(cd , c , cdm , m ){
    console.log(m);
    var interv = setInterval(function() {
        c--;
        cd.html(c);

        if (c == 0) {
            c = 60;
            m--;  
            $('#countdownMinutes').html(m);
            if(m<0)  {
                clearInterval(interv); 
                //alert("time over");
            }                     
        }
    }, 1000);
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
var arrFilesharingBoxes=[];

function attachControlButtons( uuid  , videoElement, streamid , controlBarName , snapshotViewer){
    var controlBar= document.createElement("div");
    controlBar.id=controlBarName;
    controlBar.setAttribute("style","float:left;margin-left: 20px;");
    controlBar.name= streamid;
    if(muteobj.active){
        if(muteobj.audio){
            controlBar.appendChild(createAudioMuteButton(controlBarName));
        }
        if(muteobj.video){
            controlBar.appendChild(createVideoMuteButton(controlBarName));        
        }
    }
    if(snapshotobj.active){
        controlBar.appendChild(createSnapshotButton(controlBarName , streamid));
    }
    if(videoRecordobj.active){
        controlBar.appendChild(createRecordButton(controlBarName));
    }

    var nameBox=document.createElement("span");
    nameBox.innerHTML=uuid;
    controlBar.appendChild(nameBox);

    videoElement.parentNode.appendChild(controlBar);        
}

function updateWebCallView(peerInfo){
    if(peerInfo.vid.indexOf("videolocal") > -1){
        $("#local").show();
        $("#remote").hide();
        if(localVideo){
            attachMediaStream(localVideo, webcallpeers[0].stream);
            localVideo.muted = true;
            localVideo.id= webcallpeers[0].userid;
            localVideo.style.opacity = 1;
            localVideo.setAttribute("style","width: 100%!important");
            attachControlButtons( webcallpeers[0].userid,
                localVideo , 
                webcallpeers[0].streamid ,
                webcallpeers[0].controlBarName,
                webcallpeers[0].fileSharingContainer);
        }
    }else if(peerInfo.vid.indexOf("videoremote") > -1) {
        var pi = 0;
        var vi = 0;

        $("#local").hide();
        $("#remote").show();
    
        for(x in webcallpeers)
            arrFilesharingBoxes.push(webcallpeers[x].fileSharingSubContents.fileSharingBox);

        /*
        handling local video transistion to active 
        */
        if( outgoingVideo ){
            /*adding local video to index 0 */
            if( remoteVideos[0].played.length==0 ){
                reattachMediaStream(remoteVideos[0], localVideo);
                remoteVideos[0].id=webcallpeers[0].videoContainer;
                remoteVideos[0].muted =   true;
                remoteVideos[0].setAttribute("style","border: 5px solid #0087ff");

                //if(miniVideo.parentNode.querySelector("#"+webcallpeers[0].controlBarName)!=null){
                attachControlButtons( webcallpeers[0].userid,
                    remoteVideos[0], 
                    webcallpeers[0].streamid ,
                    webcallpeers[0].controlBarName,
                    webcallpeers[0].fileSharingContainer); 

                if(remoteVideos[0].hidden){
                    remoteVideos[0].hidden=false;
                }

                if(fileshareobj.active){
                    createFileSharingDiv(0);
                }
            }
            vi++;
            pi++;
        }else{
            pi++;
        }

        /*get the next empty empty index of video and pointer in video array */
        for(var v=vi;v< remoteVideos.length;v++){
            if(remoteVideos[v].src){
                vi++;
                pi++;
            }
        }

        if(remoteobj.remoteVideoCount=="unlimited"){
            var video = document.createElement('video');
            video.setAttribute("style","border: 5px solid #4bce50");
            video.autoplay="autoplay";
            remoteVideos[vi]=video;
            document.getElementById(remoteobj.remoteVideoContainer).appendChild(video);
        }

        attachMediaStream(remoteVideos[vi], webcallpeers[pi].stream);
        attachControlButtons(webcallpeers[pi].userid,
            remoteVideos[vi] , 
            webcallpeers[pi].streamid ,
            webcallpeers[pi].controlBarName,
            webcallpeers[pi].fileSharingContainer); 

        if(outgoingVideo)
            waitForRemoteVideo(webcallpeers[pi].stream , remoteVideos[vi] , localVideo  , remoteVideos[0] );
        else
            waitForRemoteVideo(webcallpeers[pi].stream , remoteVideos[vi] , null  , null );

        if(remoteVideos[vi].hidden){
            remoteVideos[vi].hidden=false;
        }

        if(fileshareobj.active){
            createFileSharingDiv(pi);
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
        channel: channel,
        sender: userid
    });
    shownotification(" Making a new session ");
}

connectWebRTC=function(channel , userid){
    rtcMultiConnection.connect(channel);
    /*changeUserid(userid);*/
    shownotification("Connected ");
}

joinWebRTC=function(channel , userid){
    shownotification("Joining an existing session ");
    rtcMultiConnection.join(channel);
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

function updatePeerInfo(userid , type ){
    console.log("updating peerInfo: " , userid , type);
    for(x in webcallpeers){
        console.log(webcallpeers[x].userid);
        if(webcallpeers[x].userid==userid) return;
    }

    peerInfo={ 
        videoContainer : "video"+userid,
        videoHeight : null,
        videoClassName: null,
        userid : userid , 
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
    console.log(element);
    
    if (typeof element.srcObject !== 'undefined') {
        element.srcObject = stream;
    }else if (typeof element.src !== 'undefined') {
        element.src = URL.createObjectURL(stream);
    } else{
         console.log('Error attaching stream to element.' , element , stream);
    }
}


function reattachMediaStream(to, from) {
    to.src = from.src;
}