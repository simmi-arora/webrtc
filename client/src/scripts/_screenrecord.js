
/************************************************************************
Canvas Record 
*************************************************************************/
var scrrecordStream = null , scrrecordStreamid = null;
var mediaRecorder = null , chunks = [];
// var scrrecordAudioStream = null , scrrecordAudioStreamid = null;

// function syncVideoScreenRecording(data , datatype , dataname ){
//     rtcMultiConnection.send({type:datatype, message:data  , name : dataname});
// }

// function autorecordScreenVideo(){

// }


/* 
 * Assign Screen Record Button based on screenrecordobj widget
 * @method
 * @name assignScreenRecordButton
 */
function assignScreenRecordButton(){

    var recordButton = document.getElementById(screenrecordobj.button.id);

    recordButton.onclick = function() {
        if(recordButton.className==screenrecordobj.button.class_on){

            recordButton.className= screenrecordobj.button.class_off ;
            recordButton.innerHTML= screenrecordobj.button.html_off;
            //recordButton.disabled=true;
            webrtcdevRecordScreen();

        }else if(recordButton.className==screenrecordobj.button.class_off){

            var peerinfo;
            if(selfuserid)
                peerinfo = findPeerInfo(selfuserid);
            else
                peerinfo = findPeerInfo(rtcConn.userid);

            recordButton.className= screenrecordobj.button.class_on ;
            recordButton.innerHTML= screenrecordobj.button.html_on;
            webrtcdevStopRecordScreen();

            // stopRecord(peerinfo , scrrecordStreamid, scrrecordStream , scrrecordAudioStreamid, scrrecordAudioStream);
            
            // var scrrecordStreamBlob;
            // var scrrecordAudioStreamBlob;

            // var recorder1 = listOfRecorders[scrrecordStreamid];
            // recorder1.stopRecording(function() {
            //     scrrecordStreamBlob = recorder1.getBlob();
            // });

            // var recorder2 = listOfRecorders[scrrecordAudioStreamid];
            // recorder2.stopRecording(function() {
            //     scrrecordAudioStreamBlob = recorder2.getBlob();
            // });

            // setTimeout(function(){ 

            //     webrtcdev.log(" ===blobs====", scrrecordStreamBlob , scrrecordAudioStreamBlob); 
            //     mergeStreams(scrrecordStreamBlob , scrrecordAudioStreamBlob);
            //     //convertStreams(scrrecordStreamBlob , scrrecordAudioStreamBlob);
                
            //     scrrecordStreamid = null;
            //     scrrecordStream = null ;

            //     scrrecordAudioStreamid = null;
            //     scrrecordAudioStream = null ;

            //     //recordButton.disabled=false;

            //  }, 5000);

        }
    };
}

