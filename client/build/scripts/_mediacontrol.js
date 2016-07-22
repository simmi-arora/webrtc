function createAudioMuteButton(controlBarName){
    var audioButton=document.createElement("span");
    audioButton.id=controlBarName+"audioButton";
    audioButton.setAttribute("data-val","mute");
    audioButton.setAttribute("title", "Toggle Audio");
    audioButton.setAttribute("data-placement", "bottom");
    audioButton.setAttribute("data-toggle", "tooltip");
    audioButton.setAttribute("data-container", "body");
    audioButton.className=muteobj.audio.button.class_on;
    audioButton.innerHTML=muteobj.audio.button.html_on;
    audioButton.onclick = function() {
        if(audioButton.className == muteobj.audio.button.class_on ){
            rtcMultiConnection.streams[streamid].mute({
                audio: !0
            });
            audioButton.className=muteobj.audio.button.class_off;
            audioButton.innerHTML=muteobj.audio.button.html_off;
        } 
        else{            
            rtcMultiConnection.streams[streamid].unmute({
                audio: !0
            });
            audioButton.className=muteobj.audio.button.class_on;
            audioButton.innerHTML=muteobj.audio.button.html_on;
        }     
        syncButton(audioButton.id);        
    };
    return audioButton;
}

function createVideoMuteButton(controlBarName){
    var videoButton=document.createElement("span");
    videoButton.id=controlBarName+"videoButton";
    videoButton.setAttribute("title", "Toggle Video");
    videoButton.setAttribute("data-placement", "bottom");
    videoButton.setAttribute("data-toggle", "tooltip");
    videoButton.setAttribute("data-container", "body");
    videoButton.className=muteobj.video.button.class_on;   
    videoButton.innerHTML=muteobj.video.button.html_on;     
    videoButton.onclick= function(event) {
        if(videoButton.className == muteobj.video.button.class_on ){
            rtcMultiConnection.streams[streamid].mute({
                video: !0
            });
            videoButton.innerHTML=muteobj.video.button.html_off;
            videoButton.className=muteobj.video.button.class_off;   
        } 
        else{ 
            rtcMultiConnection.streams[streamid].unmute({
                video: !0
            });
            videoButton.innerHTML=muteobj.video.button.html_on;
            videoButton.className=muteobj.video.button.class_on; 
        }  
        syncButton(videoButton.id);
    }; 
    return videoButton;
}