/*
//var username= prompt("Please enter your id ", "");
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
var e = null;
var n ="tara181989@gmail.com";
var rtcConn ;
var selfuserid=null , remoteUserId=null;
var containerDiv;
var webcallpeers=[];
var sessions = {};
var repeatFlagShowButton =null, repeatFlagHideButton =null, repeatFlagRemoveButton=null ;

/* DOM objects for single user video , user in conf and all other users*/
var localVideo=null, selfVideo=null, remoteVideos=[];
var localobj , remoteobj;

var selfusername="" , selfemail="" , selfcolor="" ;
var latitude="" , longitude="" , operatingsystem="";

/* webrtc session intilization */
var autoload = true;
var sessionid = null, socketAddr = "/", turn = null , webrtcdevIceServers;
var localStream , localStreamId, remoteStream , remoteStreamId;

/* incoming and outgoing call params */
var incomingAudio =true , incomingVideo =true , incomingData = true;
var outgoingAudio =true , outgoingVideo =true , outgoingData = true;

var debug=false;

var timerobj =false;

var chatobj=false , chatContainer= null;

var fileshareobj=false ;

var screenrecordobj =false ;

var snapshotobj=false ;

var videoRecordobj=false , videoRecordContainer=null;

var drawCanvasobj=false ;

var texteditorobj= false;

var codeeditorobj=false, editor=null;

var reconnectobj=false;

var cursorobj=false;

var muteobj=false;

var minmaxobj=false;

var screenshareobj=false;
var screen , isScreenOn=0;
var screen_roomid , screen_userid;

var role="participant";

function init( autoload , callback ){

	if(autoload && !location.hash.replace('#', '').length) {
		// When Session should autogenerate ssid and locationbar doesnt have a session name
		location.href = location.href.split('#')[0] + '#' + (Math.random() * 100).toString().replace('.', '');
		location.reload();
	}else if(autoload && location.href.replace('#', '').length){
		// When Session should autogenerate ssid and locationbar doesnt have a session name
		if(location.href.indexOf('?')>-1){
			sessionid = (location.hash.substring(0,location.href.indexOf('?'))).replace(/\/|:|#|\?|\$|\^|%|\.|`|~|!|\+|@|\[|\||]|\|*. /g, '').split('\n').join('').split('\r').join('');
		}else{
			sessionid = location.hash.replace(/\/|:|#|\?|\$|\^|%|\.|`|~|!|\+|@|\[|\||]|\|*. /g, '').split('\n').join('').split('\r').join('');
		}
		callback(sessionid);

	}else{
		sessionid = prompt("Enter session ", "");
		callback(sessionid);
	}
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

function shownotification(message){

	if(document.getElementById("alertBox")){
		var alertDiv =document.createElement("div");
		alertDiv.className="alert alert-success fade in";
		alertDiv.innerHTML='<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+ message;

		document.getElementById("alertBox").hidden=false;
		document.getElementById("alertBox").innerHTML="";
		document.getElementById("alertBox").appendChild(alertDiv);

		setTimeout(function() {
			document.getElementById("alertBox").hidden=true;
		}, 3000);
	}else{
		alert(message);
	}

}

function shownotificationWarning(message){

  if(document.getElementById("alertBox")){
    var alertDiv =document.createElement("div");
    alertDiv.className="alert alert-warning fade in";
    alertDiv.innerHTML='<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+ message;

    document.getElementById("alertBox").hidden=false;
    document.getElementById("alertBox").innerHTML="";
    document.getElementById("alertBox").appendChild(alertDiv);

    setTimeout(function() {
      document.getElementById("alertBox").hidden=true;
    }, 3000);
  }else{
    alert(message);
  }

}

function showdesktopnotification() {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
	alert("This browser does not support desktop notification");
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
	// If it's okay let's create a notification
	var notification = new Notification("Vilageexperts");
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== 'denied') {
	Notification.requestPermission(function (permission) {
	  // If the user accepts, let's create a notification
	  if (permission === "granted") {
		var notification = new Notification("villageexpsrts");
	  }
	});
  }

  // At last, if the user has denied notifications, and you 
  // want to be respectful there is no need to bother them any more.
}

Notification.requestPermission().then(function(result) {
  console.log(result);
});

function spawnNotification(theBody,theIcon,theTitle) {
  var options = {
	  body: theBody,
	  icon: theIcon
  }
  var n = new Notification(theTitle,options);
}



    /**
     * function to check devices like speakers , webcam ,  microphone etc
     * @method
     * @name checkDevices
     * @param {object} connection
     */
    function checkDevices(obj){
        console.log(" obj.DetectRTC  " , obj.DetectRTC);
        if(obj.DetectRTC.hasMicrophone) {
            // seems current system has at least one audio input device
            console.log("has Microphone");
        }else{
            console.log("doesnt have  hasMicrophone");
        }

        if(obj.DetectRTC.hasSpeakers) {
            console.log("has Speakers");
            // seems current system has at least one audio output device
        }else{
            console.log("doesnt have  Speakers");
        }

        if(obj.DetectRTC.hasWebcam) {
            console.log("has Webcam");
            // seems current system has at least one video input device
        }else{
            console.log("doesnt have Webcam");
        }
    }

    /**
     * function to check browser support for webrtc apis
     * @name checkWebRTCSupport
     * @param {object} connection
     */
    function checkWebRTCSupport(obj){
        if(obj.DetectRTC.isWebRTCSupported) {
        // seems WebRTC compatible client
        }

        if(obj.DetectRTC.isAudioContextSupported) {
            // seems Web-Audio compatible client
        }

        if(obj.DetectRTC.isScreenCapturingSupported) {
            // seems WebRTC screen capturing feature is supported on this client
        }

        if(obj.DetectRTC.isSctpDataChannelsSupported) {
            // seems WebRTC SCTP data channels feature are supported on this client
        }

        if(obj.DetectRTC.isRtpDataChannelsSupported) {
            // seems WebRTC (old-fashioned) RTP data channels feature are supported on this client
        }
    }

    function error(arg1 , arg2){
        console.log(arg1, arg2);
    }

    function getElement(e) {
        return document.querySelector(e)
    }

    function getRandomColor() {
        for (var e = "0123456789ABCDEF".split(""), t = "#", n = 0; 6 > n; n++) t += e[Math.round(15 * Math.random())];
        return t
    }

    function guid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    }


    function getUserinfo(e, t) {
        return e ? '<video src="' + e + '" autoplay></vide>' : '<img src="' + t + '">';
    }

    function fireClickEvent(e) {
        var t = new MouseEvent("click", {
            view: window,
            bubbles: !0,
            cancelable: !0
        });
        e.dispatchEvent(t)
    }

    function bytesToSize(e) {
        var t = ["Bytes", "KB", "MB", "GB", "TB"];
        if (0 == e) return "0 Bytes";
        var n = parseInt(Math.floor(Math.log(e) / Math.log(1024)));
        return Math.round(e / Math.pow(1024, n), 2) + " " + t[n]
    }