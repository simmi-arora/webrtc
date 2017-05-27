function createRecordButton(controlBarName, peerinfo, streamid, stream){
    var recordButton=document.createElement("div");
    recordButton.id=controlBarName+"recordButton";
    recordButton.setAttribute("title", "Record");
    recordButton.setAttribute("data-placement", "bottom");
    recordButton.setAttribute("data-toggle", "tooltip");
    recordButton.setAttribute("data-container", "body");
    recordButton.className=videoRecordobj.button.class_off;
    recordButton.innerHTML=videoRecordobj.button.html_off;
    recordButton.onclick = function(e) {
        if(recordButton.className==videoRecordobj.button.class_on){
            recordButton.className=videoRecordobj.button.class_off;
            recordButton.innerHTML=videoRecordobj.button.html_off;
            stopRecord(peerinfo, streamid, stream);
        }else if(recordButton.className==videoRecordobj.button.class_off){
            recordButton.className=videoRecordobj.button.class_on;
            recordButton.innerHTML=videoRecordobj.button.html_on;
            startRecord(peerinfo, streamid, stream);
        }
    };  

    return recordButton;
}


var listOfRecorders = {};

function startRecord(peerinfo , streamid, stream){
    var recorder = RecordRTC(stream, {
        type: 'video        recorderType: MediaStreamRecorder',

    });
    recorder.startRecording();
    listOfRecorders[streamid] = recorder;
}

function stopRecord(peerinfo , streamid , stream){
    /*var streamid = prompt('Enter stream-id');*/

    if(!listOfRecorders[streamid]) {
        /*throw 'Wrong stream-id';*/
        console.log("wrong stream id ");
    }
    var recorder = listOfRecorders[streamid];
    recorder.stopRecording(function() {
        var blob = recorder.getBlob();
        if(!peerinfo){
            if(selfuserid)
                peerinfo = findPeerInfo(selfuserid);
            else
                peerinfo = findPeerInfo(rtcConn.userid);
        }

        /*        
        window.open( URL.createObjectURL(blob) );
        // or upload to server
        var formData = new FormData();
        formData.append('file', blob);
        $.post('/server-address', formData, serverCallback);*/
    
        var recordVideoname = "recordedvideo"+ new Date().getTime();
        peerinfo.filearray.push(recordVideoname);
        var numFile= document.createElement("div");
        numFile.value= peerinfo.filearray.length;
        var fileurl=URL.createObjectURL(blob);

        displayList(peerinfo.uuid , peerinfo  ,fileurl , recordVideoname , "videoRecording");
        displayFile(peerinfo.uuid , peerinfo , fileurl , recordVideoname , "videoRecording");
    });
}


function stopSessionRecord(peerinfo , scrrecordStreamid, scrrecordStream , scrrecordAudioStreamid, scrrecordAudioStream){
    /*var streamid = prompt('Enter stream-id');*/

    if(!listOfRecorders[scrrecordStreamid]) {
        /*throw 'Wrong stream-id';*/
        console.log("wrong stream id scrrecordStreamid");
    }

    if(!listOfRecorders[scrrecordAudioStreamid]) {
        /*throw 'Wrong stream-id';*/
        console.log("wrong stream id scrrecordAudioStreamid");
    }

    var recorder = listOfRecorders[scrrecordStreamid];
    recorder.stopRecording(function() {
        var blob = recorder.getBlob();
        console.log(" scrrecordStreamid stopped recoridng blob is " , blob);
    });

    var recorder2 = listOfRecorders[scrrecordAudioStreamid];
    recorder2.stopRecording(function() {
        var blob = recorder2.getBlob();
        console.log(" scrrecordStreamid stopped recoridng blob is " , blob);
    });

}

/*function startRecord(){
    rtcMultiConnection.streams[streamid].startRecording({
        audio: true,
        video: true
    });
}

function stopRecord(){
    rtcMultiConnection.streams[streamid].stopRecording(function (dataRecordedVideo) {
        for(i in webcallpeers ){
            if(webcallpeers[i].userid==rtcMultiConnection.userid){
                var recordVideoname = "recordedvideo"+ new Date().getTime();
                webcallpeers[i].filearray.push(recordVideoname);
                var numFile= document.createElement("div");
                numFile.value= webcallpeers[i].filearray.length;
                var fileurl=URL.createObjectURL(dataRecordedVideo.video);
                if(fileshareobj.active){
                    syncSnapshot(fileurl , "videoRecording" , recordVideoname );
                    displayList(rtcMultiConnection.uuid , rtcMultiConnection.userid  ,fileurl , recordVideoname , "videoRecording");
                    displayFile(rtcMultiConnection.uuid , rtcMultiConnection.userid , fileurl , recordVideoname , "videoRecording");
                }else{
                    displayFile(rtcMultiConnection.uuid , rtcMultiConnection.userid , fileurl , recordVideoname , "videoRecording");
                }
            }
        }
    }, {audio:true, video:true} );
}*/