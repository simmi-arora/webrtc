/***************************************************************88
File sharing 
******************************************************************/

var progressHelper = {};

function createFileShareButton(fileshareobj){
    var button= document.getElementById(fileshareobj.button.id);
    button.onclick = function() {
        var fileSelector = new FileSelector();
        fileSelector.selectSingleFile(function(file) {
            sendFile(file);
            sendChatMessage("File is shared :"+file.name);
        });
    };
}
function sendFile(file){
    /*
    addNewFileLocal({
        userid : selfuserid,
        header: 'User local',
        message: 'File shared',
        userinfo: getUserinfo(rtcMultiConnection.blobURLs[rtcMultiConnection.userid], "images/share-files.png"),
        callback: function(r) {   
            console.log(r);
            shownotification("Sharing File "+file.name);
        }
    });*/
    rtcMultiConnection.send(file);
    console.log("sendFile : " ,file);
}

function addProgressHelper(uuid , userid , filename , fileSize,  progressHelperclassName ){
    for(i in webcallpeers ){
        if(webcallpeers[i].userid==userid){
            var n = document.createElement("div");
            n.title = filename,
            n.id = uuid+ filename,
            n.setAttribute("class", progressHelperclassName),
            n.innerHTML = "<label>0%</label><progress></progress>", 
            document.getElementById(webcallpeers[i].fileListContainer).appendChild(n),              
            progressHelper[uuid] = {
                div: n,
                progress: n.querySelector("progress"),
                label: n.querySelector("label")
            }, 
            progressHelper[uuid].progress.max = fileSize;
        }
    }
}

function addNewFileLocal(e) {
    console.log("addNewFileLocal message ", e);
    if ("" != e.message && " " != e.message) {
        alert("addNewFileLocal");
    }
}

