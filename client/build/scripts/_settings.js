function setSettingsAttributes(){
	$("#inspectorlink").val(window.location+'?appname=webrtcwebcall&role=inspector&audio=0&video=0');
    $("#channelname").val(rtcMultiConnection.channel);
    $("#userid").val(rtcMultiConnection.userid);

    $("#inAudio").val(incomingAudio);
    $("#inVideo").val(incomingVideo);
    $("#inData").val(incomingData);

    $("#outAudio").val(outgoingAudio);
    $("#outVideo").val(outgoingVideo);
    $("#outData").val(outgoingData);

    $("#btnGetPeers").click(function(){
       // $("#alllpeerinfo").html(JSON.stringify(webcallpeers,null,6));
       $("#alllpeerinfo").empty();
        /*   
        for(x in webcallpeers){
            $("#allpeerinfo").append( webcallpeers[x].userid+" "+webcallpeers[x].videoContainer)
            $("#allpeerinfo").append('<br/>');
        }*/
       $('#allpeerinfo').append('<pre contenteditable>'+JSON.stringify(webcallpeers, null, 2)+'<pre>');
    });

    $("#btnDebug").click(function(){
        //window.open().document.write('<pre>'+rtcMultiConnection+'<pre>');
        $("#allwebrtcdevinfo").empty();
        $('#allwebrtcdevinfo').append('<pre contenteditable>'+rtcMultiConnection+'<pre>');
        console.info(rtcMultiConnection);
    });
}


/******************* help and settings ***********************/


function getAllPeerInfo(){
    console.log(webcallpeers);
}

$("#SettingsButton").click(function() {
    
    console.log(localobj.userdetails);

    if(localobj.userdisplay.latitude){
        /*$('#'+localobj.userdisplay.latitude).val(latitude);*/
        localobj.userdisplay.latitude.value=latitude;
    }

    if(localobj.userdisplay.longitude){
        localobj.userdisplay.longitude.value=longitude;
    }
    
    if(localobj.userdisplay.operatingsystem){
        localobj.userdisplay.operatingsystem.value=operatingsystem;
        /*$('#'+localobj.userdisplay.operatingsystem).val(operatingsystem);*/
    }
});