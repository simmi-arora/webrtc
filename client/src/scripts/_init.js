/*-----------------------------------------------------------------------------------*/
/*                    Global Init JS                                                 */
/*-----------------------------------------------------------------------------------*/

var t = "";
var e = null;
var n = "";
var rtcConn= null;
var scrConn= null;
var selfuserid=null , remoteUserId=null;
var containerDiv;
var webcallpeers=[];
var sessions = {};
var repeatFlagShowButton =null, repeatFlagHideButton =null, repeatFlagRemoveButton=null, repeatFlagStopuploadButton=null ;

/* DOM objects for single user video , user in conf and all other users*/
var localVideo=null, selfVideo=null, remoteVideos=[];

var webrtcDetectedBrowser = null;
var webrtcDetectedVersion = null;
/*var usersList     = document.getElementById("userslist");
var numbersOfUsers  = document.getElementById("numbersofusers");
var usersContainer  = document.getElementById("usersContainer");*/
var tempuserid ;
var sessions = {};
    
var selfusername="" , selfemail="" , selfcolor="" ;
var remoteusername="" , remoteemail="" , remotecolor="" ;

var latitude="" , longitude="" , operatingsystem="";

/* webrtc session intilization */
var autoload = true;
var sessionid = null, socketAddr = "/" , webrtcdevIceServers=[];
var localStream , localStreamId, remoteStream , remoteStreamId;

/* incoming and outgoing call params */
var incomingAudio =true , incomingVideo =true , incomingData = true;
var outgoingAudio =true , outgoingVideo =true , outgoingData = true;

var debug=false;

var timerobj =false;
var peerTimerStarted = false;

var chatobj=false , chatContainer= null;

var fileshareobj=false ;
var pendingFileTransferlimit = 3;

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

var listeninobj=false;

var screenshareobj=false;

var helpobj=false;

var statisticsobj=false;

var screen, isScreenOn = 0,  chromeMediaSourceId = null , extensioninstalled ;
var screen_roomid , screen_userid;

var role="participant";

var webrtcdev =  webrtcdevlogger;

/*********** global ****************/
this.sessionid="";

/**
 * creates sessionid 
 * @method
 * @name makesessionid
 * @param {string} autoload
 * @return {string}sessionid
 */
