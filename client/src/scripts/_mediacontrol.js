/***************************************************
video handling 
*********************************************************/

function appendVideo(e, style) {
    createVideoContainer(e, style, function(div) {
        var video = document.createElement('video');
        video.className = style;
        video.setAttribute('style', 'height:auto;opacity:1;');
        video.controls=false;
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
       User Detail attchmenet to Video Element
*******************************************/
function attachUserDetails(vid , peerinfo){
    var nameBox=document.createElement("div");
    nameBox.setAttribute("style","background-color:"+ peerinfo.color);
    nameBox.className = "videoHeaderClass";
    nameBox.innerHTML = peerinfo.name+"<br/>";
    // vid.parentNode.appendChild(nameBox); 
    vid.parentNode.insertBefore(nameBox, vid.parentNode.firstChild);
}

function attachMetaUserDetails(vid , peerinfo){
    webrtcdev.log(peerinfo.userid+ ":" + peerinfo.type);
    var detailsbox = document.createElement("span");
    detailsbox.setAttribute("style","background-color:"+ peerinfo.color);
    detailsbox.innerHTML = peerinfo.userid+ ":" + peerinfo.type+"<br/>";
    vid.parentNode.insertBefore(detailsbox, vid.parentNode.firstChild);
}

function attachControlButtons( vid ,  peerinfo){

    var stream = peerinfo.stream;
    var streamid = peerinfo.streamid;
    var controlBarName =  peerinfo.controlBarName;
    var snapshotViewer =  peerinfo.fileSharingContainer ;

    //Preventing multple control bars 
    var c = vid.parentNode.childNodes;
    for (i = 0; i < c.length; i++) {
        webrtcdev.log("ChildNode of video Parent " , c[i]);
        if(c[i].nodeName=="DIV" && c[i].id!=undefined){
            if( c[i].id.indexOf("control")>-1 ){
                webrtcdev.log("control bar exists already  , delete the previous one before adding new one");
                vid.parentNode.removeChild(c[i]);
            }
        }
    }

    // Control bar holds media control elements like , mute unmute , fillscreen ,. recird , snapshot
    var controlBar= document.createElement("div");
    controlBar.id = controlBarName;

    if(peerinfo.type=="local")
        controlBar.className= "localVideoControlBarClass";
    else
        controlBar.className= "remoteVideoControlBarClass";

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
        controlBar.appendChild(createRecordButton(controlBarName, peerinfo, streamid, stream ));
    }

    if(cursorobj.active){
        //assignButtonCursor(cursorobj.button.id);
        controlBar.appendChild(createCursorButton(controlBarName, peerinfo ));
    }

    if(minmaxobj.active){
        controlBar.appendChild(createFullScreenButton(controlBarName, peerinfo, streamid, stream ));
        controlBar.appendChild(createMinimizeVideoButton(controlBarName, peerinfo, streamid, stream ));
    }

    if(debug){
        var nameBox=document.createElement("span");
        nameBox.innerHTML=vid.id;
        controlBar.appendChild(nameBox);  
    }

    vid.parentNode.appendChild(controlBar);        
}

/************************************
        control Buttons attchmenet to Video Element
*******************************************/
function createFullScreenButton(controlBarName, peerinfo, streamid, stream ){
    var button = document.createElement("span");
    button.id = controlBarName+"fullscreeButton";
    button.setAttribute("title", "Full Screen");
    button.className = minmaxobj.max.button.class_off;
    button.innerHTML = minmaxobj.max.button.html_off;

    // button.setAttribute("data-placement", "bottom");
    // button.setAttribute("data-toggle", "tooltip");
    // button.setAttribute("data-container", "body");

    button.onclick = function() {
        if(button.className == minmaxobj.max.button.class_off){
            var vid = document.getElementById(peerinfo.videoContainer);
            vid.webkitRequestFullScreen();
            button.className=minmaxobj.max.button.class_on;
            button.innerHTML=minmaxobj.max.button.html_on;
        } 
        else{            
            button.className=minmaxobj.max.button.class_off;
            button.innerHTML=minmaxobj.max.button.html_off;
        }     
        //syncButton(audioButton.id);        
    };
    return button;
}


function createMinimizeVideoButton(controlBarName, peerinfo, streamid, stream){
    var button = document.createElement("span");
    button.id = controlBarName+"minmizevideoButton";
    button.setAttribute("title", "Minimize Video");
    button.className = minmaxobj.min.button.class_off;
    button.innerHTML = minmaxobj.min.button.html_off;
    var vid=document.getElementById(peerinfo.videoContainer);
    button.onclick = function() {
        if(button.className == minmaxobj.min.button.class_off){
            vid.hidden = true;
            button.className=minmaxobj.min.button.class_on;
            button.innerHTML=minmaxobj.min.button.html_on;
        } 
        else{ 
            vid.hidden = false;           
            button.className=minmaxobj.min.button.class_off;
            button.innerHTML=minmaxobj.min.button.html_off;
        }     
        //syncButton(audioButton.id);        
    };
    return button;
}


function createAudioMuteButton(controlBarName , peerinfo){
    var audioButton=document.createElement("span");
    audioButton.id=controlBarName+"audioButton";
    audioButton.setAttribute("data-val","mute");
    audioButton.setAttribute("title", "Toggle Audio");
    // audioButton.setAttribute("data-placement", "bottom");
    // audioButton.setAttribute("data-toggle", "tooltip");
    // audioButton.setAttribute("data-container", "body");
    audioButton.className=muteobj.audio.button.class_on;
    audioButton.innerHTML=muteobj.audio.button.html_on;
    audioButton.onclick = function() {
        if(audioButton.className == muteobj.audio.button.class_on ){
            peerinfo.stream.mute({
                audio: !0
            });
            audioButton.className=muteobj.audio.button.class_off;
            audioButton.innerHTML=muteobj.audio.button.html_off;
        } 
        else{            
            peerinfo.stream.unmute({
                audio: !0
            });
            audioButton.className=muteobj.audio.button.class_on;
            audioButton.innerHTML=muteobj.audio.button.html_on;
        }     
        syncButton(audioButton.id);        
    };
    return audioButton;
}

function createVideoMuteButton(controlBarName , peerinfo){
    var videoButton=document.createElement("span");
    videoButton.id=controlBarName+"videoButton";
    videoButton.setAttribute("title", "Toggle Video");
    videoButton.setAttribute("data-container", "body");
    videoButton.className=muteobj.video.button.class_on;   
    videoButton.innerHTML=muteobj.video.button.html_on;     
    videoButton.onclick= function(event) {
        if(videoButton.className == muteobj.video.button.class_on ){
            peerinfo.stream.mute({
                video: !0
            });
            videoButton.innerHTML=muteobj.video.button.html_off;
            videoButton.className=muteobj.video.button.class_off;   
        } 
        else{ 
            peerinfo.stream.unmute({
                video: !0
            });
            videoButton.innerHTML=muteobj.video.button.html_on;
            videoButton.className=muteobj.video.button.class_on; 
        }  
        syncButton(videoButton.id);
    }; 
    return videoButton;
}


function waitForRemoteVideo(_remoteStream , _remoteVideo , _localVideo  , _miniVideo ) {
    var videoTracks = _remoteStream.getVideoTracks();
    if (videoTracks.length === 0 || _remoteVideo.currentTime > 0) {
        transitionToActive(_remoteVideo ,_localVideo ,  _miniVideo);
    } else {
        setTimeout(function(){
            waitForRemoteVideo(_remoteStream , _remoteVideo , _localVideo  , _miniVideo )
        }, 100);
    }
}

function transitionToActive(_remoteVideo ,_localVideo ,  _miniVideo) {
    _remoteVideo.style.opacity = 1;
    if(localVideo!=null){
        setTimeout(function() {
            _localVideo.src = '';
        }, 500); 
    }
    if(miniVideo!=null){
        setTimeout(function() {
            _miniVideo.style.opacity = 1;
        }, 1000); 
    }
}

function transitionToWaiting() {
    card.style.webkitTransform = 'rotateY(0deg)';
    setTimeout(function() {
        localVideo.src = miniVideo.src;
        localVideo.muted = true;
        miniVideo.src = '';
        remoteVideo.src = '';
        localVideo.style.opacity = 1;
    }, 500);
    miniVideo.style.opacity = 0;
    remoteVideo.style.opacity = 0;
}

function attachMediaStream(element, stream) {
    try{
        webrtcdev.log("[ Mediacontrol - attachMediaStream ] element.src", typeof element.src ,typeof element.srcObject , " || stream " + stream );
        
        if(stream){
            if (typeof element.src == 'string') {
                element.src = URL.createObjectURL(stream);
            }else if (typeof element.srcObject == 'object') {
                element.srcObject = stream;
            }else{
                webrtcdev.log('Error attaching stream to element.' , element , stream);
            }

            //element.play();
            webrtcdev.log(" Media Stream attached to " , element , " succesfully");
        }else{
            //element.src = "";
            webrtcdev.debug(" Media Stream not attached to " , element  , " as stream is not valid " , stream);
        }

    }catch(e){
        webrtcdev.error(" [ Mediacontrol - attachMediaStream ]  error" , e);
    }

}

function reattachMediaStream(to, from) {
    to.src = from.src;
}