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
var localobj , remoteobj;

    var username="" , useremail="" , usercolor="" ;
    var latitude="" , longitude="" , operatingsystem="";

/* webrtc session intilization */
var autoload=true;
var sessionid=null, socketAddr="/",turn , webrtcdevIceServers;
/* iconsoming and outgoing call params */
var incomingAudio =true , incomingVideo =true , incomingData = true;
var outgoingAudio =true , outgoingVideo =true , outgoingData = true;

var chatobj=false , chatContainer= null;

var fileshareobj=false ;

var screenrecordobj =false ;

var snapshotobj=false ;

var videoRecordobj=false , videoRecordContainer=null;

var drawCanvasobj=false ;

var texteditorobj= false;

var reconnectobj=false;

var muteobj=false;

var screenshareobj=false;
var screen , isScreenOn=0;
var screen_roomid , screen_userid;

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


function loadjscssfile(filename, filetype){
    if (filetype=="js"){ //if filename is a external JavaScript file
        var fileref=document.createElement('script')
        fileref.setAttribute("type","text/javascript")
        fileref.setAttribute("src", filename)
    }
    else if (filetype=="css"){ //if filename is an external CSS file
        var fileref=document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref!="undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}

function loadScript(src, onload) {
    var script = document.createElement('script');
    script.src = src;
    script.async = true;
    document.documentElement.appendChild(script);
}

function isData(session) {
    return !session.audio && !session.video && !session.screen && session.data;
}

function isNull(obj) {
    return typeof obj == 'undefined';
}

function isString(obj) {
    return typeof obj == 'string';
}

function isEmpty(session) {
    var length = 0;
    for (var s in session) {
        length++;
    }
    return length == 0;
}

// this method converts array-buffer into string
function ab2str(buf) {
    var result = '';
    try {
        result = String.fromCharCode.apply(null, new Uint16Array(buf));
    } catch (e) {}
    return result;
}

// this method converts string into array-buffer
function str2ab(str) {
    if (!isString(str)) str = JSON.stringify(str);

    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

function toStr(obj) {
    return JSON.stringify(obj, function(key, value) {
        if (value && value.sdp) {
            log(value.sdp.type, '\t', value.sdp.sdp);
            return '';
        } else return value;
    }, '\t');
}

function getLength(obj) {
    var length = 0;
    for (var o in obj)
        if (o) length++;
    return length;
}
function log() {
    console.log(arguments);
}

function error() {
    console.error(arguments);
}

function warn() {
    console.warn(arguments);
}
