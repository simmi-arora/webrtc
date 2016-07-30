/************************************************************************
Canvas Record 
*************************************************************************/

function syncVideoScreenRecording(data , datatype , dataname ){
    rtcMultiConnection.send({type:datatype, message:data  , name : dataname});
}

function autorecordScreenVideo(){

}

function createScreenRecordButton(){

	var element = document.body;
    recorder = RecordRTC(element, {
        type: 'canvas',
        showMousePointer: true
    });

    var recordButton= document.createElement("span");
    recordButton.className= screenrecordobj.button.class_off ;
    recordButton.innerHTML= screenrecordobj.button.html_off;
    recordButton .onclick = function() {
        if(recordButton.className==screenrecordobj.button.class_off){
            recordButton.className= screenrecordobj.button.class_on ;
            recordButton.innerHTML= screenrecordobj.button.html_on;
            recorder.startRecording();
        }else if(recordButton.className==screenrecordobj.button.class_on){
            recordButton.className= screenrecordobj.button.class_off ;
            recordButton.innerHTML= screenrecordobj.button.html_off;
            recorder.stopRecording(function(videoURL) {
                for(i in webcallpeers ){
                    if(webcallpeers[i].userid==rtcMultiConnection.userid){
                        var recordVideoname = "recordedScreenvideo"+ new Date().getTime();
                        webcallpeers[i].filearray.push(recordVideoname);
                        var numFile= document.createElement("div");
                        numFile.value= webcallpeers[i].filearray.length;

                        syncVideoScreenRecording(videoURL , "videoScreenRecording" , recordVideoname);
                        displayList(rtcMultiConnection.uuid , rtcMultiConnection.userid , videoURL, recordVideoname , "videoScreenRecording");
                        displayFile(rtcMultiConnection.uuid , rtcMultiConnection.userid , videoURL, recordVideoname , "videoScreenRecording");
                    }
                }

                var recordedBlob = recorder.getBlob();
                recorder.getDataURL(function(dataRecordedVideo) { 
                    console.log("dataURL " , dataRecordedVideo);
                    /* creates a file */
                });
            });
            
        }
    };

    var li =document.createElement("li");
    li.appendChild(recordButton);
    document.getElementById("topIconHolder_ul").appendChild(li);
        
}