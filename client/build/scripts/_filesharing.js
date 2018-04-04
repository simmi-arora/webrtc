/***************************************************************88
File sharing 
******************************************************************/

var progressHelper = {};

/**
 * Create File share button
 * @method
 * @name createFileShareButton
 * @param {json} fileshareobj
 */
function createFileShareButton(fileshareobj){
    widgetholder= "topIconHolder_ul";

    var button= document.createElement("span");
    button.setAttribute("data-provides","fileinput");
    button.className= fileshareobj.button.class;
    button.innerHTML= fileshareobj.button.html;
    button.onclick = function() {
        var fileSelector = new FileSelector();
        fileSelector.selectSingleFile(function(file) {
            sendFile(file);
        });
    };
    var li =document.createElement("li");
    li.appendChild(button);
    document.getElementById(widgetholder).appendChild(li);
}

/**
 * Assign File share button
 * @method
 * @name assignFileShareButton
 * @param {json} fileshareobj
 */
function assignFileShareButton(fileshareobj){
    var button= document.getElementById(fileshareobj.button.id);
    button.onclick = function() {
        var fileSelector = new FileSelector();
        fileSelector.selectSingleFile(function(file) {
            sendFile(file);
        });
    };
}

/**
 * Send File 
 * @method
 * @name sendFile
 * @param {json} file
 */
function sendFile(file){
    console.log(" [filehsraing js] Send file - " , file );
    rtcConn.send(file);
}

/**
 * Send Old Files
 * @method
 * @name sendFile
 * @param {json} files
 */
function addProgressHelper(uuid , peerinfo , filename , fileSize,  progressHelperclassName ){
    try{
        if(!peerinfo){
            console.error(" [filehsraingJs]Progress helpler cannot be added for one peer as its absent")
            return;
        }else if(!peerinfo.fileList.container || !document.getElementById(peerinfo.fileList.container)){
            console.error(" [filehsraingJs] Progress helpler cannot be added , missing fileListcontainer ")
            return;
        }

        if(!document.getElementById(filename)){
            console.log(" [filehsraingJs] progresshelper " , uuid , peerinfo , filename , fileSize,  progressHelperclassName );
            var progressDiv = document.createElement("div");
            progressDiv.id = filename,
            progressDiv.title = uuid + filename,
            progressDiv.setAttribute("class", progressHelperclassName),
            progressDiv.innerHTML = "<label>0%</label><progress></progress>", 
            document.getElementById(peerinfo.fileList.container).appendChild(progressDiv),              
            progressHelper[uuid] = {
                div: progressDiv,
                progress: progressDiv.querySelector("progress"),
                label: progressDiv.querySelector("label")
            }, 
            progressHelper[uuid].progress.max = fileSize;
        }else{
            console.log(" Not creating progress bar div as it already exists ");
        }

    }catch(e){
        console.error(" [filehsraingJs] problem in progress helper " , e);
    }
}

/**
 * REquest Old Files
 * @method
 * @name sendFile
 * @param {json} files
 */
function requestOldFiles(){
    try{
        var msg={
            type:"syncOldFiles"
        };
        rtcConn.send(msg);
    }catch(e){
        console.error("[filesharing js ] syncOldFiles" , e);   
    }
}

/**
 * Send Old Files
 * @method
 * @name sendFile
 * @param {json} files
 */
