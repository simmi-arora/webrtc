/***************************************************************88
File sharing 
******************************************************************/

var progressHelper = {};

function createFileShareButton(fileshareobj){
    var button= document.createElement("span");
    button.setAttribute("data-provides","fileinput");
    button.className= fileshareobj.button.class;
    button.innerHTML= fileshareobj.button.html;
    button.onclick = function() {
        var fileSelector = new FileSelector();
        fileSelector.selectSingleFile(function(file) {
            sendFile(file);
            /*sendChatMessage("File is shared :"+file.name);*/
        });
    };

    var li =document.createElement("li");
    li.appendChild(button);
    document.getElementById("topIconHolder_ul").appendChild(li);
}

function sendFile(file){
        
    rtcMultiConnection.send(file);

    /*    
    addNewFileLocal({
        userid : selfuserid,
        header: 'User local',
        message: 'File shared',
        userinfo: getUserinfo(rtcMultiConnection.blobURLs[selfuserid], "images/share-files.png"),
        callback: function(r) {   
            console.log(r);
            shownotification("Sharing File "+file.name);
        }
    });*/

}

function addProgressHelper(uuid , peerinfo , filename , fileSize,  progressHelperclassName ){
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
    console.log("DisplayList peerinfo->",peerinfo);
    var showDownloadButton=true , showRemoveButton=true; 

    var elementList= peerinfo.fileList.container;
    var elementDisplay= peerinfo.fileShare.container;
    var listlength=peerinfo.filearray.length;

    alert("displayList-> elementDisplay"+elementDisplay);
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
                _element: elementDisplay,
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
    hideButton.onclick=function(event){
        if(repeatFlagHideButton != filename){
            hideFile(uuid , elementDisplay , fileurl , filename , filetype);
            rtcMultiConnection.send({
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
    
    if(document.getElementById(filename)){
        filedom = document.getElementById(filename);
        if(fileshareobj.active){
            filedom.innerHTML="";
            filedom.appendChild(name);
            if(showDownloadButton) 
                filedom.appendChild(downloadButton);
            filedom.appendChild(showButton);
            filedom.appendChild(hideButton);
            if(showRemoveButton) 
                filedom.appendChild(removeButton);
        }
    }else{
        /* if the progress bar area dodont exist */
        if(document.getElementById(elementList)){
            parentdom = document.getElementById(elementList);
            filedom = document.createElement("div") ;
        }else{
            parentdom = document.body;
            filedom = document.createElement("div") ;
        }
        if(fileshareobj.active){
            filedom.id=filename;
            filedom.innerHTML="";
            filedom.appendChild(name);
            if(showDownloadButton) 
                filedom.appendChild(downloadButton);
            filedom.appendChild(showButton);
            filedom.appendChild(hideButton);
            if(showRemoveButton) 
                filedom.appendChild(removeButton);
        }

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
    console.log("displayFile peerinfo->",peerinfo);

    var parentdom =  document.getElementById(peerinfo.fileShare.container);
    var filedom=getFileElementDisplayByType(_filetype , _fileurl , _filename);
    if(parentdom){
        parentdom.innerHTML="";
        parentdom.appendChild(filedom);
    }else{
        document.body.appendChild(filedom);
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
    alert("file shown in " + element);
}

function hideFile( uuid , element , fileurl , filename , filetype ){
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


function createFileSharingBox(peerinfo, parent){

    if(document.getElementById(peerinfo.fileShare.outerbox))
        return;

    var fileSharingBox=document.createElement("div");
    fileSharingBox.className= "col-sm-6 fileViewing1Box";
    fileSharingBox.setAttribute("style","background-color:"+peerinfo.color);
    fileSharingBox.id=peerinfo.fileShare.outerbox;

    /*--------------------------------add for File Share control Bar--------------------*/
    var fileControlBar=document.createElement("p");
    fileControlBar.appendChild(document.createTextNode("File Viewer for "+ peerinfo.name));

    var minButton= document.createElement("span");
    minButton.className="btn btn-default glyphicon glyphicon-import closeButton";
    minButton.innerHTML="Minimize";
    minButton.id=peerinfo.fileShare.minButton;
    minButton.setAttribute("lastClickedBy" ,'');
    minButton.onclick=function(){
        resizeFV(peerinfo.userid, minButton.id , arrFilesharingBoxes);
    }

    var maxButton= document.createElement("span");
    maxButton.className= "btn btn-default glyphicon glyphicon-export closeButton";
    maxButton.innerHTML="Maximize";
    maxButton.id=peerinfo.fileShare.maxButton;
    maxButton.setAttribute("lastClickedBy" ,'');
    maxButton.onclick=function(){
        maxFV(peerinfo.userid, maxButton.id , arrFilesharingBoxes , peerinfo.fileShare.outerbox);
    }

    var closeButton= document.createElement("span");
    closeButton.className="btn btn-default glyphicon glyphicon-remove closeButton";
    closeButton.innerHTML="Close";
    closeButton.id=peerinfo.fileShare.closeButton;
    closeButton.setAttribute("lastClickedBy" ,'');
    closeButton.onclick=function(){
        closeFV(peerinfo.userid, closeButton.id , peerinfo.fileShare.container);
    }

    fileControlBar.appendChild(minButton);
    fileControlBar.appendChild(maxButton);
    fileControlBar.appendChild(closeButton);

    /*--------------------------------add for File Share Container--------------------*/
    var fileShareContainer = document.createElement("div");
    fileShareContainer.className ="filesharingWidget";
    fileShareContainer.id =peerinfo.fileShare.container;

    var fillerArea=document.createElement("p");
    fillerArea.className="filler";

    if(debug){
        var nameBox=document.createElement("span");
        nameBox.innerHTML="<br/>"+fileShareContainer.id+"<br/>"; 
        fileSharingBox.appendChild(nameBox);
    }

    fileSharingBox.appendChild(fileControlBar);
    fileSharingBox.appendChild(fileShareContainer);
    fileSharingBox.appendChild(fillerArea);

    parent.appendChild(fileSharingBox);
}

function createFileListingBox(peerinfo, parent){

    if(document.getElementById(peerinfo.fileList.outerbox))
        return;

    var fileListingBox= document.createElement("div");
    fileListingBox.className="col-sm-6  filesharing1Box";
    fileListingBox.id=peerinfo.fileList.outerbox;
    fileListingBox.setAttribute("style","background-color:"+peerinfo.color);


    /*--------------------------------add for File List control Bar--------------------*/

    var fileListControlBar=document.createElement("p");

    var fileHelpButton= document.createElement("span");
    fileHelpButton.className="btn btn-default glyphicon glyphicon-question-sign closeButton";
    fileHelpButton.innerHTML="Help";

    fileListControlBar.appendChild(document.createTextNode("List of Uploaded Files"));
    fileListControlBar.appendChild(fileHelpButton);

   /*--------------------------------add for File List Container--------------------*/
    var fileListContainer= document.createElement("div");
    fileListContainer.id=peerinfo.fileList.container;

    var fileProgress = document.createElement("div");

    if(debug){
        var nameBox=document.createElement("span");
        nameBox.innerHTML=fileListContainer.id; 
        fileListingBox.appendChild(nameBox);
    }

    fileListingBox.appendChild(fileListControlBar);
    fileListingBox.appendChild(fileListContainer);
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