this.makesessionid = function(autoload , callback ){
  if(autoload && !location.hash.replace('#', '').length) {
    // When Session should autogenerate ssid and locationbar doesnt have a session name
    location.href = location.href.split('#')[0] + '#' + (Math.random() * 100).toString().replace('.', '');
    location.reload();
  }else if(autoload && location.href.replace('#', '').length){
    // When Session should autogenerate ssid and locationbar doesnt have a session name
    if(location.href.indexOf('?')>-1){
      sessionid = (location.hash.substring(0,location.hash.indexOf('?'))).replace(/\/|:|#|\?|\$|\^|%|\.|`|~|!|\+|@|\[|\||]|\|*. /g, '').split('\n').join('').split('\r').join('');
    }else{
      sessionid = location.hash.replace(/\/|:|#|\?|\$|\^|%|\.|`|~|!|\+|@|\[|\||]|\|*. /g, '').split('\n').join('').split('\r').join('');
    }
    callback(sessionid);
  }else{
    sessionid = prompt("Enter session ", "");
    callback(sessionid);
  }
}

/**************************************************************************************
    peerconnection 
****************************************************************************/

var channelpresence= false;
var localVideoStreaming= null;
var turn="none";
var localobj={}, remoteobj={};
var pendingFileTransfer=[];


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


function getLength(obj) {
  var length = 0;
  for (var o in obj)
    if (o) length++;
  return length;
}



function isHTML(str) {
  var a = document.createElement('div');
  a.innerHTML = str;

  for (var c = a.childNodes, i = c.length; i--; ) {
    if (c[i].nodeType == 1) return true; 
  }

  return false;
}


function getElement(e) {
    return document.querySelector(e)
}

function getElementById(elem) {
    try{
        return document.getElementById(elem);
    }catch(e){
        webrtcdev.error(e);
        return "";
    }
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


/************************************************
scripts or stylesheets load unloading
********************************************/
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

/* ********************************************************
UI / DOM related functions
****************************************************** */

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

// function showElement(elem){
//     if(elem.vide) elem.video.hidden = false;
//     elem.removeAttribute("hidden");
//     elem.setAttribute("style","display:block!important");
// }

/**
 * function to show an elemnt by id or dom
 * @method
 * @name showelem
 * @param {dom} elem
 */
function showelem(elem){
    if( typeof elem   === 'object' && elem.nodeType !== undefined){
        elem.removeAttribute("hidden");
        elem.setAttribute("style","display:block!important");
    }else if(document.getElementById(elem)){
        document.getElementById(elem).removeAttribute("hidden");
        document.getElementById(elem).setAttribute("style","display:block");
    }else{
        webrtcdev.warn("elem not found ", elem);
    }
}

/**
 * function to hide an Element by id of dom 
 * @method
 * @name hideelem
 * @param {dom} elem
 */
function hideelem(elem){
    if( typeof elem   === 'object' && elem.nodeType !== undefined){
        elem.addAttribute("hidden");
        elem.setAttribute("style","display:none!important");
    }else if(document.getElementById(elem)){
        document.getElementById(eid).setAttribute("hidden" , true);
        document.getElementById(eid).setAttribute("style","display:none");
        webrtcdev.log("hideElement ", eid , document.getElementById(eid));
    }
}

/*-----------------------------------------------------------------------------------*/


/**
 * Assigns session varables, ICE gateways and widgets 
 * @constructor
 * @param {json} _localObj - local object.
 * @param {json} _remoteObj - remote object.
 * @param {json} incoming - incoming media stream attributes
 * @param {json} outgoing - outgoing media stream attributes
 * @param {json} session - session object.
 * @param {json} widgets - widgets object.
 */
this.setsession = function(_localobj, _remoteobj , incoming, outgoing , session, widgets){
    //try{
        this.sessionid = sessionid  = session.sessionid;
        socketAddr = session.socketAddr;
        localobj = _localobj;
        remoteobj = _remoteobj;
        webrtcdev.log("[startjs] WebRTCdev Session - " , session);
    // }catch(e){
    //     webrtcdev.error(e);
    //     alert(" Session object doesnt have all parameters ");
    // }

    turn = (session.hasOwnProperty('turn')?session.turn:null);
    webrtcdev.log("[ startjs] WebRTCdev TURN - ", turn);
    if(turn && turn !="none"){
        if(turn.active && turn.iceServers){
            webrtcdev.log("WebRTCdev - Getting preset static ICE servers " , turn.iceServers);
            webrtcdevIceServers = turn.iceServers;
        }else{
            webrtcdev.info("WebRTCdev - Calling API to fetch dynamic ICE servers ");
            getICEServer();  
            // getICEServer( turn.username ,turn.secretkey , turn.domain,
            //                 turn.application , turn.room , turn.secure);                
        }
    }else{
        webrtcdev.log("WebRTCdev - TURN not applied ");
    }

    if(widgets){

        webrtcdev.log( " WebRTCdev - widgets  " , widgets);

        if(widgets.debug)           debug           = widgets.debug || false

        if(widgets.chat)            chatobj         = widgets.chat || null;

        if(widgets.fileShare)       fileshareobj    = widgets.fileShare || null;

        if(widgets.screenrecord)    screenrecordobj = widgets.screenrecord || null;

        if(widgets.screenshare)     screenshareobj  = widgets.screenshare || null;

        if(widgets.snapshot)        snapshotobj     = widgets.snapshot || null;

        if(widgets.videoRecord)     videoRecordobj  = widgets.videoRecord || null;

        if(widgets.reconnect)       reconnectobj    = widgets.reconnect || null;

        if(widgets.drawCanvas)      drawCanvasobj   = widgets.drawCanvas || null;

        if(widgets.texteditor)      texteditorobj   = widgets.texteditor || null;

        if(widgets.codeeditor)      codeeditorobj   = widgets.codeeditor || null;

        if(widgets.mute)            muteobj         = widgets.mute || null;

        if(widgets.timer)           timerobj        = widgets.timer || null;

        if(widgets.listenin)        listeninobj     = widgets.listenin || null;

        if(widgets.cursor)          cursorobj       = widgets.cursor || null;

        if(widgets.minmax)          minmaxobj       = widgets.minmax || null;

        if(widgets.help)            helpobj         = widgets.help || null;

        if(widgets.statistics)      statisticsobj   = widgets.statistics || null;
    }

    return {
        sessionid : sessionid,
        socketAddr: socketAddr,
        turn : turn,
        widgets  : widgets,
        startwebrtcdev: funcStartWebrtcdev,
        rtcConn : rtcConn
    };
}

/**
 * function to return chain of promises for webrtc session to start
 * @method
 * @name funcStartWebrtcdev
 */
function funcStartWebrtcdev(){
    console.log(" [startjs] funcStartWebrtcdev - webrtcdev" , webrtcdev);
    return new Promise(function (resolve, reject) {
        webrtcdev.log(" [ startJS webrtcdom ] : begin DetectRTC checkDevices"); 
        if(role!="inspector") checkDevices(resolve, reject , incoming , outgoing);
    }).then((res)=>{
        webrtcdev.log(" [ startJS webrtcdom ] : sessionid : "+ sessionid+" and localStorage  " , localStorage);

        return new Promise(function (resolve , reject){
            if(localStorage.length>=1 && localStorage.getItem("channel") != sessionid){
                webrtcdev.log("[startjs] Current Session ID " + sessionid + " doesnt match cached channel id "+ localStorage.getItem("channel") +"-> clearCaches()");
                clearCaches();
            }else {
                webrtcdev.log(" no action taken on localStorage");
            }
            resolve("done");
        });
    }).then((res)=>{

        webrtcdev.log(" [ startJS webrtcdom ] : incoming " , incoming);
        webrtcdev.log(" [ startJS webrtcdom ] : outgoing " , outgoing);

        return new Promise(function (resolve , reject){
            if(incoming){
                incomingAudio = incoming.audio ; 
                incomingVideo = incoming.video ; 
                incomingData  = incoming.data  ;  
            }
            if(outgoing){
                outgoingAudio = outgoing.audio ; 
                outgoingVideo = outgoing.video ; 
                outgoingData  = outgoing.data ;
            }
            resolve("done");
        });
    }).then((res)=>{

        webrtcdev.log(" [ startJS webrtcdom ] : localobj " , localobj);
        webrtcdev.log(" [ startJS webrtcdom ] : remoteobj " , remoteobj);

        return new Promise(function (resolve , reject){
            /* When user is single */
            localVideo = localobj.video;

            /* when user is in conference */
            let _remotearr = remoteobj.videoarr;
            /* first video container in remotearr belongs to user */
            if(outgoingVideo){
                selfVideo = _remotearr[0];
            }
            /* create arr for remote peers videos */
            if(!remoteobj.dynamicVideos){
                for(var x=1;x<_remotearr.length;x++){
                    remoteVideos.push(_remotearr[x]);    
                }
            }
            resolve("done");
        });
    }).then((res)=>{
        return new Promise(function (resolve , reject){

            if(localobj.hasOwnProperty('userdetails')){
                let obj      = localobj.userdetails;
                webrtcdev.info("localobj userdetails " , obj);
                selfusername = obj.username  || "LOCAL";
                selfcolor    = obj.usercolor || "";
                selfemail    = obj.useremail || "";
                role         = obj.role      || "participant";
            }else{
                webrtcdev.warn("localobj has no userdetails ");
            }
            resolve("done");
        });
    }).then( ()=> setRtcConn(sessionid)
    ).then( (result)=> setWidgets(rtcConn)
    ).then( (result)=> startSocketSession(rtcConn, socketAddr,  sessionid)
    ).catch((err) =>{
        webrtcdev.error(" Promise rejected " , err);
    });
}

this.issafari= /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
/********************************************************************************** 
        Session call and Updating Peer Info
************************************************************************************/
/**
 * starts a call 
 * @method
 * @name startCall
 * @param {json} obj
 */
this.startCall=function(obj){
    webrtcdev.log(" startCall obj" , obj);
    webrtcdev.log(" TURN " , turn);
    //if(turn=='none'){
        obj.startwebrtcdev();
    // }else if(turn!=null){
    //     repeatInitilization = window.setInterval(obj.startwebrtcdev, 2000);     
    // }
    return;
}

/**
 * stops a call and removes loalstorage items 
 * @method
 * @name stopCall
 */
this.stopCall=function(){
    webrtcdev.log(" stopCall ");
    rtcConn.closeEntireSession();

    if(!localStorage.getItem("channel"))
        localStorage.removeItem("channel");

    if(!localStorage.getItem("userid"))
        localStorage.removeItem("userid");
    
    if(!localStorage.getItem("remoteUsers"))
        localStorage.removeItem("remoteUsers");

    return;
}