function sendOldFiles(){

    // Sync old files
    var oldfilesList = [];
    for(x in webcallpeers){
        console.log(" Checking Old Files in index " , x);
        var user = webcallpeers[x];
        if(user.filearray && user.filearray.length >0 ){
            for( y in user.filearray){
                // chking is file is already present in old file list 
                for(o in oldfilesList){
                    if(oldfilesList[o].name == user.filearray[y].name) break;
                }
                console.log(" ======== user.filearray[y]" , user.filearray[y])
                oldfilesList.push(user.filearray[y]);
            } 
        }
    }

    setTimeout(function(){
        if(oldfilesList.length >0 ){
            console.log(" [filehsraing js] sendOldFiles " , oldfilesList );
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
    console.log("addNewFileLocal message ", e);
    if ("" != e.message && " " != e.message) {
        console.log("addNewFileLocal");
    }
}

/**
 * add New File Remote
 * @method
 * @name addNewFileRemote
 * @param {json} files
 */
function addNewFileRemote(e) {
    console.log("addNewFileRemote message ", e);
    if ("" != e.message && " " != e.message) {
        console.log("addNewFileRemote");
    }
}

function updateLabel(e, r) {
    if (-1 != e.position) {
        var n = +e.position.toFixed(2).split(".")[1] || 100;
        r.innerHTML = n + "%"
    }
}

function simulateClick(buttonName){
    document.getElementById(buttonName).click(); 
    console.log("simulateClick on "+buttonName);
    return true;
}

function displayList(uuid , peerinfo , fileurl , filename , filetype ){
    try{

        console.log("DisplayList peerinfo->", peerinfo, fileurl, filename, filetype);
        var showDownloadButton = true , showRemoveButton=true; 

        var elementList = peerinfo.fileList.container;
        var elementDisplay = peerinfo.fileShare.container;
        var listlength = peerinfo.filearray.length;

        /*  
        if(peerinfo.name=="localVideo"){
            showRemoveButton=false;
        }else{
            showRemoveButton=false;
        }*/
        var _filename=null;
        if (filetype =="sessionRecording"){
            filename = filename.videoname+"_"+filename.audioname;
            _filename = filename;
        }

        var name = document.createElement("div");
        /*name.innerHTML = listlength +"   " + filename ;*/
        name.innerHTML = filename ;
        name.title = filetype +" shared by " +peerinfo.name ;  
        name.className = "filenameClass";
        name.id = "name"+filename;

        var downloadButton = document.createElement("div");
        downloadButton.id = "downloadButton"+filename;
        downloadButton.style.float="right";
        if (fileshareobj.filelist.saveicon) {
            var img = document.createElement("img");
            img.src = fileshareobj.filelist.downloadicon;
            downloadButton.appendChild(img);
        } else {
            downloadButton.innerHTML = '<i class="fa fa-download" style=" color: #615aa8;padding: 10px; font-size: larger;"></i>';
        }
        downloadButton.onclick = function () {
            downloadFile(uuid , elementDisplay , fileurl , _filename , filetype);
        };

        var saveButton = document.createElement("div");
        saveButton.id= "saveButton"+filename;
        saveButton.style.float="right";
        saveButton.setAttribute("data-toggle","modal");
        saveButton.setAttribute("data-target", "#saveModal");
        if (fileshareobj.filelist.saveicon) {
            var img = document.createElement("img");
            img.src = fileshareobj.filelist.saveicon;
            saveButton.appendChild(img);
        } else {
            saveButton.innerHTML = '<i class="fa fa-floppy-o" style="color: #615aa8;padding: 10px; font-size: larger;"></i>';
        }
        saveButton.onclick=function(){ 
            createModalPopup(filetype);
        };

        var showButton = document.createElement("div");
        showButton.id= "showButton"+filename;
        showButton.style.float="right";
        if (fileshareobj.filelist.saveicon) {
            var img = document.createElement("img");
            img.src = fileshareobj.filelist.showicon;
            showButton.appendChild(img);
        } else {
            showButton.innerHTML = '<i class="fa fa-eye-slash" style="color: #615aa8;padding: 10px; font-size: larger;"></i>';
        }
        var countClicks=0;
        repeatFlagHideButton = filename;
        repeatFlagShowButton = "";
        showButton.onclick = function () {
            countClicks++;
            showHideFile(uuid , elementDisplay , fileurl , filename , filetype , showButton , countClicks );
        };

        /*
        var hideButton = document.createElement("div");
        hideButton.id= "hideButton"+filename;
        hideButton.style.float="right";
           
        //hideButton.setAttribute("class" , "btn btn-primary");
        //hideButton.innerHTML='hide';
        //hideButton.innerHTML='<i class="fa fa-eye-slash" style="font-size: 25px;"></i>';
        hideButton.onclick=function(event){
            if(repeatFlagHideButton != filename){
                hideFile(uuid , elementDisplay , fileurl , filename , filetype);
                rtcConn.send({
                    type:"shareFileHide", 
                    _uuid: uuid , 
                    _element: elementDisplay,
                    _fileurl : fileurl, 
                    _filename : filename, 
                    _filetype : filetype
                });
                repeatFlagHideButton= filename;
            }else if(repeatFlagHideButton == filename){
                repeatFlagHideButton= "";
            }
        };
        */

        var removeButton = document.createElement("div");
        removeButton.id= "removeButton"+filename;
        removeButton.style.float="right";
        removeButton.innerHTML ='<i class="fa fa-trash-o" style="color: #615aa8;padding: 10px; font-size: larger;"></i>';
        removeButton.onclick=function(event){
            if(repeatFlagRemoveButton != filename){
                hideFile( elementDisplay , filename );
                //var tobeHiddenElement = event.target.parentNode.id;
                var tobeHiddenElement = filename;
                rtcConn.send({
                    type:"shareFileRemove", 
                    _element: tobeHiddenElement,
                    _filename : filename
                });  
                removeFile(tobeHiddenElement);
                repeatFlagRemoveButton=filename;
            }else if(repeatFlagRemoveButton == filename){
                repeatFlagRemoveButton= "";
            }  
        };

        var parentdom , filedom ;
        if(document.getElementById(filename)){
            filedom = document.getElementById(filename);
        }else{
            /* if the progress bar area does not exist */
            if(document.getElementById(elementList)){
                parentdom = document.getElementById(elementList);
                filedom = document.createElement("div") ;
            }else{
                parentdom = document.body;
                filedom = document.createElement("div") ;
            }
        }

        if(fileshareobj.active){
            filedom.id=filename;
            filedom.innerHTML="";
            filedom.className="row";
            filedom.appendChild(name);
            if(showDownloadButton) 
                filedom.appendChild(downloadButton);
            filedom.appendChild(showButton);
            filedom.appendChild(saveButton);
            //filedom.appendChild(hideButton);
            if(showRemoveButton) 
                filedom.appendChild(removeButton);
        }

        if(parentdom)
            parentdom.appendChild(filedom); 

    }catch(e){
        console.error(" [filesharing ] Display list exception " , e);
    }
}


function getFileElementDisplayByType(filetype , fileurl , filename){
    var elementDisplay;
    
    if(filetype.indexOf("msword")>-1 || filetype.indexOf("officedocument")>-1) {
        var divNitofcation= document.createElement("div");
        divNitofcation.className="alert alert-warning";
        divNitofcation.innerHTML= "Microsoft and Libra word file cannot be opened in browser. " +
        "Click bottom DOWNLOAD in UF box . File shows up below the UF box. Click arrow on right, then select OPEN  . File Opens in New Window, then 'Save As'.";
        elementDisplay=divNitofcation;

    }else if(filetype.indexOf("image")>-1){
        var image= document.createElement("img");
        image.src= fileurl;
        image.style.width="100%";
        image.title=filename;
        image.id= "display"+filename; 
        elementDisplay=image;

    }else if (filetype == "sessionRecording") {

        alert(" Session Reording");
        var filename = filename.videoname+"_"+filename.audioname;
        var div =  document.createElement("div");
        div.setAttribute("background-color","black");
        div.id= "display"+filename; 
        div.title=  filename; 

        var video = document.createElement('video');
        video.src = fileurl.videofileurl;
        //video.type = "video/webm";
        video.setAttribute("type", "audvideo/webm");
        video.setAttribute("name", "videofile");
        video.controls = "controls";
        video.title = filename.videoname + ".webm";

        var audio = document.createElement('audio');
        audio.src = fileurl.audiofileurl;
        audio.setAttribute("type" , "audio/wav");
        audio.controls = "controls";
        audio.title = filename.videoname + ".wav";
    
        //audio.hidden=true;

        div.appendChild(video);
        div.appendChild(audio);

        elementDisplay  = div;

        video.play();
        audio.play();

    }else if(filetype.indexOf("videoScreenRecording")>-1){
        console.log("videoScreenRecording " , fileurl);
        var video = document.createElement("video");
        video.src = fileurl; 
        video.setAttribute("controls","controls");  
        video.style.width="100%";
        video.title=filename;
        video.id= "display"+filename; 
        elementDisplay=video;

    }else if(filetype.indexOf("video")>-1){
        console.log("videoRecording " , fileurl);
        var video = document.createElement("video");
        video.src=fileurl;
        /*            
        try{
            if(fileurl.video!=undefined ){
                video.src = URL.createObjectURL(fileurl.video); 
            }else{
                video.src = URL.createObjectURL(fileurl); 
            }
        }catch(e){
            video.src=fileurl;
        }*/

        video.setAttribute("controls","controls");  
        video.style.width="100%";
        video.title=filename;
        video.id= "display"+filename; 
        elementDisplay=video;

    }else{
        var iframe= document.createElement("iframe");
        iframe.style.width="100%";
        iframe.src= fileurl;
        iframe.className= "viewerIframeClass";
        iframe.title= filename;
        iframe.id= "display"+filename;
        elementDisplay=iframe;
    }
    return  elementDisplay
}

function displayFile( uuid , peerinfo , _fileurl , _filename , _filetype ){

    try{

        if(!peerinfo || !peerinfo.fileShare) return;

        var parentdom =  document.getElementById(peerinfo.fileShare.container);
        var filedom = getFileElementDisplayByType(_filetype , _fileurl , _filename);
        
        if(parentdom){
            parentdom.innerHTML="";
            parentdom.appendChild(filedom);
        }else if(role=="inspector"){
            for( r in webcallpeers){
                var i = ++r;
                if(document.getElementById(webcallpeers[i].fileShare.container)){
                    parentdom =  document.getElementById(webcallpeers[i].fileShare.container);
                    parentdom.innerHTML="";
                    parentdom.appendChild(filedom);
                    break;
                }
            }
        }else{
            document.body.appendChild(filedom);
        } 
    }catch(e){
        console.error("[filehsaring js] displayFile " , e)
    }

    /*
    if($('#'+ parentdom).length > 0)
        $("#"+element).html(getFileElementDisplayByType(_filetype , _fileurl , _filename));
    else
        $("body").append(getFileElementDisplayByType(_filetype , _fileurl , _filename));*/
}

function syncButton(buttonId){
    var buttonElement= document.getElementById(buttonId);

    for(x in webcallpeers){
        if(buttonElement.getAttribute("lastClickedBy")==webcallpeers[x].userid){
            buttonElement.setAttribute("lastClickedBy" , '');
            return;
        }
    }

    if(buttonElement.getAttribute("lastClickedBy")==''){
        buttonElement.setAttribute("lastClickedBy" , rtcConn.userid);
        rtcConn.send({
                type:"buttonclick", 
                buttonName: buttonId
        });
    }
}

/* ************* file Listing container button functions --------------- */

/**
* Shows or hides file and sync activity with peers 
* @method
* @name showHideFile
* @param {id} uuid - unique universal id for the file 
* @param {dom} element - name of dom element
* @param {bloburl} fileurl - blob of the file 
* @param {string} filename - name for file 
* @param {string} filetype - type of  file 
*/
function showHideFile(uuid , elementDisplay , fileurl , filename , filetype , showHideButton ,countClicks ){
    console.log(" filehsare - show/hide button ",  filename , " || ", countClicks);
    if (countClicks%2==1 ){
        showFile( elementDisplay , fileurl , filename , filetype );
        /*rtcConn.send({
            type:"shareFileShow", 
            _uuid: uuid ,
            _element: elementDisplay,
            _fileurl : fileurl, 
            _filename : filename, 
            _filetype : filetype
        }); */
        showHideButton.innerHTML = '<i class="fa fa-eye-slash" style="color: #615aa8;padding: 10px; font-size: larger;"></i>';
        console.log(" Executed script to show the file");
    } else if (countClicks%2==0 ){
        hideFile( elementDisplay, filename );
        /*rtcConn.send({
            type: "shareFileHide",
            _uuid: uuid,
            _element: elementDisplay,
            _fileurl: fileurl,
            _filename: filename,
            _filetype: filetype
        });*/
        showHideButton.innerHTML = '<i class="fa fa-eye" style="color: #615aa8;padding: 10px; font-size: larger;"></i>';
        console.log(" Executed script to hide the file ");
    }
}

function showFile( element , fileurl , filename , filetype ){
    $("#"+element).html( getFileElementDisplayByType(filetype , fileurl , filename));
}

function hideFile( element ,filename ){
    if($("#"+element).has("#display"+filename)){
        console.log("hidefile " ,filename , " from " , element);
        document.getElementById(element).innerHTML="";
    }else{
        console.log(" file is not displayed to hide  ");
    }
}

function removeFile(element){
    document.getElementById(element).hidden=true;
}


function downloadFile(uuid , element , fileurl , _filename , filetype){
    console.log(" downloadButton _filename ", _filename , "  filetype ", filetype);
    if (filetype =="sessionRecording"){
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = fileurl.audiofileurl;
        //a.download = _filename.audioname+".wav";
        a.download = peerinfo.filearray[0] + ".wav";
        a.click();
        window.URL.revokeObjectURL(fileurl.audiofileurl);

        var v = document.createElement("a");
        document.body.appendChild(v);
        v.style = "display: none";
        v.href = fileurl.videofileurl;
        //v.download = _filename.videoname+".webm";
        v.download = peerinfo.filearray[1] + ".webm";
        v.click();
        window.URL.revokeObjectURL(fileurl.videofileurl);

        /*window.open(fileurl.audiofileurl , filename.audioname+".wav");
        window.open(fileurl.videofileurl , filename.videoname+".webm");*/
        /*         
        var zip = new JSZip();
        zip.file(filename.videoname , filename.videofileurl);
        var audio = zip.folder("audio");
        audio.file(filename.audioname, fileurl.audiofileurl);
        zip.generateAsync({type:"blob"})
        .then(function(content) {
            // see FileSaver.js
            //saveAs(content, "sessionRecording.zip");
            window.open(content , "sessionRecording.zip");
        });*/
    }else{ 
        window.open(fileurl , "downloadedDocument");
    }
}

/**
* Creates container for file sharing
* @method
* @name createFileSharingBox
* @param {object} peerinfo - single object peerinfo from webcallpeers
* @param {dom} parent - name of dom element parent
*/
function createFileSharingBox(peerinfo, parent){
    try {
        console.log(" [ filehsreing js ]  createFileSharingBox " , peerinfo, parent);
        if (document.getElementById(peerinfo.fileShare.outerbox))
            return;

        var fileSharingBox = document.createElement("div");
        fileSharingBox.className = "fileviewing-box";
        fileSharingBox.setAttribute("style", "background-color:" + peerinfo.color);
        fileSharingBox.id = peerinfo.fileShare.outerbox;

        /*--------------------------------add for File Share control Bar--------------------*/
        /*    
        <div class="button-corner">
            <span data-placement="bottom" data-toggle="tooltip" title="" data-original-title="minimize"><i class="fa fa-minus-square"></i></span>
            <span data-placement="bottom" data-toggle="tooltip" title="" data-original-title="maxsimize"><i class="fa fa-external-link-square"></i></span>
            <span data-placement="bottom" data-toggle="tooltip" title="" data-original-title="close"><i class="fa fa-times-circle"></i></span>        
        </div>*/

        var fileControlBar = document.createElement("p");
        fileControlBar.id = peerinfo.fileShare.container + "controlBar";
        fileControlBar.appendChild(document.createTextNode( peerinfo.name));
        //fileControlBar.appendChild(document.createTextNode("File Viewer " + peerinfo.name));

        // Minimize the File viewer box 
        var minButton = document.createElement("span");
        /*    minButton.className="btn btn-default glyphicon glyphicon-import closeButton";
        minButton.innerHTML="Minimize";*/
        if (fileshareobj.fileshare.minicon) {
            var img = document.createElement("img");
            img.src = fileshareobj.fileshare.minicon;
            minButton.appendChild(img);
        } else {
            minButton.innerHTML = '<i class="fa fa-minus-square" style="font-size: 25px;"></i>';
        }
        minButton.id = peerinfo.fileShare.minButton;
        minButton.style.float = "right";
        minButton.style.display = "none";
        minButton.setAttribute("lastClickedBy", '');
        minButton.onclick = function () {
            resizeFV(peerinfo.userid, minButton.id, peerinfo.fileShare.outerbox);
            minButton.style.display = "none";
            maxButton.style.display = "block";
        }

        // Mximize the file viewer box
        var maxButton = document.createElement("span");
        /*    maxButton.className= "btn btn-default glyphicon glyphicon-export closeButton";
        maxButton.innerHTML="Maximize";*/
        if (fileshareobj.fileshare.minicon) {
            var img = document.createElement("img");
            img.src = fileshareobj.fileshare.maxicon;
            maxButton.appendChild(img);
        } else {
            maxButton.innerHTML = '<i class="fa fa-external-link-square" style="font-size: 25px;"></i>';
        }
        maxButton.id = peerinfo.fileShare.maxButton;
        maxButton.style.float = "right";
        maxButton.style.display = "block";
        maxButton.setAttribute("lastClickedBy", '');
        maxButton.onclick = function () {
            maxFV(peerinfo.userid, maxButton.id, peerinfo.fileShare.outerbox);
            maxButton.style.display = "none";
            minButton.style.display = "block";
        }

        // close the file viewer box
        var closeButton = document.createElement("span");
        /* closeButton.className="btn btn-default glyphicon glyphicon-remove closeButton";
        closeButton.innerHTML="Close";*/
        if (fileshareobj.fileshare.closeicon) {
            var img = document.createElement("img");
            img.src = fileshareobj.fileshare.closeicon;
            closeButton.appendChild(img);
        } else {
            closeButton.innerHTML = '<i class="fa fa-times-circle" style="font-size: 25px;"></i>';
        }
        closeButton.id = peerinfo.fileShare.closeButton;
        closeButton.style.float = "right";
        closeButton.setAttribute("lastClickedBy", '');
        closeButton.onclick = function () {
            closeFV(peerinfo.userid, closeButton.id, peerinfo.fileShare.container);
        }

        // rotate the content of file viewer box
        var angle = 0;
        var rotateButton = document.createElement("span");
        if (fileshareobj.fileshare.rotateicon) {
            var img = document.createElement("img");
            img.src = fileshareobj.fileshare.rotateicon;
            rotateButton.appendChild(img);
        } else {
            rotateButton.innerHTML = '<i class="fa fa-mail-forward" style="font-size: 25px;"></i>';
        }
        rotateButton.id = "btnRotate";
        rotateButton.style.float = "right";
        rotateButton.onclick = function () {
            var img = document.getElementById(peerinfo.fileShare.container).firstChild;
            angle = (angle + 90) % 360;
            img.className = "rotate" + angle;
        }

        fileControlBar.appendChild(rotateButton);
        fileControlBar.appendChild(minButton);
        fileControlBar.appendChild(maxButton);
        fileControlBar.appendChild(closeButton);

        /*--------------------------------add for File Share Container--------------------*/
        var fileShareContainer = document.createElement("div");
        fileShareContainer.className = "filesharingWidget";
        fileShareContainer.id = peerinfo.fileShare.container;

        var fillerArea = document.createElement("p");
        fillerArea.className = "filler";

        if (debug) {
            var nameBox = document.createElement("span");
            nameBox.innerHTML = "<br/>" + fileShareContainer.id + "<br/>";
            fileSharingBox.appendChild(nameBox);
        }

        linebreak = document.createElement("br");

        fileSharingBox.appendChild(fileControlBar);
        fileSharingBox.appendChild(linebreak);
        fileSharingBox.appendChild(linebreak);
        fileSharingBox.appendChild(fileShareContainer);
        fileSharingBox.appendChild(fillerArea);

        parent.appendChild(fileSharingBox);
    } catch (e) {
        console.error(" createFileSharingBox ", e);
    }
}

/**
* Creates container for file listing
* @method
* @name createFileListingBox
* @param {object} peerinfo - single object peerinfo from webcallpeers
* @param {dom} parent - name of dom element parent
*/
function createFileListingBox(peerinfo, parent){

    try {
        if (document.getElementById(peerinfo.fileList.outerbox))
            return;

        var fileListingBox = document.createElement("div");
        fileListingBox.className = "col-sm-6  filesharing-box";
        fileListingBox.id = peerinfo.fileList.outerbox;
        //fileListingBox.setAttribute("style", "background-color:" + peerinfo.color);

        /*--------------------------------add for File List control Bar--------------------*/

        var fileListControlBar = document.createElement("p");
        //fileListControlBar.appendChild(document.createTextNode(peerinfo.name + "     "));
        //fileListControlBar.appendChild(document.createTextNode("Uploaded Files " + peerinfo.name + "     "));

        /*
        var fileHelpButton= document.createElement("span");s
        fileHelpButton.className="btn btn-default glyphicon glyphicon-question-sign closeButton";
        fileHelpButton.innerHTML="Help";
        /*fileListControlBar.appendChild(fileHelpButton);*/

        var minButton = document.createElement("span");
        minButton.innerHTML = '<i class="fa fa-minus-square" style="font-size: 20px;></i>';
        minButton.id = peerinfo.fileShare.minButton;
        minButton.setAttribute("lastClickedBy", '');
        minButton.onclick = function () {
            resizeFV(peerinfo.userid, minButton.id, peerinfo.fileShare.outerbox);
        }

        var maxButton = document.createElement("span");
        maxButton.innerHTML = '<i class="fa fa-external-link-square" style="font-size: 20px;></i>';
        maxButton.id = peerinfo.fileShare.maxButton;
        maxButton.setAttribute("lastClickedBy", '');
        maxButton.onclick = function () {
            maxFV(peerinfo.userid, maxButton.id, peerinfo.fileShare.outerbox);
        }

        var closeButton = document.createElement("span");
        closeButton.innerHTML = '<i class="fa fa-times-circle" style="font-size: 20px;></i>';
        closeButton.id = peerinfo.fileShare.closeButton;
        closeButton.setAttribute("lastClickedBy", '');
        closeButton.onclick = function () {
            closeFV(peerinfo.userid, closeButton.id, peerinfo.fileShare.container);
        }

        fileListControlBar.appendChild(minButton);
        fileListControlBar.appendChild(maxButton);
        fileListControlBar.appendChild(closeButton);


        /*--------------------------------add for File List Container--------------------*/
        var fileListContainer = document.createElement("div");
        fileListContainer.id = peerinfo.fileList.container;

        var fileProgress = document.createElement("div");

        if (debug) {
            var nameBox = document.createElement("span");
            nameBox.innerHTML = fileListContainer.id;
            fileListingBox.appendChild(nameBox);
        }

        fileListingBox.appendChild(fileListControlBar);
        fileListingBox.appendChild(fileListContainer);
        fileListingBox.appendChild(fileProgress);

        parent.appendChild(fileListingBox);
    } catch (e) {
        console.error(" createFileListingBox ", e);
    }
}

// __________________
// createFileSharingDiv.js

/**
 * {@link createFileSharingDiv} is an inner/private helper for {@link RecordRTC}.
 * @summary It returns dom for Filesharing conatiner.
 * @license {@link https://github.com/altanai/webrtc#license|MIT}
 * @author {@link http://www.altanai.com|Altanai}
 * @typedef createFileSharingDiv
 * @class
 * @example
 * createFileSharingDiv(peerinfo)
 * @see {@link https://github.com/altanai/webrtc|webrtc Source Code}
 * @param {object} config - {
color :"#a69afe"
controlBarName : "control-video4wm0h338u9p"
email : "abc@gmail.com"
fileList : {
    outerbox: "widget-filelisting-box4wm0h338u9p", 
    container: "widget-filelisting-container4wm0h338u9p"
}
fileShare : {
    outerbox: "widget-filesharing-box4wm0h338u9p", 
    container: "widget-filesharing-container4wm0h338u9p", 
    minButton: "widget-filesharing-minbutton4wm0h338u9p", 
    maxButton: "widget-filesharing-maxbutton4wm0h338u9p", 
    closeButton: "widget-filesharing-closebutton4wm0h338u9p"
}
filearray : []
name : "REMOTE"
role : "participant"
stream : MediaStream {isAudio: false, isVideo: true, isScreen: false, streamid: "aXSL939WBQZwTpytTnOMR9wnzZJQT8VGT8hF", type: "remote", …}
streamid : "aXSL939WBQZwTpytTnOMR9wnzZJQT8VGT8hF"
type : "remote"
userid : "4wm0h338u9p"
vid : "videoremote_4wm0h338u9p"
videoClassName : null
videoContainer : "video4wm0h338u9p"
videoHeight : null
}
 */
function createFileSharingDiv(peerinfo){
    console.log(" -------createFileSharingDiv  " , peerinfo);

    // When the peerinfo role is inspctor but self role is not inspector only then exit 
    if(peerinfo.role =="inspector" && role !="inspector") return;

    if (!document.getElementById(peerinfo.fileShare.outerbox)){
        var parentFileShareContainer = document.getElementById(fileshareobj.fileShareContainer);
        createFileSharingBox(peerinfo , parentFileShareContainer);
    }

    if(!document.getElementById(peerinfo.fileList.outerbox)){
        var parentFileListContainer = document.getElementById(fileshareobj.fileListContainer);
        createFileListingBox(peerinfo , parentFileListContainer);
    }
}

/* ************* file sharing container button functions --------------- */
function closeFV(userid,  buttonId , selectedFileSharingBox){
    document.getElementById(selectedFileSharingBox).innerHTML="";
    /*syncButton(buttonId);*/
}

function resizeFV(userid,  buttonId , selectedFileSharingBox){
    for(x in webcallpeers){
        if(webcallpeers[x].fileShare.outerbox==selectedFileSharingBox) {
            document.getElementById(selectedFileSharingBox).hidden=false;
            document.getElementById(selectedFileSharingBox).style.width="50%";
        }else{
            document.getElementById(webcallpeers[x].fileShare.outerbox).hidden=false;
            document.getElementById(webcallpeers[x].fileShare.outerbox).style.width="50%";
        }
    }
    /*  
    document.getElementById(selectedFileSharingBox).hidden=false;
    document.getElementById(selectedFileSharingBox).style.width="50%";   
    syncButton(buttonId);*/
}

function minFV(userid, buttonId , selectedFileSharingBox){
    document.getElementById(selectedFileSharingBox).hidden=false;
    document.getElementById(selectedFileSharingBox).style.width="50%";
    document.getElementById(selectedFileSharingBox).style.height="10%";
    
    /*syncButton(buttonId);*/
}

function maxFV(userid,  buttonId ,  selectedFileSharingBox){
    for(x in webcallpeers){
        if(webcallpeers[x].fileShare.outerbox==selectedFileSharingBox) {
            document.getElementById(selectedFileSharingBox).hidden=false;
            document.getElementById(selectedFileSharingBox).style.width="100%";
        }else{
            document.getElementById(webcallpeers[x].fileShare.outerbox).hidden=true;
            document.getElementById(webcallpeers[x].fileShare.outerbox).style.width="0%";
        }
    }
    /*syncButton(buttonId);  */
}

/**
 * Save File Modal Popup
 * @method
 * @name createModalPopup
 * @param {string} filetype
 */
function createModalPopup(filetype ){
    console.log( " create Modal popup for filetype " , filetype);

    var mainDiv= document.getElementById("mainDiv");

    if(document.getElementById("saveModal")){
        mainDiv.removeChild(document.getElementById("saveModal"));
    }

    var modalBox=document.createElement("div");
    modalBox.className="modal fade";
    modalBox.setAttribute("role" , "dialog");
    modalBox.id="saveModal";

    var modalinnerBox=document.createElement("div");
    modalinnerBox.className="modal-dialog";

    var modal=document.createElement("div");
    modal.className = "modal-content";

    var modalheader= document.createElement("div");
    modalheader.className = "modal-header";

    var closeButton= document.createElement("button");
    closeButton.className="close";
    closeButton.setAttribute("data-dismiss", "modal");
    closeButton.innerHTML="&times;";

    var title=document.createElement("h4");
    title.className="modal-title";
    title.innerHTML="Save File";   
    title.setAttribute("float" ,  "left");
    modalheader.appendChild(title);
    modalheader.appendChild(closeButton);

    var modalbody = document.createElement("div");
    modalbody.className = "modal-body";
    modalbody.innerHTML = "";

    var body=document.createElement("div");
    switch(filetype){
        case  "blobcanvas":
            title.innerHTML="Save Drawing";  
            var d1=document.createElement("div");
            d1.innerHTML= "Right Click on Save, pop up window gives following info: Right Click on Draw image, Click Save As when window opens up.";
            body.appendChild(d1);
            break;
        case "application/pdf":
            title.innerHTML="Save PDF"; 
            var d1= document.createElement("div");
            d1.innerHTML='Click DOWNLOAD on top of the doc . Click SAVE AS when window opens up';
            var i1 = document.createElement("img");
            i1.src= "images/savefile.PNG";
            body.appendChild(d1);
            body.appendChild(i1);
            break; 
        // browser supported formats 
        case "image/jpeg":
        case "image/png":
        case "video/mov": 
        case "video/webm":
        case "imagesnapshot":
            title.innerHTML="Save Picture / Video"; 
            var d1=document.createElement("div");
            d1.innerHTML='Right Click on the FILE . Click SAVE AS when window opens up';
            body.appendChild(d1);
            break; 
        // browser supported audio formats    
        case "audio/mp3":
            title.innerHTML="Save Music File"; 
            var d1= document.createElement("div");
            d1.innerHTML="Right Click on the FILE (play display line). Click SAVE AS when window opens up";
            body.appendChild(d1);
            break;
        // propertiary stuff that will not open in browser 
        case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        case "application/vnd.ms-excel":
        case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": 
        case "video/x-ms-wmv":
            title.innerHTML="Save Microsoft Office / Libra / Open Office Documents"; 
            var d1= document.createElement("div");
            d1.innerHTML="Click bottom DOWNLOAD in Uploaded Files box . File shows up below the Uploaded Files box. Click arrow on right, then select OPEN  . File Opens in New Window, then 'Save As'.";
            body.appendChild(d1);
            break; 
        case "sessionRecording":
            title.innerHTML="Save Session Recording";
            var d1=document.createElement("div");
            d1.innerHTML='Extract the video and audio recording from the dowloaded compresed file and play together ';
            body.appendChild(d1);
            break;
        default :
            var d1=document.createElement("div");
            d1.innerHTML='Document is Unrecognizable, cannot be saved, but can be shared with Remote. Use/Click Screen Share for Remote to view your screen. Then open the document on your screen.';
            body.appendChild(d1);
            break;
    }

    modalbody.appendChild(body);
    modal.appendChild(modalheader);
    modal.appendChild(modalbody);

    modalinnerBox.appendChild(modal);
    modalBox.appendChild(modalinnerBox);

    mainDiv.appendChild(modalBox);
}