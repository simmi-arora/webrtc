function setSettingsAttributes(){
	$("#inspectorlink").val(window.location+'?appname=webrtcwebcall&role=inspector&audio=0&video=0');
    
    $("#channelname").val(rtcMultiConnection.channel);
    $("#userid").val(rtcMultiConnection.userid);

    /*$("#inAudio").val(incomingAudio);*/
    $("#inAudio").prop('checked', incomingAudio);
    $("#inVideo").prop('checked',incomingVideo);
    $("#inData").prop('checked',incomingData);

    $("#outAudio").prop('checked',outgoingAudio);
    $("#outVideo").prop('checked',outgoingVideo);
    $("#outData").prop('checked',outgoingData);

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

function AddPartner(){
    $("#partnerlink").val(window.location+'?appname=webrtcwebcall&role=peer&audio=1&video=1&name='+$("#partnername").val());
}

function EmailPartnerLink(){
    window.open('mailto:test@example.com?subject=subject&body=body');
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