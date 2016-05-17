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

/********************************************************************
    global variables
**********************************************************************/

var t = " ";
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

/* DOM objects */
var localVideo =null, miniVideo=null, remoteVideos=[];

/* webrtc session intilization */
var autoload=true;
var sessionid=null, socketAddr="/";

/* iconsoming and outgoing call params */
var incomingAudio =true , incomingVideo =true , incomingData = true;
var outgoingAudio =true , outgoingVideo =true , outgoingData = true;

var chat=false , chatContainer= null;

var fileShare=false ;

var screenrecord=false , recorder=null;

var screenshare =false;

var videoRecord=false , videoRecordContainer=null;

var drawCanvas=false ;

var reconnect=false;

var role="participant";

function init(autoload){
	var ssid;
	if(autoload && !location.hash.replace('#', '').length) {
	        location.href = location.href.split('#')[0] + '#' + (Math.random() * 100).toString().replace('.', '');
	        location.reload();
	}else if(autoload && location.hash.replace('#', '').length){
		ssid=location.href.replace(/\/|:|#|\?|\$|\^|%|\.|`|~|!|\+|@|\[|\||]|\|*. /g, '').split('\n').join('').split('\r').join('');
	}else{
	    ssid=prompt("Enter session ", "");
	}
	return ssid;
}