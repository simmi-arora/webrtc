/************************************************************************
Canvas Record 
*************************************************************************/
var scrrecordStream = null , scrrecordStreamid = null;
var scrrecordAudioStream = null , scrrecordAudioStreamid = null;

function syncVideoScreenRecording(data , datatype , dataname ){
    rtcMultiConnection.send({type:datatype, message:data  , name : dataname});
}

function autorecordScreenVideo(){

}

function assignScreenRecordButton(){

    var recordButton = document.getElementById(screenrecordobj.button.id);

    recordButton.onclick = function() {
        if(recordButton.className==screenrecordobj.button.class_off){

            recordButton.className= screenrecordobj.button.class_on ;
            recordButton.innerHTML= screenrecordobj.button.html_on;
            webrtcdevRecordScreen();

        }else if(recordButton.className==screenrecordobj.button.class_on){

            var peerinfo;
            if(selfuserid)
                peerinfo = findPeerInfo(selfuserid);
            else
                peerinfo = findPeerInfo(rtcConn.userid);

            recordButton.className= screenrecordobj.button.class_off ;
            recordButton.innerHTML= screenrecordobj.button.html_off;
            webrtcdevStopRecordScreen();

            stopRecord(peerinfo , scrrecordStreamid, scrrecordStream , scrrecordAudioStreamid, scrrecordAudioStream);
            
            var scrrecordStreamBlob;
            var scrrecordAudioStreamBlob;

            var recorder1 = listOfRecorders[scrrecordStreamid];
            recorder1.stopRecording(function() {
                scrrecordStreamBlob = recorder1.getBlob();
            });

            var recorder2 = listOfRecorders[scrrecordAudioStreamid];
            recorder2.stopRecording(function() {
                scrrecordAudioStreamBlob = recorder2.getBlob();
            });

            
            setTimeout(function(){ 

                console.log(" ===2 blobs====", scrrecordStreamBlob , scrrecordAudioStreamBlob); 
                mergeStreams(scrrecordStreamBlob , scrrecordAudioStreamBlob);
                //convertStreams(scrrecordStreamBlob , scrrecordAudioStreamBlob);
                
                scrrecordStreamid = null;
                scrrecordStream = null ;

                scrrecordAudioStreamid = null;
                scrrecordAudioStream = null ;

             }, 5000);

        }
    };
}

/*function assignScreenRecordButton(){

    var recordButton = document.getElementById(screenrecordobj.button.id);
    console.log(" -------recordButton---------" , recordButton);
    recordButton.onclick = function() {
        if(recordButton.className==screenrecordobj.button.class_off){
            alert(" start recording screen + audio ");

            var elementToShare = document.getElementById("parentDiv");

            var canvas2d = document.createElement('canvas');
            canvas2d.setAttribute("style","z-index:-1");
            canvas2d.id="screenrecordCanvas";

            var context = canvas2d.getContext('2d');

            canvas2d.width = elementToShare.clientWidth;
            canvas2d.height = elementToShare.clientHeight;

            canvas2d.style.top = 0;
            canvas2d.style.left = 0;

            (document.body || document.documentElement).appendChild(canvas2d);

            var isRecordingStarted = false;
            var isStoppedRecording = false;

            (function looper() {
                if(!isRecordingStarted) {
                    return setTimeout(looper, 500);
                }

                html2canvas(elementToShare, {
                    grabMouse: true,
                    onrendered: function(canvas) {
                        context.clearRect(0, 0, canvas2d.width, canvas2d.height);
                        context.drawImage(canvas, 0, 0, canvas2d.width, canvas2d.height);

                        if(isStoppedRecording) {
                            return;
                        }

                        setTimeout(looper, 1);
                    }
                });
            })();

            recorder = RecordRTC(canvas2d, {
                type: 'canvas'
            });

            recordButton.className= screenrecordobj.button.class_on ;
            recordButton.innerHTML= screenrecordobj.button.html_on;
            
            recorder.startRecording();
        
            isStoppedRecording = false;
            isRecordingStarted = true;

        }else if(recordButton.className==screenrecordobj.button.class_on){
            alert(" stoppped recording screen + audio ");

            var elem = document.getElementById("screenrecordCanvas");
            elem.parentNode.removeChild(elem);

            recordButton.className= screenrecordobj.button.class_off ;
            recordButton.innerHTML= screenrecordobj.button.html_off;
            
            isStoppedRecoridng = true;

            recorder.stopRecording(function() {
                var blob = recorder.getBlob();
                var videoURL=URL.createObjectURL(blob);
                var uuid= guid();
                var recordVideoname= "screenrecorded"+ Math.floor(new Date() / 1000);
                var peerinfo=findPeerInfo( selfuserid);
                displayList(uuid , peerinfo , videoURL, recordVideoname , "videoScreenRecording");
                displayFile(uuid , peerinfo , videoURL, recordVideoname , "videoScreenRecording");
            });
  
        }
    };
}*/

