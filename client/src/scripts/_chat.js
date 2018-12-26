/********************************************************************************8
        Chat
**************************************************************************************/
function createChatButton(obj){
    var button= document.createElement("span");
    button.className= chatobj.button.class_on;
    button.innerHTML= chatobj.button.html_on;
    button.onclick = function() {
        if(button.className==chatobj.button.class_off){
            document.getElementById(chatobj.container.id).hidden=true;
            button.className=chatobj.button.class_on;
            button.innerHTML= chatobj.button.html_on;
        }else if(button.className==chatobj.button.class_on){
            document.getElementById(chatobj.container.id).hidden=false;
            button.className=chatobj.button.class_off;
            button.innerHTML= chatobj.button.html_off;
        }
    };

    var li =document.createElement("li");
    li.appendChild(button);
    document.getElementById("topIconHolder_ul").appendChild(li);
}

/*function assignChatButton(chatobj){
    var button= document.getElementById(chatobj.button.id);
    button.onclick = function() {
        if(button.className==chatobj.button.class_off){
            document.getElementById(chatobj.chatContainer).hidden=true;
            button.className=chatobj.button.class_on;
            button.innerHTML= chatobj.button.html_on;
        }else if(button.className==chatobj.button.class_on){
            document.getElementById(chatobj.chatContainer).hidden=false;
            button.className=chatobj.button.class_off;
            button.innerHTML= chatobj.button.html_off;
        }
    };
}*/

function createChatBox(obj){

    var mainInputBox=document.createElement("div");

    var chatInput= document.createElement("input");
    chatInput.setAttribute("type", "text");
    chatInput.className= "form-control chatInputClass";
    chatInput.id="chatInput";
    chatInput.onkeypress=function(e){
        if (e.keyCode == 13) {
            sendChatMessage(chatInput.value);
            chatInput.value = "";
        }
    };

    var chatButton= document.createElement("span");
    chatButton.className= "btn btn-primary";
    chatButton.innerHTML= "Enter";
    chatButton.onclick=function(){
        var chatInput=document.getElementById("chatInput");
        sendChatMessage(chatInput.value);
        chatInput.value = "";
    }
    
    var whoTyping= document.createElement("div");
    whoTyping.className= "whoTypingClass";
    whoTyping.id="whoTyping";

    mainInputBox.appendChild(chatInput);
    mainInputBox.appendChild(chatButton);
    mainInputBox.appendChild(whoTyping);
    document.getElementById(chatobj.container.id).appendChild(mainInputBox);

    var chatBoard=document.createElement("div");
    chatBoard.className="chatMessagesClass";
    chatBoard.setAttribute("contenteditable",true);
    chatBoard.id=chatobj.chatBox.id;
    document.getElementById(chatobj.container.id).appendChild(chatBoard);
}

function assignChatBox(obj){

    var chatInput = document.getElementById(chatobj.inputBox.text_id);
    chatInput.onkeypress=function(e){
        if (e.keyCode == 13) {
            var peerinfo = findPeerInfo( selfuserid );
            webrtcdev.log(" chat " , selfuserid , peerinfo);
            sendChatMessage(chatInput.value , peerinfo);
            chatInput.value = "";
        }
    };

    if(document.getElementById(chatobj.inputBox.sendbutton_id)){
        var chatButton= document.getElementById(chatobj.inputBox.sendbutton_id);
        chatButton.onclick=function(e){

            var peerinfo = findPeerInfo( selfuserid );
            var chatInput=document.getElementById(chatobj.inputBox.text_id);
            sendChatMessage(chatInput.value , peerinfo);
            chatInput.value = "";
        }  
    }

    if(document.getElementById(chatobj.inputBox.minbutton_id)){
        var button= document.getElementById(chatobj.inputBox.minbutton_id);
        button.onclick=function(e){
            if(document.getElementById(chatobj.container.id).hidden)
                document.getElementById(chatobj.container.id).hidden=false;
            else
                document.getElementById(chatobj.container.id).hidden=true;
        }  
    }
}

function updateWhotyping(data){
    document.getElementById("whoTyping").innerHTML=data;
}

function sendChatMessage(msg,  peerinfo){
    /*var userinfo;*/
    /*try{
        userinfo = getUserinfo(rtcConn.blobURLs[rtcConn.userid], "chat-message.png");
    }catch(e){
        userinfo = "empty";
    }*/
    addNewMessagelocal({
        header: rtcConn.extra.username,
        message: msg,
        userinfo: peerinfo,
        color: rtcConn.extra.color
    });

    rtcConn.send({
        type:"chat", 
        userinfo: peerinfo,
        message: msg 
    });
}


function replaceURLWithHTMLLinks(text) {
  var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
  return text.replace(exp,"<a href='$1'>$1</a>"); 
}

function addNewMessagelocal(e ) {
    if ("" != e.message && " " != e.message) {
        addMessageSnapshotFormat("user-activity user-activity-right localMessageClass" , e.userinfo , e.message , chatobj.chatBox.id);
    }
}

function addNewMessage(e) {
    if ("" != e.message && " " != e.message) {
        addMessageSnapshotFormat("user-activity user-activity-right remoteMessageClass" , e.userinfo , e.message , chatobj.chatBox.id);
    }
}

function addMessageSnapshotFormat(messageDivclass, userinfo , message , parent){
    var n = document.createElement("div");
    n.className = messageDivclass; 
    webrtcdev.log("addNewMessagelocal" , userinfo);

      takeSnapshot(userinfo, function(datasnapshot) {    
            var image= document.createElement("img");
            image.src= datasnapshot;
            image.style.height="40px";

            var t = document.createElement("span");
            t.innerHTML =  replaceURLWithHTMLLinks(message);

            n.appendChild(image) ;
            n.appendChild(t);
            //n.innerHTML = image +" : "+ replaceURLWithHTMLLinks(message);
               // displayFile(peerinfo.uuid , peerinfo, datasnapshot , snapshotname, "imagesnapshot");

        });       

    document.getElementById(parent).insertBefore(n, document.getElementById(parent).firstChild);
}

function addMessageLineformat(messageDivclass, messageheader , message , parent){
    var n = document.createElement("div");
    n.className = messageDivclass; 
    if(messageheader){
        n.innerHTML = messageheader +" : "+ replaceURLWithHTMLLinks(message);
    }else{
        n.innerHTML = replaceURLWithHTMLLinks(message);
    }
    
    document.getElementById(parent).insertBefore(n, document.getElementById(parent).firstChild);
}

function addMessageBlockFormat(messageheaderDivclass , messageheader ,messageDivclass, message , parent){
    
    var t = document.createElement("div");
    t.className = messageheaderDivclass, 
    t.innerHTML = '<div class="chatusername">' + messageheader + "</div>";

    var n = document.createElement("div");
    n.className = messageDivclass,
    n.innerHTML= message,

    t.appendChild(n),  
    $("#"+parent).append(n);
    /* $("#all-messages").scrollTop($("#all-messages")[0].scrollHeight) */
}

/*$("#chatInput").keypress(function(e) {
    if (e.keyCode == 13) {
        sendChatMessage();
    }
})*/

/*$('#send').click( function() {
    sendChatMessage();
    return false; 
});*/

//$('#chatbox').height($( "#leftVideo" ).height());
$('#chatbox').css('max-height', $( "#leftVideo" ).height()+ 80);
$('#chatBoard').css('max-height', $( "#leftVideo" ).height());
$("#chatBoard").css("overflow-y" , "scroll");