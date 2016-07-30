function createRecordButton(controlBarName){
    var recordButton=document.createElement("div");
    recordButton.id=controlBarName+"recordButton";
    recordButton.setAttribute("title", "Record");
    recordButton.setAttribute("data-placement", "bottom");
    recordButton.setAttribute("data-toggle", "tooltip");
    recordButton.setAttribute("data-container", "body");
    recordButton.className=videoRecordobj.button.class_off;
    recordButton.innerHTML=videoRecordobj.button.html_off;
    recordButton.onclick = function() {
        if(recordButton.className==videoRecordobj.button.class_on){
            recordButton.className=videoRecordobj.button.class_off;
            recordButton.innerHTML=videoRecordobj.button.html_off;
            rtcMultiConnection.streams[streamid].startRecording({
                audio: true,
                video: true
            });
        }else if(recordButton.className==videoRecordobj.button.class_off){
            recordButton.className=videoRecordobj.button.class_on;
            recordButton.innerHTML=videoRecordobj.button.html_on;
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
        }
    };  

    return recordButton;
}