/*function createScreenRecordButton(){

    var recordButton= document.createElement("span");
    recordButton.className= screenrecordobj.button.class_off ;
    recordButton.innerHTML= screenrecordobj.button.html_off;
    recordButton.onclick = function() {
        if(recordButton.className==screenrecordobj.button.class_off){

            var element = document.body;  
            recorder = RecordRTC(element, {
                type: 'canvas',
                showMousePointer: true
            });

            var canvas2d = document.createElement('canvas');
            canvas2d.id="screenrecordCanvas";
            canvas2d.setAttribute("style","z-index:-1");
            var context = canvas2d.getContext('2d');

            canvas2d.style.top = 0;
            canvas2d.style.left = 0;

            (document.body || document.documentElement).appendChild(canvas2d);

            var isRecordingStarted = false;
            var isStoppedRecording = false;

            (function looper() {
                if(!isRecordingStarted) {
                    return setTimeout(looper, 500);
                }

                html2canvas(elementToShare, {
                    grabMouse: true,
                    onrendered: function(canvas) {
                        context.clearRect(0, 0, canvas2d.width, canvas2d.height);
                        context.drawImage(canvas, 0, 0, canvas2d.width, canvas2d.height);

                        if(isStoppedRecording) {
                            return;
                        }

                        setTimeout(looper, 1);
                    }
                });
            })();

            recorder = RecordRTC(canvas2d, {
                type: 'canvas'
            });

            recordButton.className= screenrecordobj.button.class_on ;
            recordButton.innerHTML= screenrecordobj.button.html_on;
            recorder.startRecording();

            isStoppedRecording = false;
            isRecordingStarted = true;

            setTimeout(function() {
                recordButton.disabled = false;
            }, 500);

        }else if(recordButton.className==screenrecordobj.button.class_on){
            recordButton.className= screenrecordobj.button.class_off ;
            recordButton.innerHTML= screenrecordobj.button.html_off;
            
            isStoppedRecoridng = true;

            recorder.stopRecording(function() {
                var elem = document.getElementById("screenrecordCanvas");
                elem.parentNode.removeChild(elem);

                var blob = recorder.getBlob();
                var video = document.createElement('video');
                video.src = URL.createObjectURL(blob);
                video.setAttribute('style', 'height: 100%; position: absolute; top:0;');
                document.body.appendChild(video);
                video.controls = true;
                video.play();
            });
  
        }
    };

    //webrtcUtils.enableLogs = false;

    var li =document.createElement("li");
    li.appendChild(recordButton);
    document.getElementById("topIconHolder_ul").appendChild(li);       
}*/

//call with getSourceIdScreenrecord(function(){} , true)
function getSourceIdScreenrecord(callback, audioPlusTab) {
    if (!callback)
        throw '"callback" parameter is mandatory.';

    window.postMessage("webrtcdev-extension-getsourceId-audio-plus-tab", "*");
};

function onScreenrecordExtensionCallback(event){
    console.log("onScreenrecordExtensionCallback" , event);

    if (event.data.chromeExtensionStatus) {
       console.log(event.data.chromeExtensionStatus);
    }

    if (event.data.sourceId) {
        if (event.data.sourceId === 'PermissionDeniedError') {
            console.log('permission-denied');
        } else{
            webrtcdevScreenRecordConstraints(event.data.sourceId);
        }
    }
}

