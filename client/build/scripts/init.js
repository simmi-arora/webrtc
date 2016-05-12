/*//var username= prompt("Please enter your id ", "");
var username= " "
document.getElementById("username").innerHTML=username;
var useremail= "serviceexchange@serviceexchange.com";

var currentTimeTicker = '';

if(window.location.href.indexOf("s=1")>=0){

}else{
	currentTimeTicker = new Date().getTime();
}
*/

    if(!location.hash.replace('#', '').length) {
        location.href = location.href.split('#')[0] + '#' + (Math.random() * 100).toString().replace('.', '');
        location.reload();
    }
    
/********************************************************************
    global variables
**********************************************************************/

var t = " ";
var o = "/";
var e= null;
var n="tara181989@gmail.com";

var usersList       = document.getElementById("userslist");
var numbersOfUsers  = document.getElementById("numbersofusers");
var usersContainer  = document.getElementById("usersContainer");

var localUserId=null , remoteUserId=null;

var card = document.getElementById('card');
var containerDiv;
var main = document.querySelector('#main');
var smaller = document.querySelector('#smaller');
var webcallpeers=[];
var sessions = {};
var whoIsTyping = document.querySelector("#who-is-typing");
var repeatFlagShowButton =null, repeatFlagHideButton =null, repeatFlagRemoveButton=null ;
// DOM objects
var localVideo =null, miniVideo=null, remoteVideos=[];

var WebRTCdom= function(  _local , _remotearr ){
    if(_local!=null){
        localVideo = document.getElementsByName(_local)[0];
        miniVideo = document.getElementsByName(_remotearr[0])[0];   
        for(var x=1;x<_remotearr.length;x++){
            remoteVideos.push(document.getElementsByName(_remotearr[x])[0]);
        }     
    }else{
        for(var x=0;x<_remotearr.length;x++){
            remoteVideos.push(document.getElementsByName(_remotearr[x])[0]);
        }     
    }
    console.log(" remoteVideos " , remoteVideos)
}

//webrtc session intilization
var sessionid=location.href.replace(/\/|:|#|\?|\$|\^|%|\.|`|~|!|\+|@|\[|\||]|\|*. /g, '').split('\n').join('').split('\r').join('');
var incomingAudio =true , incomingVideo =true , incomingData = true;
var outgoingAudio =true , outgoingVideo =true , outgoingData = true;
var chat=true , fileShare=true ,  screenrecord=true , screenshare =true;
var role="participant";

var WebRTCdev= function( 
    _sessionid,
    _incomingAudio , _incomingVideo , _incomingData,
    _outgoingAudio, _outgoingVideo , _outgoingData,
    _chat , _fileShare ,  _screenrecord , _screenshare
    ){

    sessionid     = _sessionid,
    incomingAudio = _incomingAudio , 
    incomingVideo = _incomingVideo , 
    incomingData  = _incomingData
    outgoingAudio = _outgoingAudio, 
    outgoingVideo = _outgoingVideo , 
    outgoingData  = _outgoingData,
    chat          = _chat , 
    fileShare     = _fileShare , 
    screenrecord  = _screenrecord , 
    screenshare   = _screenshare
}