/*function assignScreenRecordButton(){

    var recordButton = document.getElementById(screenrecordobj.button.id);
    webrtcdev.log(" -------recordButton---------" , recordButton);
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



// function webrtcdevScreenRecordConstraints(chromeMediaSourceId){
//     webrtcdev.log(" webrtcdevScreenRecordConstraints :" + chromeMediaSourceId);
    
//     // navigator.getUserMedia(
//     //     {
//     //         audio: true,
//     //         video: false
//     //     },
//     //     function stream(event) {

//     //         var peerinfo;
//     //         if(selfuserid)
//     //             peerinfo = findPeerInfo(selfuserid);
//     //         else
//     //             peerinfo = findPeerInfo(rtcConn.userid);

//     //         scrrecordAudioStreamid = event.id ;
//     //         scrrecordAudioStream = event ;
//     //         startRecord(peerinfo ,  scrrecordAudioStreamid , scrrecordAudioStream);
//     //     },
//     //     function error(err) {
//     //         webrtcdev.log(" Error in webrtcdevScreenRecordConstraints "  , err);
//     //         if (isChrome && location.protocol === 'http:') {
//     //             alert('Please test this WebRTC experiment on HTTPS.');
//     //         } else if(isChrome) {
//     //             alert('Screen capturing is either denied or not supported. Please install chrome extension for screen capturing or run chrome with command-line flag: --enable-usermedia-screen-capturing');
//     //         } else if(!!navigator.mozGetUserMedia) {
//     //             alert(Firefox_Screen_Capturing_Warning);
//     //         }
//     //     }
//     // );

// }

// {

//  static _startScreenCapture() {
//     if (navigator.getDisplayMedia) {
//       return navigator.getDisplayMedia({video: true});
//     } else if (navigator.mediaDevices.getDisplayMedia) {
//       return navigator.mediaDevices.getDisplayMedia({video: true});
//     } else {
//       return navigator.mediaDevices.getUserMedia({video: {mediaSource: 'screen'}});
//     }
//   }

//   async _startRecording(e) {
//     console.log('Start capturing.');
//     this.status = 'Screen recording started.';
//     this.enableStartCapture = false;
//     this.enableStopCapture = true;
//     this.enableDownloadRecording = false;
//     this.requestUpdate('buttons');

//     if (this.recording) {
//       window.URL.revokeObjectURL(this.recording);
//     }

//     this.chunks = [];
//     this.recording = null;
//     this.stream = await ScreenSharing._startScreenCapture();
//     this.stream.addEventListener('inactive', e => {
//       console.log('Capture stream inactive - stop recording!');
//       this._stopCapturing(e);
//     });

//   }

//   _stopRecording(e) {
//     console.log('Stop capturing.');
//     this.status = 'Screen recorded completed.';
//     this.enableStartCapture = true;
//     this.enableStopCapture = false;
//     this.enableDownloadRecording = true;

//     this.mediaRecorder.stop();
//     this.mediaRecorder = null;
//     this.stream.getTracks().forEach(track => track.stop());
//     this.stream = null;

//     this.recording = window.URL.createObjectURL(new Blob(this.chunks, {type: 'video/webm'}));
//   }

//   _downloadRecording(e) {
//     console.log('Download recording.');
//     this.enableStartCapture = true;
//     this.enableStopCapture = false;
//     this.enableDownloadRecording = false;

//     const downloadLink = this.shadowRoot.querySelector('a#downloadLink');
//     downloadLink.addEventListener('progress', e => console.log(e));
//     downloadLink.href = this.recording;
//     downloadLink.download = 'screen-recording.webm';
//     downloadLink.click();
//   }
// }

// customElements.define('screen-sharing', ScreenSharing);

async function webrtcdevRecordScreen() {
    webrtcdev.log("[screenrecord js] webrtcdevRecordScreen");
   
    // if (navigator.getDisplayMedia) {
    //   return navigator.getDisplayMedia({video: true});
    // } else if (navigator.mediaDevices.getDisplayMedia) {
    //   return navigator.mediaDevices.getDisplayMedia({video: true});
    // } else {
    //   return navigator.mediaDevices.getUserMedia({video: {mediaSource: 'screen'}});
    // }
    try{

        // uses await to asynchronously wait for getDisplayMedia() to resolve with a MediaStream
        scrrecordStream = await navigator.mediaDevices.getDisplayMedia({
            audio: true,
            video: {
                mediaSource: "screen",
                mandatory: {
                    maxWidth: window.screen.width > 1920 ? window.screen.width : 1920,
                    maxHeight: window.screen.height > 1080 ? window.screen.height : 1080
                },
                optional: []
            }
        });
        webrtcdev.log('[screenrecord js] stream', scrrecordStream);
    }catch(err){
        webrtcdev.error("[screenrecord js] Error in webrtcdevRecordScreen " , err);
        // List of errors 
        //AbortError-  doesn't match any of the other exceptions below occurred.
        // InvalidStateError - document in whose context getDisplayMedia() was called is not fully active; for example, perhaps it is not the frontmost tab.
        // NotAllowedError -  Permission to access a screen area was denied by the user, or the current browsing instance is not permitted access to screen sharing.
        // NotFoundError - No sources of screen video are available for capture.
        // NotReadableError - The user selected a screen, window, tab, or other source of screen data, but a hardware or operating system level error or lockout occurred, prevenging the sharing of the selected source.
        // OverconstrainedError - After creating the stream, applying the specified constraints fails because no compatible stream could be generated.
        // TypeError - The specified constraints include constraints which are not permitted when calling getDisplayMedia(). These unsupported constraints are advanced and any constraints which in turn have a member named min or exact.    
    };

    scrrecordStream.addEventListener('inactive', e => {
        webrtcdev.log('Capture stream inactive - stop recording!');
        webrtcdevStopRecordScreen(e);
    });

    try{
        mediaRecorder = new MediaRecorder(scrrecordStream, {mimeType: 'video/webm'});
        mediaRecorder.addEventListener('dataavailable', event => {
            if (event.data && event.data.size > 0) {
                chunks.push(event.data);
            }
        });
        mediaRecorder.start(10);
        webrtcdev.log('[screenrecord js] mediaRecorder', mediaRecorder);
    }catch(err){
        webrtcdev.error("[screenrecord js] Error in mediaRecorder " , err);
    }
}

function webrtcdevStopRecordScreen(event){

    webrtcdev.log("webrtcdevStopRecordScreen" , event);
    // window.postMessage("webrtcdev-extension-stopsource-screenrecord", "*");
    mediaRecorder.stop();
    mediaRecorder = null;

    scrrecordStream.getTracks().forEach(track => track.stop());
    scrrecordStream = null;

    let recording = window.URL.createObjectURL(new Blob(chunks, {type: 'video/webm'}));

    PostBlob(recording);
}

// Using ffmpeg concept and merging it together
// var workerPath = 'https://archive.org/download/ffmpeg_asm/ffmpeg_asm.js';
// function processInWebWorker() {
//     var blob = URL.createObjectURL(new Blob(['importScripts("' + workerPath + '");var now = Date.now;function print(text) {postMessage({"type" : "stdout","data" : text});};onmessage = function(event) {var message = event.data;if (message.type === "command") {var Module = {print: print,printErr: print,files: message.files || [],arguments: message.arguments || [],TOTAL_MEMORY: message.TOTAL_MEMORY || false};postMessage({"type" : "start","data" : Module.arguments.join(" ")});postMessage({"type" : "stdout","data" : "Received command: " +Module.arguments.join(" ") +((Module.TOTAL_MEMORY) ? ".  Processing with " + Module.TOTAL_MEMORY + " bits." : "")});var time = now();var result = ffmpeg_run(Module);var totalTime = now() - time;postMessage({"type" : "stdout","data" : "Finished processing (took " + totalTime + "ms)"});postMessage({"type" : "done","data" : result,"time" : totalTime});}};postMessage({"type" : "ready"});'], {
//         type: 'application/javascript'
//     }));

//     var worker = new Worker(blob);
//     URL.revokeObjectURL(blob);
//     return worker;
// }

// var worker;
// var videoFile = !!navigator.mozGetUserMedia ? 'video.gif' : 'video.webm';

/**
 * merging the recorded audio and video stream
 * @method
 * @name stopSessionRecord
 * @param {json} peerinfo
 * @param {string} scrrecordStreamid
 * @param {blob} scrrecordStream
  * @param {string} scrrecordAudioStreamid
 * @param {blob} scrrecordAudioStream
 */
