/*-----------------------------------------------------------------------------------*/
/*                    File JS                                                   */
/*-----------------------------------------------------------------------------------*/

var progressHelper = {};

/**
 * Send File 
 * @method
 * @name sendFile
 * @param {json} file
 */
function sendFile(file){
    webrtcdev.log(" [filehsraing js] Send file - " , file );
    //var peerinfo = findPeerInfo(selfuserid);
    for( x in webcallpeers){
        for(y in webcallpeers[x].filearray){
            if(webcallpeers[x].filearray[y].status=="progress"){
                webrtcdev.log(" A file is already in progress , add the new file "+file.name+" to queue");
                //alert("Allow current file to complete uploading, before selecting the next file share upload");
                pendingFileTransfer.push(file);
                addstaticProgressHelper(file.uuid, findPeerInfo(selfuserid), file.name, file.maxChunks, file , "fileBoxClass" , selfuserid , "" );
                return;
            }
        }
    }
    rtcConn.send(file);
}


/**
 * Stop Sending File 
 * @method
 * @name stop sending files and remove them form filearray 
 * @param {json} file
 */
function stopSendFile(progressid , filename , file , fileto, filefrom ){
    webrtcdev.log(" [filehsraing js] Stop Sending file - " , file );
    var peerinfo = findPeerInfo(file.userid);
    for( y in peerinfo.filearray){
        if(peerinfo.filearray[y].pid == progressid) {
            //alert(" stop senidng file progressid "+ progressid);
            peerinfo.filearray[y].status = "stop";
            webrtcdev.log(" [filesharing js ] stopSendFile - filename " , peerinfo.filearray[y].name , " | status " , peerinfo.filearray[y].status);
            //peerinfo.filearray.splice(y,1);
        }
    }
}


/**
 * Request Old Files
 * @method
 * @name requestOldFiles
 * @param {json} files
 */
function requestOldFiles(){
    try{
        var msg={
            type:"syncOldFiles"
        };
        rtcConn.send(msg);
    }catch(e){
        webrtcdev.error("[filesharing js ] syncOldFiles" , e);   
    }
}

/**
 * Send Old Files
 * @method
 * @name sendOldFiles
 * @param {json} files
 */
function sendOldFiles(){

    // Sync old files
    var oldfilesList = [];
    for(x in webcallpeers){
        webrtcdev.log(" Checking Old Files in index " , x);
        var user = webcallpeers[x];
        if(user.filearray && user.filearray.length >0 ){
            for( y in user.filearray){
                // chking is file is already present in old file list 
                for(o in oldfilesList){
                    if(oldfilesList[o].name == user.filearray[y].name) break;
                }
                webrtcdev.log("[filehsraing js] user.filearray[y]" , user.filearray[y])
                oldfilesList.push(user.filearray[y]);
            } 
        }
    }

    setTimeout(function(){
        if(oldfilesList.length >0 ){
            webrtcdev.log("[filehsraing js] sendOldFiles " , oldfilesList );
            for( f in oldfilesList ){
                sendFile(oldfilesList[f]);
            }
        }
    } , 20000);

}

/**
 * add New File Local
 * @method
 * @name addNewFileLocal
 * @param {json} files
 */
function addNewFileLocal(e) {
    webrtcdev.log("addNewFileLocal message ", e);
    if ("" != e.message && " " != e.message) {
        webrtcdev.log("addNewFileLocal");
    }
}

/**
 * add New File Remote
 * @method
 * @name addNewFileRemote
 * @param {json} files
 */
function addNewFileRemote(e) {
    webrtcdev.log("addNewFileRemote message ", e);
    if ("" != e.message && " " != e.message) {
        webrtcdev.log("addNewFileRemote");
    }
}

/*-----------------------------------------------------------------------------------*/