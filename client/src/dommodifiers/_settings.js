/* ***********************************************
settings
*********************************************/

function setSettingsAttributes(){
    
    $("#channelname").val(rtcConn.channel);
    $("#userid").val(rtcConn.userid);

    /*$("#inAudio").val(incomingAudio);*/
    $("#inAudio").prop('checked', incomingAudio);
    $("#inVideo").prop('checked',incomingVideo);
    $("#inData").prop('checked',incomingData);

    $("#outAudio").prop('checked',outgoingAudio);
    $("#outVideo").prop('checked',outgoingVideo);
    $("#outData").prop('checked',outgoingData);

    $("#role").val(role);

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
        $('#allwebrtcdevinfo').append('<pre contenteditable>'+rtcConn+'<pre>');
        webrtcdev.info(rtcConn);
    });
}

function createSession(){
    var role = $("#roleMakeSession").val();
    var appname = $("#appnameMakeSession").val();
    var username = $("#userNameMakeSession").val();
    var sessionname = $("#sessionNameMakeSession").val();
    var sessionlink = "https://"+window.location.host+window.location.pathname+"#"+sessionname+"?"+"appname="+appname+"&role="+role+"&audio="+1+"&video="+1+"&name="+username;
/*    if(sessionlink.){
        sessionlinkstr.replace("make", "index");
    }*/
    $("#sessionlink").val(sessionlink);
    $("#sessionlinkGo").click(function(){
        window.open($("#sessionlink").val())
    });
    /*$("#sessionlink").val(window.location+'?appname=webrtcwebcall&role=peer&audio=1&video=1&name='+$("#partnername").val());*/
}

function AddPartner(){
    var role= $("#roleMakeSession").val();
    var appname= $("#appnameMakeSession").val();
    var username= $("#partnername").val();
    var sessionname = $("#sessionNameMakeSession").val();
    var sessionlink = "https://"+window.location.host+window.location.pathname+"#"+sessionname+"?"+"appname="+appname+"&role="+role+"&audio="+1+"&video="+1+"&name="+username;
    $("#partnerlink").val(sessionlink);
    /*$("#partnerlink").val(window.location+'?appname=webrtcwebcall&role=peer&audio=1&video=1&name='+$("#partnername").val());*/
}

function EmailPartnerLink(){
    var sessionname = $("#sessionNameMakeSession").val();
    var sessionlink = $("#partnerlink").val();
    window.open('mailto:test@example.com?subject='+'join Session '+ sessionname+'&body='+ sessionlink);
}
/******************* help and settings ***********************/


function getAllPeerInfo(){
    webrtcdev.info(webcallpeers);
}

$("#SettingsButton").click(function() {
    
    webrtcdev.info(localobj.userdetails);

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