function webrtcdevScreenRecordConstraints(chromeMediaSourceId){
    console.log(" webrtcdevScreenRecordConstraints :" + chromeMediaSourceId);
    
    navigator.getUserMedia(
        {
            audio: true,
            video: false
        },
        function stream(event) {

            var peerinfo;
            if(selfuserid)
                peerinfo = findPeerInfo(selfuserid);
            else
                peerinfo = findPeerInfo(rtcConn.userid);

            scrrecordAudioStreamid = event.id ;
            scrrecordAudioStream = event ;
            startRecord(peerinfo ,  scrrecordAudioStreamid , scrrecordAudioStream);
        },
        function error(err) {
            console.log(" Error in webrtcdevScreenRecordConstraints "  , err);
            if (isChrome && location.protocol === 'http:') {
                alert('Please test this WebRTC experiment on HTTPS.');
            } else if(isChrome) {
                alert('Screen capturing is either denied or not supported. Please install chrome extension for screen capturing or run chrome with command-line flag: --enable-usermedia-screen-capturing');
            } else if(!!navigator.mozGetUserMedia) {
                alert(Firefox_Screen_Capturing_Warning);
            }
        }
    );

    navigator.getUserMedia(
        {
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
        },
        function stream(event) {

            //var container = document.getElementById(screenshareobj.screenshareContainer);
            //var videosContainer = document.createElement("video");
            //videosContainer.src = window.URL.createObjectURL(event);
            //container.appendChild(videosContainer);

            var peerinfo;
            if(selfuserid)
                peerinfo = findPeerInfo(selfuserid);
            else
                peerinfo = findPeerInfo(rtcConn.userid);

            scrrecordStreamid = event.id ;
            scrrecordStream = event ;
            startRecord(peerinfo ,  scrrecordStreamid , scrrecordStream);
        },
        function error(err) {
            console.log(" Error in webrtcdevScreenRecordConstraints "  , err);
            if (isChrome && location.protocol === 'http:') {
                alert('Please test this WebRTC experiment on HTTPS.');
            } else if(isChrome) {
                alert('Screen capturing is either denied or not supported. Please install chrome extension for screen capturing or run chrome with command-line flag: --enable-usermedia-screen-capturing');
            } else if(!!navigator.mozGetUserMedia) {
                alert(Firefox_Screen_Capturing_Warning);
            }
        }
    );

}

function webrtcdevRecordScreen() {
    console.log("webrtcdevRecordScreen");
    getSourceIdScreenrecord(function(){} , true);
}

function webrtcdevStopRecordScreen(){
    console.log("webrtcdevStopRecordScreen screenRoomid");
    window.postMessage("webrtcdev-extension-stopsource-screenrecord", "*");

    if(scrrecordStream)scrrecordStream.stop();
    else alert(" screen video recoridng was not succesfull");

    if(scrrecordAudioStream)scrrecordAudioStream.stop();
    else alert(" screen audio recording was not successfull");
}

// Using ffmpeg concept and merging it together

var workerPath = 'https://archive.org/download/ffmpeg_asm/ffmpeg_asm.js';

function processInWebWorker() {
    var blob = URL.createObjectURL(new Blob(['importScripts("' + workerPath + '");var now = Date.now;function print(text) {postMessage({"type" : "stdout","data" : text});};onmessage = function(event) {var message = event.data;if (message.type === "command") {var Module = {print: print,printErr: print,files: message.files || [],arguments: message.arguments || [],TOTAL_MEMORY: message.TOTAL_MEMORY || false};postMessage({"type" : "start","data" : Module.arguments.join(" ")});postMessage({"type" : "stdout","data" : "Received command: " +Module.arguments.join(" ") +((Module.TOTAL_MEMORY) ? ".  Processing with " + Module.TOTAL_MEMORY + " bits." : "")});var time = now();var result = ffmpeg_run(Module);var totalTime = now() - time;postMessage({"type" : "stdout","data" : "Finished processing (took " + totalTime + "ms)"});postMessage({"type" : "done","data" : result,"time" : totalTime});}};postMessage({"type" : "ready"});'], {
        type: 'application/javascript'
    }));

    var worker = new Worker(blob);
    URL.revokeObjectURL(blob);
    return worker;
}

var worker;
var videoFile = !!navigator.mozGetUserMedia ? 'video.gif' : 'video.webm';

