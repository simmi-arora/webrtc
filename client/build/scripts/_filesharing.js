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

function assignFileShareButton(fileshareobj){
    var button= document.getElementById(fileshareobj.button.id);
    button.onclick = function() {
        var fileSelector = new FileSelector();
        fileSelector.selectSingleFile(function(file) {
            sendFile(file);
            //sendChatMessage("File is shared :"+file.name);
        });
    };
}

function sendFile(file){
        
    rtcConn.send(file);

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

/*    if(peerinfo.name=="localVideo"){
        showRemoveButton=false;
    }else{
        showRemoveButton=false;
    }*/

    var name = document.createElement("div");
    name.innerHTML = listlength +"   " + filename ;
    name.title=filetype +" shared by " +peerinfo.name ;  
    name.setAttribute("style", " width: 40%;  float: left;");
    name.id="name"+filename;

    var downloadButton = document.createElement("div");
    downloadButton.style.float="right";
    /*downloadButton.setAttribute("class" , "btn btn-primary");*/
    /*downloadButton.setAttribute("style", "color:white");*/
    downloadButton.innerHTML='<a href="' +fileurl + '" download="' + filename + '">'+'<i class="fa fa-download" style="font-size: 25px;"></i>'+' </a>';

    var showButton = document.createElement("div");
    showButton.id= "showButton"+filename;
    showButton.style.float="right";
/*    showButton.setAttribute("class" , "btn btn-primary");
    showButton.innerHTML='show';*/
    showButton.innerHTML='<i class="fa fa-eye" style="font-size: 25px;"></i>';
    showButton.onclick=function(){
        if(repeatFlagShowButton != filename){
            showFile(uuid , elementDisplay , fileurl , filename , filetype);
            rtcConn.send({
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
    hideButton.style.float="right";
/*    hideButton.setAttribute("class" , "btn btn-primary");
    hideButton.innerHTML='hide';*/
    hideButton.innerHTML='<i class="fa fa-eye-slash" style="font-size: 25px;"></i>';
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


    var removeButton = document.createElement("div");
    removeButton.id= "removeButton"+filename;
    removeButton.style.float="right";
/*    removeButton.setAttribute("class" , "btn btn-primary");
    removeButton.innerHTML='remove';*/
    removeButton.innerHTML='<i class="fa fa-trash-o" style="font-size: 25px;"></i>';
    removeButton.onclick=function(event){
        if(repeatFlagRemoveButton != filename){
            hideFile(uuid , elementDisplay , fileurl , filename , filetype);
            //console.log("remove button clicked || to be deleted " , event.target.parentNode.id);
            //alert("remove button clciked ");
            //var tobeHiddenElement = event.target.parentNode.id;
            var tobeHiddenElement=filename;
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
        filedom.setAttribute("style"," margin: 5px; padding: 5px;   background-color: rgba(204, 204, 204, 0.56)");
        filedom.appendChild(name);
        if(showDownloadButton) 
            filedom.appendChild(downloadButton);
        filedom.appendChild(showButton);
        filedom.appendChild(hideButton);
        if(showRemoveButton) 
            filedom.appendChild(removeButton);
    }

    if(parentdom)
        parentdom.appendChild(filedom); 

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
        buttonElement.setAttribute("lastClickedBy" , rtcConn.userid);
        rtcConn.send({
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
    /*    
    <div class="button-corner">
        <span data-placement="bottom" data-toggle="tooltip" title="" data-original-title="minimize"><i class="fa fa-minus-square"></i></span>
        <span data-placement="bottom" data-toggle="tooltip" title="" data-original-title="maxsimize"><i class="fa fa-external-link-square"></i></span>
        <span data-placement="bottom" data-toggle="tooltip" title="" data-original-title="close"><i class="fa fa-times-circle"></i></span>        
    </div>*/

    var fileControlBar=document.createElement("p");
    fileControlBar.id =peerinfo.fileShare.container+"controlBar";
    fileControlBar.appendChild(document.createTextNode("File Viewer for "+ peerinfo.name+ "     "));

        var minButton= document.createElement("span");
        /*    minButton.className="btn btn-default glyphicon glyphicon-import closeButton";
        minButton.innerHTML="Minimize";*/
        minButton.innerHTML='<i class="fa fa-minus-square" style="font-size: 25px;"></i>';
        minButton.id=peerinfo.fileShare.minButton;
        minButton.style.float="right";
        minButton.setAttribute("lastClickedBy" ,'');
        minButton.onclick=function(){
            resizeFV(peerinfo.userid, minButton.id , peerinfo.fileShare.outerbox);
        }

        var maxButton= document.createElement("span");
        /*    maxButton.className= "btn btn-default glyphicon glyphicon-export closeButton";
        maxButton.innerHTML="Maximize";*/
        maxButton.innerHTML='<i class="fa fa-external-link-square" style="font-size: 25px;"></i>';
        maxButton.id=peerinfo.fileShare.maxButton;
        maxButton.style.float="right";
        maxButton.setAttribute("lastClickedBy" ,'');
        maxButton.onclick=function(){
            maxFV(peerinfo.userid, maxButton.id  , peerinfo.fileShare.outerbox);
        }

        var closeButton= document.createElement("span");
        /*
        closeButton.className="btn btn-default glyphicon glyphicon-remove closeButton";
        closeButton.innerHTML="Close";*/
        closeButton.innerHTML='<i class="fa fa-times-circle" style="font-size: 25px;"></i>';
        closeButton.id=peerinfo.fileShare.closeButton;
        closeButton.style.float="right";
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

    linebreak = document.createElement("br");

    fileSharingBox.appendChild(fileControlBar);
    fileSharingBox.appendChild(linebreak);
    fileSharingBox.appendChild(linebreak);
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

    fileListControlBar.appendChild(document.createTextNode("List of Uploaded Files"));

    /*
    var fileHelpButton= document.createElement("span");
    fileHelpButton.className="btn btn-default glyphicon glyphicon-question-sign closeButton";
    fileHelpButton.innerHTML="Help";
    /*fileListControlBar.appendChild(fileHelpButton);*/

    var fileControlBar=document.createElement("p");
    fileControlBar.appendChild(document.createTextNode("File Viewer for "+ peerinfo.name));

        var minButton= document.createElement("span");
        minButton.innerHTML='<i class="fa fa-minus-square" style="font-size: 20px;></i>';
        minButton.id=peerinfo.fileShare.minButton;
        minButton.setAttribute("lastClickedBy" ,'');
        minButton.onclick=function(){
            resizeFV(peerinfo.userid, minButton.id , peerinfo.fileShare.outerbox);
        }

        var maxButton= document.createElement("span");
        maxButton.innerHTML='<i class="fa fa-external-link-square" style="font-size: 20px;></i>';
        maxButton.id=peerinfo.fileShare.maxButton;
        maxButton.setAttribute("lastClickedBy" ,'');
        maxButton.onclick=function(){
            maxFV(peerinfo.userid, maxButton.id  , peerinfo.fileShare.outerbox);
        }

        var closeButton= document.createElement("span");
        closeButton.innerHTML='<i class="fa fa-times-circle" style="font-size: 20px;></i>';
        closeButton.id=peerinfo.fileShare.closeButton;
        closeButton.setAttribute("lastClickedBy" ,'');
        closeButton.onclick=function(){
            closeFV(peerinfo.userid, closeButton.id , peerinfo.fileShare.container);
        }

    fileListControlBar.appendChild(minButton);
    fileListControlBar.appendChild(maxButton);
    fileListControlBar.appendChild(closeButton);


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

    if (!document.getElementById(peerinfo.fileShare.outerbo)){
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
    syncButton(buttonId);
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
/*    document.getElementById(selectedFileSharingBox).hidden=false;
    document.getElementById(selectedFileSharingBox).style.width="50%";   
    syncButton(buttonId);*/
}

function minFV(userid, buttonId , selectedFileSharingBox){
    document.getElementById(selectedFileSharingBox).hidden=false;
    document.getElementById(selectedFileSharingBox).style.width="50%";
    document.getElementById(selectedFileSharingBox).style.height="10%";
    syncButton(buttonId);
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

    syncButton(buttonId);  
}