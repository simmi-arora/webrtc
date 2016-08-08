function createSnapshotButton(controlBarName , peerinfo){
    var snapshotButton=document.createElement("div");
    snapshotButton.id=controlBarName+"snapshotButton";
    snapshotButton.setAttribute("title", "Snapshot");
    snapshotButton.setAttribute("data-placement", "bottom");
    snapshotButton.setAttribute("data-toggle", "tooltip");
    snapshotButton.setAttribute("data-container", "body");
    snapshotButton.className=snapshotobj.button.class_on;
    snapshotButton.innerHTML=snapshotobj.button.html_on;
    snapshotButton.onclick = function() {
        /*rtcMultiConnection.streams[streamid].takeSnapshot(function(datasnapshot) {*/
        /*
        for(i in webcallpeers ){
            if(webcallpeers[i].userid==rtcMultiConnection.userid){
            }
        }*/

        console.log(" mediaobj ----------------" , peerinfo);

        takeSnapshot(peerinfo, function(datasnapshot) {    
            var snapshotname = "snapshot"+ new Date().getTime();
            peerinfo.filearray.push(snapshotname);
            var numFile= document.createElement("div");
            numFile.value= peerinfo.filearray.length;

            if(fileshareobj.active){
                syncSnapshot(datasnapshot , "imagesnapshot" , snapshotname );
                displayList(peerinfo.uuid , peerinfo.userid ,datasnapshot , snapshotname, "imagesnapshot");
                displayFile(peerinfo.uuid , peerinfo.userid, datasnapshot , snapshotname, "imagesnapshot");
            }else{
                displayFile(peerinfo.uuid , peerinfo.userid, datasnapshot , snapshotname, "imagesnapshot");
            } 
        });         
    };
    return snapshotButton;
}

/* *************************************8
Snapshot
************************************************/
function takeSnapshot(peerinfo , callback) {
    /*
    var userid = args.userid;
    var connection = args.connection;*/

    function _takeSnapshot(video) {
        var canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || video.clientWidth;
        canvas.height = video.videoHeight || video.clientHeight;

        var context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        /*
        connection.snapshots[userid] = canvas.toDataURL('image/png');
        args.callback && args.callback(connection.snapshots[userid]);*/
    
        callback(canvas.toDataURL('image/png'));
    }

    if (peerinfo.videoContainer) return _takeSnapshot(document.getElementById(peerinfo.videoContainer));

    /*
    for (var stream in connection.streams) {
        stream = connection.streams[stream];
        if (stream.userid == userid && stream.stream && stream.stream.getVideoTracks && stream.stream.getVideoTracks().length) {
            _takeSnapshot(stream.mediaElement);
            continue;
        }
    }*/
}
    
function syncSnapshot(datasnapshot , datatype , dataname ){
    rtcMultiConnection.send({
        type:datatype, 
        message:datasnapshot, 
        name : dataname
    });
}

/*function displaySnapshot(snapshotViewer , datasnapshot){
    var snaspshot=document.createElement("img");
    snaspshot.src = datasnapshot;
    document.getElementById(snapshotViewer).appendChild(snaspshot);
    console.log("snaspshot ",datasnapshot);
}*/
