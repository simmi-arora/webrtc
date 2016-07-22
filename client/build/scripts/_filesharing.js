/***************************************************************88
File sharing 
******************************************************************/

var progressHelper = {};

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


$('#file').change(function() {
    var file = this.files[0];
    rtcMultiConnection.send(file);
});


function addNewFileLocal(e) {
    console.log("add new message ", e);
    if ("" != e.message && " " != e.message) {
    }
}

function addNewFileRemote(e) {
    console.log("add new message ", e);
    if ("" != e.message && " " != e.message) {
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

function displayList(uuid , userid , fileurl , filename , filetype ){

    var elementList=null , elementPeerList=null , listlength=null;
    var elementDisplay=null, elementPeerDisplay=null ;

    var downloadButton,removeButton;
    var showDownloadButton=true , showRemoveButton=true; 
    for(i in webcallpeers ){
        if(webcallpeers[i].userid==userid){
           elementList=webcallpeers[i].fileListContainer;
           elementDisplay= webcallpeers[i].fileSharingContainer;
           listlength=webcallpeers[i].filearray.length;
           console.log("Self shared file ");
          
        }else{
            console.log("Peer shared file ");
            elementPeerList= webcallpeers[i].fileListContainer;
            elementPeerDisplay= webcallpeers[i].fileSharingContainer;
        }
    }

    if(selfuserid==userid){
        showDownloadButton=false;
    }else{
        showRemoveButton=false;
    }

    var name = document.createElement("div");
    name.innerHTML = listlength +"   " + filename ;
    name.id="name"+filename;

    if(showDownloadButton){
        downloadButton = document.createElement("div");
        downloadButton.setAttribute("class" , "btn btn-primary");
        downloadButton.setAttribute("style", "color:white");
        downloadButton.innerHTML='<a href="' +fileurl + '" download="' + filename + '" style="color:white" > Download </a>';
    }

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


    if(showRemoveButton){
        removeButton = document.createElement("div");
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
    }

    var r;
    if(fileshareobj.active && document.getElementById(elementList)!=null){
        switch(filetype) {
            case "imagesnapshot":
                r=document.createElement("div");
                r.id=filename;
                document.getElementById(elementList).appendChild(r);
            break;
            case "videoRecording":
                r=document.createElement("div");
                r.id=filename;  
                document.getElementById(elementList).appendChild(r);         
            break;
            case "videoScreenRecording":
                r=document.createElement("div");
                r.id=filename;  
                document.getElementById(elementList).appendChild(r);         
            break;
            default:
                r = progressHelper[uuid].div;
        }
    }else{
        r=document.createElement("div");
        r.id=filename;
        document.body.appendChild(r);
    }

    r.innerHTML="";
    r.appendChild(name);
    if(showDownloadButton) r.appendChild(downloadButton);
    r.appendChild(showButton);
    r.appendChild(hideButton);
     if(showRemoveButton) r.appendChild(removeButton);
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
        console.log(fileurl);
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

function displayFile( uuid , _userid , _fileurl , _filename , _filetype ){
    var element=null;
    for(i in webcallpeers ){
        if(webcallpeers[i].userid==_userid)
           element=webcallpeers[i].fileSharingContainer;
    }
    console.log(" Display File ---------" ,_userid ," ||", _filename , "||", _filetype ,"||", element);
    if($('#'+ element).length > 0){
        $("#"+element).html(getFileElementDisplayByType(_filetype , _fileurl , _filename));
    }else{
        $( "body" ).append(getFileElementDisplayByType(_filetype , _fileurl , _filename));
    }
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

function createFileSharingDiv(i){
    /*--------------------------------add for File Share --------------------*/
    var fileSharingBox=document.createElement("div");
    fileSharingBox.className= "col-sm-6 fileViewing1Box";
    fileSharingBox.id=webcallpeers[i].fileSharingSubContents.fileSharingBox;

    var fileControlBar=document.createElement("p");
    fileControlBar.appendChild(document.createTextNode("File Viewer"));

    var minButton= document.createElement("span");
    minButton.className="btn btn-default glyphicon glyphicon-import closeButton";
    minButton.innerHTML="Minimize";
    minButton.id=webcallpeers[i].fileSharingSubContents.minButton;
    minButton.setAttribute("lastClickedBy" ,'');
    minButton.onclick=function(){
        resizeFV(webcallpeers[i].userid, minButton.id , arrFilesharingBoxes);
    }

    var maxButton= document.createElement("span");
    maxButton.className= "btn btn-default glyphicon glyphicon-export closeButton";
    maxButton.innerHTML="Maximize";
    maxButton.id=webcallpeers[i].fileSharingSubContents.maxButton;
    maxButton.setAttribute("lastClickedBy" ,'');
    maxButton.onclick=function(){
        maxFV(webcallpeers[i].userid, maxButton.id , arrFilesharingBoxes , webcallpeers[i].fileSharingSubContents.fileSharingBox);
    }

    var closeButton= document.createElement("span");
    closeButton.className="btn btn-default glyphicon glyphicon-remove closeButton";
    closeButton.innerHTML="Close";
    closeButton.id=webcallpeers[i].fileSharingSubContents.closeButton;
    closeButton.setAttribute("lastClickedBy" ,'');
    closeButton.onclick=function(){
        closeFV(webcallpeers[i].userid, closeButton.id , webcallpeers[i].fileSharingContainer);
    }

    fileControlBar.appendChild(minButton);
    fileControlBar.appendChild(maxButton);
    fileControlBar.appendChild(closeButton);

    var fileSharingContainer= document.createElement("div");
    fileSharingContainer.className="filesharingWidget";
    fileSharingContainer.id=webcallpeers[i].fileSharingContainer;

    var fillerArea=document.createElement("p");
    fillerArea.className="filler";

    fileSharingBox.appendChild(fileControlBar);
    fileSharingBox.appendChild(fileSharingContainer);
    fileSharingBox.appendChild(fillerArea);

    document.getElementById("fileSharingRow").appendChild(fileSharingBox);

    /*--------------------------------add for File List --------------------*/

    var fileListingBox= document.createElement("div");
    fileListingBox.className="col-sm-6  filesharing1Box";

    var fileListingControlBar=document.createElement("p");

    var fileHelpButton= document.createElement("span");
    fileHelpButton.className="btn btn-default glyphicon glyphicon-question-sign closeButton";
    fileHelpButton.innerHTML="Help";

    fileListingControlBar.appendChild(document.createTextNode("List of Uploaded Files"));
    fileListingControlBar.appendChild(fileHelpButton);

    var fileListingContainer= document.createElement("div");
    fileListingContainer.id=webcallpeers[i].fileListContainer;

    var fileProgress = document.createElement("div");

    fileListingBox.appendChild(fileListingControlBar);
    fileListingBox.appendChild(fileListingContainer);
    fileListingBox.appendChild(fileProgress);

    document.getElementById("fileListingRow").appendChild(fileListingBox);
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