// function mergeStreams(videoBlob, audioBlob) {
//     var peerinfo;
//     if(selfuserid){
//         peerinfo = findPeerInfo(selfuserid);
//     }else{
//         peerinfo = findPeerInfo(rtcConn.userid);
//     }

//     var recordVideoname = "recordedvideo"+ new Date().getTime();
//     peerinfo.filearray.push(recordVideoname);
//     var numFile= document.createElement("div");
//     numFile.value= peerinfo.filearray.length;
//     var fileurl=URL.createObjectURL(videoBlob);

//     var recordAudioname = "recordedaudio"+ new Date().getTime();
//     peerinfo.filearray.push(recordAudioname);
//     var numFile2= document.createElement("div");
//     numFile2.value= peerinfo.filearray.length;
//     var fileurl2=URL.createObjectURL(audioBlob);

//     var sessionRecordfileurl={
//         videofileurl: fileurl,
//         audiofileurl: fileurl2
//     };

//     var sessionRecordName={
//         videoname: recordVideoname,
//         audioname: recordAudioname
//     };

//    displayList(peerinfo.uuid , peerinfo , sessionRecordfileurl , sessionRecordName , "sessionRecording");
//    displayFile(peerinfo.uuid , peerinfo , sessionRecordfileurl , sessionRecordName , "sessionRecording"); 