function mergeStreams(videoBlob, audioBlob) {
    var peerinfo;
    if(selfuserid){
        peerinfo = findPeerInfo(selfuserid);
    }else{
        peerinfo = findPeerInfo(rtcConn.userid);
    }

    var recordVideoname = "recordedvideo"+ new Date().getTime();
    peerinfo.filearray.push(recordVideoname);
    var numFile= document.createElement("div");
    numFile.value= peerinfo.filearray.length;
    var fileurl=URL.createObjectURL(videoBlob);

    var recordAudioname = "recordedaudio"+ new Date().getTime();
    peerinfo.filearray.push(recordAudioname);
    var numFile2= document.createElement("div");
    numFile2.value= peerinfo.filearray.length;
    var fileurl2=URL.createObjectURL(audioBlob);

    var sessionRecordfileurl={
        videofileurl: fileurl,
        audiofileurl: fileurl2
    };

    var sessionRecordName={
        videoname: recordVideoname,
        audioname: recordAudioname
    };

   displayList(peerinfo.uuid , peerinfo , sessionRecordfileurl , sessionRecordName , "sessionRecording");
   displayFile(peerinfo.uuid , peerinfo , sessionRecordfileurl , sessionRecordName , "sessionRecording"); 

}

function convertStreams(videoBlob, audioBlob) {
    var vab;
    var aab;
    var buffersReady;
    var workerReady;
    var posted = false;

    var fileReader1 = new FileReader();
    fileReader1.onload = function() {
        vab = this.result;

        if (aab) buffersReady = true;

        if (buffersReady && workerReady && !posted) postMessage();
    };

    var fileReader2 = new FileReader();
    fileReader2.onload = function() {
        aab = this.result;

        if (vab) buffersReady = true;

        if (buffersReady && workerReady && !posted) postMessage();
    };

    console.log("videoBlob ", videoBlob);
    console.log("audioBlob ", audioBlob);

    fileReader1.readAsArrayBuffer(videoBlob);
    fileReader2.readAsArrayBuffer(audioBlob);

    if (!worker) {
        worker = processInWebWorker();
    }

    worker.onmessage = function(event) {
        var message = event.data;
        if (message.type == "ready") {
            console.log('<a href="'+ workerPath +'" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file has been loaded.');
            workerReady = true;
            if (buffersReady)
                postMessage();
        } else if (message.type == "stdout") {
            console.log(message.data);
        } else if (message.type == "start") {
            console.log('<a href="'+ workerPath +'" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file received ffmpeg command.');
        } else if (message.type == "done") {
            console.log(JSON.stringify(message));

            var result = message.data[0];
            console.log(JSON.stringify(result));

            var blob = new Blob([result.data], {
                type: 'video/mp4'
            });

            console.log(JSON.stringify(blob));

            PostBlob(blob);
        }
    };

    var postMessage = function() {
        posted = true;

        worker.postMessage({
            type: 'command',
            arguments: [
                '-i', videoFile,
                '-i', 'audio.wav',
                '-c:v', 'mpeg4',
                '-c:a', 'vorbis',
                '-b:v', '6400k',
                '-b:a', '4800k',
                '-strict', 'experimental', 'output.mp4'
            ],
            files: [
                {
                    data: new Uint8Array(vab),
                    name: videoFile
                },
                {
                    data: new Uint8Array(aab),
                    name: "audio.wav"
                }
            ]
        });
    };
}

function PostBlob(blob) {

    var peerinfo;
    if(selfuserid){
        peerinfo = findPeerInfo(selfuserid);
    }else{
        peerinfo = findPeerInfo(rtcConn.userid);
    }

    var recordVideoname = "recordedvideo"+ new Date().getTime();
    peerinfo.filearray.push(recordVideoname);
    var numFile= document.createElement("div");
    numFile.value= peerinfo.filearray.length;
    var fileurl=URL.createObjectURL(blob);

   // displayList(peerinfo.uuid , peerinfo  ,fileurl , recordVideoname , "videoRecording");
   // displayFile(peerinfo.uuid , peerinfo , fileurl , recordVideoname , "videoRecording");
   
    var video = document.createElement('video');
    video.controls = true;
    var source = document.createElement('source');
    source.src = URL.createObjectURL(blob);
    source.type = 'video/mp4; codecs=mpeg4';
    video.appendChild(source);
    video.download = 'Play mp4 in VLC Player.mp4';
    
    document.body.appendChild(video);
    /*    
    var h2 = document.createElement('h2');
    h2.innerHTML = '<a href="' + source.src + '" target="_blank" download="Play mp4 in VLC Player.mp4">Download Converted mp4 and play in VLC player!</a>';
    inner.appendChild(h2);
    h2.style.display = 'block';
    inner.appendChild(video);*/

    video.tabIndex = 0;
    video.focus();
    video.play();
}