function addNewFileRemote(e) {
    console.log("addNewFileRemote message ", e);
    if ("" != e.message && " " != e.message) {
        alert("addNewFileRemote");
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

    var showDownloadButton=true , showRemoveButton=true; 

    var elementList=peerinfo.fileListContainer;
    var elementDisplay=peerinfo.fileSharingContainer;
    var listlength=peerinfo.filearray.length;

    if(peerinfo.name=="localVideo"){
        showRemoveButton=false;
    }else{
        showRemoveButton=false;
    }

    var name = document.createElement("div");
    name.innerHTML = listlength +"   " + filename ;
    name.title=filetype +" shared by " +peerinfo.name ;  
    name.id="name"+filename;

    var downloadButton = document.createElement("div");
    downloadButton.setAttribute("class" , "btn btn-primary");
    downloadButton.setAttribute("style", "color:white");
    downloadButton.innerHTML='<a href="' +fileurl + '" download="' + filename + '" style="color:white" > Download </a>';

    var showButton = document.createElement("div");
    showButton.id= "showButton"+filename;
    showButton.setAttribute("class" , "btn btn-primary");
    showButton.innerHTML='show';
    showButton.onclick=function(){
        if(repeatFlagShowButton != filename){
            showFile(uuid , elementDisplay , fileurl , filename , filetype);
            rtcMultiConnection.send({
                type:"shareFileShow", 
                _uuid: uuid , 
                _element: elementPeerDisplay,
                _fileurl : fileurl, 
                _filename : filename, 
                _filetype : filetype
            }); 
            repeatFlagShowButton= filename;       
        }else if(repeatFlagShowButton == filename){
            repeatFlagShowButton= "";
        }
    };

    var hideButton = document.createElement("div");
    hideButton.id= "hideButton"+filename;
    hideButton.setAttribute("class" , "btn btn-primary");
    hideButton.innerHTML='hide';
    hideButton.onclick=function(){
        if(repeatFlagHideButton != filename){
            hideFile(uuid , elementDisplay , fileurl , filename , filetype);
            rtcMultiConnection.send({
                type:"shareFileHide", 
                _uuid: uuid , 
                _element: elementPeerDisplay,
                _fileurl : fileurl, 
                _filename : filename, 
                _filetype : filetype
            });
            repeatFlagHideButton= filename;
        }else if(repeatFlagHideButton == filename){
            repeatFlagHideButton= "";
        }
    };


    var removeButton = document.createElement("div");
    removeButton.id= "removeButton"+filename;
    removeButton.setAttribute("class" , "btn btn-primary");
    removeButton.innerHTML='remove';
    removeButton.onclick=function(event){
        if(repeatFlagRemoveButton != filename){
            hideFile(uuid , elementDisplay , fileurl , filename , filetype);
            var tobeHiddenElement = event.target.parentNode.id;
            rtcMultiConnection.send({
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
    parentdom = (document.getElementById(elementList)?document.getElementById(elementList):document.body);
    filedom=document.createElement("div") ;

    if(fileshareobj.active){
        /*
        switch(filetype) {
            case "imagesnapshot":
                filedom.id=filename;
            break;
            case "videoRecording":
                filedom.id=filename;        
            break;
            case "videoScreenRecording":
                filedom.id=filename;        
            break;
            default:
                filedom = progressHelper[uuid].div;
        }*/
        filedom.id=filename;
        filedom.innerHTML="";
        filedom.appendChild(name);
        if(showDownloadButton) 
            filedom.appendChild(downloadButton);
        filedom.appendChild(showButton);
        filedom.appendChild(hideButton);
        if(showRemoveButton) 
            filedom.appendChild(removeButton);

        parentdom.appendChild(filedom);
    }



}

function getFileElementDisplayByType(filetype , fileurl , filename){
    var elementDisplay;
    
    if(filetype.indexOf("msword")>-1 || filetype.indexOf("officedocument")>-1) {
        var divNitofcation= document.createElement("div");
        divNitofcation.className="alert alert-warning";
        divNitofcation.innerHTML= "Microsoft and Libra word file cannt be opened in browser";
        elementDisplay=divNitofcation;
    }else if(filetype.indexOf("image")>-1){
        var image= document.createElement("img");
        image.src= fileurl;
        image.style.width="100%";
        image.title=filename;
        image.id= "display"+filename; 
        elementDisplay=image;
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
        /*            
        try{
            if(fileurl.video!=undefined ){
                video.src = URL.createObjectURL(fileurl.video); 
            }else{
                video.src = URL.createObjectURL(fileurl); 
            }
        }catch(e){*/
            video.src=fileurl;
        /*}*/

        video.setAttribute("controls","controls");  
        video.style.width="100%";
        video.title=filename;
        video.id= "display"+filename; 
        elementDisplay=video;
    }else{
        var iframe= document.createElement("iframe");
        iframe.src= fileurl;
        iframe.className= "viewerIframeClass";
        iframe.title= filename;
        iframe.id= "display"+filename;
        elementDisplay=iframe;
    }
    return  elementDisplay
}

function displayFile( uuid , peerinfo , _fileurl , _filename , _filetype ){
    var elementDisplay = peerinfo.fileSharingContainer;
    var parentdom , filedom ;
    parentdom = (document.getElementById(elementDisplay)?document.getElementById(elementDisplay):document.body);
    filedom=getFileElementDisplayByType(_filetype , _fileurl , _filename);
    parentdom.innerHTML="";
    parentdom.appendChild(filedom);
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
        buttonElement.setAttribute("lastClickedBy" , rtcMultiConnection.userid);
        rtcMultiConnection.send({
                type:"buttonclick", 
                buttonName: buttonId
        });
    }
}

/* ************* file Listing container button functions --------------- */

function showFile( uuid , element , fileurl , filename , filetype ){
    $("#"+element).html( getFileElementDisplayByType(filetype , fileurl , filename));
}

function hideFile( uuid , element , fileurl , filename , filetype ){
    if($("#"+element).has("#display"+filename)){
        document.getElementById(element).innerHTML="";
        console.log("hidefile " ,filename , " from " , element);
    }else{
        console.log(" file is not displayed to hide  ");
    }
}

function removeFile(element){
    document.getElementById(element).hidden=true;
}


function createFileSharingBox(peerinfo, parent){

    /*--------------------------------add for File Share --------------------*/
    var fileSharingBox=document.createElement("div");
    fileSharingBox.className= "col-sm-6 fileViewing1Box";
    fileSharingBox.setAttribute("style","background-color:"+peerinfo.color);
    fileSharingBox.id=peerinfo.fileSharingSubContents.fileSharingBox;

    var fileControlBar=document.createElement("p");
    fileControlBar.appendChild(document.createTextNode("File Viewer for "+ peerinfo.name));

    var minButton= document.createElement("span");
    minButton.className="btn btn-default glyphicon glyphicon-import closeButton";
    minButton.innerHTML="Minimize";
    minButton.id=peerinfo.fileSharingSubContents.minButton;
    minButton.setAttribute("lastClickedBy" ,'');
    minButton.onclick=function(){
        resizeFV(peerinfo.userid, minButton.id , arrFilesharingBoxes);
    }

    var maxButton= document.createElement("span");
    maxButton.className= "btn btn-default glyphicon glyphicon-export closeButton";
    maxButton.innerHTML="Maximize";
    maxButton.id=peerinfo.fileSharingSubContents.maxButton;
    maxButton.setAttribute("lastClickedBy" ,'');
    maxButton.onclick=function(){
        maxFV(peerinfo.userid, maxButton.id , arrFilesharingBoxes , peerinfo.fileSharingSubContents.fileSharingBox);
    }

    var closeButton= document.createElement("span");
    closeButton.className="btn btn-default glyphicon glyphicon-remove closeButton";
    closeButton.innerHTML="Close";
    closeButton.id=peerinfo.fileSharingSubContents.closeButton;
    closeButton.setAttribute("lastClickedBy" ,'');
    closeButton.onclick=function(){
        closeFV(peerinfo.userid, closeButton.id , peerinfo.fileSharingContainer);
    }

    fileControlBar.appendChild(minButton);
    fileControlBar.appendChild(maxButton);
    fileControlBar.appendChild(closeButton);

    var fileSharingContainer = document.createElement("div");
    fileSharingContainer.className ="filesharingWidget";
    fileSharingContainer.id =peerinfo.fileSharingContainer;

    var fillerArea=document.createElement("p");
    fillerArea.className="filler";

    if(debug){
        var nameBox=document.createElement("span");
        nameBox.innerHTML=fileSharingContainer.id; 
        fileSharingBox.appendChild(nameBox);
    }

    fileSharingBox.appendChild(fileControlBar);
    fileSharingBox.appendChild(fileSharingContainer);
    fileSharingBox.appendChild(fillerArea);

    parent.appendChild(fileSharingBox);
}

function createFileListingBox(peerinfo, parent){

   /*--------------------------------add for File List --------------------*/

    var fileListingBox= document.createElement("div");
    fileListingBox.className="col-sm-6  filesharing1Box";
    fileListingBox.setAttribute("style","background-color:"+peerinfo.color);

    var fileListingControlBar=document.createElement("p");

    var fileHelpButton= document.createElement("span");
    fileHelpButton.className="btn btn-default glyphicon glyphicon-question-sign closeButton";
    fileHelpButton.innerHTML="Help";

    fileListingControlBar.appendChild(document.createTextNode("List of Uploaded Files"));
    fileListingControlBar.appendChild(fileHelpButton);

    var fileListingContainer= document.createElement("div");
    fileListingContainer.id=peerinfo.fileListContainer;

    var fileProgress = document.createElement("div");

    if(debug){
        var nameBox=document.createElement("span");
        nameBox.innerHTML=fileListingContainer.id; 
        fileListingBox.appendChild(nameBox);
    }

    fileListingBox.appendChild(fileListingControlBar);
    fileListingBox.appendChild(fileListingContainer);
    fileListingBox.appendChild(fileProgress);

    parent.appendChild(fileListingBox);
}

function createFileSharingDiv(peerinfo){

    var parentFileShareContainer = document.getElementById(fileshareobj.fileShareContainer);
    createFileSharingBox(peerinfo , parentFileShareContainer);

    var parentFileListContainer = document.getElementById(fileshareobj.fileListContainer);
    createFileListingBox(peerinfo , parentFileListContainer);
}

/* ************* file sharing container button functions --------------- */
function closeFV(userid,  buttonId , selectedFileSharingBox){
    document.getElementById(selectedFileSharingBox).innerHTML="";
    syncButton(buttonId);
}

function resizeFV(userid,  buttonId , arrFilesharingBoxes){
    for ( x in arrFilesharingBoxes){
        document.getElementById(arrFilesharingBoxes[x]).hidden=false;
        document.getElementById(arrFilesharingBoxes[x]).style.width="50%";   
    }
    syncButton(buttonId);
}

function minFV(userid, buttonId , arrFilesharingBoxes){
    for ( x in arrFilesharingBoxes){
        document.getElementById(arrFilesharingBoxes[x]).hidden=false;
        document.getElementById(arrFilesharingBoxes[x]).style.width="50%";
        document.getElementById(arrFilesharingBoxes[x]).style.height="10%";
    }
    syncButton(buttonId);
}

function maxFV(userid,  buttonId , arrFilesharingBoxes, selectedFileSharingBox){
    for ( x in arrFilesharingBoxes){
        if(arrFilesharingBoxes[x]==selectedFileSharingBox){
            document.getElementById(arrFilesharingBoxes[x]).hidden=false;
            document.getElementById(arrFilesharingBoxes[x]).style.width="100%";
        }else{
            document.getElementById(arrFilesharingBoxes[x]).hidden=true;
            document.getElementById(arrFilesharingBoxes[x]).style.width="0%";
        }
    }
    syncButton(buttonId);  
}


/*
var FileProgressBarHandler = (function() {
    function handle(connection) {
        var progressHelper = {};

        // www.RTCMultiConnection.org/docs/onFileStart/
        connection.onFileStart = function(file) {
            var div = document.createElement('div');
            div.title = file.name;
            div.innerHTML = '<label>0%</label> <progress></progress>';

            if (file.remoteUserId) {
                div.innerHTML += ' (Sharing with:' + file.remoteUserId + ')';
            }

            if (!connection.filesContainer) {
                connection.filesContainer = document.body || document.documentElement;
            }

            connection.filesContainer.insertBefore(div, connection.filesContainer.firstChild);

            if (!file.remoteUserId) {
                progressHelper[file.uuid] = {
                    div: div,
                    progress: div.querySelector('progress'),
                    label: div.querySelector('label')
                };
                progressHelper[file.uuid].progress.max = file.maxChunks;
                return;
            }

            if (!progressHelper[file.uuid]) {
                progressHelper[file.uuid] = {};
            }

            progressHelper[file.uuid][file.remoteUserId] = {
                div: div,
                progress: div.querySelector('progress'),
                label: div.querySelector('label')
            };
            progressHelper[file.uuid][file.remoteUserId].progress.max = file.maxChunks;
        };

        // www.RTCMultiConnection.org/docs/onFileProgress/
        connection.onFileProgress = function(chunk) {
            var helper = progressHelper[chunk.uuid];
            if (!helper) {
                return;
            }
            if (chunk.remoteUserId) {
                helper = progressHelper[chunk.uuid][chunk.remoteUserId];
                if (!helper) {
                    return;
                }
            }

            helper.progress.value = chunk.currentPosition || chunk.maxChunks || helper.progress.max;
            updateLabel(helper.progress, helper.label);
        };

        // www.RTCMultiConnection.org/docs/onFileEnd/
        connection.onFileEnd = function(file) {
            var helper = progressHelper[file.uuid];
            if (!helper) {
                console.error('No such progress-helper element exists.', file);
                return;
            }

            if (file.remoteUserId) {
                helper = progressHelper[file.uuid][file.remoteUserId];
                if (!helper) {
                    return;
                }
            }

            var div = helper.div;
            if (file.type.indexOf('image') != -1) {
                div.innerHTML = '<a href="' + file.url + '" download="' + file.name + '">Download <strong style="color:red;">' + file.name + '</strong> </a><br /><img src="' + file.url + '" title="' + file.name + '" style="max-width: 80%;">';
            } else {
                div.innerHTML = '<a href="' + file.url + '" download="' + file.name + '">Download <strong style="color:red;">' + file.name + '</strong> </a><br /><iframe src="' + file.url + '" title="' + file.name + '" style="width: 80%;border: 0;height: inherit;margin-top:1em;"></iframe>';
            }
        };

        function updateLabel(progress, label) {
            if (progress.position === -1) {
                return;
            }

            var position = +progress.position.toFixed(2).split('.')[1] || 100;
            label.innerHTML = position + '%';
        }
    }

    return {
        handle: handle
    };
})();
*/