// }

// function convertStreams(videoBlob, audioBlob) {
//     var vab;
//     var aab;
//     var buffersReady;
//     var workerReady;
//     var posted = false;

//     var fileReader1 = new FileReader();
//     fileReader1.onload = function() {
//         vab = this.result;

//         if (aab) buffersReady = true;

//         if (buffersReady && workerReady && !posted) postMessage();
//     };

//     var fileReader2 = new FileReader();
//     fileReader2.onload = function() {
//         aab = this.result;

//         if (vab) buffersReady = true;

//         if (buffersReady && workerReady && !posted) postMessage();
//     };

//     webrtcdev.log("videoBlob ", videoBlob);
//     webrtcdev.log("audioBlob ", audioBlob);

//     fileReader1.readAsArrayBuffer(videoBlob);
//     fileReader2.readAsArrayBuffer(audioBlob);

//     if (!worker) {
//         worker = processInWebWorker();
//     }

//     worker.onmessage = function(event) {
//         var message = event.data;
//         if (message.type == "ready") {
//             webrtcdev.log('<a href="'+ workerPath +'" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file has been loaded.');
//             workerReady = true;
//             if (buffersReady)
//                 postMessage();
//         } else if (message.type == "stdout") {
//             webrtcdev.log(message.data);
//         } else if (message.type == "start") {
//             webrtcdev.log('<a href="'+ workerPath +'" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file received ffmpeg command.');
//         } else if (message.type == "done") {
//             webrtcdev.log(JSON.stringify(message));

//             var result = message.data[0];
//             webrtcdev.log(JSON.stringify(result));

//             var blob = new Blob([result.data], {
//                 type: 'video/mp4'
//             });

//             webrtcdev.log(JSON.stringify(blob));

//             PostBlob(blob);
//         }
//     };

//     var postMessage = function() {
//         posted = true;

//         worker.postMessage({
//             type: 'command',
//             arguments: [
//                 '-i', videoFile,
//                 '-i', 'audio.wav',
//                 '-c:v', 'mpeg4',
//                 '-c:a', 'vorbis',
//                 '-b:v', '6400k',
//                 '-b:a', '4800k',
//                 '-strict', 'experimental', 'output.mp4'
//             ],
//             files: [
//                 {
//                     data: new Uint8Array(vab),
//                     name: videoFile
//                 },
//                 {
//                     data: new Uint8Array(aab),
//                     name: "audio.wav"
//                 }
//             ]
//         });
//     };
// }

function PostBlob(resource) {
   
    //var video = document.createElement('video');
    //video.controls = true;
    var fileurl = null;
    if( resource instanceof Blob){
        fileurl = URL.createObjectURL(blob);
        //source.type = 'video/mp4; codecs=mpeg4';
    }else{
        fileurl = resource;
    }
    //video.appendChild(source);
    //video.download = 'Play mp4 in VLC Player.mp4';    
    //document.body.appendChild(video);
    /*    
    var h2 = document.createElement('h2');
    h2.innerHTML = '<a href="' + source.src + '" target="_blank" download="Play mp4 in VLC Player.mp4">Download Converted mp4 and play in VLC player!</a>';
    inner.appendChild(h2);
    h2.style.display = 'block';
    inner.appendChild(video);*/
    // video.tabIndex = 0;
    // video.focus();
    // video.play();

    var peerinfo;
    if(selfuserid){
        peerinfo = findPeerInfo(selfuserid);
    }else{
        peerinfo = findPeerInfo(rtcConn.userid);
    }
    var recordVideoname = "recordedvideo"+ new Date().getTime();
    peerinfo.filearray.push(recordVideoname);
    var numFile = document.createElement("div");
    numFile.value = peerinfo.filearray.length;

    displayList(peerinfo.uuid , peerinfo  ,fileurl , recordVideoname , "videoScreenRecording");
    displayFile(peerinfo.uuid , peerinfo , fileurl , recordVideoname , "videoScreenRecording");
}