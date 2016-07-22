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
var e = null;
var n ="tara181989@gmail.com";

var selfuserid=null , remoteUserId=null;
var containerDiv;
var webcallpeers=[];
var sessions = {};
var repeatFlagShowButton =null, repeatFlagHideButton =null, repeatFlagRemoveButton=null ;

/* DOM objects */
var localVideo =null, miniVideo=null, remoteVideos=[];
var localobj , remoteobj;

var username="" , useremail="" , usercolor="" ;
var latitude="" , longitude="" , operatingsystem="";

/* webrtc session intilization */
var autoload=true;
var sessionid=null, socketAddr="/", turn=null , webrtcdevIceServers;
var localStream , localStreamId, remoteStream , remoteStreamId;

/* icoming and outgoing call params */
var incomingAudio =true , incomingVideo =true , incomingData = true;
var outgoingAudio =true , outgoingVideo =true , outgoingData = true;

var chatobj=false , chatContainer= null;

var fileshareobj=false ;

var screenrecordobj =false ;

var snapshotobj=false ;

var videoRecordobj=false , videoRecordContainer=null;

var drawCanvasobj=false ;

var texteditorobj= false;

var codeeditorobj=false, editor=null;

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
(function() {function g(a){throw a;}var j=void 0,k=!0,l=null,o=!1;function aa(a){return function(){return this[a]}}function p(a){return function(){return a}}var r,ba=this;function ca(a,b){var c=a.split("."),d=ba;!(c[0]in d)&&d.execScript&&d.execScript("var "+c[0]);for(var e;c.length&&(e=c.shift());)!c.length&&s(b)?d[e]=b:d=d[e]?d[e]:d[e]={}}function da(){}
function ea(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b}function s(a){return a!==j}function fa(a){var b=ea(a);return"array"==b||"object"==b&&"number"==typeof a.length}function t(a){return"string"==typeof a}function ga(a){return"number"==typeof a}function ha(a){var b=typeof a;return"object"==b&&a!=l||"function"==b}Math.floor(2147483648*Math.random()).toString(36);function ia(a,b,c){return a.call.apply(a.bind,arguments)}
function ja(a,b,c){a||g(Error());if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}function u(a,b,c){u=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ia:ja;return u.apply(l,arguments)}function ka(a,b){function c(){}c.prototype=b.prototype;a.Jd=b.prototype;a.prototype=new c};function la(a){a=String(a);if(/^\s*$/.test(a)?0:/^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g,"@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x10-\x1f\x80-\x9f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g,"")))try{return eval("("+a+")")}catch(b){}g(Error("Invalid JSON string: "+a))}function ma(){this.Xb=j}
function na(a,b,c){switch(typeof b){case "string":oa(b,c);break;case "number":c.push(isFinite(b)&&!isNaN(b)?b:"null");break;case "boolean":c.push(b);break;case "undefined":c.push("null");break;case "object":if(b==l){c.push("null");break}if("array"==ea(b)){var d=b.length;c.push("[");for(var e="",f=0;f<d;f++)c.push(e),e=b[f],na(a,a.Xb?a.Xb.call(b,String(f),e):e,c),e=",";c.push("]");break}c.push("{");d="";for(f in b)Object.prototype.hasOwnProperty.call(b,f)&&(e=b[f],"function"!=typeof e&&(c.push(d),
oa(f,c),c.push(":"),na(a,a.Xb?a.Xb.call(b,f,e):e,c),d=","));c.push("}");break;case "function":break;default:g(Error("Unknown type: "+typeof b))}}var pa={'"':'\\"',"\\":"\\\\","/":"\\/","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\x0B":"\\u000b"},qa=/\uffff/.test("\uffff")?/[\\\"\x00-\x1f\x7f-\uffff]/g:/[\\\"\x00-\x1f\x7f-\xff]/g;
function oa(a,b){b.push('"',a.replace(qa,function(a){if(a in pa)return pa[a];var b=a.charCodeAt(0),e="\\u";16>b?e+="000":256>b?e+="00":4096>b&&(e+="0");return pa[a]=e+b.toString(16)}),'"')};function y(a){if("undefined"!==typeof JSON&&s(JSON.stringify))a=JSON.stringify(a);else{var b=[];na(new ma,a,b);a=b.join("")}return a};function ra(a){for(var b=[],c=0,d=0;d<a.length;d++){var e=a.charCodeAt(d);55296<=e&&56319>=e&&(e-=55296,d++,z(d<a.length,"Surrogate pair missing trail surrogate."),e=65536+(e<<10)+(a.charCodeAt(d)-56320));128>e?b[c++]=e:(2048>e?b[c++]=e>>6|192:(65536>e?b[c++]=e>>12|224:(b[c++]=e>>18|240,b[c++]=e>>12&63|128),b[c++]=e>>6&63|128),b[c++]=e&63|128)}return b};function A(a,b,c,d){var e;d<b?e="at least "+b:d>c&&(e=0===c?"none":"no more than "+c);e&&g(Error(a+" failed: Was called with "+d+(1===d?" argument.":" arguments.")+" Expects "+e+"."))}function B(a,b,c){var d="";switch(b){case 1:d=c?"first":"First";break;case 2:d=c?"second":"Second";break;case 3:d=c?"third":"Third";break;case 4:d=c?"fourth":"Fourth";break;default:sa.assert(o,"errorPrefix_ called with argumentNumber > 4.  Need to update it?")}return a+" failed: "+(d+" argument ")}
function C(a,b,c,d){(!d||s(c))&&"function"!=ea(c)&&g(Error(B(a,b,d)+"must be a valid function."))}function ta(a,b,c){s(c)&&(!ha(c)||c===l)&&g(Error(B(a,b,k)+"must be a valid context object."))};function D(a,b){return Object.prototype.hasOwnProperty.call(a,b)}function ua(a,b){if(Object.prototype.hasOwnProperty.call(a,b))return a[b]};var va={},sa={},wa=/[\[\].#$\/]/,xa=/[\[\].#$]/;function ya(a){return t(a)&&0!==a.length&&!wa.test(a)}function za(a,b,c){(!c||s(b))&&Aa(B(a,1,c),b)}
function Aa(a,b,c,d){c||(c=0);d||(d=[]);s(b)||g(Error(a+"contains undefined"+Ba(d)));"function"==ea(b)&&g(Error(a+"contains a function"+Ba(d)));Ca(b)&&g(Error(a+"contains "+b.toString()+Ba(d)));1E3<c&&g(new TypeError(a+"contains a cyclic object value ("+d.slice(0,100).join(".")+"...)"));t(b)&&(b.length>10485760/3&&10485760<va.Kd.Id(b).length)&&g(Error(a+"contains a string greater than 10485760 utf8 bytes"+Ba(d)+" ('"+b.substring(0,50)+"...')"));if(ha(b))for(var e in b)D(b,e)&&(".priority"!==e&&(".value"!==
e&&!ya(e))&&g(Error(a+"contains an invalid key ("+e+")"+Ba(d)+'.  Keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]"')),d.push(e),Aa(a,b[e],c+1,d),d.pop())}function Ba(a){return 0==a.length?"":" in property "+a.join(".")}function Da(a,b){ha(b)||g(Error(B(a,1,o)+" must be an object containing the children to replace."));za(a,b,o)}function Ea(a,b,c,d){(!d||s(c))&&(c!==l&&!ga(c)&&!t(c))&&g(Error(B(a,b,d)+"must be a valid firebase priority (null or a string.)"))}
function Fa(a,b,c){if(!c||s(b))switch(b){case "value":case "child_added":case "child_removed":case "child_changed":case "child_moved":break;default:g(Error(B(a,1,c)+'must be a valid event type: "value", "child_added", "child_removed", "child_changed", or "child_moved".'))}}function Ga(a,b){s(b)&&!ya(b)&&g(Error(B(a,2,k)+'must be a valid firebase key (non-empty string, not containing ".", "#", "$", "/", "[", or "]").'))}
function Ha(a,b){(!t(b)||0===b.length||xa.test(b))&&g(Error(B(a,1,o)+'must be a non-empty string and can\'t contain ".", "#", "$", "[", or "]".'))}function E(a,b){".info"===F(b)&&g(Error(a+" failed: Can't modify data under /.info/"))};function G(a,b,c,d,e,f,h){this.o=a;this.path=b;this.ta=c;this.Z=d;this.la=e;this.ra=f;this.Pa=h;s(this.Z)&&(s(this.ra)&&s(this.ta))&&g("Query: Can't combine startAt(), endAt(), and limit().")}G.prototype.oc=function(a,b){A("Query.on",2,4,arguments.length);Fa("Query.on",a,o);C("Query.on",2,b,o);var c=Ia("Query.on",arguments[2],arguments[3]);this.o.Bb(this,a,b,c.cancel,c.W);return b};G.prototype.on=G.prototype.oc;
G.prototype.Ib=function(a,b,c){A("Query.off",0,3,arguments.length);Fa("Query.off",a,k);C("Query.off",2,b,k);ta("Query.off",3,c);this.o.Wb(this,a,b,c)};G.prototype.off=G.prototype.Ib;G.prototype.vd=function(a,b){function c(h){f&&(f=o,e.Ib(a,c),b.call(d.W,h))}A("Query.once",2,4,arguments.length);Fa("Query.once",a,o);C("Query.once",2,b,o);var d=Ia("Query.once",arguments[2],arguments[3]),e=this,f=k;this.oc(a,c,function(){e.Ib(a,c);d.cancel&&d.cancel.call(d.W)})};G.prototype.once=G.prototype.vd;
G.prototype.rd=function(a){A("Query.limit",1,1,arguments.length);(!ga(a)||Math.floor(a)!==a||0>=a)&&g("Query.limit: First argument must be a positive integer.");return new G(this.o,this.path,a,this.Z,this.la,this.ra,this.Pa)};G.prototype.limit=G.prototype.rd;G.prototype.Ed=function(a,b){A("Query.startAt",0,2,arguments.length);Ea("Query.startAt",1,a,k);Ga("Query.startAt",b);s(a)||(b=a=l);return new G(this.o,this.path,this.ta,a,b,this.ra,this.Pa)};G.prototype.startAt=G.prototype.Ed;
G.prototype.ld=function(a,b){A("Query.endAt",0,2,arguments.length);Ea("Query.endAt",1,a,k);Ga("Query.endAt",b);return new G(this.o,this.path,this.ta,this.Z,this.la,a,b)};G.prototype.endAt=G.prototype.ld;function Ja(a){var b={};s(a.Z)&&(b.sp=a.Z);s(a.la)&&(b.sn=a.la);s(a.ra)&&(b.ep=a.ra);s(a.Pa)&&(b.en=a.Pa);s(a.ta)&&(b.l=a.ta);s(a.Z)&&(s(a.la)&&a.Z===l&&a.la===l)&&(b.vf="l");return b}G.prototype.Ia=function(){var a=Ka(Ja(this));return"{}"===a?"default":a};
function Ia(a,b,c){var d={};b&&c?(d.cancel=b,C(a,3,d.cancel,k),d.W=c,ta(a,4,d.W)):b&&("object"===typeof b&&b!==l?d.W=b:"function"===typeof b?d.cancel=b:g(Error(B(a,3,k)+"must either be a cancel callback or a context object.")));return d};function I(a){if(a instanceof I)return a;if(1==arguments.length){this.m=a.split("/");for(var b=0,c=0;c<this.m.length;c++)0<this.m[c].length&&(this.m[b]=this.m[c],b++);this.m.length=b;this.X=0}else this.m=arguments[0],this.X=arguments[1]}function F(a){return a.X>=a.m.length?l:a.m[a.X]}function La(a){var b=a.X;b<a.m.length&&b++;return new I(a.m,b)}function Ma(a){return a.X<a.m.length?a.m[a.m.length-1]:l}r=I.prototype;
r.toString=function(){for(var a="",b=this.X;b<this.m.length;b++)""!==this.m[b]&&(a+="/"+this.m[b]);return a||"/"};r.parent=function(){if(this.X>=this.m.length)return l;for(var a=[],b=this.X;b<this.m.length-1;b++)a.push(this.m[b]);return new I(a,0)};r.C=function(a){for(var b=[],c=this.X;c<this.m.length;c++)b.push(this.m[c]);if(a instanceof I)for(c=a.X;c<a.m.length;c++)b.push(a.m[c]);else{a=a.split("/");for(c=0;c<a.length;c++)0<a[c].length&&b.push(a[c])}return new I(b,0)};
r.f=function(){return this.X>=this.m.length};function Na(a,b){var c=F(a);if(c===l)return b;if(c===F(b))return Na(La(a),La(b));g("INTERNAL ERROR: innerPath ("+b+") is not within outerPath ("+a+")")}r.contains=function(a){var b=0;if(this.m.length>a.m.length)return o;for(;b<this.m.length;){if(this.m[b]!==a.m[b])return o;++b}return k};function Oa(){this.children={};this.hc=0;this.value=l}function Ra(a,b,c){this.ua=a?a:"";this.ob=b?b:l;this.u=c?c:new Oa}function J(a,b){for(var c=b instanceof I?b:new I(b),d=a,e;(e=F(c))!==l;)d=new Ra(e,d,ua(d.u.children,e)||new Oa),c=La(c);return d}r=Ra.prototype;r.j=function(){return this.u.value};function M(a,b){z("undefined"!==typeof b);a.u.value=b;Sa(a)}r.Eb=function(){return 0<this.u.hc};r.f=function(){return this.j()===l&&!this.Eb()};
r.B=function(a){for(var b in this.u.children)a(new Ra(b,this,this.u.children[b]))};function Ta(a,b,c,d){c&&!d&&b(a);a.B(function(a){Ta(a,b,k,d)});c&&d&&b(a)}function Ua(a,b,c){for(a=c?a:a.parent();a!==l;){if(b(a))return k;a=a.parent()}return o}r.path=function(){return new I(this.ob===l?this.ua:this.ob.path()+"/"+this.ua)};r.name=aa("ua");r.parent=aa("ob");
function Sa(a){if(a.ob!==l){var b=a.ob,c=a.ua,d=a.f(),e=D(b.u.children,c);d&&e?(delete b.u.children[c],b.u.hc--,Sa(b)):!d&&!e&&(b.u.children[c]=a.u,b.u.hc++,Sa(b))}};function Va(a,b){this.Ma=a?a:Wa;this.Y=b?b:Xa}function Wa(a,b){return a<b?-1:a>b?1:0}r=Va.prototype;r.ia=function(a,b){return new Va(this.Ma,this.Y.ia(a,b,this.Ma).copy(l,l,o,l,l))};r.remove=function(a){return new Va(this.Ma,this.Y.remove(a,this.Ma).copy(l,l,o,l,l))};r.get=function(a){for(var b,c=this.Y;!c.f();){b=this.Ma(a,c.key);if(0===b)return c.value;0>b?c=c.left:0<b&&(c=c.right)}return l};
function Ya(a,b){for(var c,d=a.Y,e=l;!d.f();){c=a.Ma(b,d.key);if(0===c){if(d.left.f())return e?e.key:l;for(d=d.left;!d.right.f();)d=d.right;return d.key}0>c?d=d.left:0<c&&(e=d,d=d.right)}g(Error("Attempted to find predecessor key for a nonexistent key.  What gives?"))}r.f=function(){return this.Y.f()};r.count=function(){return this.Y.count()};r.ib=function(){return this.Y.ib()};r.Sa=function(){return this.Y.Sa()};r.sa=function(a){return this.Y.sa(a)};r.Ja=function(a){return this.Y.Ja(a)};
r.Qa=function(a){return new Za(this.Y,a)};function Za(a,b){this.Wc=b;for(this.Gb=[];!a.f();)this.Gb.push(a),a=a.left}function $a(a){if(0===a.Gb.length)return l;var b=a.Gb.pop(),c;c=a.Wc?a.Wc(b.key,b.value):{key:b.key,value:b.value};for(b=b.right;!b.f();)a.Gb.push(b),b=b.left;return c}function ab(a,b,c,d,e){this.key=a;this.value=b;this.color=c!=l?c:k;this.left=d!=l?d:Xa;this.right=e!=l?e:Xa}r=ab.prototype;
r.copy=function(a,b,c,d,e){return new ab(a!=l?a:this.key,b!=l?b:this.value,c!=l?c:this.color,d!=l?d:this.left,e!=l?e:this.right)};r.count=function(){return this.left.count()+1+this.right.count()};r.f=p(o);r.sa=function(a){return this.left.sa(a)||a(this.key,this.value)||this.right.sa(a)};r.Ja=function(a){return this.right.Ja(a)||a(this.key,this.value)||this.left.Ja(a)};function bb(a){return a.left.f()?a:bb(a.left)}r.ib=function(){return bb(this).key};
r.Sa=function(){return this.right.f()?this.key:this.right.Sa()};r.ia=function(a,b,c){var d,e;e=this;d=c(a,e.key);e=0>d?e.copy(l,l,l,e.left.ia(a,b,c),l):0===d?e.copy(l,b,l,l,l):e.copy(l,l,l,l,e.right.ia(a,b,c));return cb(e)};function db(a){if(a.left.f())return Xa;!a.left.H()&&!a.left.left.H()&&(a=eb(a));a=a.copy(l,l,l,db(a.left),l);return cb(a)}
r.remove=function(a,b){var c,d;c=this;if(0>b(a,c.key))!c.left.f()&&(!c.left.H()&&!c.left.left.H())&&(c=eb(c)),c=c.copy(l,l,l,c.left.remove(a,b),l);else{c.left.H()&&(c=gb(c));!c.right.f()&&(!c.right.H()&&!c.right.left.H())&&(c=hb(c),c.left.left.H()&&(c=gb(c),c=hb(c)));if(0===b(a,c.key)){if(c.right.f())return Xa;d=bb(c.right);c=c.copy(d.key,d.value,l,l,db(c.right))}c=c.copy(l,l,l,l,c.right.remove(a,b))}return cb(c)};r.H=aa("color");
function cb(a){a.right.H()&&!a.left.H()&&(a=ib(a));a.left.H()&&a.left.left.H()&&(a=gb(a));a.left.H()&&a.right.H()&&(a=hb(a));return a}function eb(a){a=hb(a);a.right.left.H()&&(a=a.copy(l,l,l,l,gb(a.right)),a=ib(a),a=hb(a));return a}function ib(a){var b;b=a.copy(l,l,k,l,a.right.left);return a.right.copy(l,l,a.color,b,l)}function gb(a){var b;b=a.copy(l,l,k,a.left.right,l);return a.left.copy(l,l,a.color,l,b)}
function hb(a){var b,c;b=a.left.copy(l,l,!a.left.color,l,l);c=a.right.copy(l,l,!a.right.color,l,l);return a.copy(l,l,!a.color,b,c)}function jb(){}r=jb.prototype;r.copy=function(){return this};r.ia=function(a,b){return new ab(a,b,j,j,j)};r.remove=function(){return this};r.get=p(l);r.count=p(0);r.f=p(k);r.sa=p(o);r.Ja=p(o);r.ib=p(l);r.Sa=p(l);r.H=p(o);var Xa=new jb;var kb=Array.prototype,lb=kb.forEach?function(a,b,c){kb.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=t(a)?a.split(""):a,f=0;f<d;f++)f in e&&b.call(c,e[f],f,a)},mb=kb.map?function(a,b,c){return kb.map.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=Array(d),f=t(a)?a.split(""):a,h=0;h<d;h++)h in f&&(e[h]=b.call(c,f[h],h,a));return e};function nb(){};function ob(){this.z=[];this.gc=[];this.hd=[];this.Ob=[];this.Ob[0]=128;for(var a=1;64>a;++a)this.Ob[a]=0;this.reset()}ka(ob,nb);ob.prototype.reset=function(){this.z[0]=1732584193;this.z[1]=4023233417;this.z[2]=2562383102;this.z[3]=271733878;this.z[4]=3285377520;this.Ac=this.eb=0};
function pb(a,b){var c;c||(c=0);for(var d=a.hd,e=c;e<c+64;e+=4)d[e/4]=b[e]<<24|b[e+1]<<16|b[e+2]<<8|b[e+3];for(e=16;80>e;e++){var f=d[e-3]^d[e-8]^d[e-14]^d[e-16];d[e]=(f<<1|f>>>31)&4294967295}c=a.z[0];for(var h=a.z[1],i=a.z[2],m=a.z[3],n=a.z[4],q,e=0;80>e;e++)40>e?20>e?(f=m^h&(i^m),q=1518500249):(f=h^i^m,q=1859775393):60>e?(f=h&i|m&(h|i),q=2400959708):(f=h^i^m,q=3395469782),f=(c<<5|c>>>27)+f+n+q+d[e]&4294967295,n=m,m=i,i=(h<<30|h>>>2)&4294967295,h=c,c=f;a.z[0]=a.z[0]+c&4294967295;a.z[1]=a.z[1]+h&
4294967295;a.z[2]=a.z[2]+i&4294967295;a.z[3]=a.z[3]+m&4294967295;a.z[4]=a.z[4]+n&4294967295}ob.prototype.update=function(a,b){s(b)||(b=a.length);var c=this.gc,d=this.eb,e=0;if(t(a))for(;e<b;)c[d++]=a.charCodeAt(e++),64==d&&(pb(this,c),d=0);else for(;e<b;)c[d++]=a[e++],64==d&&(pb(this,c),d=0);this.eb=d;this.Ac+=b};function qb(){this.La={};this.length=0}qb.prototype.setItem=function(a,b){D(this.La,a)||(this.length+=1);this.La[a]=b};qb.prototype.getItem=function(a){return D(this.La,a)?this.La[a]:l};qb.prototype.removeItem=function(a){D(this.La,a)&&(this.length-=1,delete this.La[a])};var N=l;if("undefined"!==typeof sessionStorage)try{sessionStorage.setItem("firebase-sentinel","cache"),sessionStorage.removeItem("firebase-sentinel"),N=sessionStorage}catch(rb){N=new qb}else N=new qb;function sb(a,b,c,d){this.host=a;this.Yb=b;this.jb=c;this.aa=d||N.getItem(a)||this.host}function tb(a,b){b!==a.aa&&(a.aa=b,"s-"===a.aa.substr(0,2)&&N.setItem(a.host,a.aa))}sb.prototype.toString=function(){return(this.Yb?"https://":"http://")+this.host};var ub,vb,wb,xb;function yb(){return ba.navigator?ba.navigator.userAgent:l}xb=wb=vb=ub=o;var zb;if(zb=yb()){var Ab=ba.navigator;ub=0==zb.indexOf("Opera");vb=!ub&&-1!=zb.indexOf("MSIE");wb=!ub&&-1!=zb.indexOf("WebKit");xb=!ub&&!wb&&"Gecko"==Ab.product}var Bb=vb,Cb=xb,Db=wb;var Eb;if(ub&&ba.opera){var Fb=ba.opera.version;"function"==typeof Fb&&Fb()}else Cb?Eb=/rv\:([^\);]+)(\)|;)/:Bb?Eb=/MSIE\s+([^\);]+)(\)|;)/:Db&&(Eb=/WebKit\/(\S+)/),Eb&&Eb.exec(yb());var Gb=l,Hb=l;
function Ib(a,b){fa(a)||g(Error("encodeByteArray takes an array as a parameter"));if(!Gb){Gb={};Hb={};for(var c=0;65>c;c++)Gb[c]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(c),Hb[c]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.".charAt(c)}for(var c=b?Hb:Gb,d=[],e=0;e<a.length;e+=3){var f=a[e],h=e+1<a.length,i=h?a[e+1]:0,m=e+2<a.length,n=m?a[e+2]:0,q=f>>2,f=(f&3)<<4|i>>4,i=(i&15)<<2|n>>6,n=n&63;m||(n=64,h||(i=64));d.push(c[q],c[f],c[i],c[n])}return d.join("")}
;var Jb,Kb=1;Jb=function(){return Kb++};function z(a,b){a||g(Error("Firebase INTERNAL ASSERT FAILED:"+b))}function Lb(a){var b=ra(a),a=new ob;a.update(b);var b=[],c=8*a.Ac;56>a.eb?a.update(a.Ob,56-a.eb):a.update(a.Ob,64-(a.eb-56));for(var d=63;56<=d;d--)a.gc[d]=c&255,c/=256;pb(a,a.gc);for(d=c=0;5>d;d++)for(var e=24;0<=e;e-=8)b[c++]=a.z[d]>>e&255;return Ib(b)}
function Mb(){for(var a="",b=0;b<arguments.length;b++)a=fa(arguments[b])?a+Mb.apply(l,arguments[b]):"object"===typeof arguments[b]?a+y(arguments[b]):a+arguments[b],a+=" ";return a}var Nb=l,Ob=k;function Pb(){Ob===k&&(Ob=o,Nb===l&&"true"===N.getItem("logging_enabled")&&Qb(k));if(Nb){var a=Mb.apply(l,arguments);Nb(a)}}function Sb(a){return function(){Pb(a,arguments)}}
function Tb(){if("undefined"!==typeof console){var a="FIREBASE INTERNAL ERROR: "+Mb.apply(l,arguments);"undefined"!==typeof console.error?console.error(a):console.log(a)}}function Ub(){var a=Mb.apply(l,arguments);g(Error("FIREBASE FATAL ERROR: "+a))}function Vb(){if("undefined"!==typeof console){var a="FIREBASE WARNING: "+Mb.apply(l,arguments);"undefined"!==typeof console.warn?console.warn(a):console.log(a)}}
function Ca(a){return ga(a)&&(a!=a||a==Number.POSITIVE_INFINITY||a==Number.NEGATIVE_INFINITY)}function Wb(a,b){return a!==b?a===l?-1:b===l?1:typeof a!==typeof b?"number"===typeof a?-1:1:a>b?1:-1:0}function Xb(a,b){if(b&&a in b)return b[a];g(Error("Missing required key ("+a+") in object: "+y(b)))}var Yb=0;function Ka(a){if("object"!==typeof a||a===l)return y(a);var b=[],c;for(c in a)b.push(c);b.sort();c="{";for(var d=0;d<b.length;d++)0!==d&&(c+=","),c+=y(b[d]),c+=":",c+=Ka(a[b[d]]);return c+"}"}
function Zb(a,b){if(a.length<=b)return[a];for(var c=[],d=0;d<a.length;d+=b)d+b>a?c.push(a.substring(d,a.length)):c.push(a.substring(d,d+b));return c}
function $b(a){z(!Ca(a));var b,c,d,e;0===a?(d=c=0,b=-Infinity===1/a?1:0):(b=0>a,a=Math.abs(a),a>=Math.pow(2,-1022)?(d=Math.min(Math.floor(Math.log(a)/Math.LN2),1023),c=d+1023,d=Math.round(a*Math.pow(2,52-d)-Math.pow(2,52))):(c=0,d=Math.round(a/Math.pow(2,-1074))));e=[];for(a=52;a;a-=1)e.push(d%2?1:0),d=Math.floor(d/2);for(a=11;a;a-=1)e.push(c%2?1:0),c=Math.floor(c/2);e.push(b?1:0);e.reverse();b=e.join("");c="";for(a=0;64>a;a+=8)d=parseInt(b.substr(a,8),2).toString(16),1===d.length&&(d="0"+d),c+=d;
return c.toLowerCase()};function ac(a,b){this.oa=a;z(this.oa!==l,"LeafNode shouldn't be created with null value.");this.Ua="undefined"!==typeof b?b:l}r=ac.prototype;r.J=p(k);r.k=aa("Ua");r.ec=function(a){return new ac(this.oa,a)};r.N=function(){return O};r.F=function(a){return F(a)===l?this:O};r.T=p(l);r.D=function(a,b){return(new P(new Va,this.Ua)).D(a,b)};r.Ya=function(a,b){var c=F(a);return c===l?b:this.D(c,O.Ya(La(a),b))};r.f=p(o);r.Hb=p(0);
r.P=function(a){return a&&this.k()!==l?{".value":this.j(),".priority":this.k()}:this.j()};r.hash=function(){var a="";this.k()!==l&&(a+="priority:"+bc(this.k())+":");var b=typeof this.oa,a=a+(b+":"),a="number"===b?a+$b(this.oa):a+this.oa;return Lb(a)};r.j=aa("oa");r.toString=function(){return"string"===typeof this.oa?'"'+this.oa+'"':this.oa};function P(a,b){this.R=a||new Va;this.Ua="undefined"!==typeof b?b:l}r=P.prototype;r.J=p(o);r.k=aa("Ua");r.ec=function(a){return new P(this.R,a)};r.D=function(a,b){var c=this.R.remove(a);b&&b.f()&&(b=l);b!==l&&(c=c.ia(a,b));return b&&b.k()!==l?new cc(c,l,this.Ua):new P(c,this.Ua)};r.Ya=function(a,b){var c=F(a);if(c===l)return b;var d=this.N(c).Ya(La(a),b);return this.D(c,d)};r.f=function(){return this.R.f()};r.Hb=function(){return this.R.count()};var dc=/^\d+$/;r=P.prototype;
r.P=function(a){if(this.f())return l;var b={},c=0,d=0,e=k;this.B(function(f,h){b[f]=h.P(a);c++;e&&dc.test(f)?d=Math.max(d,Number(f)):e=o});if(!a&&e&&d<2*c){var f=[],h;for(h in b)f[h]=b[h];return f}a&&this.k()!==l&&(b[".priority"]=this.k());return b};r.hash=function(){var a="";this.k()!==l&&(a+="priority:"+bc(this.k())+":");this.B(function(b,c){var d=c.hash();""!==d&&(a+=":"+b+":"+d)});return""===a?"":Lb(a)};r.N=function(a){a=this.R.get(a);return a===l?O:a};
r.F=function(a){var b=F(a);return b===l?this:this.N(b).F(La(a))};r.T=function(a){return Ya(this.R,a)};r.Kc=function(){return this.R.ib()};r.Lc=function(){return this.R.Sa()};r.B=function(a){return this.R.sa(a)};r.lc=function(a){return this.R.Ja(a)};r.Qa=function(){return this.R.Qa()};r.toString=function(){var a="{",b=k;this.B(function(c,d){b?b=o:a+=", ";a+='"'+c+'" : '+d.toString()});return a+="}"};var O=new P(new Va);function cc(a,b,c){P.call(this,a,c);b===l&&(b=new Va(ec),a.sa(function(a,c){b=b.ia({name:a,wa:c.k()},c)}));this.ka=b}ka(cc,P);r=cc.prototype;r.D=function(a,b){var c=this.N(a),d=this.R,e=this.ka;c!==l&&(d=d.remove(a),e=e.remove({name:a,wa:c.k()}));b&&b.f()&&(b=l);b!==l&&(d=d.ia(a,b),e=e.ia({name:a,wa:b.k()},b));return new cc(d,e,this.k())};r.T=function(a,b){var c=Ya(this.ka,{name:a,wa:b.k()});return c?c.name:l};r.B=function(a){return this.ka.sa(function(b,c){return a(b.name,c)})};
r.lc=function(a){return this.ka.Ja(function(b,c){return a(b.name,c)})};r.Qa=function(){return this.ka.Qa(function(a,b){return{key:a.name,value:b}})};r.Kc=function(){return this.ka.f()?l:this.ka.ib().name};r.Lc=function(){return this.ka.f()?l:this.ka.Sa().name};function Q(a,b){if("object"!==typeof a)return new ac(a,b);if(a===l)return O;var c=l;".priority"in a?c=a[".priority"]:"undefined"!==typeof b&&(c=b);z(c===l||"string"===typeof c||"number"===typeof c);if(".value"in a&&a[".value"]!==l)return new ac(a[".value"],c);var c=new P(new Va,c),d;for(d in a)if(D(a,d)&&"."!==d.substring(0,1)){var e=Q(a[d]);if(e.J()||!e.f())c=c.D(d,e)}return c}function ec(a,b){return Wb(a.wa,b.wa)||(a.name!==b.name?a.name<b.name?-1:1:0)}
function bc(a){return"number"===typeof a?"number:"+$b(a):"string:"+a};function R(a,b){this.u=a;this.Vb=b}R.prototype.P=function(){A("Firebase.DataSnapshot.val",0,0,arguments.length);return this.u.P()};R.prototype.val=R.prototype.P;R.prototype.md=function(){A("Firebase.DataSnapshot.exportVal",0,0,arguments.length);return this.u.P(k)};R.prototype.exportVal=R.prototype.md;R.prototype.C=function(a){A("Firebase.DataSnapshot.child",0,1,arguments.length);ga(a)&&(a=String(a));Ha("Firebase.DataSnapshot.child",a);var b=new I(a),c=this.Vb.C(b);return new R(this.u.F(b),c)};
R.prototype.child=R.prototype.C;R.prototype.mc=function(a){A("Firebase.DataSnapshot.hasChild",1,1,arguments.length);Ha("Firebase.DataSnapshot.hasChild",a);var b=new I(a);return!this.u.F(b).f()};R.prototype.hasChild=R.prototype.mc;R.prototype.k=function(){A("Firebase.DataSnapshot.getPriority",0,0,arguments.length);return this.u.k()};R.prototype.getPriority=R.prototype.k;
R.prototype.forEach=function(a){A("Firebase.DataSnapshot.forEach",1,1,arguments.length);C("Firebase.DataSnapshot.forEach",1,a,o);if(this.u.J())return o;var b=this;return this.u.B(function(c,d){return a(new R(d,b.Vb.C(c)))})};R.prototype.forEach=R.prototype.forEach;R.prototype.Eb=function(){A("Firebase.DataSnapshot.hasChildren",0,0,arguments.length);return this.u.J()?o:!this.u.f()};R.prototype.hasChildren=R.prototype.Eb;
R.prototype.name=function(){A("Firebase.DataSnapshot.name",0,0,arguments.length);return this.Vb.name()};R.prototype.name=R.prototype.name;R.prototype.Hb=function(){A("Firebase.DataSnapshot.numChildren",0,0,arguments.length);return this.u.Hb()};R.prototype.numChildren=R.prototype.Hb;R.prototype.wd=function(){A("Firebase.DataSnapshot.ref",0,0,arguments.length);return this.Vb};R.prototype.ref=R.prototype.wd;function fc(a){this.sc=a;this.Qb=[];this.Oa=0;this.ic=-1;this.Ga=l};function S(a,b){for(var c in a)b.call(j,a[c],c,a)}function gc(a){var b={},c;for(c in a)b[c]=a[c];return b};function hc(){this.$a={}}function ic(a,b,c){s(c)||(c=1);D(a.$a,b)||(a.$a[b]=0);a.$a[b]+=c}hc.prototype.get=function(){return gc(this.$a)};function jc(a){this.jd=a;this.Fb=l}jc.prototype.get=function(){var a=this.jd.get(),b=gc(a);if(this.Fb)for(var c in this.Fb)b[c]-=this.Fb[c];this.Fb=a;return b};function kc(a,b){this.ad={};this.$b=new jc(a);this.n=b;setTimeout(u(this.Uc,this),10+6E4*Math.random())}kc.prototype.Uc=function(){var a=this.$b.get(),b={},c=o,d;for(d in a)0<a[d]&&D(this.ad,d)&&(b[d]=a[d],c=k);c&&(a=this.n,a.S&&(b={c:b},a.e("reportStats",b),a.ya("s",b)));setTimeout(u(this.Uc,this),6E5*Math.random())};var lc={},mc={};function nc(a){a=a.toString();lc[a]||(lc[a]=new hc);return lc[a]};var oc=l;"undefined"!==typeof MozWebSocket?oc=MozWebSocket:"undefined"!==typeof WebSocket&&(oc=WebSocket);function pc(a,b,c){this.jc=a;this.e=Sb(this.jc);this.frames=this.gb=l;this.zc=0;this.$=nc(b);this.Na=(b.Yb?"wss://":"ws://")+b.aa+"/.ws?v=5";b.host!==b.aa&&(this.Na=this.Na+"&ns="+b.jb);c&&(this.Na=this.Na+"&s="+c)}var qc;
pc.prototype.open=function(a,b){this.da=b;this.Mb=a;this.e("websocket connecting to "+this.Na);this.U=new oc(this.Na);this.ab=o;var c=this;this.U.onopen=function(){c.e("Websocket connected.");c.ab=k};this.U.onclose=function(){c.e("Websocket connection was disconnected.");c.U=l;c.Ha()};this.U.onmessage=function(a){if(c.U!==l)if(a=a.data,ic(c.$,"bytes_received",a.length),rc(c),c.frames!==l)sc(c,a);else{a:{z(c.frames===l,"We already have a frame buffer");if(4>=a.length){var b=Number(a);if(!isNaN(b)){c.zc=
b;c.frames=[];a=l;break a}}c.zc=1;c.frames=[]}a!==l&&sc(c,a)}};this.U.onerror=function(){c.e("WebSocket error.  Closing connection.");c.Ha()}};pc.prototype.start=function(){};pc.isAvailable=function(){return!("undefined"!==typeof navigator&&"Opera"===navigator.appName)&&oc!==l&&!qc};function sc(a,b){a.frames.push(b);if(a.frames.length==a.zc){var c=a.frames.join("");a.frames=l;c="undefined"!==typeof JSON&&s(JSON.parse)?JSON.parse(c):la(c);a.Mb(c)}}
pc.prototype.send=function(a){rc(this);a=y(a);ic(this.$,"bytes_sent",a.length);a=Zb(a,16384);1<a.length&&this.U.send(String(a.length));for(var b=0;b<a.length;b++)this.U.send(a[b])};pc.prototype.xb=function(){this.Ea=k;this.gb&&(clearTimeout(this.gb),this.gb=l);this.U&&(this.U.close(),this.U=l)};pc.prototype.Ha=function(){this.Ea||(this.e("WebSocket is closing itself"),this.xb(),this.da&&(this.da(this.ab),this.da=l))};pc.prototype.close=function(){this.Ea||(this.e("WebSocket is being closed"),this.xb())};
function rc(a){clearTimeout(a.gb);a.gb=setInterval(function(){a.U.send("0");rc(a)},45E3)};function tc(){this.set={}}r=tc.prototype;r.add=function(a,b){this.set[a]=b!==l?b:k};r.contains=function(a){return D(this.set,a)};r.get=function(a){return this.set[a]};r.remove=function(a){delete this.set[a]};r.f=function(){var a;a:{for(a in this.set){a=o;break a}a=k}return a};r.count=function(){var a=0,b;for(b in this.set)a++;return a};r.keys=function(){var a=[],b;for(b in this.set)D(this.set,b)&&a.push(b);return a};var uc="pLPCommand",vc="pRTLPCB";function wc(a,b,c){this.jc=a;this.e=Sb(a);this.Hd=b;this.$=nc(b);this.Zb=c;this.ab=o;this.Ab=function(a){b.host!==b.aa&&(a.ns=b.jb);var c=[],f;for(f in a)a.hasOwnProperty(f)&&c.push(f+"="+a[f]);return(b.Yb?"https://":"http://")+b.aa+"/.lp?"+c.join("&")}}var xc,yc;
wc.prototype.open=function(a,b){function c(){if(!d.Ea){d.ea=new zc(function(a,b,c,e,f){ic(d.$,"bytes_received",y(arguments).length);if(d.ea)if(d.Ba&&(clearTimeout(d.Ba),d.Ba=l),d.ab=k,"start"==a)d.id=b,d.Tc=c;else if("close"===a)if(b){d.ea.Zc=o;var h=d.Pc;h.ic=b;h.Ga=function(){d.Ha()};h.ic<h.Oa&&(h.Ga(),h.Ga=l)}else d.Ha();else g(Error("Unrecognized command received: "+a))},function(a,b){ic(d.$,"bytes_received",y(arguments).length);var c=d.Pc;for(c.Qb[a]=b;c.Qb[c.Oa];){var e=c.Qb[c.Oa];delete c.Qb[c.Oa];
for(var f=0;f<e.length;++f)e[f]&&c.sc(e[f]);if(c.Oa===c.ic){c.Ga&&(clearTimeout(c.Ga),c.Ga(),c.Ga=l);break}c.Oa++}},function(){d.Ha()},d.Ab);var a={start:"t"};a.ser=Math.floor(1E8*Math.random());d.ea.cc&&(a.cb=d.ea.cc);a.v="5";d.Zb&&(a.s=d.Zb);a=d.Ab(a);d.e("Connecting via long-poll to "+a);Ac(d.ea,a,function(){})}}this.Ec=0;this.va=b;this.Pc=new fc(a);this.Ea=o;var d=this;this.Ba=setTimeout(function(){d.e("Timed out trying to connect.");d.Ha();d.Ba=l},3E4);if("complete"===document.readyState)c();
else{var e=o,f=function(){document.body?e||(e=k,c()):setTimeout(f,10)};document.addEventListener?(document.addEventListener("DOMContentLoaded",f,o),window.addEventListener("load",f,o)):document.attachEvent&&(document.attachEvent("onreadystatechange",function(){"complete"===document.readyState&&f()},o),window.attachEvent("onload",f,o))}};
wc.prototype.start=function(){var a=this.ea,b=this.Tc;a.td=this.id;a.ud=b;for(a.fc=k;Bc(a););a=this.id;b=this.Tc;this.Ta=document.createElement("iframe");var c={dframe:"t"};c.id=a;c.pw=b;a=this.Ab(c);this.Ta.src=a;this.Ta.style.display="none";document.body.appendChild(this.Ta)};wc.isAvailable=function(){return!yc&&(xc||k)};wc.prototype.xb=function(){this.Ea=k;this.ea&&(this.ea.close(),this.ea=l);this.Ta&&(document.body.removeChild(this.Ta),this.Ta=l);this.Ba&&(clearTimeout(this.Ba),this.Ba=l)};
wc.prototype.Ha=function(){this.Ea||(this.e("Longpoll is closing itself"),this.xb(),this.va&&(this.va(this.ab),this.va=l))};wc.prototype.close=function(){this.Ea||(this.e("Longpoll is being closed."),this.xb())};wc.prototype.send=function(a){a=y(a);ic(this.$,"bytes_sent",a.length);for(var a=ra(a),a=Ib(a,k),a=Zb(a,1840),b=0;b<a.length;b++){var c=this.ea;c.qb.push({Ad:this.Ec,Gd:a.length,Fc:a[b]});c.fc&&Bc(c);this.Ec++}};
function zc(a,b,c,d){this.Ab=d;this.da=c;this.tc=new tc;this.qb=[];this.kc=Math.floor(1E8*Math.random());this.Zc=k;this.cc=Jb();window[uc+this.cc]=a;window[vc+this.cc]=b;a=document.createElement("iframe");a.style.display="none";document.body?document.body.appendChild(a):g("Document body has not initialized. Wait to initialize Firebase until after the document is ready.");a.contentDocument?a.qa=a.contentDocument:a.contentWindow?a.qa=a.contentWindow.document:a.document&&(a.qa=a.document);this.ca=a;
try{this.ca.qa.open(),this.ca.qa.write("<html><body></body></html>"),this.ca.qa.close()}catch(e){Pb("frame writing exception"),e.stack&&Pb(e.stack),Pb(e)}}zc.prototype.close=function(){this.fc=o;if(this.ca){this.ca.qa.body.innerHTML="";var a=this;setTimeout(function(){a.ca!==l&&(document.body.removeChild(a.ca),a.ca=l)},0)}var b=this.da;b&&(this.da=l,b())};
function Bc(a){if(a.fc&&a.Zc&&a.tc.count()<(0<a.qb.length?2:1)){a.kc++;var b={};b.id=a.td;b.pw=a.ud;b.ser=a.kc;for(var b=a.Ab(b),c="",d=0;0<a.qb.length;)if(1870>=a.qb[0].Fc.length+30+c.length){var e=a.qb.shift(),c=c+"&seg"+d+"="+e.Ad+"&ts"+d+"="+e.Gd+"&d"+d+"="+e.Fc;d++}else break;var b=b+c,f=a.kc;a.tc.add(f);var h=function(){a.tc.remove(f);Bc(a)},i=setTimeout(h,25E3);Ac(a,b,function(){clearTimeout(i);h()});return k}return o}
function Ac(a,b,c){setTimeout(function(){try{var d=a.ca.qa.createElement("script");d.type="text/javascript";d.async=k;d.src=b;d.onload=d.onreadystatechange=function(){var a=d.readyState;if(!a||"loaded"===a||"complete"===a)d.onload=d.onreadystatechange=l,d.parentNode&&d.parentNode.removeChild(d),c()};d.onerror=function(){Pb("Long-poll script failed to load.");a.close()};a.ca.qa.body.appendChild(d)}catch(e){}},1)};function Cc(){function a(a,c){c&&c.isAvailable()&&b.push(c)}var b=[],c=Dc;if("array"==ea(c))for(var d=0;d<c.length;++d)a(0,c[d]);else S(c,a);this.bc=b}var Dc=[wc,{isAvailable:p(o)},pc];function Ec(a,b,c,d,e,f){this.id=a;this.e=Sb("c:"+this.id+":");this.sc=c;this.mb=d;this.va=e;this.rc=f;this.M=b;this.Pb=[];this.Dc=0;this.Bc=new Cc;this.ma=0;this.e("Connection created");Fc(this)}function Fc(a){var b;var c=a.Bc;0<c.bc.length?b=c.bc[0]:g(Error("No transports available"));a.G=new b("c:"+a.id+":"+a.Dc++,a.M);var d=Gc(a,a.G),e=Hc(a,a.G);a.yb=a.G;a.vb=a.G;a.w=l;setTimeout(function(){a.G&&a.G.open(d,e)},0)}
function Hc(a,b){return function(c){b===a.G?(a.G=l,!c&&0===a.ma?(a.e("Realtime connection failed."),"s-"===a.M.aa.substr(0,2)&&(N.removeItem(a.M.jb),a.M.aa=a.M.host)):1===a.ma&&a.e("Realtime connection lost."),a.close()):b===a.w?(c=a.w,a.w=l,(a.yb===c||a.vb===c)&&a.close()):a.e("closing an old connection")}}
function Gc(a,b){return function(c){if(2!=a.ma)if(b===a.vb){var d=Xb("t",c),c=Xb("d",c);if("c"==d){if(d=Xb("t",c),"d"in c)if(c=c.d,"h"===d){var d=c.ts,e=c.v,f=c.h;a.Zb=c.s;tb(a.M,f);if(0==a.ma&&(a.G.start(),c=a.G,a.e("Realtime connection established."),a.G=c,a.ma=1,a.mb&&(a.mb(d),a.mb=l),"5"!==e&&Vb("Protocol version mismatch detected"),c=1<a.Bc.bc.length?a.Bc.bc[1]:l))a.w=new c("c:"+a.id+":"+a.Dc++,a.M,a.Zb),a.w.open(Gc(a,a.w),Hc(a,a.w))}else if("n"===d){a.e("recvd end transmission on primary");
a.vb=a.w;for(c=0;c<a.Pb.length;++c)a.Kb(a.Pb[c]);a.Pb=[];Ic(a)}else"s"===d?(a.e("Connection shutdown command received. Shutting down..."),a.rc&&(a.rc(c),a.rc=l),a.va=l,a.close()):"r"===d?(a.e("Reset packet received.  New host: "+c),tb(a.M,c),1===a.ma?a.close():(Jc(a),Fc(a))):Tb("Unknown control packet command: "+d)}else"d"==d&&a.Kb(c)}else b===a.w?(d=Xb("t",c),c=Xb("d",c),"c"==d?"t"in c&&(c=c.t,"a"===c?(a.w.start(),a.e("sending client ack on secondary"),a.w.send({t:"c",d:{t:"a",d:{}}}),a.e("Ending transmission on primary"),
a.G.send({t:"c",d:{t:"n",d:{}}}),a.yb=a.w,Ic(a)):"r"===c&&(a.e("Got a reset on secondary, closing it"),a.w.close(),(a.yb===a.w||a.vb===a.w)&&a.close())):"d"==d?a.Pb.push(c):g(Error("Unknown protocol layer: "+d))):a.e("message on old connection")}}Ec.prototype.wc=function(a){a={t:"d",d:a};1!==this.ma&&g("Connection is not connected");this.yb.send(a)};function Ic(a){a.yb===a.w&&a.vb===a.w&&(a.e("cleaning up and promoting a connection: "+a.w.jc),a.G=a.w,a.w=l)}Ec.prototype.Kb=function(a){this.sc(a)};
Ec.prototype.close=function(){2!==this.ma&&(this.e("Closing realtime connection."),this.ma=2,Jc(this),this.va&&(this.va(),this.va=l))};function Jc(a){a.e("Shutting down all connections");a.G&&(a.G.close(),a.G=l);a.w&&(a.w.close(),a.w=l)};function Kc(a,b,c,d){this.id=Lc++;this.e=Sb("p:"+this.id+":");this.wb=k;this.ba={};this.O=[];this.nb=0;this.lb=[];this.S=o;this.Ub=1E3;this.Lb=b||da;this.Jb=c||da;this.kb=d||da;this.M=a;this.vc=l;this.Rb=[];this.xa={};this.zd=0;this.hb=this.Oc=l;setTimeout(u(this.Gc,this),0)}var Lc=0,Mc=0;r=Kc.prototype;
r.ya=function(a,b,c,d){var e=++this.zd,a={r:e,a:a,b:b};this.e(y(a));this.S?this.sb.wc(a):this.Rb.push(a);var f=this,a=setTimeout(function(){var a=f.xa[e];a&&(delete f.xa[e],a.ha&&a.ha.Nb&&a.ha.Nb())},45E3);this.xa[e]={ha:{Mb:c,Nb:d},bd:a}};function Nc(a,b,c,d,e){a.e("Listen on "+b+" for "+c);var f={p:b},d=mb(d,function(a){return Ja(a)});"{}"!==c&&(f.q=d);a.ya("l",f,function(d){a.e("listen response",d);d=d.s;"ok"!==d&&Oc(a,b,c);e&&e(d)},function(){a.e("timed out on listen...")})}
r.Za=function(a,b,c){this.Ca={kd:a,Ic:o,fa:b,Cb:c};this.e("Authenticating using credential: "+this.Ca);Pc(this)};r.zb=function(){delete this.Ca;this.kb(o);this.S&&this.ya("unauth",{},function(){},function(){})};function Pc(a){var b=a.Ca;a.S&&b&&a.ya("auth",{cred:b.kd},function(c){var d=c.s,c=c.d||"error";"ok"!==d&&a.Ca===b&&delete a.Ca;b.Ic?"ok"!==d&&b.Cb&&b.Cb(d,c):(b.Ic=k,b.fa&&b.fa(d,c));a.kb("ok"===d)},function(){a.e("timed out on auth...")})}
r.dd=function(a,b,c){a=a.toString();if(Oc(this,a,b)&&this.S){this.e("Unlisten on "+a+" for "+b);var d=this,a={p:a},c=mb(c,function(a){return Ja(a)});"{}"!==b&&(a.q=c);this.ya("u",a,l,function(){d.e("timed out on unlisten...")})}};function Qc(a,b,c,d){a.S?Rc(a,"o",b,c,d):a.lb.push({uc:b,action:"o",data:c,A:d})}r.qc=function(a,b){this.S?Rc(this,"oc",a,l,b):this.lb.push({uc:a,action:"oc",data:l,A:b})};
function Rc(a,b,c,d,e){c={p:c,d:d};a.e("onDisconnect "+b,c);a.ya(b,c,function(a){e&&setTimeout(function(){e(a.s)},0)},function(){a.e("timed out on onDisconnect...")})}r.put=function(a,b,c,d){Sc(this,"p",a,b,c,d)};function Sc(a,b,c,d,e,f){c={p:c,d:d};s(f)&&(c.h=f);a.O.push({action:b,Vc:c,A:e});a.nb++;b=a.O.length-1;a.S&&Tc(a,b)}
function Tc(a,b){var c=a.O[b].action,d=a.O[b].A;a.ya(c,a.O[b].Vc,function(e){a.e(c+" response",e);delete a.O[b];a.nb--;0===a.nb&&(a.O=[]);d&&d(e.s)},function(){a.e("timed out on put...")})}
r.Kb=function(a){if("r"in a){this.e("from server: "+y(a));var b=a.r,c=this.xa[b];c&&(delete this.xa[b],clearTimeout(c.bd),c.ha&&c.ha.Mb&&c.ha.Mb(a.b))}else"error"in a&&g("A server-side error has occurred: "+a.error),"a"in a&&(b=a.a,a=a.b,this.e("handleServerMessage",b,a),"d"===b?this.Lb(a.p,a.d):"m"===b?this.Lb(a.p,a.d,k):"c"===b?(b=a.p,a=(a=a.q)?mb(a,function(a){return Ka(a)}).join("$"):"{}",(a=Oc(this,b,a))&&a.A&&a.A("permission_denied")):"ac"===b?(b=a.s,a=a.d,c=this.Ca,delete this.Ca,c&&c.Cb&&
c.Cb(b,a),this.kb(o)):"sd"===b?this.vc?this.vc(a):"msg"in a&&"undefined"!==typeof console&&console.log("FIREBASE: "+a.msg.replace("\n","\nFIREBASE: ")):Tb("Unrecognized action received from server: "+y(b)+"\nAre you using the latest client?"))};
r.mb=function(a){this.e("connection ready");this.S=k;this.hb=(new Date).getTime();Yb=a-(new Date).getTime();for(a=0;a<this.Rb.length;a++)this.sb.wc(this.Rb[a]);this.Rb=[];Pc(this);for(a=0;a<this.O.length;a++)this.O[a]&&Tc(this,a);for(var b in this.ba)for(var c in this.ba[b])a=this.ba[b][c],Nc(this,b,c,a.Va,a.A);for(;this.lb.length;)b=this.lb.shift(),Rc(this,b.action,b.uc,b.data,b.A);this.Jb(k)};
r.Rc=function(){this.S=o;this.e("data client disconnected");var a=u(function(){this.Gc()},this);if(this.wb){this.hb&&(3E4<(new Date).getTime()-this.hb&&(this.Ub=1E3),this.hb=l);var b=Math.max(0,this.Ub-((new Date).getTime()-this.Oc)),b=Math.random()*b;this.e("Trying to reconnect in "+b+"ms");setTimeout(a,b);this.Ub=Math.min(3E5,1.5*this.Ub)}else{for(var c=0;c<this.O.length;c++){var d=this.O[c];d&&"h"in d.Vc&&(d.A&&d.A("disconnect"),delete this.O[c],this.nb--)}0===this.nb&&(this.O=[]);for(b in this.xa)c=
this.xa[b],delete this.xa[b],c!==l&&(c.ha&&c.ha.Nb&&c.ha.Nb(),clearTimeout(c.bd));this.Xc=function(){setTimeout(a,0)}}this.Jb(o)};r.Gc=function(){if(this.wb){this.e("Making a connection attempt");this.Oc=(new Date).getTime();this.hb=l;var a=u(this.Kb,this),b=u(this.mb,this),c=u(this.Rc,this),d=this.id+":"+Mc++,e=this;this.sb=new Ec(d,this.M,a,b,c,function(a){e.wb=o;g(Error(a))})}};r.Ra=function(){this.wb=o;this.sb?this.sb.close():this.Rc()};r.ub=function(){this.wb=k;this.Xc();this.Xc=j};
function Oc(a,b,c){b=(new I(b)).toString();c||(c="{}");var d=a.ba[b][c];delete a.ba[b][c];return d};function Uc(){this.Ka=O}function T(a,b){return a.Ka.F(b)}function U(a,b,c){a.Ka=a.Ka.Ya(b,c)}Uc.prototype.toString=function(){return this.Ka.toString()};function Vc(){this.za=new Uc;this.K=new Uc;this.Aa=new Uc;this.pb=new Ra}function Wc(a,b){for(var c=T(a.za,b),d=T(a.K,b),e=J(a.pb,b),f=o,h=e;h!==l;){if(h.j()!==l){f=k;break}h=h.parent()}if(f)return o;c=Xc(c,d,e);return c!==d?(U(a.K,b,c),k):o}function Xc(a,b,c){if(c.f())return a;if(c.j()!==l)return b;a=a||O;c.B(function(d){var d=d.name(),e=a.N(d),f=b.N(d),h=J(c,d),e=Xc(e,f,h);a=a.D(d,e)});return a}
Vc.prototype.set=function(a,b){var c=this,d=[];lb(b,function(a){var b=a.path,a=a.Fa,h=Jb();M(J(c.pb,b),h);U(c.K,b,a);d.push({path:b,Bd:h})});return d};function Yc(a,b){lb(b,function(b){var d=b.Bd,b=J(a.pb,b.path),e=b.j();z(e!==l,"pendingPut should not be null.");e===d&&M(b,l)})};function Zc(){this.Da=[]}function $c(a,b){if(0!==b.length){a.Da.push.apply(a.Da,b);for(var c=0;c<a.Da.length;c++)if(a.Da[c]){var d=a.Da[c];a.Da[c]=l;var e=d.fa;e(d.$c,d.rb)}a.Da=[]}};function V(a,b,c,d){this.type=a;this.ja=b;this.V=c;this.rb=d};function ad(a){this.I=a;this.ga=[];this.Hc=new Zc}function bd(a,b,c,d,e){a.ga.push({type:b,fa:c,cancel:d,W:e});var d=[],f=cd(a.g);a.fb&&f.push(new V("value",a.g));for(var h=0;h<f.length;h++)if(f[h].type===b){var i=new W(a.I.o,a.I.path);f[h].V&&(i=i.C(f[h].V));d.push({fa:e?u(c,e):c,$c:new R(f[h].ja,i),rb:f[h].rb})}$c(a.Hc,d)}ad.prototype.Sb=function(a,b){b=this.Tb(a,b);b!=l&&fd(this,b)};
function fd(a,b){for(var c=[],d=0;d<b.length;d++){var e=b[d],f=e.type,h=new W(a.I.o,a.I.path);b[d].V&&(h=h.C(b[d].V));h=new R(b[d].ja,h);"value"===e.type&&!h.Eb()?f+="("+h.P()+")":"value"!==e.type&&(f+=" "+h.name());Pb(a.I.o.n.id+": event:"+a.I.path+":"+a.I.Ia()+":"+f);for(f=0;f<a.ga.length;f++){var i=a.ga[f];b[d].type===i.type&&c.push({fa:i.W?u(i.fa,i.W):i.fa,$c:h,rb:e.rb})}}$c(a.Hc,c)}
function cd(a){var b=[];if(!a.J()){var c=l;a.B(function(a,e){b.push(new V("child_added",e,a,c));c=a})}return b}function gd(a){a.fb||(a.fb=k,fd(a,[new V("value",a.g)]))};function hd(a,b){ad.call(this,a);this.g=b}ka(hd,ad);hd.prototype.Tb=function(a,b){this.g=a;this.fb&&b!=l&&b.push(new V("value",this.g));return b};hd.prototype.bb=function(){return{}};function id(a,b){this.Db=a;this.pc=b}
function jd(a,b,c,d,e){var f=a.F(c),h=b.F(c),d=new id(d,e),e=kd(d,c,f,h),i=o;if(!f.f()&&!h.f()&&f.k()!==h.k())var i=a.F(c.parent()),m=b.F(c.parent()),n=Ma(c),i=i.T(n,f)!=m.T(n,h);if(e||i){f=c;c=e;for(h=i;f.parent()!==l;){var q=a.F(f),e=b.F(f),i=f.parent();if(!d.Db||J(d.Db,i).j())m=b.F(i),n=[],f=Ma(f),q.f()?(q=m.T(f,e),n.push(new V("child_added",e,f,q))):e.f()?n.push(new V("child_removed",q,f)):(q=m.T(f,e),h&&n.push(new V("child_moved",e,f,q)),c&&n.push(new V("child_changed",e,f,q))),d.pc(i,m,n);h&&
(h=o,c=k);f=i}}}function kd(a,b,c,d){var e,f=[];c===d?e=o:c.J()&&d.J()?e=c.j()!==d.j():c.J()?(ld(a,b,O,d,f),e=k):d.J()?(ld(a,b,c,O,f),e=k):e=ld(a,b,c,d,f);e?a.pc(b,d,f):c.k()!==d.k()&&a.pc(b,d,l);return e}
function ld(a,b,c,d,e){var f=o,h=!a.Db||!J(a.Db,b).f(),i=[],m=[],n=[],q=[],x={},v={},w,L,K,H;w=c.Qa();K=$a(w);L=d.Qa();for(H=$a(L);K!==l||H!==l;){c=K===l?1:H===l?-1:K.key===H.key?0:ec({name:K.key,wa:K.value.k()},{name:H.key,wa:H.value.k()});if(0>c)f=ua(x,K.key),s(f)?(n.push({Jc:K,cd:i[f]}),i[f]=l):(v[K.key]=m.length,m.push(K)),f=k,K=$a(w);else{if(0<c)f=ua(v,H.key),s(f)?(n.push({Jc:m[f],cd:H}),m[f]=l):(x[H.key]=i.length,i.push(H)),f=k;else{c=b.C(H.key);if(c=kd(a,c,K.value,H.value))q.push(H),f=k;K=
$a(w)}H=$a(L)}if(!h&&f)return k}for(h=0;h<m.length;h++)if(x=m[h])c=b.C(x.key),kd(a,c,x.value,O),e.push(new V("child_removed",x.value,x.key));for(h=0;h<i.length;h++)if(x=i[h])c=b.C(x.key),m=d.T(x.key,x.value),kd(a,c,O,x.value),e.push(new V("child_added",x.value,x.key,m));for(h=0;h<n.length;h++)x=n[h].Jc,i=n[h].cd,c=b.C(i.key),m=d.T(i.key,i.value),e.push(new V("child_moved",i.value,i.key,m)),(c=kd(a,c,x.value,i.value))&&q.push(i);for(h=0;h<q.length;h++)a=q[h],m=d.T(a.key,a.value),e.push(new V("child_changed",
a.value,a.key,m));return f};function md(){this.L=this.na=l;this.set={}}ka(md,tc);r=md.prototype;r.setActive=function(a){this.na=a};function nd(a){return a.contains("default")}function od(a){return a.na!=l&&nd(a)}r.defaultView=function(){return nd(this)?this.get("default"):l};r.path=aa("L");r.toString=function(){return mb(this.keys(),function(a){return"default"===a?"{}":a}).join("$")};r.Va=function(){var a=[];S(this.set,function(b){a.push(b.I)});return a};function pd(a,b){ad.call(this,a);this.g=O;this.Tb(b,cd(b))}ka(pd,ad);
pd.prototype.Tb=function(a,b){if(b===l)return b;var c=[],d=this.I;s(d.Z)&&(s(d.la)&&d.la!=l?c.push(function(a,b){var c=Wb(b,d.Z);return 0<c||0===c&&a>=d.la}):c.push(function(a,b){return 0<=Wb(b,d.Z)}));s(d.ra)&&(s(d.Pa)?c.push(function(a,b){var c=Wb(b,d.ra);return 0>c||0===c&&a<=d.Pa}):c.push(function(a,b){return 0>=Wb(b,d.ra)}));var e=l,f=l;if(s(this.I.ta))if(s(this.I.Z)){if(e=qd(a,c,this.I.ta,o)){var h=a.N(e).k();c.push(function(a,b){var c=Wb(b,h);return 0>c||0===c&&a<=e})}}else if(f=qd(a,c,this.I.ta,
k)){var i=a.N(f).k();c.push(function(a,b){var c=Wb(b,i);return 0<c||0===c&&a>=f})}for(var m=[],n=[],q=[],x=[],v=0;v<b.length;v++){var w=b[v].V,L=b[v].ja;switch(b[v].type){case "child_added":rd(c,w,L)&&(this.g=this.g.D(w,L),n.push(b[v]));break;case "child_removed":this.g.N(w).f()||(this.g=this.g.D(w,l),m.push(b[v]));break;case "child_changed":!this.g.N(w).f()&&rd(c,w,L)&&(this.g=this.g.D(w,L),x.push(b[v]));break;case "child_moved":var K=!this.g.N(w).f(),H=rd(c,w,L);K?H?(this.g=this.g.D(w,L),q.push(b[v])):
(m.push(new V("child_removed",this.g.N(w),w)),this.g=this.g.D(w,l)):H&&(this.g=this.g.D(w,L),n.push(b[v]))}}var dd=e||f;if(dd){var ed=(v=f!==l)?this.g.Kc():this.g.Lc(),Rb=o,Pa=o,Qa=this;(v?a.lc:a.B).call(a,function(a,b){!Pa&&ed===l&&(Pa=k);if(Pa&&Rb)return k;Rb?(m.push(new V("child_removed",Qa.g.N(a),a)),Qa.g=Qa.g.D(a,l)):Pa&&(n.push(new V("child_added",b,a)),Qa.g=Qa.g.D(a,b));ed===a&&(Pa=k);a===dd&&(Rb=k)})}for(v=0;v<n.length;v++)c=n[v],w=this.g.T(c.V,c.ja),m.push(new V("child_added",c.ja,c.V,w));
for(v=0;v<q.length;v++)c=q[v],w=this.g.T(c.V,c.ja),m.push(new V("child_moved",c.ja,c.V,w));for(v=0;v<x.length;v++)c=x[v],w=this.g.T(c.V,c.ja),m.push(new V("child_changed",c.ja,c.V,w));this.fb&&0<m.length&&m.push(new V("value",this.g));return m};function qd(a,b,c,d){if(a.J())return l;var e=l;(d?a.lc:a.B).call(a,function(a,d){if(rd(b,a,d)&&(e=a,c--,0===c))return k});return e}function rd(a,b,c){for(var d=0;d<a.length;d++)if(!a[d](b,c.k()))return o;return k}
pd.prototype.mc=function(a){return this.g.N(a)!==O};pd.prototype.bb=function(a,b,c){var d={};this.g.J()||this.g.B(function(a){d[a]=k});var e=this.g,c=T(c,new I("")),f=new Ra;M(J(f,this.I.path),k);var h=O.Ya(a,b),i=[];jd(c,h,a,f,function(a,b,c){c!==l&&(i=i.concat(c))});this.Tb(b,i);this.g.J()||this.g.B(function(a){d[a]=k});this.g=e;return d};function sd(a,b){this.n=a;this.i=b;this.Qc=b.Ka;this.pa=new Ra}
sd.prototype.Bb=function(a,b,c,d,e){var f=a.path,h=J(this.pa,f),i=h.j();i===l?(i=new md,M(h,i)):z(!i.f(),"We shouldn't be storing empty QueryMaps");var m=a.Ia();if(i.contains(m))bd(i.get(m),b,c,d,e);else{var n=this.i.Ka.F(f),a="default"===a.Ia()?new hd(a,n):new pd(a,n);if(od(i)||td(h))i.add(m,a),i.L||(i.L=a.I.path);else{var q,x;i.f()||(q=i.toString(),x=i.Va());i.add(m,a);i.L||(i.L=a.I.path);i.setActive(ud(this,i));q&&x&&this.n.dd(i.path(),q,x)}od(i)&&Ta(h,function(a){if(a=a.j()){a.na&&a.na();a.na=
l}});bd(a,b,c,d,e);(b=(b=Ua(J(this.pa,f),function(a){var b;if(b=a.j())if(b=a.j().defaultView())b=a.j().defaultView().fb;if(b)return k},k))||this.n===l)&&gd(a)}};function vd(a,b,c,d,e){for(var f=a.get(b),h=o,i=f.ga.length-1;0<=i;i--){var m=f.ga[i];if((!c||m.type===c)&&(!d||m.fa===d)&&(!e||m.W===e))if(f.ga.splice(i,1),h=k,c&&d)break}(c=h&&!(0<f.ga.length))&&a.remove(b);return c}sd.prototype.Wb=function(a,b,c,d){var e=J(this.pa,a.path).j();return e===l?l:wd(this,e,a,b,c,d)};
function wd(a,b,c,d,e,f){var h=b.path(),h=J(a.pa,h),c=c?c.Ia():l,i=[];c&&"default"!==c?vd(b,c,d,e,f)&&i.push(c):lb(b.keys(),function(a){vd(b,a,d,e,f)&&i.push(a)});b.f()&&M(h,l);c=td(h);if(0<i.length&&!c){for(var m=h,n=h.parent(),c=o;!c&&n;){var q=n.j();if(q){z(!od(q));var x=m.name(),v=o;S(q.set,function(a){v=a.mc(x)||v});v&&(c=k)}m=n;n=n.parent()}m=l;if(!od(b)){n=b.na;b.na=l;var w=[],L=function(b){var c=b.j();c&&nd(c)?(w.push(c.path()),c.na==l&&c.setActive(ud(a,c))):(c&&c.na==l&&c.setActive(ud(a,
c)),b.B(L))};L(h);m=w;n&&n()}return c?l:m}return l}function xd(a,b,c){Ta(J(a.pa,b),function(a){(a=a.j())&&S(a.set,function(a){gd(a)})},c,k)}function yd(a,b,c){function d(a){for(var b=0;b<c.length;++b)if(c[b].contains(a))return k;return o}var e=a.Qc,f=a.i.Ka;a.Qc=f;jd(e,f,b,a.pa,function(c,e,f){if(b.contains(c)){var n=d(c);n&&xd(a,c,o);a.Sb(c,e,f);n&&xd(a,c,k)}else a.Sb(c,e,f)});d(b)&&xd(a,b,k)}sd.prototype.Sb=function(a,b,c){a=J(this.pa,a).j();a!==l&&S(a.set,function(a){a.Sb(b,c)})};
function td(a){return Ua(a,function(a){return a.j()&&od(a.j())})}
function ud(a,b){if(a.n){var c=b.keys(),d=a.n,e=function(d){"ok"!==d?(Vb("on() or once() for "+b.path().toString()+" failed: "+d),b&&S(b.set,function(a){for(var b=0;b<a.ga.length;b++){var c=a.ga[b];c.cancel&&(c.W?u(c.cancel,c.W):c.cancel)()}}),wd(a,b)):lb(c,function(a){(a=b.get(a))&&gd(a)})},f=b.toString(),h=b.path().toString();d.ba[h]=d.ba[h]||{};z(!d.ba[h][f],"listen() called twice for same path/queryId.");d.ba[h][f]={Va:b.Va(),A:e};d.S&&Nc(d,h,f,b.Va(),e);return u(a.n.dd,a.n,b.path(),b.toString(),
b.Va())}return da}sd.prototype.bb=function(a,b,c,d){var e={};S(b.set,function(b){b=b.bb(a,c,d);S(b,function(a,b){e[b]=a?k:ua(e,b)||o})});c.J()||c.B(function(a){D(e,a)||(e[a]=o)});return e};
function zd(a,b,c,d,e,f){var h=b.path();if(f!==l){var i=[];d.J()||d.B(function(a,b){i.push({path:h.C(a),Fa:b});delete f[a]});S(f,function(a,b){i.push({path:h.C(b),Fa:O})});return i}var b=a.bb(h,b,d,e),m=O,n=[];S(b,function(b,f){var h=new I(f);b?m=m.D(f,d.F(h)):n=n.concat(Ad(a,d.F(h),J(c,h),e))});return[{path:h,Fa:m}].concat(n)}
function Bd(a,b,c,d,e){for(var f=J(a.pa,b),h=f.parent(),i=o;!i&&h!==l;){var m=h.j();m!==l&&(nd(m)?i=k:(m=a.bb(b,m,c,d),f=f.name(),ua(m,f)&&(i=k)));f=h;h=h.parent()}if(i)return[{path:b,Fa:c}];h=J(a.pa,b);i=h.j();return i!==l?nd(i)?[{path:b,Fa:c}]:zd(a,i,h,c,d,e):Ad(a,c,h,d)}function Ad(a,b,c,d){var e=c.j();if(e!==l)return nd(e)?[{path:c.path(),Fa:b}]:zd(a,e,c,b,d,l);if(b.J())return[];var f=[];b.B(function(b,e){var m=new I(b);f=f.concat(Ad(a,e,J(c,m),d))});return f};function Cd(a){this.M=a;this.$=nc(a);this.n=new Kc(this.M,u(this.Lb,this),u(this.Jb,this),u(this.kb,this));var b=u(function(){return new kc(this.$,this.n)},this),a=a.toString();mc[a]||(mc[a]=b());this.Fd=mc[a];this.ac=new Ra;this.i=new Vc;this.Q=new sd(this.n,this.i.Aa);this.Mc=new Uc;this.nc=new sd(l,this.Mc);Dd(this,"connected",o);Dd(this,"authenticated",o)}r=Cd.prototype;r.toString=function(){return(this.M.Yb?"https://":"http://")+this.M.host};r.name=function(){return this.M.jb};
r.Lb=function(a,b,c){var d=[],e=l;if(9<=a.length&&a.lastIndexOf(".priority")===a.length-9)a=new I(a.substring(0,a.length-9)),c=T(this.i.za,a).ec(b),d.push(a);else if(c){var e=b,a=new I(a),c=T(this.i.za,a),f;for(f in b){var h=Q(b[f]),c=c.D(f,h);d.push(a.C(f))}}else a=new I(a),c=Q(b),d.push(a);b=Bd(this.Q,a,c,this.i.K,e);e=o;for(f=0;f<b.length;++f){var c=b[f],h=this.i,i=c.path;U(h.za,i,c.Fa);e=Wc(h,i)||e}e&&(a=Ed(this,a),Fd(this,a),a=a.path());yd(this.Q,a,d)};r.Jb=function(a){Dd(this,"connected",a)};
r.kb=function(a){Dd(this,"authenticated",a)};function Dd(a,b,c){b=new I("/.info/"+b);U(a.Mc,b,Q(c));yd(a.nc,b,[b])}r.Za=function(a,b,c){this.n.Za(a,function(a,c){X(b,a,c)},function(a,b){Vb("auth() was canceled: "+b);if(c){var f=Error(b);f.code=a.toUpperCase();c(f)}})};r.zb=function(){this.n.zb()};
r.Xa=function(a,b,c,d){this.e("set",{path:a.toString(),value:b});var b=Q(b,c),c=Bd(this.Q,a,b,this.i.K,l),e=this.i.set(a,c),f=this;this.n.put(a.toString(),b.P(k),function(b){var c="ok"===b;Yc(f.i,e);c||(Vb("set at "+a+" failed: "+b),Wc(f.i,a),c=Ed(f,a),Fd(f,c),yd(f.Q,c.path(),[]));X(d,b)});b=Ed(this,a);Gd(this,a);Fd(this,b);yd(this.Q,b.path(),[a])};
r.update=function(a,b,c){this.e("update",{path:a.toString(),value:b});var d=T(this.i.Aa,a),e=k,f=[],h;for(h in b){var e=o,i=Q(b[h]),d=d.D(h,i);f.push(a.C(h))}if(e)Pb("update() called with empty data.  Don't do anything."),X(c,"ok");else{var d=Bd(this.Q,a,d,this.i.K,b),m=this.i.set(a,d),n=this;Sc(this.n,"m",a.toString(),b,function(b){z("ok"===b||"permission_denied"===b,"merge at "+a+" failed.");Yc(n.i,m);X(c,b)},j);b=Ed(this,a);Gd(this,a);Fd(this,b);yd(this.Q,b.path(),f)}};
r.xc=function(a,b,c){this.e("setPriority",{path:a.toString(),wa:b});var d=T(this.i.K,a).ec(b),d=Bd(this.Q,a,d,this.i.K,l),e=this.i.set(a,d),f=this;this.n.put(a.toString()+"/.priority",b,function(a){Yc(f.i,e);X(c,a)});a=Ed(this,a);Fd(this,a);yd(this.Q,a.path(),[])};r.qc=function(a,b){this.n.qc(a.toString(),function(a){X(b,a)})};function Hd(a,b,c,d){c=Q(c);Qc(a.n,b.toString(),c.P(k),function(a){X(d,a)})}function Id(a){ic(a.$,"deprecated_on_disconnect");a.Fd.ad.deprecated_on_disconnect=k}
r.Bb=function(a,b,c,d,e){".info"===F(a.path)?this.nc.Bb(a,b,c,d,e):this.Q.Bb(a,b,c,d,e)};r.Wb=function(a,b,c,d){if(".info"===F(a.path))this.nc.Wb(a,b,c,d);else if(b=this.Q.Wb(a,b,c,d),b!==l){for(var c=this.i,a=a.path,d=[],e=0;e<b.length;++e)d[e]=T(c.za,b[e]);U(c.za,a,O);for(e=0;e<b.length;++e)U(c.za,b[e],d[e])}};r.Ra=function(){this.n.Ra()};r.ub=function(){this.n.ub()};
r.yc=function(a){if("undefined"!==typeof console){a?(this.$b||(this.$b=new jc(this.$)),a=this.$b.get()):a=this.$.get();var b=a,c=[],d=0,e;for(e in b)c[d++]=e;var f=function(a,b){return Math.max(b.length,a)};if(c.reduce)e=c.reduce(f,0);else{var h=0;lb(c,function(a){h=f.call(j,h,a)});e=h}for(var i in a){b=a[i];for(c=i.length;c<e+2;c++)i+=" ";console.log(i+b)}}};r.e=function(){Pb("r:"+this.n.id+":",arguments)};function Jd(a,b){var c=new W(a,b);return new R(T(a.i.Aa,b),c)}
function X(a,b,c){if(a)if("ok"==b)a(l,c);else{var d=b=(b||"error").toUpperCase();c&&(d+=": "+c);c=Error(d);c.code=b;a(c)}};function Gd(a,b){var c=J(a.ac,b);Ua(c,function(b){Kd(a,b)});Kd(a,c);Ta(c,function(b){Kd(a,b)})}function Kd(a,b){var c=b.j();if(c!==l){for(var d=-1,e=[],f=0;f<c.length;f++)if(2===c[f].status)z(d===f-1,"All SENT items should be at beginning of queue."),d=f,c[f].status=4,c[f].Cc="set";else if(c[f].dc(),c[f].A){var h=Jd(a,b.path());e.push(u(c[f].A,l,Error("set"),o,h))}-1===d?M(b,l):c.length=d+1;for(f=0;f<e.length;f++)e[f]()}}
function Ld(a,b){var c=b||a.ac;b||Md(a,c);if(!c.f())if(c.j()!==l){var d=Nd(a,c);if(0!==d.length){var e=c.path();if(2!==d[0].status&&4!==d[0].status){for(var f=0;f<d.length;f++)z(1===d[f].status,"tryToSendTransactionForNode_: items in queue should all be run."),d[f].status=2,d[f].Yc++;var h=T(a.i.K,e).hash();U(a.i.K,e,T(a.i.Aa,e));var i=T(a.i.K,e).P(k),m=Jb();M(J(a.i.pb,e),m);a.n.put(e.toString(),i,function(b){a.e("transaction put response",{path:e.toString(),status:b});var h=J(a.i.pb,e),i=h.j();z(i!==
l,"tryToSendTransactionsForNode_: pendingPut should not be null.");i===m&&(M(h,l),U(a.i.K,e,T(a.i.za,e)));if("ok"===b){b=[];for(f=0;f<d.length;f++)d[f].status=3,d[f].A&&(h=Jd(a,d[f].path),b.push(u(d[f].A,l,l,k,h))),d[f].dc();Md(a,c);Ld(a);for(f=0;f<b.length;f++)b[f]()}else{if("datastale"===b)for(f=0;f<d.length;f++)d[f].status=4===d[f].status?5:1;else{Vb("transaction at "+e+" failed: "+b);for(f=0;f<d.length;f++)d[f].status=5,d[f].Cc=b}b=Ed(a,e);Fd(a,b);yd(a.Q,b.path(),[e])}},h)}}}else c.B(function(b){Ld(a,
b)})}
function Fd(a,b){var c=b.path();U(a.i.Aa,c,T(a.i.K,c));var d=Nd(a,b);if(0!==d.length){for(var e=T(a.i.Aa,c),f=[],h=0;h<d.length;h++){var i=Na(c,d[h].path),m=o,n;z(i!==l,"rerunTransactionsUnderNode_: relativePath should not be null.");if(5===d[h].status)m=k,n=d[h].Cc;else if(1===d[h].status)if(25<=d[h].Yc)m=k,n="maxretry";else{var q=d[h].update(e.F(i).P());s(q)?(Aa("transaction failed: Data returned ",q),e=e.Ya(i,Q(q))):(m=k,n="nodata")}m&&(d[h].dc(),d[h].status=3,d[h].A&&(m=new W(a,d[h].path),i=new R(e.F(i),
m),"nodata"===n?f.push(u(d[h].A,l,l,o,i)):f.push(u(d[h].A,l,Error(n),o,i))))}d=T(a.i.K,c).k();U(a.i.Aa,c,e.ec(d));Ld(a);for(h=0;h<f.length;h++)f[h]()}}function Ed(a,b){for(var c,d=a.ac;(c=F(b))!==l&&d.j()===l;)d=J(d,c),b=La(b);return d}function Nd(a,b){var c=[];Od(a,b,c);c.sort(function(a,b){return a.Sc-b.Sc});return c}function Od(a,b,c){var d=b.j();if(d!==l)for(var e=0;e<d.length;e++)c.push(d[e]);b.B(function(b){Od(a,b,c)})}
function Md(a,b){var c=b.j();if(c){for(var d=0,e=0;e<c.length;e++)3!==c[e].status&&(c[d]=c[e],d++);c.length=d;M(b,0<c.length?c:l)}b.B(function(b){Md(a,b)})};function Y(){this.Wa={}}Y.pd=function(){return Y.Nc?Y.Nc:Y.Nc=new Y};Y.prototype.Ra=function(){for(var a in this.Wa)this.Wa[a].Ra()};Y.prototype.interrupt=Y.prototype.Ra;Y.prototype.ub=function(){for(var a in this.Wa)this.Wa[a].ub()};Y.prototype.resume=Y.prototype.ub;var Z={qd:function(a){var b=P.prototype.hash;P.prototype.hash=a;return function(){P.prototype.hash=b}}};Z.hijackHash=Z.qd;Z.Ia=function(a){return a.Ia()};Z.queryIdentifier=Z.Ia;Z.sd=function(a){return a.o.n.ba};Z.listens=Z.sd;Z.xd=function(a){return a.o.n.sb};Z.refConnection=Z.xd;Z.fd=Kc;Z.DataConnection=Z.fd;Kc.prototype.sendRequest=Kc.prototype.ya;Kc.prototype.interrupt=Kc.prototype.Ra;Z.gd=Ec;Z.RealTimeConnection=Z.gd;Ec.prototype.sendRequest=Ec.prototype.wc;Ec.prototype.close=Ec.prototype.close;
Z.ed=sb;Z.ConnectionTarget=Z.ed;Z.nd=function(){xc=qc=k};Z.forceLongPolling=Z.nd;Z.od=function(){yc=k};Z.forceWebSockets=Z.od;Z.Dd=function(a,b){a.o.n.vc=b};Z.setSecurityDebugCallback=Z.Dd;Z.yc=function(a,b){a.o.yc(b)};Z.stats=Z.yc;function $(a,b,c){this.tb=a;this.L=b;this.ua=c}ca("fb.api.onDisconnect",$);$.prototype.cancel=function(a){A("Firebase.onDisconnect().cancel",0,1,arguments.length);C("Firebase.onDisconnect().cancel",1,a,k);this.tb.qc(this.L,a)};$.prototype.cancel=$.prototype.cancel;$.prototype.remove=function(a){A("Firebase.onDisconnect().remove",0,1,arguments.length);E("Firebase.onDisconnect().remove",this.L);C("Firebase.onDisconnect().remove",1,a,k);Hd(this.tb,this.L,l,a)};$.prototype.remove=$.prototype.remove;
$.prototype.set=function(a,b){A("Firebase.onDisconnect().set",1,2,arguments.length);E("Firebase.onDisconnect().set",this.L);za("Firebase.onDisconnect().set",a,o);C("Firebase.onDisconnect().set",2,b,k);Hd(this.tb,this.L,a,b)};$.prototype.set=$.prototype.set;
$.prototype.Xa=function(a,b,c){A("Firebase.onDisconnect().setWithPriority",2,3,arguments.length);E("Firebase.onDisconnect().setWithPriority",this.L);za("Firebase.onDisconnect().setWithPriority",a,o);Ea("Firebase.onDisconnect().setWithPriority",2,b,o);C("Firebase.onDisconnect().setWithPriority",3,c,k);(".length"===this.ua||".keys"===this.ua)&&g("Firebase.onDisconnect().setWithPriority failed: "+this.ua+" is a read-only object.");var d=this.tb,e=this.L,f=Q(a,b);Qc(d.n,e.toString(),f.P(k),function(a){X(c,
a)})};$.prototype.setWithPriority=$.prototype.Xa;$.prototype.update=function(a,b){A("Firebase.onDisconnect().update",1,2,arguments.length);E("Firebase.onDisconnect().update",this.L);Da("Firebase.onDisconnect().update",a);C("Firebase.onDisconnect().update",2,b,k);var c=this.tb,d=this.L,e=k,f;for(f in a)e=o;e?(Pb("onDisconnect().update() called with empty data.  Don't do anything."),X(b,k)):(c=c.n,d=d.toString(),e=function(a){X(b,a)},c.S?Rc(c,"om",d,a,e):c.lb.push({uc:d,action:"om",data:a,A:e}))};
$.prototype.update=$.prototype.update;var Pd,Qd=0,Rd=[];Pd=function(){var a=(new Date).getTime()+Yb,b=a===Qd;Qd=a;for(var c=Array(8),d=7;0<=d;d--)c[d]="-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(a%64),a=Math.floor(a/64);z(0===a);a=c.join("");if(b){for(d=11;0<=d&&63===Rd[d];d--)Rd[d]=0;Rd[d]++}else for(d=0;12>d;d++)Rd[d]=Math.floor(64*Math.random());for(d=0;12>d;d++)a+="-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(Rd[d]);z(20===a.length,"NextPushId: Length should be 20.");return a};function W(){var a,b,c;if(arguments[0]instanceof Cd)c=arguments[0],a=arguments[1];else{A("new Firebase",1,2,arguments.length);var d=arguments[0];b=a="";var e=k,f="";if(t(d)){var h=d.indexOf("//");if(0<=h)var i=d.substring(0,h-1),d=d.substring(h+2);h=d.indexOf("/");-1===h&&(h=d.length);a=d.substring(0,h);var d=d.substring(h+1),m=a.split(".");if(3==m.length){h=m[2].indexOf(":");e=0<=h?"https"===i:k;if("firebase"===m[1])Ub(a+" is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead");
else{b=m[0];f="";d=("/"+d).split("/");for(i=0;i<d.length;i++)if(0<d[i].length){h=d[i];try{h=decodeURIComponent(h.replace(/\+/g," "))}catch(n){}f+="/"+h}}b=b.toLowerCase()}else b=l}e||"undefined"!==typeof window&&(window.location&&window.location.protocol&&-1!==window.location.protocol.indexOf("https:"))&&Vb("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().");a=new sb(a,e,b);b=new I(f);e=b.toString();if(!(d=!t(a.host)))if(!(d=0===a.host.length))if(!(d=!ya(a.jb)))if(d=
0!==e.length)e&&(e=e.replace(/^\/*\.info(\/|$)/,"/")),d=!(t(e)&&0!==e.length&&!xa.test(e));d&&g(Error(B("new Firebase",1,o)+'must be a valid firebase URL and the path can\'t contain ".", "#", "$", "[", or "]".'));arguments[1]?arguments[1]instanceof Y?c=arguments[1]:g(Error("Expected a valid Firebase.Context for second argument to new Firebase()")):c=Y.pd();e=a.toString();d=ua(c.Wa,e);d||(d=new Cd(a),c.Wa[e]=d);c=d;a=b}G.call(this,c,a)}ka(W,G);ca("Firebase",W);
W.prototype.name=function(){A("Firebase.name",0,0,arguments.length);return this.path.f()?l:Ma(this.path)};W.prototype.name=W.prototype.name;W.prototype.C=function(a){A("Firebase.child",1,1,arguments.length);if(ga(a))a=String(a);else if(!(a instanceof I))if(F(this.path)===l){var b=a;b&&(b=b.replace(/^\/*\.info(\/|$)/,"/"));Ha("Firebase.child",b)}else Ha("Firebase.child",a);return new W(this.o,this.path.C(a))};W.prototype.child=W.prototype.C;
W.prototype.parent=function(){A("Firebase.parent",0,0,arguments.length);var a=this.path.parent();return a===l?l:new W(this.o,a)};W.prototype.parent=W.prototype.parent;W.prototype.toString=function(){A("Firebase.toString",0,0,arguments.length);var a;if(this.parent()===l)a=this.o.toString();else{a=this.parent().toString()+"/";var b=this.name();a+=encodeURIComponent(String(b))}return a};W.prototype.toString=W.prototype.toString;
W.prototype.set=function(a,b){A("Firebase.set",1,2,arguments.length);E("Firebase.set",this.path);za("Firebase.set",a,o);C("Firebase.set",2,b,k);return this.o.Xa(this.path,a,l,b)};W.prototype.set=W.prototype.set;W.prototype.update=function(a,b){A("Firebase.update",1,2,arguments.length);E("Firebase.update",this.path);Da("Firebase.update",a);C("Firebase.update",2,b,k);return this.o.update(this.path,a,b)};W.prototype.update=W.prototype.update;
W.prototype.Xa=function(a,b,c){A("Firebase.setWithPriority",2,3,arguments.length);E("Firebase.setWithPriority",this.path);za("Firebase.setWithPriority",a,o);Ea("Firebase.setWithPriority",2,b,o);C("Firebase.setWithPriority",3,c,k);(".length"===this.name()||".keys"===this.name())&&g("Firebase.setWithPriority failed: "+this.name()+" is a read-only object.");return this.o.Xa(this.path,a,b,c)};W.prototype.setWithPriority=W.prototype.Xa;
W.prototype.remove=function(a){A("Firebase.remove",0,1,arguments.length);E("Firebase.remove",this.path);C("Firebase.remove",1,a,k);this.set(l,a)};W.prototype.remove=W.prototype.remove;
W.prototype.transaction=function(a,b){function c(){}A("Firebase.transaction",1,2,arguments.length);E("Firebase.transaction",this.path);C("Firebase.transaction",1,a,o);C("Firebase.transaction",2,b,k);(".length"===this.name()||".keys"===this.name())&&g("Firebase.transaction failed: "+this.name()+" is a read-only object.");var d=this.o,e=this.path;d.e("transaction on "+e);var f=new W(d,e);f.oc("value",c);var h={path:e,update:a,A:b,Sc:Jb(),Yc:0,dc:function(){f.Ib("value",c)}},i=d.i.Aa,m=h.update(T(i,
e).P());if(s(m)){Aa("transaction failed: Data returned ",m);var n=T(d.i.K,e).k();U(i,e,Q(m,n));yd(d.Q,e,[e]);h.status=1;e=J(d.ac,e);i=e.j()||[];i.push(h);M(e,i);Ld(d)}else h.dc(),h.A&&(d=Jd(d,e),h.A(l,o,d))};W.prototype.transaction=W.prototype.transaction;W.prototype.xc=function(a,b){A("Firebase.setPriority",1,2,arguments.length);E("Firebase.setPriority",this.path);Ea("Firebase.setPriority",1,a,o);C("Firebase.setPriority",2,b,k);this.o.xc(this.path,a,b)};W.prototype.setPriority=W.prototype.xc;
W.prototype.push=function(a,b){A("Firebase.push",0,2,arguments.length);E("Firebase.push",this.path);za("Firebase.push",a,k);C("Firebase.push",2,b,k);var c=Pd(),c=this.C(c);"undefined"!==typeof a&&a!==l&&c.set(a,b);return c};W.prototype.push=W.prototype.push;W.prototype.da=function(){return new $(this.o,this.path,this.name())};W.prototype.onDisconnect=W.prototype.da;
W.prototype.yd=function(){Vb("FirebaseRef.removeOnDisconnect() being deprecated. Please use FirebaseRef.onDisconnect().remove() instead.");this.da().remove();Id(this.o)};W.prototype.removeOnDisconnect=W.prototype.yd;W.prototype.Cd=function(a){Vb("FirebaseRef.setOnDisconnect(value) being deprecated. Please use FirebaseRef.onDisconnect().set(value) instead.");this.da().set(a);Id(this.o)};W.prototype.setOnDisconnect=W.prototype.Cd;
W.prototype.Za=function(a,b,c){A("Firebase.auth",1,3,arguments.length);t(a)||g(Error(B("Firebase.auth",1,o)+"must be a valid credential (a string)."));C("Firebase.auth",2,b,k);C("Firebase.auth",3,b,k);this.o.Za(a,b,c)};W.prototype.auth=W.prototype.Za;W.prototype.zb=function(){this.o.zb()};W.prototype.unauth=W.prototype.zb;
function Qb(a,b){z(!b||a===k||a===o,"Can't turn on custom loggers persistently.");a===k?("undefined"!==typeof console&&("function"===typeof console.log?Nb=u(console.log,console):"object"===typeof console.log&&(Nb=function(a){console.log(a)})),b&&N.setItem("logging_enabled","true")):a?Nb=a:(Nb=l,N.removeItem("logging_enabled"))}W.enableLogging=Qb;W.INTERNAL=Z;W.Context=Y;})();
// FileBufferReader.js
// FileBufferReader.js uses binarize.js to convert Objects into array-buffers and vice versa.
// FileBufferReader.js is MIT licensed: www.WebRTC-Experiment.com/licence
// binarize.js is written by @agektmr: https://github.com/agektmr/binarize.js.
/* issues/features need to be fixed & implemented:
-. Fixed issue: https://github.com/muaz-khan/RTCMultiConnection/issues/41
-. Now "ArrayBuffer" is returned instead of "DataView".
-. "onEnd" for sender now having "url" property as well; same as file receiver.
-. "extra" must not be an empty object i.e. {} -because "binarize" fails to parse empty objects.
-. "extra" must not have "date" types; -because "binarize" fails to parse date-types.
*/
(function() {
    window.FileBufferReader = function() {
        var fileBufferReader = this;
        fileBufferReader.chunks = {};

        fileBufferReader.readAsArrayBuffer = function(file, callback, extra) {
            if (!file) {
                console.error('File or Blob is missing.');
                return;
            }

            extra = extra || {};
            extra.chunkSize = extra.chunkSize || 12 * 1000; // Firefox limit is 16k

            File.Read(file, function(args) {
                args = args || {};
                file.extra = extra || {};
                file.url = URL.createObjectURL(file);
                args.file = file; // passed over "onEnd"
                fileBufferReader.chunks[args.uuid] = args;
                callback(args.uuid);
            }, extra);
        };

        fileBufferReader.setMultipleUsers = function(fileUUID, userids) {
            if (!userids || !(userids instanceof Array)) {
                console.error('Exepcted array of user-ids but either NULL or invalid value passed.');
                return;
            }

            var chunks = fileBufferReader.chunks[fileUUID];
            if (!chunks) {
                console.error('No such file exists.');
                return;
            }

            if (!chunks.file) {
                for (var chunk in chunks) {
                    chunks = chunks[chunk];
                    continue;
                }
            } else {
                fileBufferReader.chunks[fileUUID] = {};
            }

            userids.forEach(function(userid) {
                var chk = {};
                for (var c in chunks) {
                    chk[c] = chunks[c];
                }

                var blob = new Blob([chk.file], {
                    type: chk.file.type
                });

                for (var prop in chk.file) {
                    if (!blob[prop]) {
                        blob[prop] = chk.file[prop];
                    }
                }

                fileBufferReader.chunks[fileUUID][userid] = chk;
                fileBufferReader.chunks[fileUUID][userid].file = blob;
            });
        };

        fileBufferReader.getNextChunk = function(uuid, callback, specificUser) {
            if (!uuid) {
                console.error('"uuid" is missing.');
                return;
            }

            var chunks = fileBufferReader.chunks[uuid];
            if (!chunks) return;

            if (specificUser) {
                chunks = chunks[specificUser];
                if (!chunks) return;
            }

            var currentChunk = chunks.listOfChunks[chunks.currentPosition];
            if (!currentChunk) {
                return;
            }

            var isLastChunk = currentChunk.end;

            FileConverter.ConvertToArrayBuffer(currentChunk, function(buffer) {
                if (chunks.currentPosition == 0) {
                    chunks.file.remoteUserId = specificUser || '';
                    fileBufferReader.onBegin(chunks.file);
                }

                if (isLastChunk) {
                    chunks.file.remoteUserId = specificUser || '';
                    fileBufferReader.onEnd(chunks.file);
                }

                callback(buffer, isLastChunk, currentChunk.extra);
                fileBufferReader.onProgress({
                    currentPosition: chunks.currentPosition,
                    maxChunks: chunks.maxChunks,
                    uuid: chunks.uuid,
                    extra: currentChunk.extra,
                    remoteUserId: specificUser || ''
                });

                if (!specificUser) {
                    fileBufferReader.chunks[uuid].currentPosition++;
                    return;
                }
                fileBufferReader.chunks[uuid][specificUser].currentPosition++;
            });
        };

        fileBufferReader.onBegin = fileBufferReader.onProgress = fileBufferReader.onEnd = function() {};

        var receiver = new File.Receiver(fileBufferReader);

        fileBufferReader.addChunk = function(chunk, callback) {
            if (!chunk) {
                console.error('Chunk is missing.');
                return;
            }

            receiver.receive(chunk, function(uuid) {
                FileConverter.ConvertToArrayBuffer({
                    readyForNextChunk: true,
                    uuid: uuid
                }, callback);
            });
        };

        fileBufferReader.convertToObject = FileConverter.ConvertToObject;
        fileBufferReader.convertToArrayBuffer = FileConverter.ConvertToArrayBuffer;
    };

    window.FileSelector = function() {
        var selector = this;

        selector.selectSingleFile = selectFile;
        selector.selectMultipleFiles = function(callback) {
            selectFile(callback, true);
        };

        function selectFile(callback, multiple) {
            var file = document.createElement('input');
            file.type = 'file';

            if (multiple) {
                file.multiple = true;
            }

            file.onchange = function() {
                if (multiple) {
                    if (!file.files.length) {
                        console.error('No file selected.');
                        return;
                    }
                    callback(file.files);
                    return;
                }

                if (!file.files[0]) {
                    console.error('No file selected.');
                    return;
                }

                callback(file.files[0]);
            };
            fireClickEvent(file);
        }

        function fireClickEvent(element) {
            var evt = new window.MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            });

            element.dispatchEvent(evt);
        }
    };

    var File = {
        Read: function(file, callback, extra) {
            extra = extra || {};

            var numOfChunksInSlice;
            var currentPosition = 1;
            var hasEntireFile;
            var listOfChunks = {};

            var chunkSize = extra.chunkSize || 60 * 1000; // 64k max sctp limit (AFAIK!)

            var sliceId = 0;
            var cacheSize = chunkSize;

            var chunksPerSlice = Math.floor(Math.min(100000000, cacheSize) / chunkSize);
            var sliceSize = chunksPerSlice * chunkSize;
            var maxChunks = Math.ceil(file.size / chunkSize);

            // uuid is used to uniquely identify sending instance
            var uuid = file.uuid || (Math.random() * new Date().getTime()).toString(36).replace(/\./g, '-');

            listOfChunks[0] = {
                uuid: uuid,
                maxChunks: maxChunks,
                size: file.size,
                name: file.name,
                lastModifiedDate: file.lastModifiedDate + '',
                type: file.type,
                start: true,
                extra: extra
            };

            file.maxChunks = maxChunks;
            file.uuid = uuid;

            var blob, reader = new FileReader();
            reader.onloadend = function(evt) {
                if (evt.target.readyState == FileReader.DONE) {
                    addChunks(file.name, evt.target.result, function() {
                        sliceId++;
                        if ((sliceId + 1) * sliceSize < file.size) {
                            blob = file.slice(sliceId * sliceSize, (sliceId + 1) * sliceSize);
                            reader.readAsArrayBuffer(blob);
                        } else if (sliceId * sliceSize < file.size) {
                            blob = file.slice(sliceId * sliceSize, file.size);
                            reader.readAsArrayBuffer(blob);
                        } else {
                            listOfChunks[currentPosition] = {
                                uuid: uuid,
                                maxChunks: maxChunks,
                                size: file.size,
                                name: file.name,
                                lastModifiedDate: file.lastModifiedDate + '',
                                type: file.type,
                                end: true,
                                extra: extra
                            };
                            callback({
                                currentPosition: 0,
                                listOfChunks: listOfChunks,
                                maxChunks: maxChunks + 1,
                                uuid: uuid,
                                extra: extra
                            });
                        }
                    });
                }
            };

            blob = file.slice(sliceId * sliceSize, (sliceId + 1) * sliceSize);
            reader.readAsArrayBuffer(blob);

            function addChunks(fileName, binarySlice, callback00) {
                numOfChunksInSlice = Math.ceil(binarySlice.byteLength / chunkSize);
                for (var i = 0; i < numOfChunksInSlice; i++) {
                    var start = i * chunkSize;
                    listOfChunks[currentPosition] = {
                        uuid: uuid,
                        value: binarySlice.slice(start, Math.min(start + chunkSize, binarySlice.byteLength)),
                        currentPosition: currentPosition,
                        maxChunks: maxChunks,
                        extra: extra
                    };

                    currentPosition++;
                }

                if (currentPosition == maxChunks) {
                    hasEntireFile = true;
                }

                callback00();
            }
        },

        Receiver: function(config) {
            var packets = {};

            function receive(chunk, callback) {
                if (!chunk.uuid) {
                    FileConverter.ConvertToObject(chunk, function(object) {
                        receive(object);
                    });
                    return;
                }

                if (chunk.start && !packets[chunk.uuid]) {
                    packets[chunk.uuid] = [];
                    if (config.onBegin) config.onBegin(chunk);
                }

                if (!chunk.end && chunk.value) {
                    packets[chunk.uuid].push(chunk.value);
                }

                if (chunk.end) {
                    var _packets = packets[chunk.uuid];
                    var finalArray = [],
                        length = _packets.length;

                    for (var i = 0; i < length; i++) {
                        if (!!_packets[i]) {
                            finalArray.push(_packets[i]);
                        }
                    }

                    var blob = new Blob(finalArray, {
                        type: chunk.type
                    });
                    blob = merge(blob, chunk);
                    blob.url = URL.createObjectURL(blob);
                    blob.uuid = chunk.uuid;

                    if (!blob.size) console.error('Something went wrong. Blob Size is 0.');

                    if (config.onEnd) config.onEnd(blob);
                }

                if (chunk.value && config.onProgress) config.onProgress(chunk);

                if (!chunk.end) callback(chunk.uuid);
            }

            return {
                receive: receive
            };
        },
        SaveToDisk: function(fileUrl, fileName) {
            var hyperlink = document.createElement('a');
            hyperlink.href = fileUrl;
            hyperlink.target = '_blank';
            hyperlink.download = fileName || fileUrl;

            var mouseEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            });

            hyperlink.dispatchEvent(mouseEvent);
            (window.URL || window.webkitURL).revokeObjectURL(hyperlink.href);
        }
    };

    // ________________
    // FileConverter.js
    var FileConverter = {
        ConvertToArrayBuffer: function(object, callback) {
            binarize.pack(object, function(dataView) {
                callback(dataView.buffer);
            });
        },
        ConvertToObject: function(buffer, callback) {
            binarize.unpack(buffer, callback);
        }
    };

    function merge(mergein, mergeto) {
        if (!mergein) mergein = {};
        if (!mergeto) return mergein;

        for (var item in mergeto) {
            mergein[item] = mergeto[item];
        }
        return mergein;
    }

    /*
    Copyright 2013 Eiji Kitamura

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

    Author: Eiji Kitamura (agektmr@gmail.com)
    */
    (function(root) {
        var debug = false;

        var BIG_ENDIAN = false,
            LITTLE_ENDIAN = true,
            TYPE_LENGTH = Uint8Array.BYTES_PER_ELEMENT,
            LENGTH_LENGTH = Uint16Array.BYTES_PER_ELEMENT,
            BYTES_LENGTH = Uint32Array.BYTES_PER_ELEMENT;

        var Types = {
            NULL: 0,
            UNDEFINED: 1,
            STRING: 2,
            NUMBER: 3,
            BOOLEAN: 4,
            ARRAY: 5,
            OBJECT: 6,
            INT8ARRAY: 7,
            INT16ARRAY: 8,
            INT32ARRAY: 9,
            UINT8ARRAY: 10,
            UINT16ARRAY: 11,
            UINT32ARRAY: 12,
            FLOAT32ARRAY: 13,
            FLOAT64ARRAY: 14,
            ARRAYBUFFER: 15,
            BLOB: 16,
            FILE: 16,
            BUFFER: 17 // Special type for node.js
        };

        if (debug) {
            var TypeNames = [
                'NULL',
                'UNDEFINED',
                'STRING',
                'NUMBER',
                'BOOLEAN',
                'ARRAY',
                'OBJECT',
                'INT8ARRAY',
                'INT16ARRAY',
                'INT32ARRAY',
                'UINT8ARRAY',
                'UINT16ARRAY',
                'UINT32ARRAY',
                'FLOAT32ARRAY',
                'FLOAT64ARRAY',
                'ARRAYBUFFER',
                'BLOB',
                'BUFFER'
            ];
        }

        var Length = [
            null, // Types.NULL
            null, // Types.UNDEFINED
            'Uint16', // Types.STRING
            'Float64', // Types.NUMBER
            'Uint8', // Types.BOOLEAN
            null, // Types.ARRAY
            null, // Types.OBJECT
            'Int8', // Types.INT8ARRAY
            'Int16', // Types.INT16ARRAY
            'Int32', // Types.INT32ARRAY
            'Uint8', // Types.UINT8ARRAY
            'Uint16', // Types.UINT16ARRAY
            'Uint32', // Types.UINT32ARRAY
            'Float32', // Types.FLOAT32ARRAY
            'Float64', // Types.FLOAT64ARRAY
            'Uint8', // Types.ARRAYBUFFER
            'Uint8', // Types.BLOB, Types.FILE
            'Uint8' // Types.BUFFER
        ];

        var binary_dump = function(view, start, length) {
            var table = [],
                endianness = BIG_ENDIAN,
                ROW_LENGTH = 40;
            table[0] = [];
            for (var i = 0; i < ROW_LENGTH; i++) {
                table[0][i] = i < 10 ? '0' + i.toString(10) : i.toString(10);
            }
            for (i = 0; i < length; i++) {
                var code = view.getUint8(start + i, endianness);
                var index = ~~(i / ROW_LENGTH) + 1;
                if (typeof table[index] === 'undefined') table[index] = [];
                table[index][i % ROW_LENGTH] = code < 16 ? '0' + code.toString(16) : code.toString(16);
            }
            console.log('%c' + table[0].join(' '), 'font-weight: bold;');
            for (i = 1; i < table.length; i++) {
                console.log(table[i].join(' '));
            }
        };

        var find_type = function(obj) {
            var type = undefined;

            if (obj === undefined) {
                type = Types.UNDEFINED;

            } else if (obj === null) {
                type = Types.NULL;

            } else {
                var const_name = obj.constructor.name;
                if (const_name !== undefined) {
                    // return type by .constructor.name if possible
                    type = Types[const_name.toUpperCase()];

                } else {
                    // Work around when constructor.name is not defined
                    switch (typeof obj) {
                        case 'string':
                            type = Types.STRING;
                            break;

                        case 'number':
                            type = Types.NUMBER;
                            break;

                        case 'boolean':
                            type = Types.BOOLEAN;
                            break;

                        case 'object':
                            if (obj instanceof Array) {
                                type = Types.ARRAY;

                            } else if (obj instanceof Int8Array) {
                                type = Types.INT8ARRAY;

                            } else if (obj instanceof Int16Array) {
                                type = Types.INT16ARRAY;

                            } else if (obj instanceof Int32Array) {
                                type = Types.INT32ARRAY;

                            } else if (obj instanceof Uint8Array) {
                                type = Types.UINT8ARRAY;

                            } else if (obj instanceof Uint16Array) {
                                type = Types.UINT16ARRAY;

                            } else if (obj instanceof Uint32Array) {
                                type = Types.UINT32ARRAY;

                            } else if (obj instanceof Float32Array) {
                                type = Types.FLOAT32ARRAY;

                            } else if (obj instanceof Float64Array) {
                                type = Types.FLOAT64ARRAY;

                            } else if (obj instanceof ArrayBuffer) {
                                type = Types.ARRAYBUFFER;

                            } else if (obj instanceof Blob) { // including File
                                type = Types.BLOB;

                            } else if (obj instanceof Buffer) { // node.js only
                                type = Types.BUFFER;

                            } else if (obj instanceof Object) {
                                type = Types.OBJECT;

                            }
                            break;

                        default:
                            break;
                    }
                }
            }
            return type;
        };

        var utf16_utf8 = function(string) {
            return unescape(encodeURIComponent(string));
        };

        var utf8_utf16 = function(bytes) {
            return decodeURIComponent(escape(bytes));
        };

        /**
         * packs seriarized elements array into a packed ArrayBuffer
         * @param  {Array} serialized Serialized array of elements.
         * @return {DataView} view of packed binary
         */
        var pack = function(serialized) {
            var cursor = 0,
                i = 0,
                j = 0,
                endianness = BIG_ENDIAN;

            var ab = new ArrayBuffer(serialized[0].byte_length + serialized[0].header_size);
            var view = new DataView(ab);

            for (i = 0; i < serialized.length; i++) {
                var start = cursor,
                    header_size = serialized[i].header_size,
                    type = serialized[i].type,
                    length = serialized[i].length,
                    value = serialized[i].value,
                    byte_length = serialized[i].byte_length,
                    type_name = Length[type],
                    unit = type_name === null ? 0 : root[type_name + 'Array'].BYTES_PER_ELEMENT;

                // Set type
                if (type === Types.BUFFER) {
                    // on node.js Blob is emulated using Buffer type
                    view.setUint8(cursor, Types.BLOB, endianness);
                } else {
                    view.setUint8(cursor, type, endianness);
                }
                cursor += TYPE_LENGTH;

                if (debug) {
                    console.info('Packing', type, TypeNames[type]);
                }

                // Set length if required
                if (type === Types.ARRAY || type === Types.OBJECT) {
                    view.setUint16(cursor, length, endianness);
                    cursor += LENGTH_LENGTH;

                    if (debug) {
                        console.info('Content Length', length);
                    }
                }

                // Set byte length
                view.setUint32(cursor, byte_length, endianness);
                cursor += BYTES_LENGTH;

                if (debug) {
                    console.info('Header Size', header_size, 'bytes');
                    console.info('Byte Length', byte_length, 'bytes');
                }

                switch (type) {
                    case Types.NULL:
                    case Types.UNDEFINED:
                        // NULL and UNDEFINED doesn't have any payload
                        break;

                    case Types.STRING:
                        if (debug) {
                            console.info('Actual Content %c"' + value + '"', 'font-weight:bold;');
                        }
                        for (j = 0; j < length; j++, cursor += unit) {
                            view.setUint16(cursor, value.charCodeAt(j), endianness);
                        }
                        break;

                    case Types.NUMBER:
                    case Types.BOOLEAN:
                        if (debug) {
                            console.info('%c' + value.toString(), 'font-weight:bold;');
                        }
                        view['set' + type_name](cursor, value, endianness);
                        cursor += unit;
                        break;

                    case Types.INT8ARRAY:
                    case Types.INT16ARRAY:
                    case Types.INT32ARRAY:
                    case Types.UINT8ARRAY:
                    case Types.UINT16ARRAY:
                    case Types.UINT32ARRAY:
                    case Types.FLOAT32ARRAY:
                    case Types.FLOAT64ARRAY:
                        var _view = new Uint8Array(view.buffer, cursor, byte_length);
                        _view.set(new Uint8Array(value.buffer));
                        cursor += byte_length;
                        break;

                    case Types.ARRAYBUFFER:
                    case Types.BUFFER:
                        var _view = new Uint8Array(view.buffer, cursor, byte_length);
                        _view.set(new Uint8Array(value));
                        cursor += byte_length;
                        break;

                    case Types.BLOB:
                    case Types.ARRAY:
                    case Types.OBJECT:
                        break;

                    default:
                        throw 'TypeError: Unexpected type found.';
                }

                if (debug) {
                    binary_dump(view, start, cursor - start);
                }
            }

            return view;
        };

        /**
         * Unpack binary data into an object with value and cursor
         * @param  {DataView} view [description]
         * @param  {Number} cursor [description]
         * @return {Object}
         */
        var unpack = function(view, cursor) {
            var i = 0,
                endianness = BIG_ENDIAN,
                start = cursor;
            var type, length, byte_length, value, elem;

            // Retrieve "type"
            type = view.getUint8(cursor, endianness);
            cursor += TYPE_LENGTH;

            if (debug) {
                console.info('Unpacking', type, TypeNames[type]);
            }

            // Retrieve "length"
            if (type === Types.ARRAY || type === Types.OBJECT) {
                length = view.getUint16(cursor, endianness);
                cursor += LENGTH_LENGTH;

                if (debug) {
                    console.info('Content Length', length);
                }
            }

            // Retrieve "byte_length"
            byte_length = view.getUint32(cursor, endianness);
            cursor += BYTES_LENGTH;

            if (debug) {
                console.info('Byte Length', byte_length, 'bytes');
            }

            var type_name = Length[type];
            var unit = type_name === null ? 0 : root[type_name + 'Array'].BYTES_PER_ELEMENT;

            switch (type) {
                case Types.NULL:
                case Types.UNDEFINED:
                    if (debug) {
                        binary_dump(view, start, cursor - start);
                    }
                    // NULL and UNDEFINED doesn't have any octet
                    value = null;
                    break;

                case Types.STRING:
                    length = byte_length / unit;
                    var string = [];
                    for (i = 0; i < length; i++) {
                        var code = view.getUint16(cursor, endianness);
                        cursor += unit;
                        string.push(String.fromCharCode(code));
                    }
                    value = string.join('');
                    if (debug) {
                        console.info('Actual Content %c"' + value + '"', 'font-weight:bold;');
                        binary_dump(view, start, cursor - start);
                    }
                    break;

                case Types.NUMBER:
                    value = view.getFloat64(cursor, endianness);
                    cursor += unit;
                    if (debug) {
                        console.info('Actual Content %c"' + value.toString() + '"', 'font-weight:bold;');
                        binary_dump(view, start, cursor - start);
                    }
                    break;

                case Types.BOOLEAN:
                    value = view.getUint8(cursor, endianness) === 1 ? true : false;
                    cursor += unit;
                    if (debug) {
                        console.info('Actual Content %c"' + value.toString() + '"', 'font-weight:bold;');
                        binary_dump(view, start, cursor - start);
                    }
                    break;

                case Types.INT8ARRAY:
                case Types.INT16ARRAY:
                case Types.INT32ARRAY:
                case Types.UINT8ARRAY:
                case Types.UINT16ARRAY:
                case Types.UINT32ARRAY:
                case Types.FLOAT32ARRAY:
                case Types.FLOAT64ARRAY:
                case Types.ARRAYBUFFER:
                    elem = view.buffer.slice(cursor, cursor + byte_length);
                    cursor += byte_length;

                    // If ArrayBuffer
                    if (type === Types.ARRAYBUFFER) {
                        value = elem;

                        // If other TypedArray
                    } else {
                        value = new root[type_name + 'Array'](elem);
                    }

                    if (debug) {
                        binary_dump(view, start, cursor - start);
                    }
                    break;

                case Types.BLOB:
                    if (debug) {
                        binary_dump(view, start, cursor - start);
                    }
                    // If Blob is available (on browser)
                    if (root.Blob) {
                        var mime = unpack(view, cursor);
                        var buffer = unpack(view, mime.cursor);
                        cursor = buffer.cursor;
                        value = new Blob([buffer.value], {
                            type: mime.value
                        });
                    } else {
                        // node.js implementation goes here
                        elem = view.buffer.slice(cursor, cursor + byte_length);
                        cursor += byte_length;
                        // node.js implementatino uses Buffer to help Blob
                        value = new Buffer(elem);
                    }
                    break;

                case Types.ARRAY:
                    if (debug) {
                        binary_dump(view, start, cursor - start);
                    }
                    value = [];
                    for (i = 0; i < length; i++) {
                        // Retrieve array element
                        elem = unpack(view, cursor);
                        cursor = elem.cursor;
                        value.push(elem.value);
                    }
                    break;

                case Types.OBJECT:
                    if (debug) {
                        binary_dump(view, start, cursor - start);
                    }
                    value = {};
                    for (i = 0; i < length; i++) {
                        // Retrieve object key and value in sequence
                        var key = unpack(view, cursor);
                        var val = unpack(view, key.cursor);
                        cursor = val.cursor;
                        value[key.value] = val.value;
                    }
                    break;

                default:
                    throw 'TypeError: Type not supported.';
            }
            return {
                value: value,
                cursor: cursor
            };
        };

        /**
         * deferred function to process multiple serialization in order
         * @param  {array}   array    [description]
         * @param  {Function} callback [description]
         * @return {void} no return value
         */
        var deferredSerialize = function(array, callback) {
            var length = array.length,
                results = [],
                count = 0,
                byte_length = 0;
            for (var i = 0; i < array.length; i++) {
                (function(index) {
                    serialize(array[index], function(result) {
                        // store results in order
                        results[index] = result;
                        // count byte length
                        byte_length += result[0].header_size + result[0].byte_length;
                        // when all results are on table
                        if (++count === length) {
                            // finally concatenate all reuslts into a single array in order
                            var array = [];
                            for (var j = 0; j < results.length; j++) {
                                array = array.concat(results[j]);
                            }
                            callback(array, byte_length);
                        }
                    });
                })(i);
            }
        };

        /**
         * Serializes object and return byte_length
         * @param  {mixed} obj JavaScript object you want to serialize
         * @return {Array} Serialized array object
         */
        var serialize = function(obj, callback) {
            var subarray = [],
                unit = 1,
                header_size = TYPE_LENGTH + BYTES_LENGTH,
                type, byte_length = 0,
                length = 0,
                value = obj;

            type = find_type(obj);

            unit = Length[type] === undefined || Length[type] === null ? 0 :
                root[Length[type] + 'Array'].BYTES_PER_ELEMENT;

            switch (type) {
                case Types.UNDEFINED:
                case Types.NULL:
                    break;

                case Types.NUMBER:
                case Types.BOOLEAN:
                    byte_length = unit;
                    break;

                case Types.STRING:
                    length = obj.length;
                    byte_length += length * unit;
                    break;

                case Types.INT8ARRAY:
                case Types.INT16ARRAY:
                case Types.INT32ARRAY:
                case Types.UINT8ARRAY:
                case Types.UINT16ARRAY:
                case Types.UINT32ARRAY:
                case Types.FLOAT32ARRAY:
                case Types.FLOAT64ARRAY:
                    length = obj.length;
                    byte_length += length * unit;
                    break;

                case Types.ARRAY:
                    deferredSerialize(obj, function(subarray, byte_length) {
                        callback([{
                            type: type,
                            length: obj.length,
                            header_size: header_size + LENGTH_LENGTH,
                            byte_length: byte_length,
                            value: null
                        }].concat(subarray));
                    });
                    return;

                case Types.OBJECT:
                    var deferred = [];
                    for (var key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            deferred.push(key);
                            deferred.push(obj[key]);
                            length++;
                        }
                    }
                    deferredSerialize(deferred, function(subarray, byte_length) {
                        callback([{
                            type: type,
                            length: length,
                            header_size: header_size + LENGTH_LENGTH,
                            byte_length: byte_length,
                            value: null
                        }].concat(subarray));
                    });
                    return;

                case Types.ARRAYBUFFER:
                    byte_length += obj.byteLength;
                    break;

                case Types.BLOB:
                    var mime_type = obj.type;
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        deferredSerialize([mime_type, e.target.result], function(subarray, byte_length) {
                            callback([{
                                type: type,
                                length: length,
                                header_size: header_size,
                                byte_length: byte_length,
                                value: null
                            }].concat(subarray));
                        });
                    };
                    reader.onerror = function(e) {
                        throw 'FileReader Error: ' + e;
                    };
                    reader.readAsArrayBuffer(obj);
                    return;

                case Types.BUFFER:
                    byte_length += obj.length;
                    break;

                default:
                    throw 'TypeError: Type "' + obj.constructor.name + '" not supported.';
            }

            callback([{
                type: type,
                length: length,
                header_size: header_size,
                byte_length: byte_length,
                value: value
            }].concat(subarray));
        };

        /**
         * Deserialize binary and return JavaScript object
         * @param  ArrayBuffer buffer ArrayBuffer you want to deserialize
         * @return mixed              Retrieved JavaScript object
         */
        var deserialize = function(buffer, callback) {
            var view = buffer instanceof DataView ? buffer : new DataView(buffer);
            var result = unpack(view, 0);
            return result.value;
        };

        if (debug) {
            root.Test = {
                BIG_ENDIAN: BIG_ENDIAN,
                LITTLE_ENDIAN: LITTLE_ENDIAN,
                Types: Types,
                pack: pack,
                unpack: unpack,
                serialize: serialize,
                deserialize: deserialize
            };
        }

        var binarize = {
            pack: function(obj, callback) {
                try {
                    if (debug) console.info('%cPacking Start', 'font-weight: bold; color: red;', obj);
                    serialize(obj, function(array) {
                        if (debug) console.info('Serialized Object', array);
                        callback(pack(array));
                    });
                } catch (e) {
                    throw e;
                }
            },
            unpack: function(buffer, callback) {
                try {
                    if (debug) console.info('%cUnpacking Start', 'font-weight: bold; color: red;', buffer);
                    var result = deserialize(buffer);
                    if (debug) console.info('Deserialized Object', result);
                    callback(result);
                } catch (e) {
                    throw e;
                }
            }
        };

        if (typeof module !== 'undefined' && module.exports) {
            module.exports = binarize;
        } else {
            root.binarize = binarize;
        }
    })(typeof global !== 'undefined' ? global : this);
})();

// RTCMultiConnection-v2.2.2

(function() {

    // RMC == RTCMultiConnection
    // usually page-URL is used as channel-id
    // you can always override it!

    window.RMCDefaultChannel = location.href.replace(/\/|:|#|\?|\$|\^|%|\.|`|~|!|\+|@|\[|\||]|\|*. /g, '').split('\n').join('').split('\r').join('');

    // www.RTCMultiConnection.org/docs/constructor/
    window.RTCMultiConnection = function(channel) {
        // an instance of constructor
        var connection = this;

        // a reference to RTCMultiSession
        var rtcMultiSession;

        // setting default channel or channel passed through constructor
        connection.channel = channel || RMCDefaultChannel;

        // to allow single user to join multiple rooms;
        // you can change this property at runtime!
        connection.isAcceptNewSession = true;

        // www.RTCMultiConnection.org/docs/open/
        connection.open = function(args) {
            connection.isAcceptNewSession = false;

            // www.RTCMultiConnection.org/docs/session-initiator/
            // you can always use this property to determine room owner!
            connection.isInitiator = true;

            var dontTransmit = false;

            // a channel can contain multiple rooms i.e. sessions
            if (args) {
                if (isString(args)) {
                    connection.sessionid = args;
                } else {
                    if (!isNull(args.transmitRoomOnce)) {
                        connection.transmitRoomOnce = args.transmitRoomOnce;
                    }

                    if (!isNull(args.dontTransmit)) {
                        dontTransmit = args.dontTransmit;
                    }

                    if (!isNull(args.sessionid)) {
                        connection.sessionid = args.sessionid;
                    }
                }
            }

            // if firebase && if session initiator
            if (connection.socket && connection.socket.remove) {
                connection.socket.remove();
            }

            if (!connection.sessionid) connection.sessionid = connection.channel;
            connection.sessionDescription = {
                sessionid: connection.sessionid,
                userid: connection.userid,
                session: connection.session,
                extra: connection.extra
            };

            if (!connection.sessionDescriptions[connection.sessionDescription.sessionid]) {
                connection.numberOfSessions++;
                connection.sessionDescriptions[connection.sessionDescription.sessionid] = connection.sessionDescription;
            }

            // connect with signaling channel
            initRTCMultiSession(function() {
                // "captureUserMediaOnDemand" is disabled by default.
                // invoke "getUserMedia" only when first participant found.
                rtcMultiSession.captureUserMediaOnDemand = args ? !!args.captureUserMediaOnDemand : false;

                if (args && args.onMediaCaptured) {
                    connection.onMediaCaptured = args.onMediaCaptured;
                }

                // for session-initiator, user-media is captured as soon as "open" is invoked.
                if (!rtcMultiSession.captureUserMediaOnDemand) captureUserMedia(function() {
                    rtcMultiSession.initSession({
                        sessionDescription: connection.sessionDescription,
                        dontTransmit: dontTransmit
                    });

                    invokeMediaCaptured(connection);
                });

                if (rtcMultiSession.captureUserMediaOnDemand) {
                    rtcMultiSession.initSession({
                        sessionDescription: connection.sessionDescription,
                        dontTransmit: dontTransmit
                    });
                }
            });
            return connection.sessionDescription;
        };

        // www.RTCMultiConnection.org/docs/connect/
        connection.connect = function(sessionid) {
            // a channel can contain multiple rooms i.e. sessions
            if (sessionid) {
                connection.sessionid = sessionid;
            }

            // connect with signaling channel
            initRTCMultiSession(function() {
                log('Signaling channel is ready.');
            });

            return this;
        };

        // www.RTCMultiConnection.org/docs/join/
        connection.join = joinSession;

        // www.RTCMultiConnection.org/docs/send/
        connection.send = function(data, _channel) {
            if (connection.numberOfConnectedUsers <= 0) {
                // no connections
                setTimeout(function() {
                    // try again
                    connection.send(data, _channel);
                }, 1000);
                return;
            }

            // send file/data or /text
            if (!data)
                throw 'No file, data or text message to share.';

            // connection.send([file1, file2, file3])
            // you can share multiple files, strings or data objects using "send" method!
            if (data instanceof Array && !isNull(data[0].size) && !isNull(data[0].type)) {
                // this mechanism can cause failure for subsequent packets/data 
                // on Firefox especially; and on chrome as well!
                // todo: need to use setTimeout instead.
                for (var i = 0; i < data.length; i++) {
                    data[i].size && data[i].type && connection.send(data[i], _channel);
                }
                return;
            }

            // File or Blob object MUST have "type" and "size" properties
            if (!isNull(data.size) && !isNull(data.type)) {
                if (!connection.enableFileSharing) {
                    throw '"enableFileSharing" boolean MUST be "true" to support file sharing.';
                }

                if (!rtcMultiSession.fileBufferReader) {
                    initFileBufferReader(connection, function(fbr) {
                        rtcMultiSession.fileBufferReader = fbr;
                        connection.send(data, _channel);
                    });
                    return;
                }

                var extra = merge({
                    userid: connection.userid
                }, data.extra || connection.extra);

                rtcMultiSession.fileBufferReader.readAsArrayBuffer(data, function(uuid) {
                    rtcMultiSession.fileBufferReader.getNextChunk(uuid, function(nextChunk, isLastChunk, extra) {
                        if (_channel) _channel.send(nextChunk);
                        else rtcMultiSession.send(nextChunk);
                    });
                }, extra);
            } else {
                // to allow longest string messages
                // and largest data objects
                // or anything of any size!
                // to send multiple data objects concurrently!

                TextSender.send({
                    text: data,
                    channel: rtcMultiSession,
                    _channel: _channel,
                    connection: connection
                });
            }
        };

        function initRTCMultiSession(onSignalingReady) {
            if (screenFrame) {
                loadScreenFrame();
            }

            // RTCMultiSession is the backbone object;
            // this object MUST be initialized once!
            if (rtcMultiSession) return onSignalingReady();

            // your everything is passed over RTCMultiSession constructor!
            rtcMultiSession = new RTCMultiSession(connection, onSignalingReady);
        }

        connection.disconnect = function() {
            if (rtcMultiSession) rtcMultiSession.disconnect();
            rtcMultiSession = null;
        };

        function joinSession(session, joinAs) {
            if (isString(session)) {
                connection.skipOnNewSession = true;
            }

            if (!rtcMultiSession) {
                log('Signaling channel is not ready. Connecting...');
                // connect with signaling channel
                initRTCMultiSession(function() {
                    log('Signaling channel is connected. Joining the session again...');
                    setTimeout(function() {
                        joinSession(session, joinAs);
                    }, 1000);
                });
                return;
            }

            // connection.join('sessionid');
            if (isString(session)) {
                if (connection.sessionDescriptions[session]) {
                    session = connection.sessionDescriptions[session];
                } else
                    return setTimeout(function() {
                        log('Session-Descriptions not found. Rechecking..');
                        joinSession(session, joinAs);
                    }, 1000);
            }

            // connection.join('sessionid', { audio: true });
            if (joinAs) {
                return captureUserMedia(function() {
                    session.oneway = true;
                    joinSession(session);
                }, joinAs);
            }

            if (!session || !session.userid || !session.sessionid) {
                error('missing arguments', arguments);

                var error = 'Invalid data passed over "connection.join" method.';
                connection.onstatechange({
                    userid: 'browser',
                    extra: {},
                    name: 'Unexpected data detected.',
                    reason: error
                });

                throw error;
            }

            if (!connection.dontOverrideSession) {
                connection.session = session.session;
            }

            var extra = connection.extra || session.extra || {};

            // todo: need to verify that if-block statement works as expected.
            // expectations: if it is oneway streaming; or if it is data-only connection
            // then, it shouldn't capture user-media on participant's side.
            if (session.oneway || isData(session)) {
                rtcMultiSession.joinSession(session, extra);
            } else {
                captureUserMedia(function() {
                    rtcMultiSession.joinSession(session, extra);
                });
            }
        }

        var isFirstSession = true;

        // www.RTCMultiConnection.org/docs/captureUserMedia/

        function captureUserMedia(callback, _session, dontCheckChromExtension) {
            // capture user's media resources
            var session = _session || connection.session;

            if (isEmpty(session)) {
                if (callback) callback();
                return;
            }

            // you can force to skip media capturing!
            if (connection.dontCaptureUserMedia) {
                return callback();
            }

            // if it is data-only connection
            // if it is one-way connection and current user is participant
            if (isData(session) || (!connection.isInitiator && session.oneway)) {
                // www.RTCMultiConnection.org/docs/attachStreams/
                connection.attachStreams = [];
                return callback();
            }

            var constraints = {
                audio: !!session.audio ? {
                    mandatory: {},
                    optional: [{
                        chromeRenderToAssociatedSink: true
                    }]
                } : false,
                video: !!session.video
            };

            // if custom audio device is selected
            if (connection._mediaSources.audio) {
                constraints.audio.optional.push({
                    sourceId: connection._mediaSources.audio
                });
            }

            // if custom video device is selected
            if (connection._mediaSources.video) {
                constraints.video = {
                    optional: [{
                        sourceId: connection._mediaSources.video
                    }]
                };
            }

            // for connection.session = {};
            if (!session.screen && !constraints.audio && !constraints.video) {
                return callback();
            }

            var screen_constraints = {
                audio: false,
                video: {
                    mandatory: {
                        chromeMediaSource: DetectRTC.screen.chromeMediaSource,
                        maxWidth: screen.width > 1920 ? screen.width : 1920,
                        maxHeight: screen.height > 1080 ? screen.height : 1080
                    },
                    optional: []
                }
            };

            if (isFirefox && session.screen) {
                if (location.protocol !== 'https:') {
                    return error(SCREEN_COMMON_FAILURE);
                }
                warn(Firefox_Screen_Capturing_Warning);

                screen_constraints.video = merge(screen_constraints.video.mandatory, {
                    mozMediaSource: 'window', // mozMediaSource is redundant here
                    mediaSource: 'window' // 'screen' || 'window'
                });

                // Firefox is supporting audio+screen from single getUserMedia request
                // audio+video+screen will become audio+screen for Firefox
                // because Firefox isn't supporting multi-streams feature version < 38
                // version >38 supports multi-stream sharing.
                // we can use:  firefoxVersion < 38
                // however capturing audio and screen using single getUserMedia is a better option
                if (constraints.audio /* && !session.video */ ) {
                    screen_constraints.audio = true;
                    constraints = {};
                }

                delete screen_constraints.video.chromeMediaSource;
            }

            // if screen is prompted
            if (session.screen) {
                if (isChrome && DetectRTC.screen.extensionid != ReservedExtensionID) {
                    useCustomChromeExtensionForScreenCapturing = true;
                }

                if (isChrome && !useCustomChromeExtensionForScreenCapturing && !dontCheckChromExtension && !DetectRTC.screen.sourceId) {
                    listenEventHandler('message', onIFrameCallback);

                    function onIFrameCallback(event) {
                        if (event.data && event.data.chromeMediaSourceId) {
                            // this event listener is no more needed
                            window.removeEventListener('message', onIFrameCallback);

                            var sourceId = event.data.chromeMediaSourceId;

                            DetectRTC.screen.sourceId = sourceId;
                            DetectRTC.screen.chromeMediaSource = 'desktop';

                            if (sourceId == 'PermissionDeniedError') {
                                var mediaStreamError = {
                                    message: location.protocol == 'https:' ? 'User denied to share content of his screen.' : SCREEN_COMMON_FAILURE,
                                    name: 'PermissionDeniedError',
                                    constraintName: screen_constraints,
                                    session: session
                                };
                                currentUserMediaRequest.mutex = false;
                                DetectRTC.screen.sourceId = null;
                                return connection.onMediaError(mediaStreamError);
                            }

                            captureUserMedia(callback, _session);
                        }

                        if (event.data && event.data.chromeExtensionStatus) {
                            warn('Screen capturing extension status is:', event.data.chromeExtensionStatus);
                            DetectRTC.screen.chromeMediaSource = 'screen';
                            captureUserMedia(callback, _session, true);
                        }
                    }

                    if (!screenFrame) {
                        loadScreenFrame();
                    }

                    screenFrame.postMessage();
                    return;
                }

                // check if screen capturing extension is installed.
                if (isChrome && useCustomChromeExtensionForScreenCapturing && !dontCheckChromExtension && DetectRTC.screen.chromeMediaSource == 'screen' && DetectRTC.screen.extensionid) {
                    
                    if (DetectRTC.screen.extensionid == ReservedExtensionID && document.domain.indexOf('webrtc-experiment.com') == -1) {
                        return captureUserMedia(callback, _session, true);
                    }


                    log('checking if chrome extension is installed.');
                    DetectRTC.screen.getChromeExtensionStatus(function(status) {
                        if (status == 'installed-enabled') {
                            DetectRTC.screen.chromeMediaSource = 'desktop';
                        }

                        captureUserMedia(callback, _session, true);
                        log('chrome extension is installed?', DetectRTC.screen.chromeMediaSource == 'desktop');
                    });
                    return;
                }

                if (isChrome && useCustomChromeExtensionForScreenCapturing && DetectRTC.screen.chromeMediaSource == 'desktop' && !DetectRTC.screen.sourceId) {
                    DetectRTC.screen.getSourceId(function(sourceId) {
                        if (sourceId == 'PermissionDeniedError') {
                            var mediaStreamError = {
                                message: 'User denied to share content of his screen.',
                                name: 'PermissionDeniedError',
                                constraintName: screen_constraints,
                                session: session
                            };
                            currentUserMediaRequest.mutex = false;
                            DetectRTC.screen.chromeMediaSource = 'desktop';
                            return connection.onMediaError(mediaStreamError);
                        }

                        if (sourceId == 'No-Response') {
                            error('Chrome extension seems not available. Make sure that manifest.json#L16 has valid content-script matches pointing to your URL.');
                            DetectRTC.screen.chromeMediaSource = 'screen';
                            return captureUserMedia(callback, _session, true);
                        }

                        captureUserMedia(callback, _session, true);
                    });
                    return;
                }

                if (isChrome && DetectRTC.screen.chromeMediaSource == 'desktop') {
                    screen_constraints.video.mandatory.chromeMediaSourceId = DetectRTC.screen.sourceId;
                }

                var _isFirstSession = isFirstSession;

                _captureUserMedia(screen_constraints, constraints.audio || constraints.video ? function() {

                    if (_isFirstSession) isFirstSession = true;

                    _captureUserMedia(constraints, callback);
                } : callback);
            } else _captureUserMedia(constraints, callback, session.audio && !session.video);

            function _captureUserMedia(forcedConstraints, forcedCallback, isRemoveVideoTracks, dontPreventSSLAutoAllowed) {
                connection.onstatechange({
                    userid: 'browser',
                    extra: {},
                    name: 'fetching-usermedia',
                    reason: 'About to capture user-media with constraints: ' + toStr(forcedConstraints)
                });


                if (connection.preventSSLAutoAllowed && !dontPreventSSLAutoAllowed && isChrome) {
                    // if navigator.customGetUserMediaBar.js is missing
                    if (!navigator.customGetUserMediaBar) {
                        loadScript(connection.resources.customGetUserMediaBar, function() {
                            _captureUserMedia(forcedConstraints, forcedCallback, isRemoveVideoTracks, dontPreventSSLAutoAllowed);
                        });
                        return;
                    }

                    navigator.customGetUserMediaBar(forcedConstraints, function() {
                        _captureUserMedia(forcedConstraints, forcedCallback, isRemoveVideoTracks, true);
                    }, function() {
                        connection.onMediaError({
                            name: 'PermissionDeniedError',
                            message: 'User denied permission.',
                            constraintName: forcedConstraints,
                            session: session
                        });
                    });
                    return;
                }

                var mediaConfig = {
                    onsuccess: function(stream, returnBack, idInstance, streamid) {
                        onStreamSuccessCallback(stream, returnBack, idInstance, streamid, forcedConstraints, forcedCallback, isRemoveVideoTracks, screen_constraints, constraints, session);
                    },
                    onerror: function(e, constraintUsed) {
                        // http://goo.gl/hrwF1a
                        if (isFirefox) {
                            if (e == 'PERMISSION_DENIED') {
                                e = {
                                    message: '',
                                    name: 'PermissionDeniedError',
                                    constraintName: constraintUsed,
                                    session: session
                                };
                            }
                        }

                        if (isFirefox && constraintUsed.video && constraintUsed.video.mozMediaSource) {
                            mediaStreamError = {
                                message: Firefox_Screen_Capturing_Warning,
                                name: e.name || 'PermissionDeniedError',
                                constraintName: constraintUsed,
                                session: session
                            };

                            connection.onMediaError(mediaStreamError);
                            return;
                        }

                        if (isString(e)) {
                            return connection.onMediaError({
                                message: 'Unknown Error',
                                name: e,
                                constraintName: constraintUsed,
                                session: session
                            });
                        }

                        // it seems that chrome 35+ throws "DevicesNotFoundError" exception 
                        // when any of the requested media is either denied or absent
                        if (e.name && (e.name == 'PermissionDeniedError' || e.name == 'DevicesNotFoundError')) {
                            var mediaStreamError = 'Either: ';
                            mediaStreamError += '\n Media resolutions are not permitted.';
                            mediaStreamError += '\n Another application is using same media device.';
                            mediaStreamError += '\n Media device is not attached or drivers not installed.';
                            mediaStreamError += '\n You denied access once and it is still denied.';

                            if (e.message && e.message.length) {
                                mediaStreamError += '\n ' + e.message;
                            }

                            mediaStreamError = {
                                message: mediaStreamError,
                                name: e.name,
                                constraintName: constraintUsed,
                                session: session
                            };

                            connection.onMediaError(mediaStreamError);

                            if (isChrome && (session.audio || session.video)) {
                                // todo: this snippet fails if user has two or more 
                                // microphone/webcam attached.
                                DetectRTC.load(function() {
                                    // it is possible to check presence of the microphone before using it!
                                    if (session.audio && !DetectRTC.hasMicrophone) {
                                        warn('It seems that you have no microphone attached to your device/system.');
                                        session.audio = session.audio = false;

                                        if (!session.video) {
                                            alert('It seems that you are capturing microphone and there is no device available or access is denied. Reloading...');
                                            location.reload();
                                        }
                                    }

                                    // it is possible to check presence of the webcam before using it!
                                    if (session.video && !DetectRTC.hasWebcam) {
                                        warn('It seems that you have no webcam attached to your device/system.');
                                        session.video = session.video = false;

                                        if (!session.audio) {
                                            alert('It seems that you are capturing webcam and there is no device available or access is denied. Reloading...');
                                            location.reload();
                                        }
                                    }

                                    if (!DetectRTC.hasMicrophone && !DetectRTC.hasWebcam) {
                                        alert('It seems that either both microphone/webcam are not available or access is denied. Reloading...');
                                        location.reload();
                                    } else if (!connection.getUserMediaPromptedOnce) {
                                        // make maximum two tries!
                                        connection.getUserMediaPromptedOnce = true;
                                        captureUserMedia(callback, session);
                                    }
                                });
                            }
                        }

                        if (e.name && e.name == 'ConstraintNotSatisfiedError') {
                            var mediaStreamError = 'Either: ';
                            mediaStreamError += '\n You are prompting unknown media resolutions.';
                            mediaStreamError += '\n You are using invalid media constraints.';

                            if (e.message && e.message.length) {
                                mediaStreamError += '\n ' + e.message;
                            }

                            mediaStreamError = {
                                message: mediaStreamError,
                                name: e.name,
                                constraintName: constraintUsed,
                                session: session
                            };

                            connection.onMediaError(mediaStreamError);
                        }

                        if (session.screen) {
                            if (isFirefox) {
                                error(Firefox_Screen_Capturing_Warning);
                            } else if (location.protocol !== 'https:') {
                                if (!isNodeWebkit && (location.protocol == 'file:' || location.protocol == 'http:')) {
                                    error('You cannot use HTTP or file protocol for screen capturing. You must either use HTTPs or chrome extension page or Node-Webkit page.');
                                }
                            } else {
                                error('Unable to detect actual issue. Maybe "deprecated" screen capturing flag was not set using command line or maybe you clicked "No" button or maybe chrome extension returned invalid "sourceId". Please install chrome-extension: http://bit.ly/webrtc-screen-extension');
                            }
                        }

                        currentUserMediaRequest.mutex = false;

                        // to make sure same stream can be captured again!
                        var idInstance = JSON.stringify(constraintUsed);
                        if (currentUserMediaRequest.streams[idInstance]) {
                            delete currentUserMediaRequest.streams[idInstance];
                        }
                    },
                    mediaConstraints: connection.mediaConstraints || {}
                };

                mediaConfig.constraints = forcedConstraints || constraints;
                mediaConfig.connection = connection;
                getUserMedia(mediaConfig);
            }
        }

        function onStreamSuccessCallback(stream, returnBack, idInstance, streamid, forcedConstraints, forcedCallback, isRemoveVideoTracks, screen_constraints, constraints, session) {
            if (!streamid) streamid = getRandomString();

            connection.onstatechange({
                userid: 'browser',
                extra: {},
                name: 'usermedia-fetched',
                reason: 'Captured user media using constraints: ' + toStr(forcedConstraints)
            });

            if (isRemoveVideoTracks) {
                stream = convertToAudioStream(stream);
            }

            connection.localStreamids.push(streamid);
            stream.onended = function() {
                if (streamedObject.mediaElement && !streamedObject.mediaElement.parentNode && document.getElementById(stream.streamid)) {
                    streamedObject.mediaElement = document.getElementById(stream.streamid);
                }

                // when a stream is stopped; it must be removed from "attachStreams" array
                connection.attachStreams.forEach(function(_stream, index) {
                    if (_stream == stream) {
                        delete connection.attachStreams[index];
                        connection.attachStreams = swap(connection.attachStreams);
                    }
                });

                onStreamEndedHandler(streamedObject, connection);

                if (connection.streams[streamid]) {
                    connection.removeStream(streamid);
                }

                // if user clicks "stop" button to close screen sharing
                var _stream = connection.streams[streamid];
                if (_stream && _stream.sockets.length) {
                    _stream.sockets.forEach(function(socket) {
                        socket.send({
                            streamid: _stream.streamid,
                            stopped: true
                        });
                    });
                }

                currentUserMediaRequest.mutex = false;
                // to make sure same stream can be captured again!
                if (currentUserMediaRequest.streams[idInstance]) {
                    delete currentUserMediaRequest.streams[idInstance];
                }

                // to allow re-capturing of the screen
                DetectRTC.screen.sourceId = null;
            };

            if (!isIE) {
                stream.streamid = streamid;
                stream.isScreen = forcedConstraints == screen_constraints;
                stream.isVideo = forcedConstraints == constraints && !!constraints.video;
                stream.isAudio = forcedConstraints == constraints && !!constraints.audio && !constraints.video;

                // if muted stream is negotiated
                stream.preMuted = {
                    audio: stream.getAudioTracks().length && !stream.getAudioTracks()[0].enabled,
                    video: stream.getVideoTracks().length && !stream.getVideoTracks()[0].enabled
                };
            }

            var mediaElement = createMediaElement(stream, session);
            mediaElement.muted = true;

            var streamedObject = {
                stream: stream,
                streamid: streamid,
                mediaElement: mediaElement,
                blobURL: mediaElement.mozSrcObject ? URL.createObjectURL(stream) : mediaElement.src,
                type: 'local',
                userid: connection.userid,
                extra: connection.extra,
                session: session,
                isVideo: !!stream.isVideo,
                isAudio: !!stream.isAudio,
                isScreen: !!stream.isScreen,
                isInitiator: !!connection.isInitiator,
                rtcMultiConnection: connection
            };

            if (isFirstSession) {
                connection.attachStreams.push(stream);
            }
            isFirstSession = false;

            connection.streams[streamid] = connection._getStream(streamedObject);

            if (!returnBack) {
                connection.onstream(streamedObject);
            }

            if (connection.setDefaultEventsForMediaElement) {
                connection.setDefaultEventsForMediaElement(mediaElement, streamid);
            }

            if (forcedCallback) forcedCallback(stream, streamedObject);

            if (connection.onspeaking) {
                initHark({
                    stream: stream,
                    streamedObject: streamedObject,
                    connection: connection
                });
            }
        }

        // www.RTCMultiConnection.org/docs/captureUserMedia/
        connection.captureUserMedia = captureUserMedia;

        // www.RTCMultiConnection.org/docs/leave/
        connection.leave = function(userid) {
            if (!rtcMultiSession) return;

            isFirstSession = true;

            if (userid) {
                connection.eject(userid);
                return;
            }

            rtcMultiSession.leave();
        };

        // www.RTCMultiConnection.org/docs/eject/
        connection.eject = function(userid) {
            if (!connection.isInitiator) throw 'Only session-initiator can eject a user.';
            if (!connection.peers[userid]) throw 'You ejected invalid user.';
            connection.peers[userid].sendCustomMessage({
                ejected: true
            });
        };

        // www.RTCMultiConnection.org/docs/close/
        connection.close = function() {
            // close entire session
            connection.autoCloseEntireSession = true;
            connection.leave();
        };

        // www.RTCMultiConnection.org/docs/renegotiate/
        connection.renegotiate = function(stream, session) {
            if (connection.numberOfConnectedUsers <= 0) {
                // no connections
                setTimeout(function() {
                    // try again
                    connection.renegotiate(stream, session);
                }, 1000);
                return;
            }

            rtcMultiSession.addStream({
                renegotiate: session || merge({
                    oneway: true
                }, connection.session),
                stream: stream
            });
        };

        connection.attachExternalStream = function(stream, isScreen) {
            var constraints = {};
            if (stream.getAudioTracks && stream.getAudioTracks().length) {
                constraints.audio = true;
            }
            if (stream.getVideoTracks && stream.getVideoTracks().length) {
                constraints.video = true;
            }

            var screen_constraints = {
                video: {
                    chromeMediaSource: 'fake'
                }
            };
            var forcedConstraints = isScreen ? screen_constraints : constraints;
            onStreamSuccessCallback(stream, false, '', null, forcedConstraints, false, false, screen_constraints, constraints, constraints);
        };

        // www.RTCMultiConnection.org/docs/addStream/
        connection.addStream = function(session, socket) {
            // www.RTCMultiConnection.org/docs/renegotiation/

            if (connection.numberOfConnectedUsers <= 0) {
                // no connections
                setTimeout(function() {
                    // try again
                    connection.addStream(session, socket);
                }, 1000);
                return;
            }

            // renegotiate new media stream
            if (session) {
                var isOneWayStreamFromParticipant;
                if (!connection.isInitiator && session.oneway) {
                    session.oneway = false;
                    isOneWayStreamFromParticipant = true;
                }

                captureUserMedia(function(stream) {
                    if (isOneWayStreamFromParticipant) {
                        session.oneway = true;
                    }
                    addStream(stream);
                }, session);
            } else addStream();

            function addStream(stream) {
                rtcMultiSession.addStream({
                    stream: stream,
                    renegotiate: session || connection.session,
                    socket: socket
                });
            }
        };

        // www.RTCMultiConnection.org/docs/removeStream/
        connection.removeStream = function(streamid, dontRenegotiate) {
            if (connection.numberOfConnectedUsers <= 0) {
                // no connections
                setTimeout(function() {
                    // try again
                    connection.removeStream(streamid, dontRenegotiate);
                }, 1000);
                return;
            }

            if (!streamid) streamid = 'all';
            if (!isString(streamid) || streamid.search(/all|audio|video|screen/gi) != -1) {
                function _detachStream(_stream, config) {
                    if (config.local && _stream.type != 'local') return;
                    if (config.remote && _stream.type != 'remote') return;

                    // connection.removeStream({screen:true});
                    if (config.screen && !!_stream.isScreen) {
                        connection.detachStreams.push(_stream.streamid);
                    }

                    // connection.removeStream({audio:true});
                    if (config.audio && !!_stream.isAudio) {
                        connection.detachStreams.push(_stream.streamid);
                    }

                    // connection.removeStream({video:true});
                    if (config.video && !!_stream.isVideo) {
                        connection.detachStreams.push(_stream.streamid);
                    }

                    // connection.removeStream({});
                    if (!config.audio && !config.video && !config.screen) {
                        connection.detachStreams.push(_stream.streamid);
                    }

                    if (connection.detachStreams.indexOf(_stream.streamid) != -1) {
                        log('removing stream', _stream.streamid);
                        onStreamEndedHandler(_stream, connection);

                        if (config.stop) {
                            connection.stopMediaStream(_stream.stream);
                        }
                    }
                }

                for (var stream in connection.streams) {
                    if (connection._skip.indexOf(stream) == -1) {
                        _stream = connection.streams[stream];

                        if (streamid == 'all') _detachStream(_stream, {
                            audio: true,
                            video: true,
                            screen: true
                        });

                        else if (isString(streamid)) {
                            // connection.removeStream('screen');
                            var config = {};
                            config[streamid] = true;
                            _detachStream(_stream, config);
                        } else _detachStream(_stream, streamid);
                    }
                }

                if (!dontRenegotiate && connection.detachStreams.length) {
                    connection.renegotiate();
                }

                return;
            }

            var stream = connection.streams[streamid];

            // detach pre-attached streams
            if (!stream) return warn('No such stream exists. Stream-id:', streamid);

            // www.RTCMultiConnection.org/docs/detachStreams/
            connection.detachStreams.push(stream.streamid);

            log('removing stream', stream.streamid);
            onStreamEndedHandler(stream, connection);

            // todo: how to allow "stop" function?
            // connection.stopMediaStream(stream.stream)

            if (!dontRenegotiate) {
                connection.renegotiate();
            }
        };

        connection.switchStream = function(session) {
            if (connection.numberOfConnectedUsers <= 0) {
                // no connections
                setTimeout(function() {
                    // try again
                    connection.switchStream(session);
                }, 1000);
                return;
            }

            connection.removeStream('all', true);
            connection.addStream(session);
        };

        // www.RTCMultiConnection.org/docs/sendCustomMessage/
        connection.sendCustomMessage = function(message) {
            if (!rtcMultiSession || !rtcMultiSession.defaultSocket) {
                return setTimeout(function() {
                    connection.sendCustomMessage(message);
                }, 1000);
            }

            rtcMultiSession.defaultSocket.send({
                customMessage: true,
                message: message
            });
        };

        // set RTCMultiConnection defaults on constructor invocation
        setDefaults(connection);
    };

    function RTCMultiSession(connection, callbackForSignalingReady) {
        var socketObjects = {};
        var sockets = [];
        var rtcMultiSession = this;
        var participants = {};

        if (!rtcMultiSession.fileBufferReader && connection.session.data && connection.enableFileSharing) {
            initFileBufferReader(connection, function(fbr) {
                rtcMultiSession.fileBufferReader = fbr;
            });
        }

        var textReceiver = new TextReceiver(connection);

        function onDataChannelMessage(e) {
            if (e.data.checkingPresence && connection.channels[e.userid]) {
                connection.channels[e.userid].send({
                    presenceDetected: true
                });
                return;
            }

            if (e.data.presenceDetected && connection.peers[e.userid]) {
                connection.peers[e.userid].connected = true;
                return;
            }

            if (e.data.type === 'text') {
                textReceiver.receive(e.data, e.userid, e.extra);
            } else {
                if (connection.autoTranslateText) {
                    e.original = e.data;
                    connection.Translator.TranslateText(e.data, function(translatedText) {
                        e.data = translatedText;
                        connection.onmessage(e);
                    });
                } else connection.onmessage(e);
            }
        }

        function onNewSession(session) {
            if (connection.skipOnNewSession) return;

            if (!session.session) session.session = {};
            if (!session.extra) session.extra = {};

            // todo: make sure this works as expected.
            // i.e. "onNewSession" should be fired only for 
            // sessionid that is passed over "connect" method.
            if (connection.sessionid && session.sessionid != connection.sessionid) return;

            if (connection.onNewSession) {
                session.join = function(forceSession) {
                    if (!forceSession) return connection.join(session);

                    for (var f in forceSession) {
                        session.session[f] = forceSession[f];
                    }

                    // keeping previous state
                    var isDontCaptureUserMedia = connection.dontCaptureUserMedia;

                    connection.dontCaptureUserMedia = false;
                    connection.captureUserMedia(function() {
                        connection.dontCaptureUserMedia = true;
                        connection.join(session);

                        // returning back previous state
                        connection.dontCaptureUserMedia = isDontCaptureUserMedia;
                    }, forceSession);
                };
                if (!session.extra) session.extra = {};

                return connection.onNewSession(session);
            }

            connection.join(session);
        }

        function updateSocketForLocalStreams(socket) {
            for (var i = 0; i < connection.localStreamids.length; i++) {
                var streamid = connection.localStreamids[i];
                if (connection.streams[streamid]) {
                    // using "sockets" array to keep references of all sockets using 
                    // this media stream; so we can fire "onStreamEndedHandler" among all users.
                    connection.streams[streamid].sockets.push(socket);
                }
            }
        }

        function newPrivateSocket(_config) {
            var socketConfig = {
                channel: _config.channel,
                onmessage: socketResponse,
                onopen: function(_socket) {
                    if (_socket) socket = _socket;

                    if (isofferer && !peer) {
                        peerConfig.session = connection.session;
                        if (!peer) peer = new PeerConnection();
                        peer.create('offer', peerConfig);
                    }

                    _config.socketIndex = socket.index = sockets.length;
                    socketObjects[socketConfig.channel] = socket;
                    sockets[_config.socketIndex] = socket;

                    updateSocketForLocalStreams(socket);

                    if (!socket.__push) {
                        socket.__push = socket.send;
                        socket.send = function(message) {
                            message.userid = message.userid || connection.userid;
                            message.extra = message.extra || connection.extra || {};

                            socket.__push(message);
                        };
                    }
                }
            };

            socketConfig.callback = function(_socket) {
                socket = _socket;
                socketConfig.onopen();
            };

            var socket = connection.openSignalingChannel(socketConfig);
            if (socket) socketConfig.onopen(socket);

            var isofferer = _config.isofferer,
                peer;

            var peerConfig = {
                onopen: onChannelOpened,
                onicecandidate: function(candidate) {
                    if (!connection.candidates) throw 'ICE candidates are mandatory.';
                    if (!connection.iceProtocols) throw 'At least one must be true; UDP or TCP.';

                    var iceCandidates = connection.candidates;

                    var stun = iceCandidates.stun;
                    var turn = iceCandidates.turn;

                    if (!isNull(iceCandidates.reflexive)) stun = iceCandidates.reflexive;
                    if (!isNull(iceCandidates.relay)) turn = iceCandidates.relay;

                    if (!iceCandidates.host && !!candidate.candidate.match(/a=candidate.*typ host/g)) return;
                    if (!turn && !!candidate.candidate.match(/a=candidate.*typ relay/g)) return;
                    if (!stun && !!candidate.candidate.match(/a=candidate.*typ srflx/g)) return;

                    var protocol = connection.iceProtocols;

                    if (!protocol.udp && !!candidate.candidate.match(/a=candidate.* udp/g)) return;
                    if (!protocol.tcp && !!candidate.candidate.match(/a=candidate.* tcp/g)) return;

                    if (!window.selfNPObject) window.selfNPObject = candidate;

                    socket && socket.send({
                        candidate: JSON.stringify({
                            candidate: candidate.candidate,
                            sdpMid: candidate.sdpMid,
                            sdpMLineIndex: candidate.sdpMLineIndex
                        })
                    });
                },
                onmessage: function(data) {
                    if (!data) return;

                    var abToStr = ab2str(data);
                    if (abToStr.indexOf('"userid":') != -1) {
                        abToStr = JSON.parse(abToStr);
                        onDataChannelMessage(abToStr);
                    } else if (data instanceof ArrayBuffer || data instanceof DataView) {
                        if (!connection.enableFileSharing) {
                            throw 'It seems that receiving data is either "Blob" or "File" but file sharing is disabled.';
                        }

                        if (!rtcMultiSession.fileBufferReader) {
                            var that = this;
                            initFileBufferReader(connection, function(fbr) {
                                rtcMultiSession.fileBufferReader = fbr;
                                that.onmessage(data);
                            });
                            return;
                        }

                        var fileBufferReader = rtcMultiSession.fileBufferReader;

                        fileBufferReader.convertToObject(data, function(chunk) {
                            if (chunk.maxChunks || chunk.readyForNextChunk) {
                                // if target peer requested next chunk
                                if (chunk.readyForNextChunk) {
                                    fileBufferReader.getNextChunk(chunk.uuid, function(nextChunk, isLastChunk, extra) {
                                        rtcMultiSession.send(nextChunk);
                                    });
                                    return;
                                }

                                // if chunk is received
                                fileBufferReader.addChunk(chunk, function(promptNextChunk) {
                                    // request next chunk
                                    rtcMultiSession.send(promptNextChunk);
                                });
                                return;
                            }

                            connection.onmessage({
                                data: chunk,
                                userid: _config.userid,
                                extra: _config.extra
                            });
                        });
                        return;
                    }
                },
                onaddstream: function(stream, session) {
                    session = session || _config.renegotiate || connection.session;

                    // if it is data-only connection; then return.
                    if (isData(session)) return;

                    if (session.screen && (session.audio || session.video)) {
                        if (!_config.gotAudioOrVideo) {
                            // audio/video are fired earlier than screen
                            _config.gotAudioOrVideo = true;
                            session.screen = false;
                        } else {
                            // screen stream is always fired later
                            session.audio = false;
                            session.video = false;
                        }
                    }

                    var preMuted = {};

                    if (_config.streaminfo) {
                        var streaminfo = _config.streaminfo.split('----');
                        var strInfo = JSON.parse(streaminfo[streaminfo.length - 1]);

                        if (!isIE) {
                            stream.streamid = strInfo.streamid;
                            stream.isScreen = !!strInfo.isScreen;
                            stream.isVideo = !!strInfo.isVideo;
                            stream.isAudio = !!strInfo.isAudio;
                            preMuted = strInfo.preMuted;
                        }

                        streaminfo.pop();
                        _config.streaminfo = streaminfo.join('----');
                    }

                    var mediaElement = createMediaElement(stream, merge({
                        remote: true
                    }, session));

                    if (connection.setDefaultEventsForMediaElement) {
                        connection.setDefaultEventsForMediaElement(mediaElement, stream.streamid);
                    }

                    if (!isPluginRTC && !stream.getVideoTracks().length) {
                        function eventListener() {
                            setTimeout(function() {
                                mediaElement.muted = false;
                                afterRemoteStreamStartedFlowing({
                                    mediaElement: mediaElement,
                                    session: session,
                                    stream: stream,
                                    preMuted: preMuted
                                });
                            }, 3000);

                            mediaElement.removeEventListener('play', eventListener);
                        }
                        return mediaElement.addEventListener('play', eventListener, false);
                    }

                    waitUntilRemoteStreamStartsFlowing({
                        mediaElement: mediaElement,
                        session: session,
                        stream: stream,
                        preMuted: preMuted
                    });
                },

                onremovestream: function(stream) {
                    if (stream && stream.streamid) {
                        stream = connection.streams[stream.streamid];
                        if (stream) {
                            log('on:stream:ended via on:remove:stream', stream);
                            onStreamEndedHandler(stream, connection);
                        }
                    } else log('on:remove:stream', stream);
                },

                onclose: function(e) {
                    e.extra = _config.extra;
                    e.userid = _config.userid;
                    connection.onclose(e);

                    // suggested in #71 by "efaj"
                    if (connection.channels[e.userid]) {
                        delete connection.channels[e.userid];
                    }
                },
                onerror: function(e) {
                    e.extra = _config.extra;
                    e.userid = _config.userid;
                    connection.onerror(e);
                },

                oniceconnectionstatechange: function(event) {
                    log('oniceconnectionstatechange', toStr(event));

                    if (peer.connection && peer.connection.iceConnectionState == 'connected' && peer.connection.iceGatheringState == 'complete' && peer.connection.signalingState == 'stable' && connection.numberOfConnectedUsers == 1) {
                        connection.onconnected({
                            userid: _config.userid,
                            extra: _config.extra,
                            peer: connection.peers[_config.userid],
                            targetuser: _config.userinfo
                        });
                    }

                    if (!connection.isInitiator && peer.connection && peer.connection.iceConnectionState == 'connected' && peer.connection.iceGatheringState == 'complete' && peer.connection.signalingState == 'stable' && connection.numberOfConnectedUsers == 1) {
                        connection.onstatechange({
                            userid: _config.userid,
                            extra: _config.extra,
                            name: 'connected-with-initiator',
                            reason: 'ICE connection state seems connected; gathering state is completed; and signaling state is stable.'
                        });
                    }

                    if (connection.peers[_config.userid] && connection.peers[_config.userid].oniceconnectionstatechange) {
                        connection.peers[_config.userid].oniceconnectionstatechange(event);
                    }

                    // if ICE connectivity check is failed; renegotiate or redial
                    if (connection.peers[_config.userid] && connection.peers[_config.userid].peer.connection.iceConnectionState == 'failed') {
                        connection.onfailed({
                            userid: _config.userid,
                            extra: _config.extra,
                            peer: connection.peers[_config.userid],
                            targetuser: _config.userinfo
                        });
                    }

                    if (connection.peers[_config.userid] && connection.peers[_config.userid].peer.connection.iceConnectionState == 'disconnected') {
                        !peer.connection.renegotiate && connection.ondisconnected({
                            userid: _config.userid,
                            extra: _config.extra,
                            peer: connection.peers[_config.userid],
                            targetuser: _config.userinfo
                        });
                        peer.connection.renegotiate = false;
                    }

                    if (!connection.autoReDialOnFailure) return;

                    if (connection.peers[_config.userid]) {
                        if (connection.peers[_config.userid].peer.connection.iceConnectionState != 'disconnected') {
                            _config.redialing = false;
                        }

                        if (connection.peers[_config.userid].peer.connection.iceConnectionState == 'disconnected' && !_config.redialing) {
                            _config.redialing = true;
                            warn('Peer connection is closed.', toStr(connection.peers[_config.userid].peer.connection), 'ReDialing..');
                            connection.peers[_config.userid].socket.send({
                                redial: true
                            });

                            // to make sure all old "remote" streams are also removed!
                            connection.streams.remove({
                                remote: true,
                                userid: _config.userid
                            });
                        }
                    }
                },

                onsignalingstatechange: function(event) {
                    log('onsignalingstatechange', toStr(event));
                },

                attachStreams: connection.dontAttachStream ? [] : connection.attachStreams,
                iceServers: connection.iceServers,
                rtcConfiguration: connection.rtcConfiguration,
                bandwidth: connection.bandwidth,
                sdpConstraints: connection.sdpConstraints,
                optionalArgument: connection.optionalArgument,
                disableDtlsSrtp: connection.disableDtlsSrtp,
                dataChannelDict: connection.dataChannelDict,
                preferSCTP: connection.preferSCTP,

                onSessionDescription: function(sessionDescription, streaminfo) {
                    sendsdp({
                        sdp: sessionDescription,
                        socket: socket,
                        streaminfo: streaminfo
                    });
                },
                trickleIce: connection.trickleIce,
                processSdp: connection.processSdp,
                sendStreamId: function(stream) {
                    socket && socket.send({
                        streamid: stream.streamid,
                        isScreen: !!stream.isScreen,
                        isAudio: !!stream.isAudio,
                        isVideo: !!stream.isVideo
                    });
                },
                rtcMultiConnection: connection
            };

            function waitUntilRemoteStreamStartsFlowing(args) {
                // chrome for android may have some features missing
                if (isMobileDevice || isPluginRTC || (isNull(connection.waitUntilRemoteStreamStartsFlowing) || !connection.waitUntilRemoteStreamStartsFlowing)) {
                    return afterRemoteStreamStartedFlowing(args);
                }

                if (!args.numberOfTimes) args.numberOfTimes = 0;
                args.numberOfTimes++;

                if (!(args.mediaElement.readyState <= HTMLMediaElement.HAVE_CURRENT_DATA || args.mediaElement.paused || args.mediaElement.currentTime <= 0)) {
                    return afterRemoteStreamStartedFlowing(args);
                }

                if (args.numberOfTimes >= 60) { // wait 60 seconds while video is delivered!
                    return socket.send({
                        failedToReceiveRemoteVideo: true,
                        streamid: args.stream.streamid
                    });
                }

                setTimeout(function() {
                    log('Waiting for incoming remote stream to be started flowing: ' + args.numberOfTimes + ' seconds.');
                    waitUntilRemoteStreamStartsFlowing(args);
                }, 900);
            }

            function initFakeChannel() {
                if (!connection.fakeDataChannels || connection.channels[_config.userid]) return;

                // for non-data connections; allow fake data sender!
                if (!connection.session.data) {
                    var fakeChannel = {
                        send: function(data) {
                            socket.send({
                                fakeData: data
                            });
                        },
                        readyState: 'open'
                    };
                    // connection.channels['user-id'].send(data);
                    connection.channels[_config.userid] = {
                        channel: fakeChannel,
                        send: function(data) {
                            this.channel.send(data);
                        }
                    };
                    peerConfig.onopen(fakeChannel);
                }
            }

            function afterRemoteStreamStartedFlowing(args) {
                var mediaElement = args.mediaElement;
                var session = args.session;
                var stream = args.stream;

                stream.onended = function() {
                    if (streamedObject.mediaElement && !streamedObject.mediaElement.parentNode && document.getElementById(stream.streamid)) {
                        streamedObject.mediaElement = document.getElementById(stream.streamid);
                    }

                    onStreamEndedHandler(streamedObject, connection);
                };

                var streamedObject = {
                    mediaElement: mediaElement,

                    stream: stream,
                    streamid: stream.streamid,
                    session: session || connection.session,

                    blobURL: isPluginRTC ? '' : mediaElement.mozSrcObject ? URL.createObjectURL(stream) : mediaElement.src,
                    type: 'remote',

                    extra: _config.extra,
                    userid: _config.userid,

                    isVideo: isPluginRTC ? !!session.video : !!stream.isVideo,
                    isAudio: isPluginRTC ? !!session.audio && !session.video : !!stream.isAudio,
                    isScreen: !!stream.isScreen,
                    isInitiator: !!_config.isInitiator,

                    rtcMultiConnection: connection,
                    socket: socket
                };

                // connection.streams['stream-id'].mute({audio:true})
                connection.streams[stream.streamid] = connection._getStream(streamedObject);
                connection.onstream(streamedObject);

                if (!isEmpty(args.preMuted) && (args.preMuted.audio || args.preMuted.video)) {
                    var fakeObject = merge({}, streamedObject);
                    fakeObject.session = merge(fakeObject.session, args.preMuted);

                    fakeObject.isAudio = !!fakeObject.session.audio && !fakeObject.session.video;
                    fakeObject.isVideo = !!fakeObject.session.video;
                    fakeObject.isScreen = false;

                    connection.onmute(fakeObject);
                }

                log('on:add:stream', streamedObject);

                onSessionOpened();

                if (connection.onspeaking) {
                    initHark({
                        stream: stream,
                        streamedObject: streamedObject,
                        connection: connection
                    });
                }
            }

            function onChannelOpened(channel) {
                _config.channel = channel;

                // connection.channels['user-id'].send(data);
                connection.channels[_config.userid] = {
                    channel: _config.channel,
                    send: function(data) {
                        connection.send(data, this.channel);
                    }
                };

                connection.onopen({
                    extra: _config.extra,
                    userid: _config.userid,
                    channel: channel
                });

                // fetch files from file-queue
                for (var q in connection.fileQueue) {
                    connection.send(connection.fileQueue[q], channel);
                }

                if (isData(connection.session)) onSessionOpened();

                if (connection.partOfScreen && connection.partOfScreen.sharing) {
                    connection.peers[_config.userid].sharePartOfScreen(connection.partOfScreen);
                }
            }

            function updateSocket() {
                // todo: need to check following {if-block} MUST not affect "redial" process
                if (socket.userid == _config.userid)
                    return;

                socket.userid = _config.userid;
                sockets[_config.socketIndex] = socket;

                connection.numberOfConnectedUsers++;
                // connection.peers['user-id'].addStream({audio:true})
                connection.peers[_config.userid] = {
                    socket: socket,
                    peer: peer,
                    userid: _config.userid,
                    extra: _config.extra,
                    userinfo: _config.userinfo,
                    addStream: function(session00) {
                        // connection.peers['user-id'].addStream({audio: true, video: true);

                        connection.addStream(session00, this.socket);
                    },
                    removeStream: function(streamid) {
                        if (!connection.streams[streamid])
                            return warn('No such stream exists. Stream-id:', streamid);

                        this.peer.connection.removeStream(connection.streams[streamid].stream);
                        this.renegotiate();
                    },
                    renegotiate: function(stream, session) {
                        // connection.peers['user-id'].renegotiate();

                        connection.renegotiate(stream, session);
                    },
                    changeBandwidth: function(bandwidth) {
                        // connection.peers['user-id'].changeBandwidth();

                        if (!bandwidth) throw 'You MUST pass bandwidth object.';
                        if (isString(bandwidth)) throw 'Pass object for bandwidth instead of string; e.g. {audio:10, video:20}';

                        // set bandwidth for self
                        this.peer.bandwidth = bandwidth;

                        // ask remote user to synchronize bandwidth
                        this.socket.send({
                            changeBandwidth: true,
                            bandwidth: bandwidth
                        });
                    },
                    sendCustomMessage: function(message) {
                        // connection.peers['user-id'].sendCustomMessage();

                        this.socket.send({
                            customMessage: true,
                            message: message
                        });
                    },
                    onCustomMessage: function(message) {
                        log('Received "private" message from', this.userid,
                            isString(message) ? message : toStr(message));
                    },
                    drop: function(dontSendMessage) {
                        // connection.peers['user-id'].drop();

                        for (var stream in connection.streams) {
                            if (connection._skip.indexOf(stream) == -1) {
                                stream = connection.streams[stream];

                                if (stream.userid == connection.userid && stream.type == 'local') {
                                    this.peer.connection.removeStream(stream.stream);
                                    onStreamEndedHandler(stream, connection);
                                }

                                if (stream.type == 'remote' && stream.userid == this.userid) {
                                    onStreamEndedHandler(stream, connection);
                                }
                            }
                        }

                        !dontSendMessage && this.socket.send({
                            drop: true
                        });
                    },
                    hold: function(holdMLine) {
                        // connection.peers['user-id'].hold();

                        if (peer.prevCreateType == 'answer') {
                            this.socket.send({
                                unhold: true,
                                holdMLine: holdMLine || 'both',
                                takeAction: true
                            });
                            return;
                        }

                        this.socket.send({
                            hold: true,
                            holdMLine: holdMLine || 'both'
                        });

                        this.peer.hold = true;
                        this.fireHoldUnHoldEvents({
                            kind: holdMLine,
                            isHold: true,
                            userid: connection.userid,
                            remoteUser: this.userid
                        });
                    },
                    unhold: function(holdMLine) {
                        // connection.peers['user-id'].unhold();

                        if (peer.prevCreateType == 'answer') {
                            this.socket.send({
                                unhold: true,
                                holdMLine: holdMLine || 'both',
                                takeAction: true
                            });
                            return;
                        }

                        this.socket.send({
                            unhold: true,
                            holdMLine: holdMLine || 'both'
                        });

                        this.peer.hold = false;
                        this.fireHoldUnHoldEvents({
                            kind: holdMLine,
                            isHold: false,
                            userid: connection.userid,
                            remoteUser: this.userid
                        });
                    },
                    fireHoldUnHoldEvents: function(e) {
                        // this method is for inner usages only!

                        var isHold = e.isHold;
                        var kind = e.kind;
                        var userid = e.remoteUser || e.userid;

                        // hold means inactive a specific media line!
                        // a media line can contain multiple synced sources (ssrc)
                        // i.e. a media line can reference multiple tracks!
                        // that's why hold will affect all relevant tracks in a specific media line!
                        for (var stream in connection.streams) {
                            if (connection._skip.indexOf(stream) == -1) {
                                stream = connection.streams[stream];

                                if (stream.userid == userid) {
                                    // www.RTCMultiConnection.org/docs/onhold/
                                    if (isHold)
                                        connection.onhold(merge({
                                            kind: kind
                                        }, stream));

                                    // www.RTCMultiConnection.org/docs/onunhold/
                                    if (!isHold)
                                        connection.onunhold(merge({
                                            kind: kind
                                        }, stream));
                                }
                            }
                        }
                    },
                    redial: function() {
                        // connection.peers['user-id'].redial();

                        // 1st of all; remove all relevant remote media streams
                        for (var stream in connection.streams) {
                            if (connection._skip.indexOf(stream) == -1) {
                                stream = connection.streams[stream];

                                if (stream.userid == this.userid && stream.type == 'remote') {
                                    onStreamEndedHandler(stream, connection);
                                }
                            }
                        }

                        log('ReDialing...');

                        socket.send({
                            recreatePeer: true
                        });

                        peer = new PeerConnection();
                        peer.create('offer', peerConfig);
                    },
                    sharePartOfScreen: function(args) {
                        // www.RTCMultiConnection.org/docs/onpartofscreen/
                        var that = this;
                        var lastScreenshot = '';

                        function partOfScreenCapturer() {
                            // if stopped
                            if (that.stopPartOfScreenSharing) {
                                that.stopPartOfScreenSharing = false;

                                if (connection.onpartofscreenstopped) {
                                    connection.onpartofscreenstopped();
                                }
                                return;
                            }

                            // if paused
                            if (that.pausePartOfScreenSharing) {
                                if (connection.onpartofscreenpaused) {
                                    connection.onpartofscreenpaused();
                                }

                                return setTimeout(partOfScreenCapturer, args.interval || 200);
                            }

                            capturePartOfScreen({
                                element: args.element,
                                connection: connection,
                                callback: function(screenshot) {
                                    if (!connection.channels[that.userid]) {
                                        throw 'No such data channel exists.';
                                    }

                                    // don't share repeated content
                                    if (screenshot != lastScreenshot) {
                                        lastScreenshot = screenshot;
                                        connection.channels[that.userid].send({
                                            screenshot: screenshot,
                                            isPartOfScreen: true
                                        });
                                    }

                                    // "once" can be used to share single screenshot
                                    !args.once && setTimeout(partOfScreenCapturer, args.interval || 200);
                                }
                            });
                        }

                        partOfScreenCapturer();
                    },
                    getConnectionStats: function(callback, interval) {
                        if (!callback) throw 'callback is mandatory.';

                        if (!window.getConnectionStats) {
                            loadScript(connection.resources.getConnectionStats, invoker);
                        } else invoker();

                        function invoker() {
                            RTCPeerConnection.prototype.getConnectionStats = window.getConnectionStats;
                            peer.connection && peer.connection.getConnectionStats(callback, interval);
                        }
                    },
                    takeSnapshot: function(callback) {
                        takeSnapshot({
                            userid: this.userid,
                            connection: connection,
                            callback: callback
                        });
                    }
                };
            }

            function onSessionOpened() {
                // original conferencing infrastructure!
                if (connection.isInitiator && getLength(participants) && getLength(participants) <= connection.maxParticipantsAllowed) {
                    if (!connection.session.oneway && !connection.session.broadcast) {
                        defaultSocket.send({
                            sessionid: connection.sessionid,
                            newParticipant: _config.userid || socket.channel,
                            userData: {
                                userid: _config.userid || socket.channel,
                                extra: _config.extra
                            }
                        });
                    }
                }

                // 1st: renegotiation is supported only on chrome
                // 2nd: must not renegotiate same media multiple times
                // 3rd: todo: make sure that target-user has no such "renegotiated" media.
                if (_config.userinfo.browser == 'chrome' && !_config.renegotiatedOnce) {
                    // this code snippet is added to make sure that "previously-renegotiated" streams are also 
                    // renegotiated to this new user
                    for (var rSession in connection.renegotiatedSessions) {
                        _config.renegotiatedOnce = true;

                        if (connection.renegotiatedSessions[rSession] && connection.renegotiatedSessions[rSession].stream) {
                            connection.peers[_config.userid].renegotiate(connection.renegotiatedSessions[rSession].stream, connection.renegotiatedSessions[rSession].session);
                        }
                    }
                }
            }

            function socketResponse(response) {
                if (isRMSDeleted) return;

                if (response.userid == connection.userid)
                    return;

                if (response.sdp) {
                    _config.userid = response.userid;
                    _config.extra = response.extra || {};
                    _config.renegotiate = response.renegotiate;
                    _config.streaminfo = response.streaminfo;
                    _config.isInitiator = response.isInitiator;
                    _config.userinfo = response.userinfo;

                    var sdp = JSON.parse(response.sdp);

                    if (sdp.type == 'offer') {
                        // to synchronize SCTP or RTP
                        peerConfig.preferSCTP = !!response.preferSCTP;
                        connection.fakeDataChannels = !!response.fakeDataChannels;
                    }

                    // initializing fake channel
                    initFakeChannel();

                    sdpInvoker(sdp, response.labels);
                }

                if (response.candidate) {
                    peer && peer.addIceCandidate(JSON.parse(response.candidate));
                }

                if (response.streamid) {
                    if (!rtcMultiSession.streamids) {
                        rtcMultiSession.streamids = {};
                    }
                    if (!rtcMultiSession.streamids[response.streamid]) {
                        rtcMultiSession.streamids[response.streamid] = response.streamid;
                        connection.onstreamid(response);
                    }
                }

                if (response.mute || response.unmute) {
                    if (response.promptMuteUnmute) {
                        if (!connection.privileges.canMuteRemoteStream) {
                            connection.onstatechange({
                                userid: response.userid,
                                extra: response.extra,
                                name: 'mute-request-denied',
                                reason: response.userid + ' tried to mute your stream; however "privileges.canMuteRemoteStream" is "false".'
                            });
                            return;
                        }

                        if (connection.streams[response.streamid]) {
                            if (response.mute && !connection.streams[response.streamid].muted) {
                                connection.streams[response.streamid].mute(response.session);
                            }
                            if (response.unmute && connection.streams[response.streamid].muted) {
                                connection.streams[response.streamid].unmute(response.session);
                            }
                        }
                    } else {
                        var streamObject = {};
                        if (connection.streams[response.streamid]) {
                            streamObject = connection.streams[response.streamid];
                        }

                        var session = response.session;
                        var fakeObject = merge({}, streamObject);
                        fakeObject.session = session;

                        fakeObject.isAudio = !!fakeObject.session.audio && !fakeObject.session.video;
                        fakeObject.isVideo = !!fakeObject.session.video;
                        fakeObject.isScreen = !!fakeObject.session.screen;

                        if (response.mute) connection.onmute(fakeObject || response);
                        if (response.unmute) connection.onunmute(fakeObject || response);
                    }
                }

                if (response.isVolumeChanged) {
                    log('Volume of stream: ' + response.streamid + ' has changed to: ' + response.volume);
                    if (connection.streams[response.streamid]) {
                        var mediaElement = connection.streams[response.streamid].mediaElement;
                        if (mediaElement) mediaElement.volume = response.volume;
                    }
                }

                // to stop local stream
                if (response.stopped) {
                    if (connection.streams[response.streamid]) {
                        onStreamEndedHandler(connection.streams[response.streamid], connection);
                    }
                }

                // to stop remote stream
                if (response.promptStreamStop /* && !connection.isInitiator */ ) {
                    if (!connection.privileges.canStopRemoteStream) {
                        connection.onstatechange({
                            userid: response.userid,
                            extra: response.extra,
                            name: 'stop-request-denied',
                            reason: response.userid + ' tried to stop your stream; however "privileges.canStopRemoteStream" is "false".'
                        });
                        return;
                    }
                    warn('Remote stream has been manually stopped!');
                    if (connection.streams[response.streamid]) {
                        connection.streams[response.streamid].stop();
                    }
                }

                if (response.left) {
                    // firefox is unable to stop remote streams
                    // firefox doesn't auto stop streams when peer.close() is called.
                    if (isFirefox) {
                        var userLeft = response.userid;
                        for (var stream in connection.streams) {
                            stream = connection.streams[stream];
                            if (stream.userid == userLeft) {
                                connection.stopMediaStream(stream);
                                onStreamEndedHandler(stream, connection);
                            }
                        }
                    }

                    if (peer && peer.connection) {
                        // todo: verify if-block's 2nd condition
                        if (peer.connection.signalingState != 'closed' && peer.connection.iceConnectionState.search(/disconnected|failed/gi) == -1) {
                            peer.connection.close();
                        }
                        peer.connection = null;
                    }

                    if (participants[response.userid]) delete participants[response.userid];

                    if (response.closeEntireSession) {
                        connection.onSessionClosed(response);
                        connection.leave();
                        return;
                    }

                    connection.remove(response.userid);

                    onLeaveHandler({
                        userid: response.userid,
                        extra: response.extra || {},
                        entireSessionClosed: !!response.closeEntireSession
                    }, connection);
                }

                // keeping session active even if initiator leaves
                if (response.playRoleOfBroadcaster) {
                    if (response.extra) {
                        // clone extra-data from initial moderator
                        connection.extra = merge(connection.extra, response.extra);
                    }
                    if (response.participants) {
                        participants = response.participants;

                        // make sure that if 2nd initiator leaves; control is shifted to 3rd person.
                        if (participants[connection.userid]) {
                            delete participants[connection.userid];
                        }

                        if (sockets[0] && sockets[0].userid == response.userid) {
                            delete sockets[0];
                            sockets = swap(sockets);
                        }

                        if (socketObjects[response.userid]) {
                            delete socketObjects[response.userid];
                        }
                    }

                    setTimeout(connection.playRoleOfInitiator, 2000);
                }

                if (response.changeBandwidth) {
                    if (!connection.peers[response.userid]) throw 'No such peer exists.';

                    // synchronize bandwidth
                    connection.peers[response.userid].peer.bandwidth = response.bandwidth;

                    // renegotiate to apply bandwidth
                    connection.peers[response.userid].renegotiate();
                }

                if (response.customMessage) {
                    if (!connection.peers[response.userid]) throw 'No such peer exists.';
                    if (response.message.ejected) {
                        if (connection.sessionDescriptions[connection.sessionid].userid != response.userid) {
                            throw 'only initiator can eject a user.';
                        }
                        // initiator ejected this user
                        connection.leave();

                        connection.onSessionClosed({
                            userid: response.userid,
                            extra: response.extra || _config.extra,
                            isEjected: true
                        });
                    } else connection.peers[response.userid].onCustomMessage(response.message);
                }

                if (response.drop) {
                    if (!connection.peers[response.userid]) throw 'No such peer exists.';
                    connection.peers[response.userid].drop(true);
                    connection.peers[response.userid].renegotiate();

                    connection.ondrop(response.userid);
                }

                if (response.hold || response.unhold) {
                    if (!connection.peers[response.userid]) throw 'No such peer exists.';

                    if (response.takeAction) {
                        connection.peers[response.userid][!!response.hold ? 'hold' : 'unhold'](response.holdMLine);
                        return;
                    }

                    connection.peers[response.userid].peer.hold = !!response.hold;
                    connection.peers[response.userid].peer.holdMLine = response.holdMLine;

                    socket.send({
                        isRenegotiate: true
                    });

                    connection.peers[response.userid].fireHoldUnHoldEvents({
                        kind: response.holdMLine,
                        isHold: !!response.hold,
                        userid: response.userid
                    });
                }

                if (response.isRenegotiate) {
                    connection.peers[response.userid].renegotiate(null, connection.peers[response.userid].peer.session);
                }

                // fake data channels!
                if (response.fakeData) {
                    peerConfig.onmessage(response.fakeData);
                }

                // sometimes we don't need to renegotiate e.g. when peers are disconnected
                // or if it is firefox
                if (response.recreatePeer) {
                    peer = new PeerConnection();
                }

                // remote video failed either out of ICE gathering process or ICE connectivity check-up
                // or IceAgent was unable to locate valid candidates/ports.
                if (response.failedToReceiveRemoteVideo) {
                    log('Remote peer hasn\'t received stream: ' + response.streamid + '. Renegotiating...');
                    if (connection.peers[response.userid]) {
                        connection.peers[response.userid].renegotiate();
                    }
                }

                if (response.redial) {
                    if (connection.peers[response.userid]) {
                        if (connection.peers[response.userid].peer.connection.iceConnectionState != 'disconnected') {
                            _config.redialing = false;
                        }

                        if (connection.peers[response.userid].peer.connection.iceConnectionState == 'disconnected' && !_config.redialing) {
                            _config.redialing = true;

                            warn('Peer connection is closed.', toStr(connection.peers[response.userid].peer.connection), 'ReDialing..');
                            connection.peers[response.userid].redial();
                        }
                    }
                }
            }

            connection.playRoleOfInitiator = function() {
                connection.dontCaptureUserMedia = true;
                connection.open();
                sockets = swap(sockets);
                connection.dontCaptureUserMedia = false;
            };

            connection.askToShareParticipants = function() {
                defaultSocket && defaultSocket.send({
                    askToShareParticipants: true
                });
            };

            connection.shareParticipants = function(args) {
                var message = {
                    joinUsers: participants,
                    userid: connection.userid,
                    extra: connection.extra
                };

                if (args) {
                    if (args.dontShareWith) message.dontShareWith = args.dontShareWith;
                    if (args.shareWith) message.shareWith = args.shareWith;
                }

                defaultSocket.send(message);
            };

            function sdpInvoker(sdp, labels) {
                if (sdp.type == 'answer') {
                    peer.setRemoteDescription(sdp);
                    updateSocket();
                    return;
                }
                if (!_config.renegotiate && sdp.type == 'offer') {
                    peerConfig.offerDescription = sdp;

                    peerConfig.session = connection.session;
                    if (!peer) peer = new PeerConnection();
                    peer.create('answer', peerConfig);

                    updateSocket();
                    return;
                }

                var session = _config.renegotiate;
                // detach streams
                detachMediaStream(labels, peer.connection);

                if (session.oneway || isData(session)) {
                    createAnswer();
                    delete _config.renegotiate;
                } else {
                    if (_config.capturing)
                        return;

                    _config.capturing = true;

                    connection.captureUserMedia(function(stream) {
                        _config.capturing = false;

                        peer.addStream(stream);

                        connection.renegotiatedSessions[JSON.stringify(_config.renegotiate)] = {
                            session: _config.renegotiate,
                            stream: stream
                        };

                        delete _config.renegotiate;

                        createAnswer();
                    }, _config.renegotiate);
                }

                function createAnswer() {
                    peer.recreateAnswer(sdp, session, function(_sdp, streaminfo) {
                        sendsdp({
                            sdp: _sdp,
                            socket: socket,
                            streaminfo: streaminfo
                        });
                        connection.detachStreams = [];
                    });
                }
            }
        }

        function detachMediaStream(labels, peer) {
            if (!labels) return;
            for (var i = 0; i < labels.length; i++) {
                var label = labels[i];
                if (connection.streams[label]) {
                    peer.removeStream(connection.streams[label].stream);
                }
            }
        }

        function sendsdp(e) {
            e.socket.send({
                sdp: JSON.stringify({
                    sdp: e.sdp.sdp,
                    type: e.sdp.type
                }),
                renegotiate: !!e.renegotiate ? e.renegotiate : false,
                streaminfo: e.streaminfo || '',
                labels: e.labels || [],
                preferSCTP: !!connection.preferSCTP,
                fakeDataChannels: !!connection.fakeDataChannels,
                isInitiator: !!connection.isInitiator,
                userinfo: {
                    browser: isFirefox ? 'firefox' : 'chrome'
                }
            });
        }

        // sharing new user with existing participants

        function onNewParticipant(response) {
            var channel = response.newParticipant;

            if (!channel || !!participants[channel] || channel == connection.userid)
                return;

            var new_channel = connection.token();
            newPrivateSocket({
                channel: new_channel,
                extra: response.userData ? response.userData.extra : response.extra,
                userid: response.userData ? response.userData.userid : response.userid
            });

            defaultSocket.send({
                participant: true,
                targetUser: channel,
                channel: new_channel
            });
        }

        // if a user leaves

        function clearSession() {
            connection.numberOfConnectedUsers--;

            var alertMessage = {
                left: true,
                extra: connection.extra || {},
                userid: connection.userid,
                sessionid: connection.sessionid
            };

            if (connection.isInitiator) {
                // if initiator wants to close entire session
                if (connection.autoCloseEntireSession) {
                    alertMessage.closeEntireSession = true;
                } else if (sockets[0]) {
                    // shift initiation control to another user
                    sockets[0].send({
                        playRoleOfBroadcaster: true,
                        userid: connection.userid,
                        extra: connection.extra,
                        participants: participants
                    });
                }
            }

            sockets.forEach(function(socket, i) {
                socket.send(alertMessage);

                if (socketObjects[socket.channel]) {
                    delete socketObjects[socket.channel];
                }

                delete sockets[i];
            });

            sockets = swap(sockets);

            connection.refresh();

            webAudioMediaStreamSources.forEach(function(mediaStreamSource) {
                // if source is connected; then chrome will crash on unload.
                mediaStreamSource.disconnect();
            });

            webAudioMediaStreamSources = [];
        }

        // www.RTCMultiConnection.org/docs/remove/
        connection.remove = function(userid) {
            if (rtcMultiSession.requestsFrom && rtcMultiSession.requestsFrom[userid]) delete rtcMultiSession.requestsFrom[userid];

            if (connection.peers[userid]) {
                if (connection.peers[userid].peer && connection.peers[userid].peer.connection) {
                    if (connection.peers[userid].peer.connection.signalingState != 'closed') {
                        connection.peers[userid].peer.connection.close();
                    }
                    connection.peers[userid].peer.connection = null;
                }
                delete connection.peers[userid];
            }
            if (participants[userid]) {
                delete participants[userid];
            }

            for (var stream in connection.streams) {
                stream = connection.streams[stream];
                if (stream.userid == userid) {
                    onStreamEndedHandler(stream, connection);
                    delete connection.streams[stream];
                }
            }

            if (socketObjects[userid]) {
                delete socketObjects[userid];
            }
        };

        // www.RTCMultiConnection.org/docs/refresh/
        connection.refresh = function() {
            // if firebase; remove data from firebase servers
            if (connection.isInitiator && !!connection.socket && !!connection.socket.remove) {
                connection.socket.remove();
            }

            participants = {};

            // to stop/remove self streams
            for (var i = 0; i < connection.attachStreams.length; i++) {
                connection.stopMediaStream(connection.attachStreams[i]);
            }

            // to allow capturing of identical streams
            currentUserMediaRequest = {
                streams: [],
                mutex: false,
                queueRequests: []
            };

            rtcMultiSession.isOwnerLeaving = true;

            connection.isInitiator = false;
            connection.isAcceptNewSession = true;
            connection.attachMediaStreams = [];
            connection.sessionDescription = null;
            connection.sessionDescriptions = {};
            connection.localStreamids = [];
            connection.preRecordedMedias = {};
            connection.snapshots = {};

            connection.numberOfConnectedUsers = 0;
            connection.numberOfSessions = 0;

            connection.attachStreams = [];
            connection.detachStreams = [];
            connection.fileQueue = {};
            connection.channels = {};
            connection.renegotiatedSessions = {};

            for (var peer in connection.peers) {
                if (peer != connection.userid) {
                    delete connection.peers[peer];
                }
            }

            // to make sure remote streams are also removed!
            for (var stream in connection.streams) {
                if (connection._skip.indexOf(stream) == -1) {
                    onStreamEndedHandler(connection.streams[stream], connection);
                    delete connection.streams[stream];
                }
            }

            socketObjects = {};
            sockets = [];
            participants = {};
        };

        // www.RTCMultiConnection.org/docs/reject/
        connection.reject = function(userid) {
            if (!isString(userid)) userid = userid.userid;
            defaultSocket.send({
                rejectedRequestOf: userid
            });

            // remove relevant data to allow him join again
            connection.remove(userid);
        };

        rtcMultiSession.leaveHandler = function(e) {
            if (!connection.leaveOnPageUnload) return;

            if (isNull(e.keyCode)) {
                return clearSession();
            }

            if (e.keyCode == 116) {
                clearSession();
            }
        };

        listenEventHandler('beforeunload', rtcMultiSession.leaveHandler);
        listenEventHandler('keyup', rtcMultiSession.leaveHandler);

        rtcMultiSession.onLineOffLineHandler = function() {
            if (!navigator.onLine) {
                rtcMultiSession.isOffLine = true;
            } else if (rtcMultiSession.isOffLine) {
                rtcMultiSession.isOffLine = !navigator.onLine;

                // defaultSocket = getDefaultSocketRef();

                // pending tasks should be resumed?
                // sockets should be reconnected?
                // peers should be re-established?
            }
        };

        listenEventHandler('load', rtcMultiSession.onLineOffLineHandler);
        listenEventHandler('online', rtcMultiSession.onLineOffLineHandler);
        listenEventHandler('offline', rtcMultiSession.onLineOffLineHandler);

        function onSignalingReady() {
            if (rtcMultiSession.signalingReady) return;
            rtcMultiSession.signalingReady = true;

            setTimeout(callbackForSignalingReady, 1000);

            if (!connection.isInitiator) {
                // as soon as signaling gateway is connected;
                // user should check existing rooms!
                defaultSocket && defaultSocket.send({
                    searchingForRooms: true
                });
            }
        }

        function joinParticipants(joinUsers) {
            for (var user in joinUsers) {
                if (!participants[joinUsers[user]]) {
                    onNewParticipant({
                        sessionid: connection.sessionid,
                        newParticipant: joinUsers[user],
                        userid: connection.userid,
                        extra: connection.extra
                    });
                }
            }
        }

        function getDefaultSocketRef() {
            return connection.openSignalingChannel({
                onmessage: function(response) {
                    // RMS == RTCMultiSession
                    if (isRMSDeleted) return;

                    // if message is sent by same user
                    if (response.userid == connection.userid) return;

                    if (response.sessionid && response.userid) {
                        if (!connection.sessionDescriptions[response.sessionid]) {
                            connection.numberOfSessions++;
                            connection.sessionDescriptions[response.sessionid] = response;

                            // fire "onNewSession" only if:
                            // 1) "isAcceptNewSession" boolean is true
                            // 2) "sessionDescriptions" object isn't having same session i.e. to prevent duplicate invocations
                            if (connection.isAcceptNewSession) {

                                if (!connection.dontOverrideSession) {
                                    connection.session = response.session;
                                }

                                onNewSession(response);
                            }
                        }
                    }

                    if (response.newParticipant && !connection.isAcceptNewSession && rtcMultiSession.broadcasterid === response.userid) {
                        if (response.newParticipant != connection.userid) {
                            onNewParticipant(response);
                        }
                    }

                    if (getLength(participants) < connection.maxParticipantsAllowed && response.targetUser == connection.userid && response.participant) {
                        if (connection.peers[response.userid] && !connection.peers[response.userid].peer) {
                            delete participants[response.userid];
                            delete connection.peers[response.userid];
                            connection.isAcceptNewSession = true;
                            return acceptRequest(response);
                        }

                        if (!participants[response.userid]) {
                            acceptRequest(response);
                        }
                    }

                    if (response.acceptedRequestOf == connection.userid) {
                        connection.onstatechange({
                            userid: response.userid,
                            extra: response.extra,
                            name: 'request-accepted',
                            reason: response.userid + ' accepted your participation request.'
                        });
                    }

                    if (response.rejectedRequestOf == connection.userid) {
                        connection.onstatechange({
                            userid: response.userid,
                            extra: response.extra,
                            name: 'request-rejected',
                            reason: response.userid + ' rejected your participation request.'
                        });
                    }

                    if (response.customMessage) {
                        if (response.message.drop) {
                            connection.ondrop(response.userid);

                            connection.attachStreams = [];
                            // "drop" should detach all local streams
                            for (var stream in connection.streams) {
                                if (connection._skip.indexOf(stream) == -1) {
                                    stream = connection.streams[stream];
                                    if (stream.type == 'local') {
                                        connection.detachStreams.push(stream.streamid);
                                        onStreamEndedHandler(stream, connection);
                                    } else onStreamEndedHandler(stream, connection);
                                }
                            }

                            if (response.message.renegotiate) {
                                // renegotiate; so "peer.removeStream" happens.
                                connection.renegotiate();
                            }
                        } else if (connection.onCustomMessage) {
                            connection.onCustomMessage(response.message);
                        }
                    }

                    if (connection.isInitiator && response.searchingForRooms) {
                        defaultSocket && defaultSocket.send({
                            sessionDescription: connection.sessionDescription,
                            responseFor: response.userid
                        });
                    }

                    if (response.sessionDescription && response.responseFor == connection.userid) {
                        var sessionDescription = response.sessionDescription;
                        if (!connection.sessionDescriptions[sessionDescription.sessionid]) {
                            connection.numberOfSessions++;
                            connection.sessionDescriptions[sessionDescription.sessionid] = sessionDescription;
                        }
                    }

                    if (connection.isInitiator && response.askToShareParticipants && defaultSocket) {
                        connection.shareParticipants({
                            shareWith: response.userid
                        });
                    }

                    // participants are shared with single user
                    if (response.shareWith == connection.userid && response.dontShareWith != connection.userid && response.joinUsers) {
                        joinParticipants(response.joinUsers);
                    }

                    // participants are shared with all users
                    if (!response.shareWith && response.joinUsers) {
                        if (response.dontShareWith) {
                            if (connection.userid != response.dontShareWith) {
                                joinParticipants(response.joinUsers);
                            }
                        } else joinParticipants(response.joinUsers);
                    }

                    if (response.messageFor == connection.userid && response.presenceState) {
                        if (response.presenceState == 'checking') {
                            defaultSocket.send({
                                messageFor: response.userid,
                                presenceState: 'available',
                                _config: response._config
                            });
                            log('participant asked for availability');
                        }

                        if (response.presenceState == 'available') {
                            rtcMultiSession.presenceState = 'available';

                            connection.onstatechange({
                                userid: 'browser',
                                extra: {},
                                name: 'room-available',
                                reason: 'Initiator is available and room is active.'
                            });

                            joinSession(response._config);
                        }
                    }

                    if (response.donotJoin && response.messageFor == connection.userid) {
                        log(response.userid, 'is not joining your room.');
                    }

                    // if initiator disconnects sockets, participants should also disconnect
                    if (response.isDisconnectSockets) {
                        log('Disconnecting your sockets because initiator also disconnected his sockets.');
                        connection.disconnect();
                    }
                },
                callback: function(socket) {
                    socket && this.onopen(socket);
                },
                onopen: function(socket) {
                    if (socket) defaultSocket = socket;
                    if (onSignalingReady) onSignalingReady();

                    rtcMultiSession.defaultSocket = defaultSocket;

                    if (!defaultSocket.__push) {
                        defaultSocket.__push = defaultSocket.send;
                        defaultSocket.send = function(message) {
                            message.userid = message.userid || connection.userid;
                            message.extra = message.extra || connection.extra || {};

                            defaultSocket.__push(message);
                        };
                    }
                }
            });
        }

        // default-socket is a common socket shared among all users in a specific channel;
        // to share participation requests; room descriptions; and other stuff.
        var defaultSocket = getDefaultSocketRef();

        rtcMultiSession.defaultSocket = defaultSocket;

        if (defaultSocket && onSignalingReady) setTimeout(onSignalingReady, 2000);

        if (connection.session.screen) {
            loadScreenFrame();
        }

        connection.getExternalIceServers && loadIceFrame(function(iceServers) {
            connection.iceServers = connection.iceServers.concat(iceServers);
        });

        if (connection.log == false) connection.skipLogs();
        if (connection.onlog) {
            log = warn = error = function() {
                var log = {};
                var index = 0;
                Array.prototype.slice.call(arguments).forEach(function(argument) {
                    log[index++] = toStr(argument);
                });
                toStr = function(str) {
                    return str;
                };
                connection.onlog(log);
            };
        }

        function setDirections() {
            var userMaxParticipantsAllowed = 0;

            // if user has set a custom max participant setting, remember it
            if (connection.maxParticipantsAllowed != 256) {
                userMaxParticipantsAllowed = connection.maxParticipantsAllowed;
            }

            if (connection.direction == 'one-way') connection.session.oneway = true;
            if (connection.direction == 'one-to-one') connection.maxParticipantsAllowed = 1;
            if (connection.direction == 'one-to-many') connection.session.broadcast = true;
            if (connection.direction == 'many-to-many') {
                if (!connection.maxParticipantsAllowed || connection.maxParticipantsAllowed == 1) {
                    connection.maxParticipantsAllowed = 256;
                }
            }

            // if user has set a custom max participant setting, set it back
            if (userMaxParticipantsAllowed && connection.maxParticipantsAllowed != 1) {
                connection.maxParticipantsAllowed = userMaxParticipantsAllowed;
            }
        }

        // open new session
        this.initSession = function(args) {
            rtcMultiSession.isOwnerLeaving = false;

            setDirections();
            participants = {};

            rtcMultiSession.isOwnerLeaving = false;

            if (!isNull(args.transmitRoomOnce)) {
                connection.transmitRoomOnce = args.transmitRoomOnce;
            }

            function transmit() {
                if (defaultSocket && getLength(participants) < connection.maxParticipantsAllowed && !rtcMultiSession.isOwnerLeaving) {
                    defaultSocket.send(connection.sessionDescription);
                }

                if (!connection.transmitRoomOnce && !rtcMultiSession.isOwnerLeaving)
                    setTimeout(transmit, connection.interval || 3000);
            }

            // todo: test and fix next line.
            if (!args.dontTransmit /* || connection.transmitRoomOnce */ ) transmit();
        };

        function joinSession(_config, skipOnStateChange) {
            if (rtcMultiSession.donotJoin && rtcMultiSession.donotJoin == _config.sessionid) {
                return;
            }

            // dontOverrideSession allows you force RTCMultiConnection
            // to not override default session for participants;
            // by default, session is always overridden and set to the session coming from initiator!
            if (!connection.dontOverrideSession) {
                connection.session = _config.session || {};
            }

            // make sure that inappropriate users shouldn't receive onNewSession event
            rtcMultiSession.broadcasterid = _config.userid;

            if (_config.sessionid) {
                // used later to prevent external rooms messages to be used by this user!
                connection.sessionid = _config.sessionid;
            }

            connection.isAcceptNewSession = false;

            var channel = getRandomString();
            newPrivateSocket({
                channel: channel,
                extra: _config.extra || {},
                userid: _config.userid
            });

            var offers = {};
            if (connection.attachStreams.length) {
                var stream = connection.attachStreams[connection.attachStreams.length - 1];
                if (!!stream.getAudioTracks && stream.getAudioTracks().length) {
                    offers.audio = true;
                }
                if (stream.getVideoTracks().length) {
                    offers.video = true;
                }
            }

            if (!isEmpty(offers)) {
                log(toStr(offers));
            } else log('Seems data-only connection.');

            connection.onstatechange({
                userid: _config.userid,
                extra: {},
                name: 'connecting-with-initiator',
                reason: 'Checking presence of the initiator; and the room.'
            });

            defaultSocket.send({
                participant: true,
                channel: channel,
                targetUser: _config.userid,
                session: connection.session,
                offers: {
                    audio: !!offers.audio,
                    video: !!offers.video
                }
            });

            connection.skipOnNewSession = false;
            invokeMediaCaptured(connection);
        }

        // join existing session
        this.joinSession = function(_config) {
            if (!defaultSocket)
                return setTimeout(function() {
                    warn('Default-Socket is not yet initialized.');
                    rtcMultiSession.joinSession(_config);
                }, 1000);

            _config = _config || {};
            participants = {};

            rtcMultiSession.presenceState = 'checking';

            connection.onstatechange({
                userid: _config.userid,
                extra: _config.extra || {},
                name: 'detecting-room-presence',
                reason: 'Checking presence of the room.'
            });

            function contactInitiator() {
                defaultSocket.send({
                    messageFor: _config.userid,
                    presenceState: rtcMultiSession.presenceState,
                    _config: {
                        userid: _config.userid,
                        extra: _config.extra || {},
                        sessionid: _config.sessionid,
                        session: _config.session || false
                    }
                });
            }
            contactInitiator();

            function checker() {
                if (rtcMultiSession.presenceState == 'checking') {
                    warn('Unable to reach initiator. Trying again...');
                    contactInitiator();
                    setTimeout(function() {
                        if (rtcMultiSession.presenceState == 'checking') {
                            connection.onstatechange({
                                userid: _config.userid,
                                extra: _config.extra || {},
                                name: 'room-not-available',
                                reason: 'Initiator seems absent. Waiting for someone to open the room.'
                            });

                            connection.isAcceptNewSession = true;
                            setTimeout(checker, 2000);
                        }
                    }, 2000);
                }
            }

            setTimeout(checker, 3000);
        };

        connection.donotJoin = function(sessionid) {
            rtcMultiSession.donotJoin = sessionid;

            var session = connection.sessionDescriptions[sessionid];
            if (!session) return;

            defaultSocket.send({
                donotJoin: true,
                messageFor: session.userid,
                sessionid: sessionid
            });

            participants = {};
            connection.isAcceptNewSession = true;
            connection.sessionid = null;
        };

        // send file/data or text message
        this.send = function(message, _channel) {
            if (!(message instanceof ArrayBuffer || message instanceof DataView)) {
                message = str2ab({
                    extra: connection.extra,
                    userid: connection.userid,
                    data: message
                });
            }

            if (_channel) {
                if (_channel.readyState == 'open') {
                    _channel.send(message);
                }
                return;
            }

            for (var dataChannel in connection.channels) {
                var channel = connection.channels[dataChannel].channel;
                if (channel.readyState == 'open') {
                    channel.send(message);
                }
            }
        };

        // leave session
        this.leave = function() {
            clearSession();
        };

        // renegotiate new stream
        this.addStream = function(e) {
            var session = e.renegotiate;

            if (!connection.renegotiatedSessions[JSON.stringify(e.renegotiate)]) {
                connection.renegotiatedSessions[JSON.stringify(e.renegotiate)] = {
                    session: e.renegotiate,
                    stream: e.stream
                };
            }

            if (e.socket) {
                if (e.socket.userid != connection.userid) {
                    addStream(connection.peers[e.socket.userid]);
                }
            } else {
                for (var peer in connection.peers) {
                    if (peer != connection.userid) {
                        addStream(connection.peers[peer]);
                    }
                }
            }

            function addStream(_peer) {
                var socket = _peer.socket;

                if (!socket) {
                    warn(_peer, 'doesn\'t has socket.');
                    return;
                }

                updateSocketForLocalStreams(socket);

                if (!_peer || !_peer.peer) {
                    throw 'No peer to renegotiate.';
                }

                var peer = _peer.peer;

                if (e.stream) {
                    if (!peer.attachStreams) {
                        peer.attachStreams = [];
                    }

                    peer.attachStreams.push(e.stream);
                }

                // detaching old streams
                detachMediaStream(connection.detachStreams, peer.connection);

                if (e.stream && (session.audio || session.video || session.screen)) {
                    peer.addStream(e.stream);
                }

                peer.recreateOffer(session, function(sdp, streaminfo) {
                    sendsdp({
                        sdp: sdp,
                        socket: socket,
                        renegotiate: session,
                        labels: connection.detachStreams,
                        streaminfo: streaminfo
                    });
                    connection.detachStreams = [];
                });
            }
        };

        // www.RTCMultiConnection.org/docs/request/
        connection.request = function(userid, extra) {
            connection.captureUserMedia(function() {
                // open private socket that will be used to receive offer-sdp
                newPrivateSocket({
                    channel: connection.userid,
                    extra: extra || {},
                    userid: userid
                });

                // ask other user to create offer-sdp
                defaultSocket.send({
                    participant: true,
                    targetUser: userid
                });
            });
        };

        function acceptRequest(response) {
            if (!rtcMultiSession.requestsFrom) rtcMultiSession.requestsFrom = {};
            if (rtcMultiSession.requestsFrom[response.userid]) return;

            var obj = {
                userid: response.userid,
                extra: response.extra,
                channel: response.channel || response.userid,
                session: response.session || connection.session
            };

            // check how participant is willing to join
            if (response.offers) {
                if (response.offers.audio && response.offers.video) {
                    log('target user has both audio/video streams.');
                } else if (response.offers.audio && !response.offers.video) {
                    log('target user has only audio stream.');
                } else if (!response.offers.audio && response.offers.video) {
                    log('target user has only video stream.');
                } else {
                    log('target user has no stream; it seems one-way streaming or data-only connection.');
                }

                var mandatory = connection.sdpConstraints.mandatory;
                if (isNull(mandatory.OfferToReceiveAudio)) {
                    connection.sdpConstraints.mandatory.OfferToReceiveAudio = !!response.offers.audio;
                }
                if (isNull(mandatory.OfferToReceiveVideo)) {
                    connection.sdpConstraints.mandatory.OfferToReceiveVideo = !!response.offers.video;
                }

                log('target user\'s SDP has?', toStr(connection.sdpConstraints.mandatory));
            }

            rtcMultiSession.requestsFrom[response.userid] = obj;

            // www.RTCMultiConnection.org/docs/onRequest/
            if (connection.onRequest && connection.isInitiator) {
                connection.onRequest(obj);
            } else _accept(obj);
        }

        function _accept(e) {
            if (rtcMultiSession.captureUserMediaOnDemand) {
                rtcMultiSession.captureUserMediaOnDemand = false;
                connection.captureUserMedia(function() {
                    _accept(e);

                    invokeMediaCaptured(connection);
                });
                return;
            }

            log('accepting request from', e.userid);
            participants[e.userid] = e.userid;
            newPrivateSocket({
                isofferer: true,
                userid: e.userid,
                channel: e.channel,
                extra: e.extra || {},
                session: e.session || connection.session
            });
        }

        // www.RTCMultiConnection.org/docs/accept/
        connection.accept = function(e) {
            // for backward compatibility
            if (arguments.length > 1 && isString(arguments[0])) {
                e = {};
                if (arguments[0]) e.userid = arguments[0];
                if (arguments[1]) e.extra = arguments[1];
                if (arguments[2]) e.channel = arguments[2];
            }

            connection.captureUserMedia(function() {
                _accept(e);
            });
        };

        var isRMSDeleted = false;
        this.disconnect = function() {
            this.isOwnerLeaving = true;

            if (!connection.keepStreamsOpened) {
                for (var streamid in connection.localStreams) {
                    connection.localStreams[streamid].stop();
                }
                connection.localStreams = {};

                currentUserMediaRequest = {
                    streams: [],
                    mutex: false,
                    queueRequests: []
                };
            }

            if (connection.isInitiator) {
                defaultSocket.send({
                    isDisconnectSockets: true
                });
            }

            connection.refresh();

            rtcMultiSession.defaultSocket = defaultSocket = null;
            isRMSDeleted = true;

            connection.ondisconnected({
                userid: connection.userid,
                extra: connection.extra,
                peer: connection.peers[connection.userid],
                isSocketsDisconnected: true
            });

            // if there is any peer still opened; close it.
            connection.close();

            window.removeEventListener('beforeunload', rtcMultiSession.leaveHandler);
            window.removeEventListener('keyup', rtcMultiSession.leaveHandler);

            // it will not work, though :)
            delete this;

            log('Disconnected your sockets, peers, streams and everything except RTCMultiConnection object.');
        };
    }

    var webAudioMediaStreamSources = [];

    function convertToAudioStream(mediaStream) {
        if (!mediaStream) throw 'MediaStream is mandatory.';

        if (mediaStream.getVideoTracks && !mediaStream.getVideoTracks().length) {
            return mediaStream;
        }

        var context = new AudioContext();
        var mediaStreamSource = context.createMediaStreamSource(mediaStream);

        var destination = context.createMediaStreamDestination();
        mediaStreamSource.connect(destination);

        webAudioMediaStreamSources.push(mediaStreamSource);

        return destination.stream;
    }

    var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    var isFirefox = typeof window.InstallTrigger !== 'undefined';
    var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
    var isChrome = !!window.chrome && !isOpera;
    var isIE = !!document.documentMode;

    var isPluginRTC = isSafari || isIE;

    var isMobileDevice = !!navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile/i);

    // detect node-webkit
    var isNodeWebkit = !!(window.process && (typeof window.process == 'object') && window.process.versions && window.process.versions['node-webkit']);

    window.MediaStream = window.MediaStream || window.webkitMediaStream;
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    function getRandomString() {
        // suggested by @rvulpescu from #154
        if (window.crypto && crypto.getRandomValues && navigator.userAgent.indexOf('Safari') == -1) {
            var a = window.crypto.getRandomValues(new Uint32Array(3)),
                token = '';
            for (var i = 0, l = a.length; i < l; i++) {
                token += a[i].toString(36);
            }
            return token;
        } else {
            return (Math.random() * new Date().getTime()).toString(36).replace(/\./g, '');
        }
    }

    var chromeVersion = 50;
    var matchArray = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
    if (isChrome && matchArray && matchArray[2]) {
        chromeVersion = parseInt(matchArray[2], 10);
    }

    var firefoxVersion = 50;
    matchArray = navigator.userAgent.match(/Firefox\/(.*)/);
    if (isFirefox && matchArray && matchArray[1]) {
        firefoxVersion = parseInt(matchArray[1], 10);
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

    function swap(arr) {
        var swapped = [],
            length = arr.length;
        for (var i = 0; i < length; i++)
            if (arr[i] && arr[i] !== true)
                swapped.push(arr[i]);
        return swapped;
    }

    function forEach(obj, callback) {
        for (var item in obj) {
            callback(obj[item], item);
        }
    }

    var console = window.console || {
        log: function() {},
        error: function() {},
        warn: function() {}
    };

    function log() {
        console.log(arguments);
    }

    function error() {
        console.error(arguments);
    }

    function warn() {
        console.warn(arguments);
    }

    if (isChrome || isFirefox || isSafari) {
        var log = console.log.bind(console);
        var error = console.error.bind(console);
        var warn = console.warn.bind(console);
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

    // Get HTMLAudioElement/HTMLVideoElement accordingly

    function createMediaElement(stream, session) {
        var mediaElement = document.createElement(stream.isAudio ? 'audio' : 'video');
        mediaElement.id = stream.streamid;

        if (isPluginRTC) {
            var body = (document.body || document.documentElement);
            body.insertBefore(mediaElement, body.firstChild);

            setTimeout(function() {
                Plugin.attachMediaStream(mediaElement, stream)
            }, 1000);

            return Plugin.attachMediaStream(mediaElement, stream);
        }

        // "mozSrcObject" is always preferred over "src"!!
        mediaElement[isFirefox ? 'mozSrcObject' : 'src'] = isFirefox ? stream : (window.URL || window.webkitURL).createObjectURL(stream);

        mediaElement.controls = true;
        mediaElement.autoplay = !!session.remote;
        mediaElement.muted = session.remote ? false : true;

        // http://goo.gl/WZ5nFl
        // Firefox don't yet support onended for any stream (remote/local)
        isFirefox && mediaElement.addEventListener('ended', function() {
            stream.onended();
        }, false);

        mediaElement.play();

        return mediaElement;
    }

    var onStreamEndedHandlerFiredFor = {};

    function onStreamEndedHandler(streamedObject, connection) {
        if (streamedObject.mediaElement && !streamedObject.mediaElement.parentNode) return;

        if (onStreamEndedHandlerFiredFor[streamedObject.streamid]) return;
        onStreamEndedHandlerFiredFor[streamedObject.streamid] = streamedObject;
        connection.onstreamended(streamedObject);
    }

    var onLeaveHandlerFiredFor = {};

    function onLeaveHandler(event, connection) {
        if (onLeaveHandlerFiredFor[event.userid]) return;
        onLeaveHandlerFiredFor[event.userid] = event;
        connection.onleave(event);
    }

    function takeSnapshot(args) {
        var userid = args.userid;
        var connection = args.connection;

        function _takeSnapshot(video) {
            var canvas = document.createElement('canvas');
            canvas.width = video.videoWidth || video.clientWidth;
            canvas.height = video.videoHeight || video.clientHeight;

            var context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            connection.snapshots[userid] = canvas.toDataURL('image/png');
            args.callback && args.callback(connection.snapshots[userid]);
        }

        if (args.mediaElement) return _takeSnapshot(args.mediaElement);

        for (var stream in connection.streams) {
            stream = connection.streams[stream];
            if (stream.userid == userid && stream.stream && stream.stream.getVideoTracks && stream.stream.getVideoTracks().length) {
                _takeSnapshot(stream.mediaElement);
                continue;
            }
        }
    }

    function invokeMediaCaptured(connection) {
        // to let user know that media resource has been captured
        // now, he can share "sessionDescription" using sockets
        if (connection.onMediaCaptured) {
            connection.onMediaCaptured();
            delete connection.onMediaCaptured;
        }
    }

    function merge(mergein, mergeto) {
        if (!mergein) mergein = {};
        if (!mergeto) return mergein;

        for (var item in mergeto) {
            mergein[item] = mergeto[item];
        }
        return mergein;
    }

    function loadScript(src, onload) {
        var script = document.createElement('script');
        script.src = src;
        script.onload = function() {
            log('loaded resource:', src);
            if (onload) onload();
        };
        document.documentElement.appendChild(script);
    }

    function capturePartOfScreen(args) {
        var connection = args.connection;
        var element = args.element;

        if (!window.html2canvas) {
            return loadScript(connection.resources.html2canvas, function() {
                capturePartOfScreen(args);
            });
        }

        if (isString(element)) {
            element = document.querySelector(element);
            if (!element) element = document.getElementById(element);
        }
        if (!element) throw 'HTML DOM Element is not accessible!';

        // todo: store DOM element somewhere to minimize DOM querying issues

        // html2canvas.js is used to take screenshots
        html2canvas(element, {
            onrendered: function(canvas) {
                args.callback(canvas.toDataURL());
            }
        });
    }

    function initFileBufferReader(connection, callback) {
        if (!window.FileBufferReader) {
            loadScript(connection.resources.FileBufferReader, function() {
                initFileBufferReader(connection, callback);
            });
            return;
        }

        function _private(chunk) {
            chunk.userid = chunk.extra.userid;
            return chunk;
        }

        var fileBufferReader = new FileBufferReader();
        fileBufferReader.onProgress = function(chunk) {
            connection.onFileProgress(_private(chunk), chunk.uuid);
        };

        fileBufferReader.onBegin = function(file) {
            connection.onFileStart(_private(file));
        };

        fileBufferReader.onEnd = function(file) {
            connection.onFileEnd(_private(file));
        };

        callback(fileBufferReader);
    }

    var screenFrame, loadedScreenFrame;

    function loadScreenFrame(skip) {
        if (DetectRTC.screen.extensionid != ReservedExtensionID) {
            return;
        }

        if (loadedScreenFrame) return;
        if (!skip) return loadScreenFrame(true);

        loadedScreenFrame = true;

        var iframe = document.createElement('iframe');
        iframe.onload = function() {
            iframe.isLoaded = true;
            log('Screen Capturing frame is loaded.');
        };
        /*iframe.src = 'https://www.webrtc-experiment.com/getSourceId/';*/
        iframe.src = 'getSourceId/';
        iframe.style.display = 'none';
        (document.body || document.documentElement).appendChild(iframe);

        screenFrame = {
            postMessage: function() {
                if (!iframe.isLoaded) {
                    setTimeout(screenFrame.postMessage, 100);
                    return;
                }
                iframe.contentWindow.postMessage({
                    captureSourceId: true
                }, '*');
            }
        };
    }

    var iceFrame, loadedIceFrame;

    function loadIceFrame(callback, skip) {
        if (loadedIceFrame) return;
        if (!skip) return loadIceFrame(callback, true);

        loadedIceFrame = true;

        var iframe = document.createElement('iframe');
        iframe.onload = function() {
            iframe.isLoaded = true;

            listenEventHandler('message', iFrameLoaderCallback);

            function iFrameLoaderCallback(event) {
                if (!event.data || !event.data.iceServers) return;
                callback(event.data.iceServers);

                // this event listener is no more needed
                window.removeEventListener('message', iFrameLoaderCallback);
            }

            iframe.contentWindow.postMessage('get-ice-servers', '*');
        };
        /*iframe.src = 'https://cdn.webrtc-experiment.com/getIceServers/'*/
        iframe.src = 'getIceServers.html';
        iframe.style.display = 'none';
        (document.body || document.documentElement).appendChild(iframe);
    }

    function muteOrUnmute(e) {
        var stream = e.stream,
            root = e.root,
            session = e.session || {},
            enabled = e.enabled;

        if (!session.audio && !session.video) {
            if (!isString(session)) {
                session = merge(session, {
                    audio: true,
                    video: true
                });
            } else {
                session = {
                    audio: true,
                    video: true
                };
            }
        }

        // implementation from #68
        if (session.type) {
            if (session.type == 'remote' && root.type != 'remote') return;
            if (session.type == 'local' && root.type != 'local') return;
        }

        log(enabled ? 'Muting' : 'UnMuting', 'session', toStr(session));

        // enable/disable audio/video tracks

        if (root.type == 'local' && session.audio && !!stream.getAudioTracks) {
            var audioTracks = stream.getAudioTracks()[0];
            if (audioTracks)
                audioTracks.enabled = !enabled;
        }

        if (root.type == 'local' && (session.video || session.screen) && !!stream.getVideoTracks) {
            var videoTracks = stream.getVideoTracks()[0];
            if (videoTracks)
                videoTracks.enabled = !enabled;
        }

        root.sockets.forEach(function(socket) {
            if (root.type == 'local') {
                socket.send({
                    streamid: root.streamid,
                    mute: !!enabled,
                    unmute: !enabled,
                    session: session
                });
            }

            if (root.type == 'remote') {
                socket.send({
                    promptMuteUnmute: true,
                    streamid: root.streamid,
                    mute: !!enabled,
                    unmute: !enabled,
                    session: session
                });
            }
        });

        if (root.type == 'remote') return;

        // According to issue #135, onmute/onumute must be fired for self
        // "fakeObject" is used because we need to keep session for renegotiated streams;
        // and MUST pass exact session over onStreamEndedHandler/onmute/onhold/etc. events.
        var fakeObject = merge({}, root);
        fakeObject.session = session;

        fakeObject.isAudio = !!fakeObject.session.audio && !fakeObject.session.video;
        fakeObject.isVideo = !!fakeObject.session.video;
        fakeObject.isScreen = !!fakeObject.session.screen;

        if (!!enabled) {
            // if muted stream is negotiated
            stream.preMuted = {
                audio: stream.getAudioTracks().length && !stream.getAudioTracks()[0].enabled,
                video: stream.getVideoTracks().length && !stream.getVideoTracks()[0].enabled
            };
            root.rtcMultiConnection.onmute(fakeObject);
        }

        if (!enabled) {
            stream.preMuted = {};
            root.rtcMultiConnection.onunmute(fakeObject);
        }
    }

    var Firefox_Screen_Capturing_Warning = 'Make sure that you are using Firefox Nightly and you enabled: media.getusermedia.screensharing.enabled flag from about:config page. You also need to add your domain in "media.getusermedia.screensharing.allowed_domains" flag. If you are using WinXP then also enable "media.getusermedia.screensharing.allow_on_old_platforms" flag. NEVER forget to use "only" HTTPs for screen capturing!';
    var SCREEN_COMMON_FAILURE = 'HTTPs i.e. SSL-based URI is mandatory to use screen capturing.';
    var ReservedExtensionID = 'ajhifddimkapgcifgcodmmfdlknahffk';

    // if application-developer deployed his own extension on Google App Store
    var useCustomChromeExtensionForScreenCapturing = document.domain.indexOf('webrtc-experiment.com') != -1;

    function initHark(args) {
        if (!window.hark) {
            loadScript(args.connection.resources.hark, function() {
                initHark(args);
            });
            return;
        }

        var connection = args.connection;
        var streamedObject = args.streamedObject;
        var stream = args.stream;

        var options = {};
        var speechEvents = hark(stream, options);

        speechEvents.on('speaking', function() {
            if (connection.onspeaking) {
                connection.onspeaking(streamedObject);
            }
        });

        speechEvents.on('stopped_speaking', function() {
            if (connection.onsilence) {
                connection.onsilence(streamedObject);
            }
        });

        speechEvents.on('volume_change', function(volume, threshold) {
            if (connection.onvolumechange) {
                connection.onvolumechange(merge({
                    volume: volume,
                    threshold: threshold
                }, streamedObject));
            }
        });
    }

    attachEventListener = function(video, type, listener, useCapture) {
        video.addEventListener(type, listener, useCapture);
    };

    var Plugin = window.PluginRTC || {};
    window.onPluginRTCInitialized = function(pluginRTCObject) {
        Plugin = pluginRTCObject;
        MediaStreamTrack = Plugin.MediaStreamTrack;
        RTCPeerConnection = Plugin.RTCPeerConnection;
        RTCIceCandidate = Plugin.RTCIceCandidate;
        RTCSessionDescription = Plugin.RTCSessionDescription;

        log(isPluginRTC ? 'Java-Applet' : 'ActiveX', 'plugin has been loaded.');
    };
    if (!isEmpty(Plugin)) window.onPluginRTCInitialized(Plugin);

    // if IE or Safari
    if (isPluginRTC) {
        loadScript('https://cdn.webrtc-experiment.com/Plugin.EveryWhere.js');
        // loadScript('https://cdn.webrtc-experiment.com/Plugin.Temasys.js');
    }

    var MediaStream = window.MediaStream;

    if (typeof MediaStream === 'undefined' && typeof webkitMediaStream !== 'undefined') {
        MediaStream = webkitMediaStream;
    }

    /*global MediaStream:true */
    if (typeof MediaStream !== 'undefined' && !('stop' in MediaStream.prototype)) {
        MediaStream.prototype.stop = function() {
            this.getAudioTracks().forEach(function(track) {
                track.stop();
            });

            this.getVideoTracks().forEach(function(track) {
                track.stop();
            });
        };
    }

    var defaultConstraints = {
        mandatory: {},
        optional: []
    };

    /* by @FreCap pull request #41 */
    var currentUserMediaRequest = {
        streams: [],
        mutex: false,
        queueRequests: []
    };

    function getUserMedia(options) {
        if (isPluginRTC) {
            if (!Plugin.getUserMedia) {
                setTimeout(function() {
                    getUserMedia(options);
                }, 1000);
                return;
            }

            return Plugin.getUserMedia(options.constraints || {
                audio: true,
                video: true
            }, options.onsuccess, options.onerror);
        }

        if (currentUserMediaRequest.mutex === true) {
            currentUserMediaRequest.queueRequests.push(options);
            return;
        }
        currentUserMediaRequest.mutex = true;

        var connection = options.connection;

        // tools.ietf.org/html/draft-alvestrand-constraints-resolution-00
        var mediaConstraints = options.mediaConstraints || {};
        var videoConstraints = typeof mediaConstraints.video == 'boolean' ? mediaConstraints.video : mediaConstraints.video || mediaConstraints;
        var audioConstraints = typeof mediaConstraints.audio == 'boolean' ? mediaConstraints.audio : mediaConstraints.audio || defaultConstraints;

        var n = navigator;
        var hints = options.constraints || {
            audio: defaultConstraints,
            video: defaultConstraints
        };

        if (hints.video && hints.video.mozMediaSource) {
            // "mozMediaSource" is redundant
            // need to check "mediaSource" instead.
            videoConstraints = {};
        }

        if (hints.video == true) hints.video = defaultConstraints;
        if (hints.audio == true) hints.audio = defaultConstraints;

        // connection.mediaConstraints.audio = false;
        if (typeof audioConstraints == 'boolean' && hints.audio) {
            hints.audio = audioConstraints;
        }

        // connection.mediaConstraints.video = false;
        if (typeof videoConstraints == 'boolean' && hints.video) {
            hints.video = videoConstraints;
        }

        // connection.mediaConstraints.audio.mandatory = {prop:true};
        var audioMandatoryConstraints = audioConstraints.mandatory;
        if (!isEmpty(audioMandatoryConstraints)) {
            hints.audio.mandatory = merge(hints.audio.mandatory, audioMandatoryConstraints);
        }

        // connection.media.min(320,180);
        // connection.media.max(1920,1080);
        var videoMandatoryConstraints = videoConstraints.mandatory;
        if (videoMandatoryConstraints) {
            var mandatory = {};

            if (videoMandatoryConstraints.minWidth) {
                mandatory.minWidth = videoMandatoryConstraints.minWidth;
            }

            if (videoMandatoryConstraints.minHeight) {
                mandatory.minHeight = videoMandatoryConstraints.minHeight;
            }

            if (videoMandatoryConstraints.maxWidth) {
                mandatory.maxWidth = videoMandatoryConstraints.maxWidth;
            }

            if (videoMandatoryConstraints.maxHeight) {
                mandatory.maxHeight = videoMandatoryConstraints.maxHeight;
            }

            if (videoMandatoryConstraints.minAspectRatio) {
                mandatory.minAspectRatio = videoMandatoryConstraints.minAspectRatio;
            }

            if (videoMandatoryConstraints.maxFrameRate) {
                mandatory.maxFrameRate = videoMandatoryConstraints.maxFrameRate;
            }

            if (videoMandatoryConstraints.minFrameRate) {
                mandatory.minFrameRate = videoMandatoryConstraints.minFrameRate;
            }

            if (mandatory.minWidth && mandatory.minHeight) {
                // http://goo.gl/IZVYsj
                var allowed = ['1920:1080', '1280:720', '960:720', '640:360', '640:480', '320:240', '320:180'];

                if (allowed.indexOf(mandatory.minWidth + ':' + mandatory.minHeight) == -1 ||
                    allowed.indexOf(mandatory.maxWidth + ':' + mandatory.maxHeight) == -1) {
                    error('The min/max width/height constraints you passed "seems" NOT supported.', toStr(mandatory));
                }

                if (mandatory.minWidth > mandatory.maxWidth || mandatory.minHeight > mandatory.maxHeight) {
                    error('Minimum value must not exceed maximum value.', toStr(mandatory));
                }

                if (mandatory.minWidth >= 1280 && mandatory.minHeight >= 720) {
                    warn('Enjoy HD video! min/' + mandatory.minWidth + ':' + mandatory.minHeight + ', max/' + mandatory.maxWidth + ':' + mandatory.maxHeight);
                }
            }

            hints.video.mandatory = merge(hints.video.mandatory, mandatory);
        }

        if (videoMandatoryConstraints) {
            hints.video.mandatory = merge(hints.video.mandatory, videoMandatoryConstraints);
        }

        // videoConstraints.optional = [{prop:true}];
        if (videoConstraints.optional && videoConstraints.optional instanceof Array && videoConstraints.optional.length) {
            hints.video.optional = hints.video.optional ? hints.video.optional.concat(videoConstraints.optional) : videoConstraints.optional;
        }

        // audioConstraints.optional = [{prop:true}];
        if (audioConstraints.optional && audioConstraints.optional instanceof Array && audioConstraints.optional.length) {
            hints.audio.optional = hints.audio.optional ? hints.audio.optional.concat(audioConstraints.optional) : audioConstraints.optional;
        }

        if (hints.video.mandatory && !isEmpty(hints.video.mandatory) && connection._mediaSources.video) {
            hints.video.optional.forEach(function(video, index) {
                if (video.sourceId == connection._mediaSources.video) {
                    delete hints.video.optional[index];
                }
            });

            hints.video.optional = swap(hints.video.optional);

            hints.video.optional.push({
                sourceId: connection._mediaSources.video
            });
        }

        if (hints.audio.mandatory && !isEmpty(hints.audio.mandatory) && connection._mediaSources.audio) {
            hints.audio.optional.forEach(function(audio, index) {
                if (audio.sourceId == connection._mediaSources.audio) {
                    delete hints.audio.optional[index];
                }
            });

            hints.audio.optional = swap(hints.audio.optional);

            hints.audio.optional.push({
                sourceId: connection._mediaSources.audio
            });
        }

        if (hints.video && !hints.video.mozMediaSource && hints.video.optional && hints.video.mandatory) {
            if (!hints.video.optional.length && isEmpty(hints.video.mandatory)) {
                hints.video = true;
            }
        }

        if (isMobileDevice) {
            // Android fails for some constraints
            // so need to force {audio:true,video:true}
            hints = {
                audio: !!hints.audio,
                video: !!hints.video
            };
        }

        // connection.mediaConstraints always overrides constraints
        // passed from "captureUserMedia" function.
        // todo: need to verify all possible situations
        log('invoked getUserMedia with constraints:', toStr(hints));

        // easy way to match
        var idInstance = JSON.stringify(hints);

        function streaming(stream, returnBack, streamid) {
            if (!streamid) streamid = getRandomString();

            // localStreams object will store stream
            // until it is removed using native-stop method.
            connection.localStreams[streamid] = stream;

            var video = options.video;
            if (video) {
                video[isFirefox ? 'mozSrcObject' : 'src'] = isFirefox ? stream : (window.URL || window.webkitURL).createObjectURL(stream);
                video.play();
            }

            options.onsuccess(stream, returnBack, idInstance, streamid);
            currentUserMediaRequest.streams[idInstance] = {
                stream: stream,
                streamid: streamid
            };
            currentUserMediaRequest.mutex = false;
            if (currentUserMediaRequest.queueRequests.length)
                getUserMedia(currentUserMediaRequest.queueRequests.shift());
        }

        if (currentUserMediaRequest.streams[idInstance]) {
            streaming(currentUserMediaRequest.streams[idInstance].stream, true, currentUserMediaRequest.streams[idInstance].streamid);
        } else {
            n.getMedia = n.webkitGetUserMedia || n.mozGetUserMedia;

            // http://goo.gl/eETIK4
            n.getMedia(hints, streaming, function(error) {
                options.onerror(error, hints);
            });
        }
    }

    var RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription;
    var RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate;

    var RTCPeerConnection;
    if (typeof mozRTCPeerConnection !== 'undefined') {
        RTCPeerConnection = mozRTCPeerConnection;
    } else if (typeof webkitRTCPeerConnection !== 'undefined') {
        RTCPeerConnection = webkitRTCPeerConnection;
    } else if (typeof window.RTCPeerConnection !== 'undefined') {
        RTCPeerConnection = window.RTCPeerConnection;
    } else {
        console.error('WebRTC 1.0 (RTCPeerConnection) API seems NOT available in this browser.');
    }

    function setSdpConstraints(config) {
        var sdpConstraints;

        var sdpConstraints_mandatory = {
            OfferToReceiveAudio: !!config.OfferToReceiveAudio,
            OfferToReceiveVideo: !!config.OfferToReceiveVideo
        };

        sdpConstraints = {
            mandatory: sdpConstraints_mandatory,
            optional: [{
                VoiceActivityDetection: false
            }]
        };

        if (!!navigator.mozGetUserMedia && firefoxVersion > 34) {
            sdpConstraints = {
                OfferToReceiveAudio: !!config.OfferToReceiveAudio,
                OfferToReceiveVideo: !!config.OfferToReceiveVideo
            };
        }

        return sdpConstraints;
    }

    function PeerConnection() {
        return {
            create: function(type, options) {
                merge(this, options);

                var self = this;

                this.type = type;
                this.init();
                this.attachMediaStreams();

                if (isFirefox && this.session.data) {
                    if (this.session.data && type == 'offer') {
                        this.createDataChannel();
                    }

                    this.getLocalDescription(type);

                    if (this.session.data && type == 'answer') {
                        this.createDataChannel();
                    }
                } else self.getLocalDescription(type);

                return this;
            },
            getLocalDescription: function(createType) {
                log('(getLocalDescription) peer createType is', createType);

                if (this.session.inactive && isNull(this.rtcMultiConnection.waitUntilRemoteStreamStartsFlowing)) {
                    // inactive session returns blank-stream
                    this.rtcMultiConnection.waitUntilRemoteStreamStartsFlowing = false;
                }

                var self = this;

                if (createType == 'answer') {
                    this.setRemoteDescription(this.offerDescription, createDescription);
                } else createDescription();

                function createDescription() {
                    self.connection[createType == 'offer' ? 'createOffer' : 'createAnswer'](function(sessionDescription) {
                        sessionDescription.sdp = self.serializeSdp(sessionDescription.sdp, createType);
                        self.connection.setLocalDescription(sessionDescription);

                        if (self.trickleIce) {
                            self.onSessionDescription(sessionDescription, self.streaminfo);
                        }

                        if (sessionDescription.type == 'offer') {
                            log('offer sdp', sessionDescription.sdp);
                        }

                        self.prevCreateType = createType;
                    }, self.onSdpError, self.constraints);
                }
            },
            serializeSdp: function(sdp, createType) {
                // it is "connection.processSdp=function(sdp){return sdp;}"
                sdp = this.processSdp(sdp);

                if (isFirefox) return sdp;

                if (this.session.inactive && !this.holdMLine) {
                    this.hold = true;
                    if ((this.session.screen || this.session.video) && this.session.audio) {
                        this.holdMLine = 'both';
                    } else if (this.session.screen || this.session.video) {
                        this.holdMLine = 'video';
                    } else if (this.session.audio) {
                        this.holdMLine = 'audio';
                    }
                }

                sdp = this.setBandwidth(sdp);
                if (this.holdMLine == 'both') {
                    if (this.hold) {
                        this.prevSDP = sdp;
                        sdp = sdp.replace(/a=sendonly|a=recvonly|a=sendrecv/g, 'a=inactive');
                    } else if (this.prevSDP) {
                        if (!this.session.inactive) {
                            // it means that DTSL key exchange already happened for single or multiple media lines.
                            // this block checks, key-exchange must be happened for all media lines.
                            sdp = this.prevSDP;

                            // todo: test it: makes sense?
                            if (chromeVersion <= 35) {
                                return sdp;
                            }
                        }
                    }
                } else if (this.holdMLine == 'audio' || this.holdMLine == 'video') {
                    sdp = sdp.split('m=');

                    var audio = '';
                    var video = '';

                    if (sdp[1] && sdp[1].indexOf('audio') == 0) {
                        audio = 'm=' + sdp[1];
                    }
                    if (sdp[2] && sdp[2].indexOf('audio') == 0) {
                        audio = 'm=' + sdp[2];
                    }

                    if (sdp[1] && sdp[1].indexOf('video') == 0) {
                        video = 'm=' + sdp[1];
                    }
                    if (sdp[2] && sdp[2].indexOf('video') == 0) {
                        video = 'm=' + sdp[2];
                    }

                    if (this.holdMLine == 'audio') {
                        if (this.hold) {
                            this.prevSDP = sdp[0] + audio + video;
                            sdp = sdp[0] + audio.replace(/a=sendonly|a=recvonly|a=sendrecv/g, 'a=inactive') + video;
                        } else if (this.prevSDP) {
                            sdp = this.prevSDP;
                        }
                    }

                    if (this.holdMLine == 'video') {
                        if (this.hold) {
                            this.prevSDP = sdp[0] + audio + video;
                            sdp = sdp[0] + audio + video.replace(/a=sendonly|a=recvonly|a=sendrecv/g, 'a=inactive');
                        } else if (this.prevSDP) {
                            sdp = this.prevSDP;
                        }
                    }
                }

                if (!this.hold && this.session.inactive) {
                    // transport.cc&l=852 - http://goo.gl/0FxxqG
                    // dtlstransport.h&l=234 - http://goo.gl/7E4sYF
                    // http://tools.ietf.org/html/rfc4340

                    // From RFC 4145, SDP setup attribute values.
                    // http://goo.gl/xETJEp && http://goo.gl/3Wgcau
                    if (createType == 'offer') {
                        sdp = sdp.replace(/a=setup:passive|a=setup:active|a=setup:holdconn/g, 'a=setup:actpass');
                    } else {
                        sdp = sdp.replace(/a=setup:actpass|a=setup:passive|a=setup:holdconn/g, 'a=setup:active');
                    }

                    // whilst doing handshake, either media lines were "inactive"
                    // or no media lines were present
                    sdp = sdp.replace(/a=inactive/g, 'a=sendrecv');
                }
                // this.session.inactive = false;
                return sdp;
            },
            init: function() {
                this.setConstraints();
                this.connection = new RTCPeerConnection(this.iceServers, this.optionalArgument);

                if (this.session.data) {
                    log('invoked: createDataChannel');
                    this.createDataChannel();
                }

                this.connection.onicecandidate = function(event) {
                    if (!event.candidate) {
                        if (!self.trickleIce) {
                            returnSDP();
                        }

                        return;
                    }

                    if (!self.trickleIce) return;

                    self.onicecandidate(event.candidate);
                };

                function returnSDP() {
                    if (self.returnedSDP) {
                        self.returnedSDP = false;
                        return;
                    };
                    self.returnedSDP = true;

                    self.onSessionDescription(self.connection.localDescription, self.streaminfo);
                }

                this.connection.onaddstream = function(e) {
                    log('onaddstream', isPluginRTC ? e.stream : toStr(e.stream));

                    self.onaddstream(e.stream, self.session);
                };

                this.connection.onremovestream = function(e) {
                    self.onremovestream(e.stream);
                };

                this.connection.onsignalingstatechange = function() {
                    self.connection && self.oniceconnectionstatechange({
                        iceConnectionState: self.connection.iceConnectionState,
                        iceGatheringState: self.connection.iceGatheringState,
                        signalingState: self.connection.signalingState
                    });
                };

                this.connection.oniceconnectionstatechange = function() {
                    if (!self.connection) return;

                    self.oniceconnectionstatechange({
                        iceConnectionState: self.connection.iceConnectionState,
                        iceGatheringState: self.connection.iceGatheringState,
                        signalingState: self.connection.signalingState
                    });

                    if (self.trickleIce) return;

                    if (self.connection.iceGatheringState == 'complete') {
                        log('iceGatheringState', self.connection.iceGatheringState);
                        returnSDP();
                    }
                };

                var self = this;
            },
            setBandwidth: function(sdp) {
                if (isMobileDevice || isFirefox || !this.bandwidth) return sdp;

                var bandwidth = this.bandwidth;

                if (this.session.screen) {
                    if (!bandwidth.screen) {
                        warn('It seems that you are not using bandwidth for screen. Screen sharing is expected to fail.');
                    } else if (bandwidth.screen < 300) {
                        warn('It seems that you are using wrong bandwidth value for screen. Screen sharing is expected to fail.');
                    }
                }

                // if screen; must use at least 300kbs
                if (bandwidth.screen && this.session.screen) {
                    sdp = sdp.replace(/b=AS([^\r\n]+\r\n)/g, '');
                    sdp = sdp.replace(/a=mid:video\r\n/g, 'a=mid:video\r\nb=AS:' + bandwidth.screen + '\r\n');
                }

                // remove existing bandwidth lines
                if (bandwidth.audio || bandwidth.video || bandwidth.data) {
                    sdp = sdp.replace(/b=AS([^\r\n]+\r\n)/g, '');
                }

                if (bandwidth.audio) {
                    sdp = sdp.replace(/a=mid:audio\r\n/g, 'a=mid:audio\r\nb=AS:' + bandwidth.audio + '\r\n');
                }

                if (bandwidth.video) {
                    sdp = sdp.replace(/a=mid:video\r\n/g, 'a=mid:video\r\nb=AS:' + (this.session.screen ? bandwidth.screen : bandwidth.video) + '\r\n');
                }

                if (bandwidth.data && !this.preferSCTP) {
                    sdp = sdp.replace(/a=mid:data\r\n/g, 'a=mid:data\r\nb=AS:' + bandwidth.data + '\r\n');
                }

                return sdp;
            },
            setConstraints: function() {
                var sdpConstraints = setSdpConstraints({
                    OfferToReceiveAudio: !!this.session.audio,
                    OfferToReceiveVideo: !!this.session.video || !!this.session.screen
                });

                if (this.sdpConstraints.mandatory) {
                    sdpConstraints = setSdpConstraints(this.sdpConstraints.mandatory);
                }

                this.constraints = sdpConstraints;

                if (this.constraints) {
                    log('sdp-constraints', toStr(this.constraints));
                }

                this.optionalArgument = {
                    optional: this.optionalArgument.optional || [],
                    mandatory: this.optionalArgument.mandatory || {}
                };

                if (!this.preferSCTP) {
                    this.optionalArgument.optional.push({
                        RtpDataChannels: true
                    });
                }

                log('optional-argument', toStr(this.optionalArgument));

                if (!isNull(this.iceServers)) {
                    var iceCandidates = this.rtcMultiConnection.candidates;

                    var stun = iceCandidates.stun;
                    var turn = iceCandidates.turn;
                    var host = iceCandidates.host;

                    if (!isNull(iceCandidates.reflexive)) stun = iceCandidates.reflexive;
                    if (!isNull(iceCandidates.relay)) turn = iceCandidates.relay;

                    if (!host && !stun && turn) {
                        this.rtcConfiguration.iceTransports = 'relay';
                    } else if (!host && !stun && !turn) {
                        this.rtcConfiguration.iceTransports = 'none';
                    }

                    this.iceServers = {
                        iceServers: this.iceServers,
                        iceTransports: this.rtcConfiguration.iceTransports
                    };
                } else this.iceServers = null;

                log('rtc-configuration', toStr(this.iceServers));
            },
            onSdpError: function(e) {
                var message = toStr(e);

                if (message && message.indexOf('RTP/SAVPF Expects at least 4 fields') != -1) {
                    message = 'It seems that you are trying to interop RTP-datachannels with SCTP. It is not supported!';
                }
                error('onSdpError:', message);
            },
            onSdpSuccess: function() {
                log('sdp success');
            },
            onMediaError: function(err) {
                error(toStr(err));
            },
            setRemoteDescription: function(sessionDescription, onSdpSuccess) {
                if (!sessionDescription) throw 'Remote session description should NOT be NULL.';

                if (!this.connection) return;

                /*log('setting remote description', sessionDescription.type, sessionDescription.sdp);*/

                var self = this;
                this.connection.setRemoteDescription(
                    new RTCSessionDescription(sessionDescription),
                    onSdpSuccess || this.onSdpSuccess,
                    function(error) {
                        if (error.search(/STATE_SENTINITIATE|STATE_INPROGRESS/gi) == -1) {
                            self.onSdpError(error);
                        }
                    }
                );
            },
            addIceCandidate: function(candidate) {
                var self = this;
                if (isPluginRTC) {
                    RTCIceCandidate(candidate, function(iceCandidate) {
                        onAddIceCandidate(iceCandidate);
                    });
                } else onAddIceCandidate(new RTCIceCandidate(candidate));

                function onAddIceCandidate(iceCandidate) {
                    self.connection.addIceCandidate(iceCandidate, function() {
                        log('added:', candidate.sdpMid, candidate.candidate);
                    }, function() {
                        error('onIceFailure', arguments, candidate.candidate);
                    });
                }
            },
            createDataChannel: function(channelIdentifier) {
                // skip 2nd invocation of createDataChannel
                if (this.channels && this.channels.length) return;

                var self = this;

                if (!this.channels) this.channels = [];

                // protocol: 'text/chat', preset: true, stream: 16
                // maxRetransmits:0 && ordered:false && outOfOrderAllowed: false
                var dataChannelDict = {};

                if (this.dataChannelDict) dataChannelDict = this.dataChannelDict;

                if (isChrome && !this.preferSCTP) {
                    dataChannelDict.reliable = false; // Deprecated!
                }

                log('dataChannelDict', toStr(dataChannelDict));

                if (this.type == 'answer' || isFirefox) {
                    this.connection.ondatachannel = function(event) {
                        self.setChannelEvents(event.channel);
                    };
                }

                if ((isChrome && this.type == 'offer') || isFirefox) {
                    this.setChannelEvents(
                        this.connection.createDataChannel(channelIdentifier || 'channel', dataChannelDict)
                    );
                }
            },
            setChannelEvents: function(channel) {
                var self = this;

                channel.binaryType = 'arraybuffer';

                if (this.dataChannelDict.binaryType) {
                    channel.binaryType = this.dataChannelDict.binaryType;
                }

                channel.onmessage = function(event) {
                    self.onmessage(event.data);
                };

                var numberOfTimes = 0;
                channel.onopen = function() {
                    channel.push = channel.send;
                    channel.send = function(data) {
                        if (self.connection.iceConnectionState == 'disconnected') {
                            return;
                        }

                        if (channel.readyState.search(/closing|closed/g) != -1) {
                            return;
                        }

                        if (channel.readyState.search(/connecting|open/g) == -1) {
                            return;
                        }

                        if (channel.readyState == 'connecting') {
                            numberOfTimes++;
                            return setTimeout(function() {
                                if (numberOfTimes < 20) {
                                    channel.send(data);
                                } else throw 'Number of times exceeded to wait for WebRTC data connection to be opened.';
                            }, 1000);
                        }
                        try {
                            channel.push(data);
                        } catch (e) {
                            numberOfTimes++;
                            warn('Data transmission failed. Re-transmitting..', numberOfTimes, toStr(e));
                            if (numberOfTimes >= 20) throw 'Number of times exceeded to resend data packets over WebRTC data channels.';
                            setTimeout(function() {
                                channel.send(data);
                            }, 100);
                        }
                    };
                    self.onopen(channel);
                };

                channel.onerror = function(event) {
                    self.onerror(event);
                };

                channel.onclose = function(event) {
                    self.onclose(event);
                };

                this.channels.push(channel);
            },
            addStream: function(stream) {
                if (!stream.streamid && !isIE) {
                    stream.streamid = getRandomString();
                }

                // todo: maybe need to add isAudio/isVideo/isScreen if missing?

                log('attaching stream:', stream.streamid, isPluginRTC ? stream : toStr(stream));

                this.connection.addStream(stream);

                this.sendStreamId(stream);
                this.getStreamInfo();
            },
            attachMediaStreams: function() {
                var streams = this.attachStreams;
                for (var i = 0; i < streams.length; i++) {
                    this.addStream(streams[i]);
                }
            },
            getStreamInfo: function() {
                this.streaminfo = '';
                var streams = this.connection.getLocalStreams();
                for (var i = 0; i < streams.length; i++) {
                    if (i == 0) {
                        this.streaminfo = JSON.stringify({
                            streamid: streams[i].streamid || '',
                            isScreen: !!streams[i].isScreen,
                            isAudio: !!streams[i].isAudio,
                            isVideo: !!streams[i].isVideo,
                            preMuted: streams[i].preMuted || {}
                        });
                    } else {
                        this.streaminfo += '----' + JSON.stringify({
                            streamid: streams[i].streamid || '',
                            isScreen: !!streams[i].isScreen,
                            isAudio: !!streams[i].isAudio,
                            isVideo: !!streams[i].isVideo,
                            preMuted: streams[i].preMuted || {}
                        });
                    }
                }
            },
            recreateOffer: function(renegotiate, callback) {
                log('recreating offer');

                this.type = 'offer';
                this.session = renegotiate;

                // todo: make sure this doesn't affect renegotiation scenarios
                // this.setConstraints();

                this.onSessionDescription = callback;
                this.getStreamInfo();

                // one can renegotiate data connection in existing audio/video/screen connection!
                if (this.session.data) {
                    this.createDataChannel();
                }

                this.getLocalDescription('offer');
            },
            recreateAnswer: function(sdp, session, callback) {
                // if(isFirefox) this.create(this.type, this);

                log('recreating answer');

                this.type = 'answer';
                this.session = session;

                // todo: make sure this doesn't affect renegotiation scenarios
                // this.setConstraints();

                this.onSessionDescription = callback;
                this.offerDescription = sdp;
                this.getStreamInfo();

                // one can renegotiate data connection in existing audio/video/screen connection!
                if (this.session.data) {
                    this.createDataChannel();
                }

                this.getLocalDescription('answer');
            }
        };
    }

    var FileSaver = {
        SaveToDisk: invokeSaveAsDialog
    };


    function invokeSaveAsDialog(fileUrl, fileName) {
        /*
        if (typeof navigator.msSaveOrOpenBlob !== 'undefined') {
            return navigator.msSaveOrOpenBlob(file, fileFullName);
        } else if (typeof navigator.msSaveBlob !== 'undefined') {
            return navigator.msSaveBlob(file, fileFullName);
        }
        */

        var hyperlink = document.createElement('a');
        hyperlink.href = fileUrl;
        hyperlink.target = '_blank';
        hyperlink.download = fileName || fileUrl;

        if (!!navigator.mozGetUserMedia) {
            hyperlink.onclick = function() {
                (document.body || document.documentElement).removeChild(hyperlink);
            };
            (document.body || document.documentElement).appendChild(hyperlink);
        }

        var evt = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });

        hyperlink.dispatchEvent(evt);

        if (!navigator.mozGetUserMedia) {
            URL.revokeObjectURL(hyperlink.href);
        }
    }

    var TextSender = {
        send: function(config) {
            var connection = config.connection;

            if (config.text instanceof ArrayBuffer || config.text instanceof DataView) {
                return config.channel.send(config.text, config._channel);
            }

            var channel = config.channel,
                _channel = config._channel,
                initialText = config.text,
                packetSize = connection.chunkSize || 1000,
                textToTransfer = '',
                isobject = false;

            if (!isString(initialText)) {
                isobject = true;
                initialText = JSON.stringify(initialText);
            }

            // uuid is used to uniquely identify sending instance
            var uuid = getRandomString();
            var sendingTime = new Date().getTime();

            sendText(initialText);

            function sendText(textMessage, text) {
                var data = {
                    type: 'text',
                    uuid: uuid,
                    sendingTime: sendingTime
                };

                if (textMessage) {
                    text = textMessage;
                    data.packets = parseInt(text.length / packetSize);
                }

                if (text.length > packetSize)
                    data.message = text.slice(0, packetSize);
                else {
                    data.message = text;
                    data.last = true;
                    data.isobject = isobject;
                }

                channel.send(data, _channel);

                textToTransfer = text.slice(data.message.length);

                if (textToTransfer.length) {
                    setTimeout(function() {
                        sendText(null, textToTransfer);
                    }, connection.chunkInterval || 100);
                }
            }
        }
    };

    function TextReceiver(connection) {
        var content = {};

        function receive(data, userid, extra) {
            // uuid is used to uniquely identify sending instance
            var uuid = data.uuid;
            if (!content[uuid]) content[uuid] = [];

            content[uuid].push(data.message);
            if (data.last) {
                var message = content[uuid].join('');
                if (data.isobject) message = JSON.parse(message);

                // latency detection
                var receivingTime = new Date().getTime();
                var latency = receivingTime - data.sendingTime;

                var e = {
                    data: message,
                    userid: userid,
                    extra: extra,
                    latency: latency
                };

                if (message.preRecordedMediaChunk) {
                    if (!connection.preRecordedMedias[message.streamerid]) {
                        connection.shareMediaFile(null, null, message.streamerid);
                    }
                    connection.preRecordedMedias[message.streamerid].onData(message.chunk);
                } else if (connection.autoTranslateText) {
                    e.original = e.data;
                    connection.Translator.TranslateText(e.data, function(translatedText) {
                        e.data = translatedText;
                        connection.onmessage(e);
                    });
                } else if (message.isPartOfScreen) {
                    connection.onpartofscreen(message);
                } else connection.onmessage(e);

                delete content[uuid];
            }
        }

        return {
            receive: receive
        };
    }

    // Last time updated at Sep 25, 2015, 08:32:23

    // Latest file can be found here: https://cdn.webrtc-experiment.com/DetectRTC.js

    // Muaz Khan     - www.MuazKhan.com
    // MIT License   - www.WebRTC-Experiment.com/licence
    // Documentation - github.com/muaz-khan/DetectRTC
    // ____________
    // DetectRTC.js

    // DetectRTC.hasWebcam (has webcam device!)
    // DetectRTC.hasMicrophone (has microphone device!)
    // DetectRTC.hasSpeakers (has speakers!)

    (function() {

        'use strict';

        var navigator = window.navigator;

        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
            // Firefox 38+ seems having support of enumerateDevices
            // Thanks @xdumaine/enumerateDevices
            navigator.enumerateDevices = function(callback) {
                navigator.mediaDevices.enumerateDevices().then(callback);
            };
        }

        if (typeof navigator !== 'undefined') {
            if (typeof navigator.webkitGetUserMedia !== 'undefined') {
                navigator.getUserMedia = navigator.webkitGetUserMedia;
            }

            if (typeof navigator.mozGetUserMedia !== 'undefined') {
                navigator.getUserMedia = navigator.mozGetUserMedia;
            }
        } else {
            navigator = {
                getUserMedia: function() {}
            };
        }

        var isMobileDevice = !!navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile/i);
        var isEdge = navigator.userAgent.indexOf('Edge') !== -1 && (!!navigator.msSaveOrOpenBlob || !!navigator.msSaveBlob);

        // this one can also be used:
        // https://www.websocket.org/js/stuff.js (DetectBrowser.js)

        function getBrowserInfo() {
            var nVer = navigator.appVersion;
            var nAgt = navigator.userAgent;
            var browserName = navigator.appName;
            var fullVersion = '' + parseFloat(navigator.appVersion);
            var majorVersion = parseInt(navigator.appVersion, 10);
            var nameOffset, verOffset, ix;

            // In Opera, the true version is after 'Opera' or after 'Version'
            if ((verOffset = nAgt.indexOf('Opera')) !== -1) {
                browserName = 'Opera';
                fullVersion = nAgt.substring(verOffset + 6);

                if ((verOffset = nAgt.indexOf('Version')) !== -1) {
                    fullVersion = nAgt.substring(verOffset + 8);
                }
            }
            // In MSIE, the true version is after 'MSIE' in userAgent
            else if ((verOffset = nAgt.indexOf('MSIE')) !== -1) {
                browserName = 'IE';
                fullVersion = nAgt.substring(verOffset + 5);
            }
            // In Chrome, the true version is after 'Chrome'
            else if ((verOffset = nAgt.indexOf('Chrome')) !== -1) {
                browserName = 'Chrome';
                fullVersion = nAgt.substring(verOffset + 7);
            }
            // In Safari, the true version is after 'Safari' or after 'Version'
            else if ((verOffset = nAgt.indexOf('Safari')) !== -1) {
                browserName = 'Safari';
                fullVersion = nAgt.substring(verOffset + 7);

                if ((verOffset = nAgt.indexOf('Version')) !== -1) {
                    fullVersion = nAgt.substring(verOffset + 8);
                }
            }
            // In Firefox, the true version is after 'Firefox'
            else if ((verOffset = nAgt.indexOf('Firefox')) !== -1) {
                browserName = 'Firefox';
                fullVersion = nAgt.substring(verOffset + 8);
            }

            // In most other browsers, 'name/version' is at the end of userAgent
            else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
                browserName = nAgt.substring(nameOffset, verOffset);
                fullVersion = nAgt.substring(verOffset + 1);

                if (browserName.toLowerCase() === browserName.toUpperCase()) {
                    browserName = navigator.appName;
                }
            }

            if (isEdge) {
                browserName = 'Edge';
                // fullVersion = navigator.userAgent.split('Edge/')[1];
                fullVersion = parseInt(navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)[2], 10);
            }

            // trim the fullVersion string at semicolon/space if present
            if ((ix = fullVersion.indexOf(';')) !== -1) {
                fullVersion = fullVersion.substring(0, ix);
            }

            if ((ix = fullVersion.indexOf(' ')) !== -1) {
                fullVersion = fullVersion.substring(0, ix);
            }

            majorVersion = parseInt('' + fullVersion, 10);

            if (isNaN(majorVersion)) {
                fullVersion = '' + parseFloat(navigator.appVersion);
                majorVersion = parseInt(navigator.appVersion, 10);
            }

            return {
                fullVersion: fullVersion,
                version: majorVersion,
                name: browserName
            };
        }

        var isMobile = {
            Android: function() {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function() {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function() {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function() {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function() {
                return navigator.userAgent.match(/IEMobile/i);
            },
            any: function() {
                return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
            },
            getOsName: function() {
                var osName = 'Unknown OS';
                if (isMobile.Android()) {
                    osName = 'Android';
                }

                if (isMobile.BlackBerry()) {
                    osName = 'BlackBerry';
                }

                if (isMobile.iOS()) {
                    osName = 'iOS';
                }

                if (isMobile.Opera()) {
                    osName = 'Opera Mini';
                }

                if (isMobile.Windows()) {
                    osName = 'Windows';
                }

                return osName;
            }
        };

        var osName = 'Unknown OS';

        if (isMobile.any()) {
            osName = isMobile.getOsName();
        } else {
            if (navigator.appVersion.indexOf('Win') !== -1) {
                osName = 'Windows';
            }

            if (navigator.appVersion.indexOf('Mac') !== -1) {
                osName = 'MacOS';
            }

            if (navigator.appVersion.indexOf('X11') !== -1) {
                osName = 'UNIX';
            }

            if (navigator.appVersion.indexOf('Linux') !== -1) {
                osName = 'Linux';
            }
        }


        var isCanvasSupportsStreamCapturing = false;
        var isVideoSupportsStreamCapturing = false;
        ['captureStream', 'mozCaptureStream', 'webkitCaptureStream'].forEach(function(item) {
            // asdf
            if (item in document.createElement('canvas')) {
                isCanvasSupportsStreamCapturing = true;
            }

            if (item in document.createElement('video')) {
                isVideoSupportsStreamCapturing = true;
            }
        });

        // via: https://github.com/diafygi/webrtc-ips
        function DetectLocalIPAddress(callback) {
            getIPs(function(ip) {
                //local IPs
                if (ip.match(/^(192\.168\.|169\.254\.|10\.|172\.(1[6-9]|2\d|3[01]))/)) {
                    callback('Local: ' + ip);
                }

                //assume the rest are public IPs
                else {
                    callback('Public: ' + ip);
                }
            });
        }

        //get the IP addresses associated with an account
        function getIPs(callback) {
            var ipDuplicates = {};

            //compatibility for firefox and chrome
            var RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
            var useWebKit = !!window.webkitRTCPeerConnection;

            // bypass naive webrtc blocking using an iframe
            if (!RTCPeerConnection) {
                var iframe = document.getElementById('iframe');
                if (!iframe) {
                    //<iframe id="iframe" sandbox="allow-same-origin" style="display: none"></iframe>
                    throw 'NOTE: you need to have an iframe in the page right above the script tag.';
                }
                var win = iframe.contentWindow;
                RTCPeerConnection = win.RTCPeerConnection || win.mozRTCPeerConnection || win.webkitRTCPeerConnection;
                useWebKit = !!win.webkitRTCPeerConnection;
            }

            //minimal requirements for data connection
            var mediaConstraints = {
                optional: [{
                    RtpDataChannels: true
                }]
            };

            //firefox already has a default stun server in about:config
            //    media.peerconnection.default_iceservers =
            //    [{"url": "stun:stun.services.mozilla.com"}]
            var servers;

            //add same stun server for chrome
            if (useWebKit) {
                servers = {
                    iceServers: [{
                        urls: 'stun:stun.services.mozilla.com'
                    }]
                };

                if (typeof DetectRTC !== 'undefined' && DetectRTC.browser.isFirefox && DetectRTC.browser.version <= 38) {
                    servers[0] = {
                        url: servers[0].urls
                    };
                }
            }

            //construct a new RTCPeerConnection
            var pc = new RTCPeerConnection(servers, mediaConstraints);

            function handleCandidate(candidate) {
                //match just the IP address
                var ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
                var ipAddress = ipRegex.exec(candidate)[1];

                //remove duplicates
                if (ipDuplicates[ipAddress] === undefined) {
                    callback(ipAddress);
                }

                ipDuplicates[ipAddress] = true;
            }

            //listen for candidate events
            pc.onicecandidate = function(ice) {
                //skip non-candidate events
                if (ice.candidate) {
                    handleCandidate(ice.candidate.candidate);
                }
            };

            //create a bogus data channel
            pc.createDataChannel('');

            //create an offer sdp
            pc.createOffer(function(result) {

                //trigger the stun server request
                pc.setLocalDescription(result, function() {}, function() {});

            }, function() {});

            //wait for a while to let everything done
            setTimeout(function() {
                //read candidate info from local description
                var lines = pc.localDescription.sdp.split('\n');

                lines.forEach(function(line) {
                    if (line.indexOf('a=candidate:') === 0) {
                        handleCandidate(line);
                    }
                });
            }, 1000);
        }

        var MediaDevices = [];

        // ---------- Media Devices detection
        var canEnumerate = false;

        /*global MediaStreamTrack:true */
        if (typeof MediaStreamTrack !== 'undefined' && 'getSources' in MediaStreamTrack) {
            canEnumerate = true;
        } else if (navigator.mediaDevices && !!navigator.mediaDevices.enumerateDevices) {
            canEnumerate = true;
        }

        var hasMicrophone = canEnumerate;
        var hasSpeakers = canEnumerate;
        var hasWebcam = canEnumerate;

        // http://dev.w3.org/2011/webrtc/editor/getusermedia.html#mediadevices
        // todo: switch to enumerateDevices when landed in canary.
        function checkDeviceSupport(callback) {
            // This method is useful only for Chrome!

            if (!navigator.enumerateDevices && window.MediaStreamTrack && window.MediaStreamTrack.getSources) {
                navigator.enumerateDevices = window.MediaStreamTrack.getSources.bind(window.MediaStreamTrack);
            }

            if (!navigator.enumerateDevices && navigator.enumerateDevices) {
                navigator.enumerateDevices = navigator.enumerateDevices.bind(navigator);
            }

            if (!navigator.enumerateDevices) {
                if (callback) {
                    callback();
                }
                return;
            }

            MediaDevices = [];
            navigator.enumerateDevices(function(devices) {
                devices.forEach(function(_device) {
                    var device = {};
                    for (var d in _device) {
                        device[d] = _device[d];
                    }

                    var skip;
                    MediaDevices.forEach(function(d) {
                        if (d.id === device.id) {
                            skip = true;
                        }
                    });

                    if (skip) {
                        return;
                    }

                    // if it is MediaStreamTrack.getSources
                    if (device.kind === 'audio') {
                        device.kind = 'audioinput';
                    }

                    if (device.kind === 'video') {
                        device.kind = 'videoinput';
                    }

                    if (!device.deviceId) {
                        device.deviceId = device.id;
                    }

                    if (!device.id) {
                        device.id = device.deviceId;
                    }

                    if (!device.label) {
                        device.label = 'Please invoke getUserMedia once.';
                        if (!isHTTPs) {
                            device.label = 'HTTPs is required to get label of this ' + device.kind + ' device.';
                        }
                    }

                    if (device.kind === 'audioinput' || device.kind === 'audio') {
                        hasMicrophone = true;
                    }

                    if (device.kind === 'audiooutput') {
                        hasSpeakers = true;
                    }

                    if (device.kind === 'videoinput' || device.kind === 'video') {
                        hasWebcam = true;
                    }

                    // there is no 'videoouput' in the spec.

                    MediaDevices.push(device);
                });

                if (typeof DetectRTC !== 'undefined') {
                    DetectRTC.MediaDevices = MediaDevices;
                    DetectRTC.hasMicrophone = hasMicrophone;
                    DetectRTC.hasSpeakers = hasSpeakers;
                    DetectRTC.hasWebcam = hasWebcam;
                }

                if (callback) {
                    callback();
                }
            });
        }

        // check for microphone/camera support!
        checkDeviceSupport();

        var DetectRTC = {};

        // ----------
        // DetectRTC.browser.name || DetectRTC.browser.version || DetectRTC.browser.fullVersion
        DetectRTC.browser = getBrowserInfo();

        // DetectRTC.isChrome || DetectRTC.isFirefox || DetectRTC.isEdge
        DetectRTC.browser['is' + DetectRTC.browser.name] = true;

        var isHTTPs = location.protocol === 'https:';
        var isNodeWebkit = !!(window.process && (typeof window.process === 'object') && window.process.versions && window.process.versions['node-webkit']);

        // --------- Detect if system supports WebRTC 1.0 or WebRTC 1.1.
        var isWebRTCSupported = false;
        ['webkitRTCPeerConnection', 'mozRTCPeerConnection', 'RTCIceGatherer'].forEach(function(item) {
            if (item in window) {
                isWebRTCSupported = true;
            }
        });
        DetectRTC.isWebRTCSupported = isWebRTCSupported;

        //-------
        DetectRTC.isORTCSupported = typeof RTCIceGatherer !== 'undefined';

        // --------- Detect if system supports screen capturing API
        var isScreenCapturingSupported = false;
        if (DetectRTC.browser.isChrome && DetectRTC.browser.version >= 35) {
            isScreenCapturingSupported = true;
        } else if (DetectRTC.browser.isFirefox && DetectRTC.browser.version >= 34) {
            isScreenCapturingSupported = true;
        }

        if (!isHTTPs) {
            isScreenCapturingSupported = false;
        }
        DetectRTC.isScreenCapturingSupported = isScreenCapturingSupported;

        // --------- Detect if WebAudio API are supported
        var webAudio = {};
        ['AudioContext', 'webkitAudioContext', 'mozAudioContext', 'msAudioContext'].forEach(function(item) {
            if (webAudio.isSupported && webAudio.isCreateMediaStreamSourceSupported) {
                return;
            }
            if (item in window) {
                webAudio.isSupported = true;

                if ('createMediaStreamSource' in window[item].prototype) {
                    webAudio.isCreateMediaStreamSourceSupported = true;
                }
            }
        });
        DetectRTC.isAudioContextSupported = webAudio.isSupported;
        DetectRTC.isCreateMediaStreamSourceSupported = webAudio.isCreateMediaStreamSourceSupported;

        // ---------- Detect if SCTP/RTP channels are supported.

        var isRtpDataChannelsSupported = false;
        if (DetectRTC.browser.isChrome && DetectRTC.browser.version > 31) {
            isRtpDataChannelsSupported = true;
        }
        DetectRTC.isRtpDataChannelsSupported = isRtpDataChannelsSupported;

        var isSCTPSupportd = false;
        if (DetectRTC.browser.isFirefox && DetectRTC.browser.version > 28) {
            isSCTPSupportd = true;
        } else if (DetectRTC.browser.isChrome && DetectRTC.browser.version > 25) {
            isSCTPSupportd = true;
        } else if (DetectRTC.browser.isOpera && DetectRTC.browser.version >= 11) {
            isSCTPSupportd = true;
        }
        DetectRTC.isSctpDataChannelsSupported = isSCTPSupportd;

        // ---------

        DetectRTC.isMobileDevice = isMobileDevice; // "isMobileDevice" boolean is defined in "getBrowserInfo.js"

        // ------

        DetectRTC.isWebSocketsSupported = 'WebSocket' in window && 2 === window.WebSocket.CLOSING;
        DetectRTC.isWebSocketsBlocked = 'Checking';

        if (DetectRTC.isWebSocketsSupported) {
            var websocket = new WebSocket('wss://echo.websocket.org:443/');
            websocket.onopen = function() {
                DetectRTC.isWebSocketsBlocked = false;

                if (DetectRTC.loadCallback) {
                    DetectRTC.loadCallback();
                }
            };
            websocket.onerror = function() {
                DetectRTC.isWebSocketsBlocked = true;

                if (DetectRTC.loadCallback) {
                    DetectRTC.loadCallback();
                }
            };
        }

        // ------
        var isGetUserMediaSupported = false;
        if (navigator.getUserMedia) {
            isGetUserMediaSupported = true;
        } else if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            isGetUserMediaSupported = true;
        }
        if (DetectRTC.browser.isChrome && DetectRTC.browser.version >= 47 && !isHTTPs) {
            DetectRTC.isGetUserMediaSupported = 'Requires HTTPs';
        }
        DetectRTC.isGetUserMediaSupported = isGetUserMediaSupported;

        // -----------
        DetectRTC.osName = osName; // "osName" is defined in "detectOSName.js"

        // ----------
        DetectRTC.isCanvasSupportsStreamCapturing = isCanvasSupportsStreamCapturing;
        DetectRTC.isVideoSupportsStreamCapturing = isVideoSupportsStreamCapturing;

        // ------
        DetectRTC.DetectLocalIPAddress = DetectLocalIPAddress;

        // -------
        DetectRTC.load = function(callback) {
            this.loadCallback = callback;

            checkDeviceSupport(callback);
        };

        DetectRTC.MediaDevices = MediaDevices;
        DetectRTC.hasMicrophone = hasMicrophone;
        DetectRTC.hasSpeakers = hasSpeakers;
        DetectRTC.hasWebcam = hasWebcam;

        // ------
        var isSetSinkIdSupported = false;
        if ('setSinkId' in document.createElement('video')) {
            isSetSinkIdSupported = true;
        }
        DetectRTC.isSetSinkIdSupported = isSetSinkIdSupported;

        // -----
        var isRTPSenderReplaceTracksSupported = false;
        if (DetectRTC.browser.isFirefox /*&& DetectRTC.browser.version > 39*/ ) {
            /*global mozRTCPeerConnection:true */
            if ('getSenders' in mozRTCPeerConnection.prototype) {
                isRTPSenderReplaceTracksSupported = true;
            }
        } else if (DetectRTC.browser.isChrome) {
            /*global webkitRTCPeerConnection:true */
            if ('getSenders' in webkitRTCPeerConnection.prototype) {
                isRTPSenderReplaceTracksSupported = true;
            }
        }
        DetectRTC.isRTPSenderReplaceTracksSupported = isRTPSenderReplaceTracksSupported;

        //------
        var isRemoteStreamProcessingSupported = false;
        if (DetectRTC.browser.isFirefox && DetectRTC.browser.version > 38) {
            isRemoteStreamProcessingSupported = true;
        }
        DetectRTC.isRemoteStreamProcessingSupported = isRemoteStreamProcessingSupported;

        //-------
        var isApplyConstraintsSupported = false;

        /*global MediaStreamTrack:true */
        if (typeof MediaStreamTrack !== 'undefined' && 'applyConstraints' in MediaStreamTrack.prototype) {
            isApplyConstraintsSupported = true;
        }
        DetectRTC.isApplyConstraintsSupported = isApplyConstraintsSupported;

        //-------
        var isMultiMonitorScreenCapturingSupported = false;
        if (DetectRTC.browser.isFirefox && DetectRTC.browser.version >= 43) {
            // version 43 merely supports platforms for multi-monitors
            // version 44 will support exact multi-monitor selection i.e. you can select any monitor for screen capturing.
            isMultiMonitorScreenCapturingSupported = true;
        }
        DetectRTC.isMultiMonitorScreenCapturingSupported = isMultiMonitorScreenCapturingSupported;

        window.DetectRTC = DetectRTC;

    })();

    // DetectRTC extender
    var screenCallback;

    DetectRTC.screen = {
        chromeMediaSource: 'screen',
        extensionid: ReservedExtensionID,
        getSourceId: function(callback) {
            if (!callback) throw '"callback" parameter is mandatory.';

            // make sure that chrome extension is installed.
            if (!!DetectRTC.screen.status) {
                onstatus(DetectRTC.screen.status);
            } else DetectRTC.screen.getChromeExtensionStatus(onstatus);

            function onstatus(status) {
                if (status == 'installed-enabled') {
                    screenCallback = callback;
                    window.postMessage('get-sourceId', '*');
                    return;
                }

                DetectRTC.screen.chromeMediaSource = 'screen';
                callback('No-Response'); // chrome extension isn't available
            }
        },
        onMessageCallback: function(data) {
            if (!(isString(data) || !!data.sourceId)) return;

            log('chrome message', data);

            // "cancel" button is clicked
            if (data == 'PermissionDeniedError') {
                DetectRTC.screen.chromeMediaSource = 'PermissionDeniedError';
                if (screenCallback) return screenCallback('PermissionDeniedError');
                else throw new Error('PermissionDeniedError');
            }

            // extension notified his presence
            if (data == 'rtcmulticonnection-extension-loaded') {
                DetectRTC.screen.chromeMediaSource = 'desktop';
                if (DetectRTC.screen.onScreenCapturingExtensionAvailable) {
                    DetectRTC.screen.onScreenCapturingExtensionAvailable();

                    // make sure that this event isn't fired multiple times
                    DetectRTC.screen.onScreenCapturingExtensionAvailable = null;
                }
            }

            // extension shared temp sourceId
            if (data.sourceId) {
                DetectRTC.screen.sourceId = data.sourceId;
                if (screenCallback) screenCallback(DetectRTC.screen.sourceId);
            }
        },
        getChromeExtensionStatus: function(extensionid, callback) {
            function _callback(status) {
                DetectRTC.screen.status = status;
                callback(status);
            }

            if (isFirefox) return _callback('not-chrome');

            if (arguments.length != 2) {
                callback = extensionid;
                extensionid = this.extensionid;
            }

            var image = document.createElement('img');
            image.src = 'chrome-extension://' + extensionid + '/icon.png';
            image.onload = function() {
                DetectRTC.screen.chromeMediaSource = 'screen';
                window.postMessage('are-you-there', '*');
                setTimeout(function() {
                    if (DetectRTC.screen.chromeMediaSource == 'screen') {
                        _callback(
                            DetectRTC.screen.chromeMediaSource == 'desktop' ? 'installed-enabled' : 'installed-disabled' 
                        );
                    } else _callback('installed-enabled');
                }, 2000);
            };
            image.onerror = function() {
                _callback('not-installed');
            };
        }
    };

    // if IE
    if (!window.addEventListener) {
        window.addEventListener = function(el, eventName, eventHandler) {
            if (!el.attachEvent) return;
            el.attachEvent('on' + eventName, eventHandler);
        };
    }

    function listenEventHandler(eventName, eventHandler) {
        window.removeEventListener(eventName, eventHandler);
        window.addEventListener(eventName, eventHandler, false);
    }

    window.addEventListener('message', function(event) {
        if (event.origin != window.location.origin) {
            return;
        }

        DetectRTC.screen.onMessageCallback(event.data);
    });

    function setDefaults(connection) {
        // www.RTCMultiConnection.org/docs/userid/
        connection.userid = getRandomString();

        // www.RTCMultiConnection.org/docs/session/
        connection.session = {
            audio: true,
            video: true
        };

        // www.RTCMultiConnection.org/docs/maxParticipantsAllowed/
        connection.maxParticipantsAllowed = 256;

        // www.RTCMultiConnection.org/docs/direction/
        // 'many-to-many' / 'one-to-many' / 'one-to-one' / 'one-way'
        connection.direction = 'many-to-many';

        // www.RTCMultiConnection.org/docs/mediaConstraints/
        connection.mediaConstraints = {
            mandatory: {}, // kept for backward compatibility
            optional: [], // kept for backward compatibility
            audio: {
                mandatory: {},
                optional: []
            },
            video: {
                mandatory: {},
                optional: []
            }
        };

        // www.RTCMultiConnection.org/docs/candidates/
        connection.candidates = {
            host: true,
            stun: true,
            turn: true
        };

        connection.sdpConstraints = {};

        // as @serhanters proposed in #225
        // it will auto fix "all" renegotiation scenarios
        connection.sdpConstraints.mandatory = {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: true
        };

        connection.privileges = {
            canStopRemoteStream: false, // user can stop remote streams
            canMuteRemoteStream: false // user can mute remote streams
        };

        connection.iceProtocols = {
            tcp: true,
            udp: true
        };

        // www.RTCMultiConnection.org/docs/preferSCTP/
        connection.preferSCTP = isFirefox || chromeVersion >= 32 ? true : false;
        connection.chunkInterval = isFirefox || chromeVersion >= 32 ? 100 : 500; // 500ms for RTP and 100ms for SCTP
        connection.chunkSize = isFirefox || chromeVersion >= 32 ? 13 * 1000 : 1000; // 1000 chars for RTP and 13000 chars for SCTP

        // www.RTCMultiConnection.org/docs/fakeDataChannels/
        connection.fakeDataChannels = false;

        connection.waitUntilRemoteStreamStartsFlowing = null; // NULL == true

        // auto leave on page unload
        connection.leaveOnPageUnload = true;

        // get ICE-servers from XirSys
        connection.getExternalIceServers = isChrome;

        // www.RTCMultiConnection.org/docs/UA/
        connection.UA = {
            isFirefox: isFirefox,
            isChrome: isChrome,
            isMobileDevice: isMobileDevice,
            version: isChrome ? chromeVersion : firefoxVersion,
            isNodeWebkit: isNodeWebkit,
            isSafari: isSafari,
            isIE: isIE,
            isOpera: isOpera
        };

        // file queue: to store previous file objects in memory;
        // and stream over newly connected peers
        // www.RTCMultiConnection.org/docs/fileQueue/
        connection.fileQueue = {};

        // this array is aimed to store all renegotiated streams' session-types
        connection.renegotiatedSessions = {};

        // www.RTCMultiConnection.org/docs/channels/
        connection.channels = {};

        // www.RTCMultiConnection.org/docs/extra/
        connection.extra = {};

        // www.RTCMultiConnection.org/docs/bandwidth/
        connection.bandwidth = {
            screen: 300 // 300kbps (dirty workaround)
        };

        // www.RTCMultiConnection.org/docs/caniuse/
        connection.caniuse = {
            RTCPeerConnection: DetectRTC.isWebRTCSupported,
            getUserMedia: !!navigator.webkitGetUserMedia || !!navigator.mozGetUserMedia,
            AudioContext: DetectRTC.isAudioContextSupported,

            // there is no way to check whether "getUserMedia" flag is enabled or not!
            ScreenSharing: DetectRTC.isScreenCapturingSupported,
            RtpDataChannels: DetectRTC.isRtpDataChannelsSupported,
            SctpDataChannels: DetectRTC.isSctpDataChannelsSupported
        };

        // www.RTCMultiConnection.org/docs/snapshots/
        connection.snapshots = {};

        // www.WebRTC-Experiment.com/demos/MediaStreamTrack.getSources.html
        connection._mediaSources = {};

        // www.RTCMultiConnection.org/docs/devices/
        connection.devices = {};

        // www.RTCMultiConnection.org/docs/language/ (to see list of all supported languages)
        connection.language = 'en';

        // www.RTCMultiConnection.org/docs/autoTranslateText/
        connection.autoTranslateText = false;

        // please use your own Google Translate API key
        // Google Translate is a paid service.
        connection.googKey = 'AIzaSyCgB5hmFY74WYB-EoWkhr9cAGr6TiTHrEE';

        connection.localStreamids = [];
        connection.localStreams = {};

        // this object stores pre-recorded media streaming uids
        // multiple pre-recorded media files can be streamed concurrently.
        connection.preRecordedMedias = {};

        // www.RTCMultiConnection.org/docs/attachStreams/
        connection.attachStreams = [];

        // www.RTCMultiConnection.org/docs/detachStreams/
        connection.detachStreams = [];

        connection.optionalArgument = {
            optional: [{
                DtlsSrtpKeyAgreement: true
            }, {
                googImprovedWifiBwe: true
            }, {
                googScreencastMinBitrate: 300
            }],
            mandatory: {}
        };

        connection.dataChannelDict = {};

        // www.RTCMultiConnection.org/docs/dontAttachStream/
        connection.dontAttachStream = false;

        // www.RTCMultiConnection.org/docs/dontCaptureUserMedia/
        connection.dontCaptureUserMedia = false;

        // this feature added to keep users privacy and 
        // make sure HTTPs pages NEVER auto capture users media
        // isChrome && location.protocol == 'https:'
        connection.preventSSLAutoAllowed = false;

        connection.autoReDialOnFailure = true;
        connection.isInitiator = false;

        // access DetectRTC.js features directly!
        connection.DetectRTC = DetectRTC;

        // you can falsify it to merge all ICE in SDP and share only SDP!
        // such mechanism is useful for SIP/XMPP and XMLHttpRequest signaling
        // bug: renegotiation fails if "trickleIce" is false
        connection.trickleIce = true;

        // this object stores list of all sessions in current channel
        connection.sessionDescriptions = {};

        // this object stores current user's session-description
        // it is set only for initiator
        // it is set as soon as "open" method is invoked.
        connection.sessionDescription = null;

        // resources used in RTCMultiConnection
        connection.resources = {
            RecordRTC: 'https://cdn.webrtc-experiment.com/RecordRTC.js',
            PreRecordedMediaStreamer: 'https://cdn.webrtc-experiment.com/PreRecordedMediaStreamer.js',
            customGetUserMediaBar: 'https://cdn.webrtc-experiment.com/navigator.customGetUserMediaBar.js',
            html2canvas: 'https://cdn.webrtc-experiment.com/screenshot.js',
            hark: 'https://cdn.webrtc-experiment.com/hark.js',
            firebase: 'scripts/irebase.js',
            firebaseio: 'https://webrtc-experiment.firebaseIO.com/',
            muted: 'muted.png',
            getConnectionStats: 'scripts/getConnectionStats.js',
            FileBufferReader: 'scripts/FileBufferReader.js'
        };

        // www.RTCMultiConnection.org/docs/body/
        connection.body = document.body || document.documentElement;

        // www.RTCMultiConnection.org/docs/peers/
        connection.peers = {};

        // www.RTCMultiConnection.org/docs/firebase/
        connection.firebase = 'chat';

        connection.numberOfSessions = 0;
        connection.numberOfConnectedUsers = 0;

        // by default, data-connections will always be getting
        // FileBufferReader.js if absent.
        connection.enableFileSharing = true;

        // www.RTCMultiConnection.org/docs/autoSaveToDisk/
        // to make sure file-saver dialog is not invoked.
        connection.autoSaveToDisk = false;

        connection.processSdp = function(sdp) {
            // process sdp here
            return sdp;
        };

        // www.RTCMultiConnection.org/docs/onmessage/
        connection.onmessage = function(e) {
            log('onmessage', toStr(e));
        };

        // www.RTCMultiConnection.org/docs/onopen/
        connection.onopen = function(e) {
            log('Data connection is opened between you and', e.userid);
        };

        // www.RTCMultiConnection.org/docs/onerror/
        connection.onerror = function(e) {
            error(onerror, toStr(e));
        };

        // www.RTCMultiConnection.org/docs/onclose/
        connection.onclose = function(e) {
            warn('onclose', toStr(e));

            // todo: should we use "stop" or "remove"?
            // BTW, it is remote user!
            connection.streams.remove({
                userid: e.userid
            });
        };

        var progressHelper = {};

        // www.RTCMultiConnection.org/docs/onFileStart/
        connection.onFileStart = function(file) {
            var div = document.createElement('div');
            div.title = file.name;
            div.innerHTML = '<label>0%</label> <progress></progress>';
            connection.body.insertBefore(div, connection.body.firstChild);
            progressHelper[file.uuid] = {
                div: div,
                progress: div.querySelector('progress'),
                label: div.querySelector('label')
            };
            progressHelper[file.uuid].progress.max = file.maxChunks;
        };

        // www.RTCMultiConnection.org/docs/onFileProgress/
        connection.onFileProgress = function(chunk) {
            var helper = progressHelper[chunk.uuid];
            if (!helper) return;
            helper.progress.value = chunk.currentPosition || chunk.maxChunks || helper.progress.max;
            updateLabel(helper.progress, helper.label);
        };

        // www.RTCMultiConnection.org/docs/onFileEnd/
        connection.onFileEnd = function(file) {
            if (progressHelper[file.uuid]) progressHelper[file.uuid].div.innerHTML = '<a href="' + file.url + '" target="_blank" download="' + file.name + '">' + file.name + '</a>';

            // for backward compatibility
            if (connection.onFileSent || connection.onFileReceived) {
                if (connection.onFileSent) connection.onFileSent(file, file.uuid);
                if (connection.onFileReceived) connection.onFileReceived(file.name, file);
            }
        };

        function updateLabel(progress, label) {
            if (progress.position == -1) return;
            var position = +progress.position.toFixed(2).split('.')[1] || 100;
            label.innerHTML = position + '%';
        }

        // www.RTCMultiConnection.org/docs/onstream/
        connection.onstream = function(e) {
            connection.body.insertBefore(e.mediaElement, connection.body.firstChild);
        };

        // www.RTCMultiConnection.org/docs/onStreamEndedHandler/
        connection.onstreamended = function(e) {
            log('onStreamEndedHandler:', e);

            if (!e.mediaElement) {
                return warn('Event.mediaElement is undefined', e);
            }
            if (!e.mediaElement.parentNode) {
                e.mediaElement = document.getElementById(e.streamid);

                if (!e.mediaElement) {
                    return warn('Event.mediaElement is undefined', e);
                }

                if (!e.mediaElement.parentNode) {
                    return warn('Event.mediElement.parentNode is null.', e);
                }
            }

            e.mediaElement.parentNode.removeChild(e.mediaElement);
        };

        // todo: need to write documentation link
        connection.onSessionClosed = function(session) {
            if (session.isEjected) {
                warn(session.userid, 'ejected you.');
            } else warn('Session has been closed.', session);
        };

        // www.RTCMultiConnection.org/docs/onmute/
        connection.onmute = function(e) {
            if (e.isVideo && e.mediaElement) {
                e.mediaElement.pause();
                e.mediaElement.setAttribute('poster', e.snapshot || connection.resources.muted);
            }
            if (e.isAudio && e.mediaElement) {
                e.mediaElement.muted = true;
            }
        };

        // www.RTCMultiConnection.org/docs/onunmute/
        connection.onunmute = function(e) {
            if (e.isVideo && e.mediaElement) {
                e.mediaElement.play();
                e.mediaElement.removeAttribute('poster');
            }
            if (e.isAudio && e.mediaElement) {
                e.mediaElement.muted = false;
            }
        };

        // www.RTCMultiConnection.org/docs/onleave/
        connection.onleave = function(e) {
            log('onleave', toStr(e));
        };

        connection.token = getRandomString;

        connection.peers[connection.userid] = {
            drop: function() {
                connection.drop();
            },
            renegotiate: function() {},
            addStream: function() {},
            hold: function() {},
            unhold: function() {},
            changeBandwidth: function() {},
            sharePartOfScreen: function() {}
        };

        connection._skip = ['stop', 'mute', 'unmute', '_private', '_selectStreams', 'selectFirst', 'selectAll', 'remove'];

        // www.RTCMultiConnection.org/docs/streams/
        connection.streams = {
            mute: function(session) {
                this._private(session, true);
            },
            unmute: function(session) {
                this._private(session, false);
            },
            _private: function(session, enabled) {
                if (session && !isString(session)) {
                    for (var stream in this) {
                        if (connection._skip.indexOf(stream) == -1) {
                            _muteOrUnMute(this[stream], session, enabled);
                        }
                    }

                    function _muteOrUnMute(stream, session, isMute) {
                        if (session.local && stream.type != 'local') return;
                        if (session.remote && stream.type != 'remote') return;

                        if (session.isScreen && !stream.isScreen) return;
                        if (session.isAudio && !stream.isAudio) return;
                        if (session.isVideo && !stream.isVideo) return;

                        if (isMute) stream.mute(session);
                        else stream.unmute(session);
                    }
                    return;
                }

                // implementation from #68
                for (var stream in this) {
                    if (connection._skip.indexOf(stream) == -1) {
                        this[stream]._private(session, enabled);
                    }
                }
            },
            stop: function(type) {
                var _stream;
                for (var stream in this) {
                    if (connection._skip.indexOf(stream) == -1) {
                        _stream = this[stream];

                        if (!type) _stream.stop();

                        else if (isString(type)) {
                            // connection.streams.stop('screen');
                            var config = {};
                            config[type] = true;
                            _stopStream(_stream, config);
                        } else _stopStream(_stream, type);
                    }
                }

                function _stopStream(_stream, config) {
                    // connection.streams.stop({ remote: true, userid: 'remote-userid' });
                    if (config.userid && _stream.userid != config.userid) return;

                    if (config.local && _stream.type != 'local') return;
                    if (config.remote && _stream.type != 'remote') return;

                    if (config.screen && !!_stream.isScreen) {
                        _stream.stop();
                    }

                    if (config.audio && !!_stream.isAudio) {
                        _stream.stop();
                    }

                    if (config.video && !!_stream.isVideo) {
                        _stream.stop();
                    }

                    // connection.streams.stop('local');
                    if (!config.audio && !config.video && !config.screen) {
                        _stream.stop();
                    }
                }
            },
            remove: function(type) {
                var _stream;
                for (var stream in this) {
                    if (connection._skip.indexOf(stream) == -1) {
                        _stream = this[stream];

                        if (!type) _stopAndRemoveStream(_stream, {
                            local: true,
                            remote: true
                        });

                        else if (isString(type)) {
                            // connection.streams.stop('screen');
                            var config = {};
                            config[type] = true;
                            _stopAndRemoveStream(_stream, config);
                        } else _stopAndRemoveStream(_stream, type);
                    }
                }

                function _stopAndRemoveStream(_stream, config) {
                    // connection.streams.remove({ remote: true, userid: 'remote-userid' });
                    if (config.userid && _stream.userid != config.userid) return;

                    if (config.local && _stream.type != 'local') return;
                    if (config.remote && _stream.type != 'remote') return;

                    if (config.screen && !!_stream.isScreen) {
                        endStream(_stream);
                    }

                    if (config.audio && !!_stream.isAudio) {
                        endStream(_stream);
                    }

                    if (config.video && !!_stream.isVideo) {
                        endStream(_stream);
                    }

                    // connection.streams.remove('local');
                    if (!config.audio && !config.video && !config.screen) {
                        endStream(_stream);
                    }
                }

                function endStream(_stream) {
                    onStreamEndedHandler(_stream, connection);
                    delete connection.streams[_stream.streamid];
                }
            },
            selectFirst: function(args) {
                return this._selectStreams(args, false);
            },
            selectAll: function(args) {
                return this._selectStreams(args, true);
            },
            _selectStreams: function(args, all) {
                if (!args || isString(args) || isEmpty(args)) throw 'Invalid arguments.';

                // if userid is used then both local/remote shouldn't be auto-set
                if (isNull(args.local) && isNull(args.remote) && isNull(args.userid)) {
                    args.local = args.remote = true;
                }

                if (!args.isAudio && !args.isVideo && !args.isScreen) {
                    args.isAudio = args.isVideo = args.isScreen = true;
                }

                var selectedStreams = [];
                for (var stream in this) {
                    if (connection._skip.indexOf(stream) == -1 && (stream = this[stream]) && ((args.local && stream.type == 'local') || (args.remote && stream.type == 'remote') || (args.userid && stream.userid == args.userid))) {
                        if (args.isVideo && stream.isVideo) {
                            selectedStreams.push(stream);
                        }

                        if (args.isAudio && stream.isAudio) {
                            selectedStreams.push(stream);
                        }

                        if (args.isScreen && stream.isScreen) {
                            selectedStreams.push(stream);
                        }
                    }
                }

                return !!all ? selectedStreams : selectedStreams[0];
            }
        };

        var iceServers = [];

        iceServers.push({
            url: 'stun:stun.l.google.com:19302'
        });

        iceServers.push({
            url: 'stun:stun.anyfirewall.com:3478'
        });

        iceServers.push({
            url: 'turn:turn.bistri.com:80',
            credential: 'homeo',
            username: 'homeo'
        });

        iceServers.push({
            url: 'turn:turn.anyfirewall.com:443?transport=tcp',
            credential: 'webrtc',
            username: 'webrtc'
        });

        connection.iceServers = iceServers;

        connection.rtcConfiguration = {
            iceServers: null,
            iceTransports: 'all', // none || relay || all - ref: http://goo.gl/40I39K
            peerIdentity: false
        };

        // www.RTCMultiConnection.org/docs/media/
        connection.media = {
            min: function(width, height) {
                if (!connection.mediaConstraints.video) return;

                if (!connection.mediaConstraints.video.mandatory) {
                    connection.mediaConstraints.video.mandatory = {};
                }
                connection.mediaConstraints.video.mandatory.minWidth = width;
                connection.mediaConstraints.video.mandatory.minHeight = height;
            },
            max: function(width, height) {
                if (!connection.mediaConstraints.video) return;

                if (!connection.mediaConstraints.video.mandatory) {
                    connection.mediaConstraints.video.mandatory = {};
                }

                connection.mediaConstraints.video.mandatory.maxWidth = width;
                connection.mediaConstraints.video.mandatory.maxHeight = height;
            }
        };

        connection._getStream = function(event) {
            var resultingObject = merge({
                sockets: event.socket ? [event.socket] : []
            }, event);

            resultingObject.stop = function() {
                var self = this;

                self.sockets.forEach(function(socket) {
                    if (self.type == 'local') {
                        socket.send({
                            streamid: self.streamid,
                            stopped: true
                        });
                    }

                    if (self.type == 'remote') {
                        socket.send({
                            promptStreamStop: true,
                            streamid: self.streamid
                        });
                    }
                });

                if (self.type == 'remote') return;

                var stream = self.stream;
                if (stream) self.rtcMultiConnection.stopMediaStream(stream);
            };

            resultingObject.mute = function(session) {
                this.muted = true;
                this._private(session, true);
            };

            resultingObject.unmute = function(session) {
                this.muted = false;
                this._private(session, false);
            };

            function muteOrUnmuteLocally(session, isPause, mediaElement) {
                if (!mediaElement) return;
                var lastPauseState = mediaElement.onpause;
                var lastPlayState = mediaElement.onplay;
                mediaElement.onpause = mediaElement.onplay = function() {};

                if (isPause) mediaElement.pause();
                else mediaElement.play();

                mediaElement.onpause = lastPauseState;
                mediaElement.onplay = lastPlayState;
            }

            resultingObject._private = function(session, enabled) {
                if (session && !isNull(session.sync) && session.sync == false) {
                    muteOrUnmuteLocally(session, enabled, this.mediaElement);
                    return;
                }

                muteOrUnmute({
                    root: this,
                    session: session,
                    enabled: enabled,
                    stream: this.stream
                });
            };

            resultingObject.startRecording = function(session) {
                var self = this;

                if (!session) {
                    session = {
                        audio: true,
                        video: true
                    };
                }

                if (isString(session)) {
                    session = {
                        audio: session == 'audio',
                        video: session == 'video'
                    };
                }

                if (!window.RecordRTC) {
                    return loadScript(self.rtcMultiConnection.resources.RecordRTC, function() {
                        self.startRecording(session);
                    });
                }

                log('started recording session', session);

                self.videoRecorder = self.audioRecorder = null;

                if (isFirefox) {
                    // firefox supports both audio/video recording in single webm file
                    if (self.stream.getAudioTracks().length && self.stream.getVideoTracks().length) {
                        self.videoRecorder = RecordRTC(self.stream, {
                            type: 'video'
                        });
                    } else if (session.video) {
                        self.videoRecorder = RecordRTC(self.stream, {
                            type: 'video'
                        });
                    } else if (session.audio) {
                        self.audioRecorder = RecordRTC(self.stream, {
                            type: 'audio'
                        });
                    }
                } else if (isChrome) {
                    // chrome >= 48 supports MediaRecorder API
                    // MediaRecorder API can record remote audio+video streams as well!

                    if (isMediaRecorderCompatible() && connection.DetectRTC.browser.version >= 50 && self.stream.getAudioTracks().length && self.stream.getVideoTracks().length) {
                        self.videoRecorder = RecordRTC(self.stream, {
                            type: 'video'
                        });
                    } else if (isMediaRecorderCompatible() && connection.DetectRTC.browser.version >= 50) {
                        if (session.video) {
                            self.videoRecorder = RecordRTC(self.stream, {
                                type: 'video'
                            });
                        } else if (session.audio) {
                            self.audioRecorder = RecordRTC(self.stream, {
                                type: 'audio'
                            });
                        }
                    } else {
                        // chrome supports recording in two separate files: WAV and WebM
                        if (session.video) {
                            self.videoRecorder = RecordRTC(self.stream, {
                                type: 'video'
                            });
                        }

                        if (session.audio) {
                            self.audioRecorder = RecordRTC(self.stream, {
                                type: 'audio'
                            });
                        }
                    }
                }

                if (self.audioRecorder) {
                    self.audioRecorder.startRecording();
                }

                if (self.videoRecorder) self.videoRecorder.startRecording();
            };

            resultingObject.stopRecording = function(callback, session) {
                if (!session) {
                    session = {
                        audio: true,
                        video: true
                    };
                }

                if (isString(session)) {
                    session = {
                        audio: session == 'audio',
                        video: session == 'video'
                    };
                }

                log('stopped recording session', session);

                var self = this;

                if (session.audio && self.audioRecorder) {
                    self.audioRecorder.stopRecording(function() {
                        if (session.video && self.videoRecorder) {
                            self.videoRecorder.stopRecording(function() {
                                callback({
                                    audio: self.audioRecorder.getBlob(),
                                    video: self.videoRecorder.getBlob()
                                });
                            });
                        } else callback({
                            audio: self.audioRecorder.getBlob()
                        });
                    });
                } else if (session.video && self.videoRecorder) {
                    self.videoRecorder.stopRecording(function() {
                        callback({
                            video: self.videoRecorder.getBlob()
                        });
                    });
                }
            };

            resultingObject.takeSnapshot = function(callback) {
                takeSnapshot({
                    mediaElement: this.mediaElement,
                    userid: this.userid,
                    connection: connection,
                    callback: callback
                });
            };

            // redundant: kept only for backward compatibility
            resultingObject.streamObject = resultingObject;

            return resultingObject;
        };

        // new RTCMultiConnection().set({properties}).connect()
        connection.set = function(properties) {
            for (var property in properties) {
                this[property] = properties[property];
            }
            return this;
        };

        // www.RTCMultiConnection.org/docs/onMediaError/
        connection.onMediaError = function(event) {
            error('name', event.name);
            error('constraintName', toStr(event.constraintName));
            error('message', event.message);
            error('original session', event.session);
        };

        // www.RTCMultiConnection.org/docs/takeSnapshot/
        connection.takeSnapshot = function(userid, callback) {
            takeSnapshot({
                userid: userid,
                connection: connection,
                callback: callback
            });
        };

        connection.saveToDisk = function(blob, fileName) {
            if (blob.size && blob.type) FileSaver.SaveToDisk(URL.createObjectURL(blob), fileName || blob.name || blob.type.replace('/', '-') + blob.type.split('/')[1]);
            else FileSaver.SaveToDisk(blob, fileName);
        };

        // www.RTCMultiConnection.org/docs/selectDevices/
        connection.selectDevices = function(device1, device2) {
            if (device1) select(this.devices[device1]);
            if (device2) select(this.devices[device2]);

            function select(device) {
                if (!device) return;
                connection._mediaSources[device.kind] = device.id;
            }
        };

        // www.RTCMultiConnection.org/docs/getDevices/
        connection.getDevices = function(callback) {
            // if, not yet fetched.
            if (!DetectRTC.MediaDevices.length) {
                return setTimeout(function() {
                    connection.getDevices(callback);
                }, 1000);
            }

            // loop over all audio/video input/output devices
            DetectRTC.MediaDevices.forEach(function(device) {
                connection.devices[device.deviceId] = device;
            });

            if (callback) callback(connection.devices);
        };

        connection.getMediaDevices = connection.enumerateDevices = function(callback) {
            if (!callback) throw 'callback is mandatory.';
            connection.getDevices(function() {
                callback(connection.DetectRTC.MediaDevices);
            });
        };

        // www.RTCMultiConnection.org/docs/onCustomMessage/
        connection.onCustomMessage = function(message) {
            log('Custom message', message);
        };

        // www.RTCMultiConnection.org/docs/ondrop/
        connection.ondrop = function(droppedBy) {
            log('Media connection is dropped by ' + droppedBy);
        };

        // www.RTCMultiConnection.org/docs/drop/
        connection.drop = function(config) {
            config = config || {};
            connection.attachStreams = [];

            // "drop" should detach all local streams
            for (var stream in connection.streams) {
                if (connection._skip.indexOf(stream) == -1) {
                    stream = connection.streams[stream];
                    if (stream.type == 'local') {
                        connection.detachStreams.push(stream.streamid);
                        onStreamEndedHandler(stream, connection);
                    } else onStreamEndedHandler(stream, connection);
                }
            }

            // www.RTCMultiConnection.org/docs/sendCustomMessage/
            connection.sendCustomMessage({
                drop: true,
                dontRenegotiate: isNull(config.renegotiate) ? true : config.renegotiate
            });
        };

        // www.RTCMultiConnection.org/docs/Translator/
        connection.Translator = {
            TranslateText: function(text, callback) {
                // if(location.protocol === 'https:') return callback(text);

                var newScript = document.createElement('script');
                newScript.type = 'text/javascript';

                var sourceText = encodeURIComponent(text); // escape

                var randomNumber = 'method' + connection.token();
                window[randomNumber] = function(response) {
                    if (response.data && response.data.translations[0] && callback) {
                        callback(response.data.translations[0].translatedText);
                    }

                    if (response.error && response.error.message == 'Daily Limit Exceeded') {
                        warn('Text translation failed. Error message: "Daily Limit Exceeded."');

                        // returning original text
                        callback(text);
                    }
                };

                var source = 'https://www.googleapis.com/language/translate/v2?key=' + connection.googKey + '&target=' + (connection.language || 'en-US') + '&callback=window.' + randomNumber + '&q=' + sourceText;
                newScript.src = source;
                document.getElementsByTagName('head')[0].appendChild(newScript);
            }
        };

        // you can easily override it by setting it NULL!
        connection.setDefaultEventsForMediaElement = function(mediaElement, streamid) {
            mediaElement.onpause = function() {
                if (connection.streams[streamid] && !connection.streams[streamid].muted) {
                    connection.streams[streamid].mute();
                }
            };

            // todo: need to make sure that "onplay" EVENT doesn't play self-voice!
            mediaElement.onplay = function() {
                if (connection.streams[streamid] && connection.streams[streamid].muted) {
                    connection.streams[streamid].unmute();
                }
            };

            var volumeChangeEventFired = false;
            mediaElement.onvolumechange = function() {
                if (!volumeChangeEventFired) {
                    volumeChangeEventFired = true;
                    connection.streams[streamid] && setTimeout(function() {
                        var root = connection.streams[streamid];
                        connection.streams[streamid].sockets.forEach(function(socket) {
                            socket.send({
                                streamid: root.streamid,
                                isVolumeChanged: true,
                                volume: mediaElement.volume
                            });
                        });
                        volumeChangeEventFired = false;
                    }, 2000);
                }
            };
        };

        // www.RTCMultiConnection.org/docs/onMediaFile/
        connection.onMediaFile = function(e) {
            log('onMediaFile', e);
            connection.body.appendChild(e.mediaElement);
        };

        // www.RTCMultiConnection.org/docs/shareMediaFile/
        // this method handles pre-recorded media streaming
        connection.shareMediaFile = function(file, video, streamerid) {
            streamerid = streamerid || connection.token();

            if (!PreRecordedMediaStreamer) {
                loadScript(connection.resources.PreRecordedMediaStreamer, function() {
                    connection.shareMediaFile(file, video, streamerid);
                });
                return streamerid;
            }

            return PreRecordedMediaStreamer.shareMediaFile({
                file: file,
                video: video,
                streamerid: streamerid,
                connection: connection
            });
        };

        // www.RTCMultiConnection.org/docs/onpartofscreen/
        connection.onpartofscreen = function(e) {
            var image = document.createElement('img');
            image.src = e.screenshot;
            connection.body.appendChild(image);
        };

        connection.skipLogs = function() {
            log = error = warn = function() {};
        };

        // www.RTCMultiConnection.org/docs/hold/
        connection.hold = function(mLine) {
            for (var peer in connection.peers) {
                connection.peers[peer].hold(mLine);
            }
        };

        // www.RTCMultiConnection.org/docs/onhold/
        connection.onhold = function(track) {
            log('onhold', track);

            if (track.kind != 'audio') {
                track.mediaElement.pause();
                track.mediaElement.setAttribute('poster', track.screenshot || connection.resources.muted);
            }
            if (track.kind == 'audio') {
                track.mediaElement.muted = true;
            }
        };

        // www.RTCMultiConnection.org/docs/unhold/
        connection.unhold = function(mLine) {
            for (var peer in connection.peers) {
                connection.peers[peer].unhold(mLine);
            }
        };

        // www.RTCMultiConnection.org/docs/onunhold/
        connection.onunhold = function(track) {
            log('onunhold', track);

            if (track.kind != 'audio') {
                track.mediaElement.play();
                track.mediaElement.removeAttribute('poster');
            }
            if (track.kind != 'audio') {
                track.mediaElement.muted = false;
            }
        };

        connection.sharePartOfScreen = function(args) {
            var lastScreenshot = '';

            function partOfScreenCapturer() {
                // if stopped
                if (connection.partOfScreen && !connection.partOfScreen.sharing) {
                    return;
                }

                capturePartOfScreen({
                    element: args.element,
                    connection: connection,
                    callback: function(screenshot) {
                        // don't share repeated content
                        if (screenshot != lastScreenshot) {
                            lastScreenshot = screenshot;

                            for (var channel in connection.channels) {
                                connection.channels[channel].send({
                                    screenshot: screenshot,
                                    isPartOfScreen: true
                                });
                            }
                        }

                        // "once" can be used to share single screenshot
                        !args.once && setTimeout(partOfScreenCapturer, args.interval || 200);
                    }
                });
            }

            partOfScreenCapturer();

            connection.partOfScreen = merge({
                sharing: true
            }, args);
        };

        connection.pausePartOfScreenSharing = function() {
            for (var peer in connection.peers) {
                connection.peers[peer].pausePartOfScreenSharing = true;
            }

            if (connection.partOfScreen) {
                connection.partOfScreen.sharing = false;
            }
        };

        connection.resumePartOfScreenSharing = function() {
            for (var peer in connection.peers) {
                connection.peers[peer].pausePartOfScreenSharing = false;
            }

            if (connection.partOfScreen) {
                connection.partOfScreen.sharing = true;
            }
        };

        connection.stopPartOfScreenSharing = function() {
            for (var peer in connection.peers) {
                connection.peers[peer].stopPartOfScreenSharing = true;
            }

            if (connection.partOfScreen) {
                connection.partOfScreen.sharing = false;
            }
        };

        connection.takeScreenshot = function(element, callback) {
            if (!element || !callback) throw 'Invalid number of arguments.';

            if (!window.html2canvas) {
                return loadScript(connection.resources.html2canvas, function() {
                    connection.takeScreenshot(element);
                });
            }

            if (isString(element)) {
                element = document.querySelector(element);
                if (!element) element = document.getElementById(element);
            }
            if (!element) throw 'HTML Element is inaccessible!';

            // html2canvas.js is used to take screenshots
            html2canvas(element, {
                onrendered: function(canvas) {
                    callback(canvas.toDataURL());
                }
            });
        };

        // this event is fired when RTCMultiConnection detects that chrome extension
        // for screen capturing is installed and available
        connection.onScreenCapturingExtensionAvailable = function() {
            log('It seems that screen capturing extension is installed and available on your system!');
        };

        if (!isPluginRTC && DetectRTC.screen.onScreenCapturingExtensionAvailable) {
            DetectRTC.screen.onScreenCapturingExtensionAvailable = function() {
                connection.onScreenCapturingExtensionAvailable();
            };
        }

        connection.changeBandwidth = function(bandwidth) {
            for (var peer in connection.peers) {
                connection.peers[peer].changeBandwidth(bandwidth);
            }
        };

        connection.convertToAudioStream = function(mediaStream) {
            convertToAudioStream(mediaStream);
        };

        connection.onstatechange = function(state) {
            log('on:state:change (' + state.userid + '):', state.name + ':', state.reason || '');
        };

        connection.onfailed = function(event) {
            if (!event.peer.numOfRetries) event.peer.numOfRetries = 0;
            event.peer.numOfRetries++;

            error('ICE connectivity check is failed. Renegotiating peer connection.');
            event.peer.numOfRetries < 2 && event.peer.renegotiate();

            if (event.peer.numOfRetries >= 2) event.peer.numOfRetries = 0;
        };

        connection.onconnected = function(event) {
            // event.peer.addStream || event.peer.getConnectionStats
            log('Peer connection has been established between you and', event.userid);
        };

        connection.ondisconnected = function(event) {
            error('Peer connection seems has been disconnected between you and', event.userid);

            if (isEmpty(connection.channels)) return;
            if (!connection.channels[event.userid]) return;

            // use WebRTC data channels to detect user's presence
            connection.channels[event.userid].send({
                checkingPresence: true
            });

            // wait 5 seconds, if target peer didn't response, simply disconnect
            setTimeout(function() {
                // iceConnectionState == 'disconnected' occurred out of low-bandwidth
                // or internet connectivity issues
                if (connection.peers[event.userid].connected) {
                    delete connection.peers[event.userid].connected;
                    return;
                }

                // to make sure this user's all remote streams are removed.
                connection.streams.remove({
                    remote: true,
                    userid: event.userid
                });

                connection.remove(event.userid);
            }, 3000);
        };

        connection.onstreamid = function(event) {
            // event.isScreen || event.isVideo || event.isAudio
            log('got remote streamid', event.streamid, 'from', event.userid);
        };

        connection.stopMediaStream = function(mediaStream) {
            if (!mediaStream) throw 'MediaStream argument is mandatory.';

            if (connection.keepStreamsOpened) {
                if (mediaStream.onended) mediaStream.onended();
                return;
            }

            // remove stream from "localStreams" object
            // when native-stop method invoked.
            if (connection.localStreams[mediaStream.streamid]) {
                delete connection.localStreams[mediaStream.streamid];
            }

            if (isFirefox) {
                // Firefox don't yet support onended for any stream (remote/local)
                if (mediaStream.onended) mediaStream.onended();
            }

            // Latest firefox does support mediaStream.getAudioTrack but doesn't support stop on MediaStreamTrack
            var checkForMediaStreamTrackStop = Boolean(
                (mediaStream.getAudioTracks || mediaStream.getVideoTracks) && (
                    (mediaStream.getAudioTracks()[0] && !mediaStream.getAudioTracks()[0].stop) ||
                    (mediaStream.getVideoTracks()[0] && !mediaStream.getVideoTracks()[0].stop)
                )
            );

            if (!mediaStream.getAudioTracks || checkForMediaStreamTrackStop) {
                if (mediaStream.stop) {
                    mediaStream.stop();
                }
                return;
            }

            if (mediaStream.getAudioTracks().length && mediaStream.getAudioTracks()[0].stop) {
                mediaStream.getAudioTracks().forEach(function(track) {
                    track.stop();
                });
            }

            if (mediaStream.getVideoTracks().length && mediaStream.getVideoTracks()[0].stop) {
                mediaStream.getVideoTracks().forEach(function(track) {
                    track.stop();
                });
            }
        };

        connection.changeBandwidth = function(bandwidth) {
            if (!bandwidth || isString(bandwidth) || isEmpty(bandwidth)) {
                throw 'Invalid "bandwidth" arguments.';
            }

            forEach(connection.peers, function(peer) {
                peer.peer.bandwidth = bandwidth;
            });

            connection.renegotiate();
        };

        // www.RTCMultiConnection.org/docs/openSignalingChannel/
        // http://goo.gl/uvoIcZ
        connection.openSignalingChannel = function(config) {
            // make sure firebase.js is loaded
            if (!window.Firebase) {
                return loadScript(connection.resources.firebase, function() {
                    connection.openSignalingChannel(config);
                });
            }

            var channel = config.channel || connection.channel;

            if (connection.firebase) {
                // for custom firebase instances
                connection.resources.firebaseio = connection.resources.firebaseio.replace('//chat.', '//' + connection.firebase + '.');
            }

            var firebase = new Firebase(connection.resources.firebaseio + channel);
            firebase.channel = channel;
            firebase.on('child_added', function(data) {
                config.onmessage(data.val());
            });

            firebase.send = function(data) {
                // a quick dirty workaround to make sure firebase
                // shouldn't fail for NULL values.
                for (var prop in data) {
                    if (isNull(data[prop]) || typeof data[prop] == 'function') {
                        data[prop] = false;
                    }
                }

                this.push(data);
            };

            if (!connection.socket)
                connection.socket = firebase;

            firebase.onDisconnect().remove();

            setTimeout(function() {
                config.callback(firebase);
            }, 1);
        };

        connection.Plugin = Plugin;
    }

})();

/*
// Quick-Demo for newbies: http://jsfiddle.net/c46de0L8/
// Another simple demo: http://jsfiddle.net/zar6fg60/

*/
var CanvasDesigner = (function() {
    var iframe;
    var tools = {
        line: true,
        pencil: true,
        dragSingle: true,
        dragMultiple: true,
        eraser: true,
        rectangle: true,
        arc: true,
        bezier: true,
        quadratic: true,
        text: true
    };

    var selectedIcon = 'pencil';

    function syncData(data) {
        if (!iframe) return;

        iframe.contentWindow.postMessage({
            canvasDesignerSyncData: data
        }, '*');
    }

    var syncDataListener = function(data) {};
    
    function onMessage() {
        if (!event.data || !event.data.canvasDesignerSyncData) return;
        syncDataListener(event.data.canvasDesignerSyncData);
    }

    /*window.addEventListener('message', onMessage, false);*/

    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

    // Listen to message from child window
    eventer(messageEvent,function(e) {
        console.log('parent received message!:  ',e.data);
        if (!e.data || !e.data.canvasDesignerSyncData) return;
        syncDataListener(e.data.canvasDesignerSyncData);
    },false);


    return {
        appendTo: function(parentNode) {
            iframe = document.createElement('iframe');
            iframe.id="drawboard";
            iframe.src = 'widget.html?tools=' + JSON.stringify(tools) + '&selectedIcon=' + selectedIcon;
            iframe.style.width ="100%";
            iframe.style.height="100%";
            iframe.style.border = 0;
            parentNode.appendChild(iframe);
        },
        destroy: function() {
            if(iframe) {
                iframe.parentNode.removeChild(iframe);
            }
            window.removeEventListener('message', onMessage);
        },
        addSyncListener: function(callback) {
            syncDataListener = callback;
        },
        syncData: syncData,
        setTools: function(_tools) {
            tools = _tools;
        },
        setSelected: function(icon) {
            if (typeof tools[icon] !== 'undefined') {
                selectedIcon = icon;
            }
        }
    };
})();

'use strict';

// Last time updated: 2016-05-11 3:47:57 AM UTC

// Open-Sourced: https://github.com/muaz-khan/RecordRTC

//--------------------------------------------------
// Muaz Khan     - www.MuazKhan.com
// MIT License   - www.WebRTC-Experiment.com/licence
//--------------------------------------------------

// ____________
// RecordRTC.js

/**
 * {@link https://github.com/muaz-khan/RecordRTC|RecordRTC} is a JavaScript-based media-recording library for modern web-browsers (supporting WebRTC getUserMedia API). It is optimized for different devices and browsers to bring all client-side (pluginfree) recording solutions in single place.
 * @summary JavaScript audio/video recording library runs top over WebRTC getUserMedia API.
 * @license {@link https://github.com/muaz-khan/RecordRTC#license|MIT}
 * @author {@link http://www.MuazKhan.com|Muaz Khan}
 * @typedef RecordRTC
 * @class
 * @example
 * var recordRTC = RecordRTC(mediaStream, {
 *     type: 'video' // audio or video or gif or canvas
 * });
 *
 * // or, you can even use keyword "new"
 * var recordRTC = new RecordRTC(mediaStream[, config]);
 * @see For further information:
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 * @param {MediaStream} mediaStream - MediaStream object fetched using getUserMedia API or generated using captureStreamUntilEnded or WebAudio API.
 * @param {object} config - {type:"video", disableLogs: true, numberOfAudioChannels: 1, bufferSize: 0, sampleRate: 0, video: HTMLVideoElement, etc.}
 */

function RecordRTC(mediaStream, config) {
    if (!mediaStream) {
        throw 'MediaStream is mandatory.';
    }

    config = config || {
        type: 'video'
    };

    config = new RecordRTCConfiguration(mediaStream, config);

    // a reference to user's recordRTC object
    var self = this;

    function startRecording() {
        if (!config.disableLogs) {
            console.debug('started recording ' + config.type + ' stream.');
        }

        if (mediaRecorder) {
            mediaRecorder.clearRecordedData();
            mediaRecorder.resume();

            if (self.recordingDuration) {
                handleRecordingDuration();
            }
            return self;
        }

        initRecorder(function() {
            if (self.recordingDuration) {
                handleRecordingDuration();
            }
        });

        return self;
    }

    function initRecorder(initCallback) {
        if (initCallback) {
            config.initCallback = function() {
                initCallback();
                initCallback = config.initCallback = null; // recordRTC.initRecorder should be call-backed once.
            };
        }

        var Recorder = new GetRecorderType(mediaStream, config);

        mediaRecorder = new Recorder(mediaStream, config);
        mediaRecorder.record();

        if (!config.disableLogs) {
            console.debug('Initialized recorderType:', mediaRecorder.constructor.name, 'for output-type:', config.type);
        }
    }

    function stopRecording(callback) {
        if (!mediaRecorder) {
            return console.warn(WARNING);
        }

        /*jshint validthis:true */
        var recordRTC = this;

        if (!config.disableLogs) {
            console.warn('Stopped recording ' + config.type + ' stream.');
        }

        if (config.type !== 'gif') {
            mediaRecorder.stop(_callback);
        } else {
            mediaRecorder.stop();
            _callback();
        }

        function _callback() {
            for (var item in mediaRecorder) {
                if (self) {
                    self[item] = mediaRecorder[item];
                }

                if (recordRTC) {
                    recordRTC[item] = mediaRecorder[item];
                }
            }

            var blob = mediaRecorder.blob;
            if (callback) {
                var url = URL.createObjectURL(blob);
                callback(url);
            }

            if (blob && !config.disableLogs) {
                console.debug(blob.type, '->', bytesToSize(blob.size));
            }

            if (!config.autoWriteToDisk) {
                return;
            }

            getDataURL(function(dataURL) {
                var parameter = {};
                parameter[config.type + 'Blob'] = dataURL;
                DiskStorage.Store(parameter);
            });
        }
    }

    function pauseRecording() {
        if (!mediaRecorder) {
            return console.warn(WARNING);
        }

        mediaRecorder.pause();

        if (!config.disableLogs) {
            console.debug('Paused recording.');
        }
    }

    function resumeRecording() {
        if (!mediaRecorder) {
            return console.warn(WARNING);
        }

        // not all libs yet having  this method
        mediaRecorder.resume();

        if (!config.disableLogs) {
            console.debug('Resumed recording.');
        }
    }

    function readFile(_blob) {
        postMessage(new FileReaderSync().readAsDataURL(_blob));
    }

    function getDataURL(callback, _mediaRecorder) {
        if (!callback) {
            throw 'Pass a callback function over getDataURL.';
        }

        var blob = _mediaRecorder ? _mediaRecorder.blob : (mediaRecorder || {}).blob;

        if (!blob) {
            if (!config.disableLogs) {
                console.warn('Blob encoder did not yet finished its job.');
            }

            setTimeout(function() {
                getDataURL(callback, _mediaRecorder);
            }, 1000);
            return;
        }

        if (typeof Worker !== 'undefined' && !navigator.mozGetUserMedia) {
            var webWorker = processInWebWorker(readFile);

            webWorker.onmessage = function(event) {
                callback(event.data);
            };

            webWorker.postMessage(blob);
        } else {
            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = function(event) {
                callback(event.target.result);
            };
        }

        function processInWebWorker(_function) {
            var blob = URL.createObjectURL(new Blob([_function.toString(),
                'this.onmessage =  function (e) {' + _function.name + '(e.data);}'
            ], {
                type: 'application/javascript'
            }));

            var worker = new Worker(blob);
            URL.revokeObjectURL(blob);
            return worker;
        }
    }

    function handleRecordingDuration() {
        setTimeout(function() {
            stopRecording(self.onRecordingStopped);
        }, self.recordingDuration);
    }

    var WARNING = 'It seems that "startRecording" is not invoked for ' + config.type + ' recorder.';

    var mediaRecorder;

    var returnObject = {
        /**
         * This method starts recording. It doesn't take any argument.
         * @method
         * @memberof RecordRTC
         * @instance
         * @example
         * recordRTC.startRecording();
         */
        startRecording: startRecording,

        /**
         * This method stops recording. It takes single "callback" argument. It is suggested to get blob or URI in the callback to make sure all encoders finished their jobs.
         * @param {function} callback - This callback function is invoked after completion of all encoding jobs.
         * @method
         * @memberof RecordRTC
         * @instance
         * @example
         * recordRTC.stopRecording(function(videoURL) {
         *     video.src = videoURL;
         *     recordRTC.blob; recordRTC.buffer;
         * });
         */
        stopRecording: stopRecording,

        /**
         * This method pauses the recording process.
         * @method
         * @memberof RecordRTC
         * @instance
         * @example
         * recordRTC.pauseRecording();
         */
        pauseRecording: pauseRecording,

        /**
         * This method resumes the recording process.
         * @method
         * @memberof RecordRTC
         * @instance
         * @example
         * recordRTC.resumeRecording();
         */
        resumeRecording: resumeRecording,

        /**
         * This method initializes the recording process.
         * @method
         * @memberof RecordRTC
         * @instance
         * @example
         * recordRTC.initRecorder();
         */
        initRecorder: initRecorder,

        /**
         * This method initializes the recording process.
         * @method
         * @memberof RecordRTC
         * @instance
         * @example
         * recordRTC.initRecorder();
         */
        setRecordingDuration: function(milliseconds, callback) {
            if (typeof milliseconds === 'undefined') {
                throw 'milliseconds is required.';
            }

            if (typeof milliseconds !== 'number') {
                throw 'milliseconds must be a number.';
            }

            self.recordingDuration = milliseconds;
            self.onRecordingStopped = callback || function() {};

            return {
                onRecordingStopped: function(callback) {
                    self.onRecordingStopped = callback;
                }
            };
        },

        /**
         * This method can be used to clear/reset all the recorded data.
         * @method
         * @memberof RecordRTC
         * @instance
         * @example
         * recordRTC.clearRecordedData();
         */
        clearRecordedData: function() {
            if (!mediaRecorder) {
                return console.warn(WARNING);
            }

            mediaRecorder.clearRecordedData();

            if (!config.disableLogs) {
                console.debug('Cleared old recorded data.');
            }
        },

        /**
         * It is equivalent to <code class="str">"recordRTC.blob"</code> property.
         * @method
         * @memberof RecordRTC
         * @instance
         * @example
         * recordRTC.stopRecording(function() {
         *     var blob = recordRTC.getBlob();
         *
         *     // equivalent to: recordRTC.blob property
         *     var blob = recordRTC.blob;
         * });
         */
        getBlob: function() {
            if (!mediaRecorder) {
                return console.warn(WARNING);
            }

            return mediaRecorder.blob;
        },

        /**
         * This method returns DataURL. It takes single "callback" argument.
         * @param {function} callback - DataURL is passed back over this callback.
         * @method
         * @memberof RecordRTC
         * @instance
         * @example
         * recordRTC.stopRecording(function() {
         *     recordRTC.getDataURL(function(dataURL) {
         *         video.src = dataURL;
         *     });
         * });
         */
        getDataURL: getDataURL,

        /**
         * This method returns Virutal/Blob URL. It doesn't take any argument.
         * @method
         * @memberof RecordRTC
         * @instance
         * @example
         * recordRTC.stopRecording(function() {
         *     video.src = recordRTC.toURL();
         * });
         */
        toURL: function() {
            if (!mediaRecorder) {
                return console.warn(WARNING);
            }

            return URL.createObjectURL(mediaRecorder.blob);
        },

        /**
         * This method saves blob/file into disk (by inovking save-as dialog). It takes single (optional) argument i.e. FileName
         * @method
         * @memberof RecordRTC
         * @instance
         * @example
         * recordRTC.stopRecording(function() {
         *     recordRTC.save('file-name');
         * });
         */
        save: function(fileName) {
            if (!mediaRecorder) {
                return console.warn(WARNING);
            }

            invokeSaveAsDialog(mediaRecorder.blob, fileName);
        },

        /**
         * This method gets blob from indexed-DB storage. It takes single "callback" argument.
         * @method
         * @memberof RecordRTC
         * @instance
         * @example
         * recordRTC.getFromDisk(function(dataURL) {
         *     video.src = dataURL;
         * });
         */
        getFromDisk: function(callback) {
            if (!mediaRecorder) {
                return console.warn(WARNING);
            }

            RecordRTC.getFromDisk(config.type, callback);
        },

        /**
         * This method appends prepends array of webp images to the recorded video-blob. It takes an "array" object.
         * @type {Array.<Array>}
         * @param {Array} arrayOfWebPImages - Array of webp images.
         * @method
         * @memberof RecordRTC
         * @instance
         * @example
         * var arrayOfWebPImages = [];
         * arrayOfWebPImages.push({
         *     duration: index,
         *     image: 'data:image/webp;base64,...'
         * });
         * recordRTC.setAdvertisementArray(arrayOfWebPImages);
         */
        setAdvertisementArray: function(arrayOfWebPImages) {
            config.advertisement = [];

            var length = arrayOfWebPImages.length;
            for (var i = 0; i < length; i++) {
                config.advertisement.push({
                    duration: i,
                    image: arrayOfWebPImages[i]
                });
            }
        },

        /**
         * It is equivalent to <code class="str">"recordRTC.getBlob()"</code> method.
         * @property {Blob} blob - Recorded Blob can be accessed using this property.
         * @memberof RecordRTC
         * @instance
         * @example
         * recordRTC.stopRecording(function() {
         *     var blob = recordRTC.blob;
         *
         *     // equivalent to: recordRTC.getBlob() method
         *     var blob = recordRTC.getBlob();
         * });
         */
        blob: null,

        /**
         * @todo Add descriptions.
         * @property {number} bufferSize - Either audio device's default buffer-size, or your custom value.
         * @memberof RecordRTC
         * @instance
         * @example
         * recordRTC.stopRecording(function() {
         *     var bufferSize = recordRTC.bufferSize;
         * });
         */
        bufferSize: 0,

        /**
         * @todo Add descriptions.
         * @property {number} sampleRate - Audio device's default sample rates.
         * @memberof RecordRTC
         * @instance
         * @example
         * recordRTC.stopRecording(function() {
         *     var sampleRate = recordRTC.sampleRate;
         * });
         */
        sampleRate: 0,

        /**
         * @todo Add descriptions.
         * @property {ArrayBuffer} buffer - Audio ArrayBuffer, supported only in Chrome.
         * @memberof RecordRTC
         * @instance
         * @example
         * recordRTC.stopRecording(function() {
         *     var buffer = recordRTC.buffer;
         * });
         */
        buffer: null,

        /**
         * @todo Add descriptions.
         * @property {DataView} view - Audio DataView, supported only in Chrome.
         * @memberof RecordRTC
         * @instance
         * @example
         * recordRTC.stopRecording(function() {
         *     var dataView = recordRTC.view;
         * });
         */
        view: null
    };

    if (!this) {
        self = returnObject;
        return returnObject;
    }

    // if someone wanna use RecordRTC with "new" keyword.
    for (var prop in returnObject) {
        this[prop] = returnObject[prop];
    }

    self = this;

    return returnObject;
}

/**
 * This method can be used to get all recorded blobs from IndexedDB storage.
 * @param {string} type - 'all' or 'audio' or 'video' or 'gif'
 * @param {function} callback - Callback function to get all stored blobs.
 * @method
 * @memberof RecordRTC
 * @example
 * RecordRTC.getFromDisk('all', function(dataURL, type){
 *     if(type === 'audio') { }
 *     if(type === 'video') { }
 *     if(type === 'gif')   { }
 * });
 */
RecordRTC.getFromDisk = function(type, callback) {
    if (!callback) {
        throw 'callback is mandatory.';
    }

    console.log('Getting recorded ' + (type === 'all' ? 'blobs' : type + ' blob ') + ' from disk!');
    DiskStorage.Fetch(function(dataURL, _type) {
        if (type !== 'all' && _type === type + 'Blob' && callback) {
            callback(dataURL);
        }

        if (type === 'all' && callback) {
            callback(dataURL, _type.replace('Blob', ''));
        }
    });
};

/**
 * This method can be used to store recorded blobs into IndexedDB storage.
 * @param {object} options - {audio: Blob, video: Blob, gif: Blob}
 * @method
 * @memberof RecordRTC
 * @example
 * RecordRTC.writeToDisk({
 *     audio: audioBlob,
 *     video: videoBlob,
 *     gif  : gifBlob
 * });
 */
RecordRTC.writeToDisk = function(options) {
    console.log('Writing recorded blob(s) to disk!');
    options = options || {};
    if (options.audio && options.video && options.gif) {
        options.audio.getDataURL(function(audioDataURL) {
            options.video.getDataURL(function(videoDataURL) {
                options.gif.getDataURL(function(gifDataURL) {
                    DiskStorage.Store({
                        audioBlob: audioDataURL,
                        videoBlob: videoDataURL,
                        gifBlob: gifDataURL
                    });
                });
            });
        });
    } else if (options.audio && options.video) {
        options.audio.getDataURL(function(audioDataURL) {
            options.video.getDataURL(function(videoDataURL) {
                DiskStorage.Store({
                    audioBlob: audioDataURL,
                    videoBlob: videoDataURL
                });
            });
        });
    } else if (options.audio && options.gif) {
        options.audio.getDataURL(function(audioDataURL) {
            options.gif.getDataURL(function(gifDataURL) {
                DiskStorage.Store({
                    audioBlob: audioDataURL,
                    gifBlob: gifDataURL
                });
            });
        });
    } else if (options.video && options.gif) {
        options.video.getDataURL(function(videoDataURL) {
            options.gif.getDataURL(function(gifDataURL) {
                DiskStorage.Store({
                    videoBlob: videoDataURL,
                    gifBlob: gifDataURL
                });
            });
        });
    } else if (options.audio) {
        options.audio.getDataURL(function(audioDataURL) {
            DiskStorage.Store({
                audioBlob: audioDataURL
            });
        });
    } else if (options.video) {
        options.video.getDataURL(function(videoDataURL) {
            DiskStorage.Store({
                videoBlob: videoDataURL
            });
        });
    } else if (options.gif) {
        options.gif.getDataURL(function(gifDataURL) {
            DiskStorage.Store({
                gifBlob: gifDataURL
            });
        });
    }
};

if (typeof module !== 'undefined' /* && !!module.exports*/ ) {
    module.exports = RecordRTC;
}

if (typeof define === 'function' && define.amd) {
    define('RecordRTC', [], function() {
        return RecordRTC;
    });
}

// __________________________
// RecordRTC-Configuration.js

/**
 * {@link RecordRTCConfiguration} is an inner/private helper for {@link RecordRTC}.
 * @summary It configures the 2nd parameter passed over {@link RecordRTC} and returns a valid "config" object.
 * @license {@link https://github.com/muaz-khan/RecordRTC#license|MIT}
 * @author {@link http://www.MuazKhan.com|Muaz Khan}
 * @typedef RecordRTCConfiguration
 * @class
 * @example
 * var options = RecordRTCConfiguration(mediaStream, options);
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 * @param {MediaStream} mediaStream - MediaStream object fetched using getUserMedia API or generated using captureStreamUntilEnded or WebAudio API.
 * @param {object} config - {type:"video", disableLogs: true, numberOfAudioChannels: 1, bufferSize: 0, sampleRate: 0, video: HTMLVideoElement, getNativeBlob:true, etc.}
 */

function RecordRTCConfiguration(mediaStream, config) {
    if (config.recorderType && !config.type) {
        if (config.recorderType === WhammyRecorder || config.recorderType === CanvasRecorder) {
            config.type = 'video';
        } else if (config.recorderType === GifRecorder) {
            config.type = 'gif';
        } else if (config.recorderType === StereoAudioRecorder) {
            config.type = 'audio';
        } else if (config.recorderType === MediaStreamRecorder) {
            if (mediaStream.getAudioTracks().length && mediaStream.getVideoTracks().length) {
                config.type = 'video';
            } else if (mediaStream.getAudioTracks().length && !mediaStream.getVideoTracks().length) {
                config.type = 'audio';
            } else if (!mediaStream.getAudioTracks().length && mediaStream.getVideoTracks().length) {
                config.type = 'audio';
            } else {
                // config.type = 'UnKnown';
            }
        }
    }

    if (typeof MediaStreamRecorder !== 'undefined' && typeof MediaRecorder !== 'undefined' && 'requestData' in MediaRecorder.prototype) {
        if (!config.mimeType) {
            config.mimeType = 'video/webm';
        }

        if (!config.type) {
            config.type = config.mimeType.split('/')[0];
        }

        if (!config.bitsPerSecond) {
            // config.bitsPerSecond = 128000;
        }
    }

    // consider default type=audio
    if (!config.type) {
        if (config.mimeType) {
            config.type = config.mimeType.split('/')[0];
        }
        if (!config.type) {
            config.type = 'audio';
        }
    }

    return config;
}

// __________________
// GetRecorderType.js

/**
 * {@link GetRecorderType} is an inner/private helper for {@link RecordRTC}.
 * @summary It returns best recorder-type available for your browser.
 * @license {@link https://github.com/muaz-khan/RecordRTC#license|MIT}
 * @author {@link http://www.MuazKhan.com|Muaz Khan}
 * @typedef GetRecorderType
 * @class
 * @example
 * var RecorderType = GetRecorderType(options);
 * var recorder = new RecorderType(options);
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 * @param {MediaStream} mediaStream - MediaStream object fetched using getUserMedia API or generated using captureStreamUntilEnded or WebAudio API.
 * @param {object} config - {type:"video", disableLogs: true, numberOfAudioChannels: 1, bufferSize: 0, sampleRate: 0, video: HTMLVideoElement, etc.}
 */

function GetRecorderType(mediaStream, config) {
    var recorder;

    // StereoAudioRecorder can work with all three: Edge, Firefox and Chrome
    // todo: detect if it is Edge, then auto use: StereoAudioRecorder
    if (isChrome || isEdge || isOpera) {
        // Media Stream Recording API has not been implemented in chrome yet;
        // That's why using WebAudio API to record stereo audio in WAV format
        recorder = StereoAudioRecorder;
    }

    if (typeof MediaRecorder !== 'undefined' && 'requestData' in MediaRecorder.prototype && !isChrome) {
        recorder = MediaStreamRecorder;
    }

    // video recorder (in WebM format)
    if (config.type === 'video' && (isChrome || isOpera)) {
        recorder = WhammyRecorder;
    }

    // video recorder (in Gif format)
    if (config.type === 'gif') {
        recorder = GifRecorder;
    }

    // html2canvas recording!
    if (config.type === 'canvas') {
        recorder = CanvasRecorder;
    }

    if (isMediaRecorderCompatible() && recorder !== CanvasRecorder && recorder !== GifRecorder && typeof MediaRecorder !== 'undefined' && 'requestData' in MediaRecorder.prototype) {
        if (mediaStream.getVideoTracks().length) {
            recorder = MediaStreamRecorder;
        }
    }

    if (config.recorderType) {
        recorder = config.recorderType;
    }

    if (!config.disableLogs && !!recorder && !!recorder.name) {
        console.debug('Using recorderType:', recorder.name || recorder.constructor.name);
    }

    return recorder;
}

// _____________
// MRecordRTC.js

/**
 * MRecordRTC runs top over {@link RecordRTC} to bring multiple recordings in single place, by providing simple API.
 * @summary MRecordRTC stands for "Multiple-RecordRTC".
 * @license {@link https://github.com/muaz-khan/RecordRTC#license|MIT}
 * @author {@link http://www.MuazKhan.com|Muaz Khan}
 * @typedef MRecordRTC
 * @class
 * @example
 * var recorder = new MRecordRTC();
 * recorder.addStream(MediaStream);
 * recorder.mediaType = {
 *     audio: true, // or StereoAudioRecorder or MediaStreamRecorder
 *     video: true, // or WhammyRecorder or MediaStreamRecorder
 *     gif: true    // or GifRecorder
 * };
 * // mimeType is optional and should be set only in advance cases.
 * recorder.mimeType = {
 *     audio: 'audio/wav',
 *     video: 'video/webm',
 *     gif:   'image/gif'
 * };
 * recorder.startRecording();
 * @see For further information:
 * @see {@link https://github.com/muaz-khan/RecordRTC/tree/master/MRecordRTC|MRecordRTC Source Code}
 * @param {MediaStream} mediaStream - MediaStream object fetched using getUserMedia API or generated using captureStreamUntilEnded or WebAudio API.
 */

function MRecordRTC(mediaStream) {

    /**
     * This method attaches MediaStream object to {@link MRecordRTC}.
     * @param {MediaStream} mediaStream - A MediaStream object, either fetched using getUserMedia API, or generated using captureStreamUntilEnded or WebAudio API.
     * @method
     * @memberof MRecordRTC
     * @example
     * recorder.addStream(MediaStream);
     */
    this.addStream = function(_mediaStream) {
        if (_mediaStream) {
            mediaStream = _mediaStream;
        }
    };

    /**
     * This property can be used to set recording type e.g. audio, or video, or gif, or canvas.
     * @property {object} mediaType - {audio: true, video: true, gif: true}
     * @memberof MRecordRTC
     * @example
     * var recorder = new MRecordRTC();
     * recorder.mediaType = {
     *     audio: true, // TRUE or StereoAudioRecorder or MediaStreamRecorder
     *     video: true, // TRUE or WhammyRecorder or MediaStreamRecorder
     *     gif  : true  // TRUE or GifRecorder
     * };
     */
    this.mediaType = {
        audio: true,
        video: true
    };

    /**
     * This method starts recording.
     * @method
     * @memberof MRecordRTC
     * @example
     * recorder.startRecording();
     */
    this.startRecording = function() {
        var mediaType = this.mediaType;
        var recorderType;
        var mimeType = this.mimeType || {
            audio: null,
            video: null,
            gif: null
        };

        if (typeof mediaType.audio !== 'function' && isMediaRecorderCompatible() && mediaStream.getAudioTracks && !mediaStream.getAudioTracks().length) {
            // Firefox is supporting both audio/video in single blob
            mediaType.audio = false;
        }

        if (typeof mediaType.video !== 'function' && isMediaRecorderCompatible() && mediaStream.getVideoTracks && !mediaStream.getVideoTracks().length) {
            // Firefox is supporting both audio/video in single blob
            mediaType.video = false;
        }

        if (!mediaType.audio && !mediaType.video) {
            throw 'MediaStream must have either audio or video tracks.';
        }

        if (!!mediaType.audio) {
            recorderType = null;
            if (typeof mediaType.audio === 'function') {
                recorderType = mediaType.audio;
            }

            this.audioRecorder = new RecordRTC(mediaStream, {
                type: 'audio',
                bufferSize: this.bufferSize,
                sampleRate: this.sampleRate,
                numberOfAudioChannels: this.numberOfAudioChannels || 2,
                disableLogs: this.disableLogs,
                recorderType: recorderType,
                mimeType: mimeType.audio
            });

            if (!mediaType.video) {
                this.audioRecorder.startRecording();
            }
        }

        if (!!mediaType.video) {
            recorderType = null;
            if (typeof mediaType.video === 'function') {
                recorderType = mediaType.video;
            }

            var newStream = mediaStream;

            if (isMediaRecorderCompatible() && !!mediaType.audio && typeof mediaType.audio === 'function') {
                var videoTrack = mediaStream.getVideoTracks()[0];

                if (!!navigator.mozGetUserMedia) {
                    newStream = new MediaStream();
                    newStream.addTrack(videoTrack);

                    if (recorderType && recorderType === WhammyRecorder) {
                        // Firefox is NOT supporting webp-encoding yet
                        recorderType = MediaStreamRecorder;
                    }
                } else {
                    newStream = new MediaStream([videoTrack]);
                }
            }

            this.videoRecorder = new RecordRTC(newStream, {
                type: 'video',
                video: this.video,
                canvas: this.canvas,
                frameInterval: this.frameInterval || 10,
                disableLogs: this.disableLogs,
                recorderType: recorderType,
                mimeType: mimeType.video
            });

            if (!mediaType.audio) {
                this.videoRecorder.startRecording();
            }
        }

        if (!!mediaType.audio && !!mediaType.video) {
            var self = this;
            if (isMediaRecorderCompatible()) {
                self.audioRecorder = null;
                self.videoRecorder.startRecording();
            } else {
                self.videoRecorder.initRecorder(function() {
                    self.audioRecorder.initRecorder(function() {
                        // Both recorders are ready to record things accurately
                        self.videoRecorder.startRecording();
                        self.audioRecorder.startRecording();
                    });
                });
            }
        }

        if (!!mediaType.gif) {
            recorderType = null;
            if (typeof mediaType.gif === 'function') {
                recorderType = mediaType.gif;
            }
            this.gifRecorder = new RecordRTC(mediaStream, {
                type: 'gif',
                frameRate: this.frameRate || 200,
                quality: this.quality || 10,
                disableLogs: this.disableLogs,
                recorderType: recorderType,
                mimeType: mimeType.gif
            });
            this.gifRecorder.startRecording();
        }
    };

    /**
     * This method stop recording.
     * @param {function} callback - Callback function is invoked when all encoders finish their jobs.
     * @method
     * @memberof MRecordRTC
     * @example
     * recorder.stopRecording(function(recording){
     *     var audioBlob = recording.audio;
     *     var videoBlob = recording.video;
     *     var gifBlob   = recording.gif;
     * });
     */
    this.stopRecording = function(callback) {
        callback = callback || function() {};

        if (this.audioRecorder) {
            this.audioRecorder.stopRecording(function(blobURL) {
                callback(blobURL, 'audio');
            });
        }

        if (this.videoRecorder) {
            this.videoRecorder.stopRecording(function(blobURL) {
                callback(blobURL, 'video');
            });
        }

        if (this.gifRecorder) {
            this.gifRecorder.stopRecording(function(blobURL) {
                callback(blobURL, 'gif');
            });
        }
    };

    /**
     * This method can be used to manually get all recorded blobs.
     * @param {function} callback - All recorded blobs are passed back to "callback" function.
     * @method
     * @memberof MRecordRTC
     * @example
     * recorder.getBlob(function(recording){
     *     var audioBlob = recording.audio;
     *     var videoBlob = recording.video;
     *     var gifBlob   = recording.gif;
     * });
     * // or
     * var audioBlob = recorder.getBlob().audio;
     * var videoBlob = recorder.getBlob().video;
     */
    this.getBlob = function(callback) {
        var output = {};

        if (this.audioRecorder) {
            output.audio = this.audioRecorder.getBlob();
        }

        if (this.videoRecorder) {
            output.video = this.videoRecorder.getBlob();
        }

        if (this.gifRecorder) {
            output.gif = this.gifRecorder.getBlob();
        }

        if (callback) {
            callback(output);
        }

        return output;
    };

    /**
     * This method can be used to manually get all recorded blobs' DataURLs.
     * @param {function} callback - All recorded blobs' DataURLs are passed back to "callback" function.
     * @method
     * @memberof MRecordRTC
     * @example
     * recorder.getDataURL(function(recording){
     *     var audioDataURL = recording.audio;
     *     var videoDataURL = recording.video;
     *     var gifDataURL   = recording.gif;
     * });
     */
    this.getDataURL = function(callback) {
        this.getBlob(function(blob) {
            getDataURL(blob.audio, function(_audioDataURL) {
                getDataURL(blob.video, function(_videoDataURL) {
                    callback({
                        audio: _audioDataURL,
                        video: _videoDataURL
                    });
                });
            });
        });

        function getDataURL(blob, callback00) {
            if (typeof Worker !== 'undefined') {
                var webWorker = processInWebWorker(function readFile(_blob) {
                    postMessage(new FileReaderSync().readAsDataURL(_blob));
                });

                webWorker.onmessage = function(event) {
                    callback00(event.data);
                };

                webWorker.postMessage(blob);
            } else {
                var reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onload = function(event) {
                    callback00(event.target.result);
                };
            }
        }

        function processInWebWorker(_function) {
            var blob = URL.createObjectURL(new Blob([_function.toString(),
                'this.onmessage =  function (e) {' + _function.name + '(e.data);}'
            ], {
                type: 'application/javascript'
            }));

            var worker = new Worker(blob);
            var url;
            if (typeof URL !== 'undefined') {
                url = URL;
            } else if (typeof webkitURL !== 'undefined') {
                url = webkitURL;
            } else {
                throw 'Neither URL nor webkitURL detected.';
            }
            url.revokeObjectURL(blob);
            return worker;
        }
    };

    /**
     * This method can be used to ask {@link MRecordRTC} to write all recorded blobs into IndexedDB storage.
     * @method
     * @memberof MRecordRTC
     * @example
     * recorder.writeToDisk();
     */
    this.writeToDisk = function() {
        RecordRTC.writeToDisk({
            audio: this.audioRecorder,
            video: this.videoRecorder,
            gif: this.gifRecorder
        });
    };

    /**
     * This method can be used to invoke save-as dialog for all recorded blobs.
     * @param {object} args - {audio: 'audio-name', video: 'video-name', gif: 'gif-name'}
     * @method
     * @memberof MRecordRTC
     * @example
     * recorder.save({
     *     audio: 'audio-file-name',
     *     video: 'video-file-name',
     *     gif  : 'gif-file-name'
     * });
     */
    this.save = function(args) {
        args = args || {
            audio: true,
            video: true,
            gif: true
        };

        if (!!args.audio && this.audioRecorder) {
            this.audioRecorder.save(typeof args.audio === 'string' ? args.audio : '');
        }

        if (!!args.video && this.videoRecorder) {
            this.videoRecorder.save(typeof args.video === 'string' ? args.video : '');
        }
        if (!!args.gif && this.gifRecorder) {
            this.gifRecorder.save(typeof args.gif === 'string' ? args.gif : '');
        }
    };
}

/**
 * This method can be used to get all recorded blobs from IndexedDB storage.
 * @param {string} type - 'all' or 'audio' or 'video' or 'gif'
 * @param {function} callback - Callback function to get all stored blobs.
 * @method
 * @memberof MRecordRTC
 * @example
 * MRecordRTC.getFromDisk('all', function(dataURL, type){
 *     if(type === 'audio') { }
 *     if(type === 'video') { }
 *     if(type === 'gif')   { }
 * });
 */
MRecordRTC.getFromDisk = RecordRTC.getFromDisk;

/**
 * This method can be used to store recorded blobs into IndexedDB storage.
 * @param {object} options - {audio: Blob, video: Blob, gif: Blob}
 * @method
 * @memberof MRecordRTC
 * @example
 * MRecordRTC.writeToDisk({
 *     audio: audioBlob,
 *     video: videoBlob,
 *     gif  : gifBlob
 * });
 */
MRecordRTC.writeToDisk = RecordRTC.writeToDisk;

if (typeof RecordRTC !== 'undefined') {
    RecordRTC.MRecordRTC = MRecordRTC;
}

var browserFakeUserAgent = 'Fake/5.0 (FakeOS) AppleWebKit/123 (KHTML, like Gecko) Fake/12.3.4567.89 Fake/123.45';

(function(that) {
    if (!that) {
        return;
    }

    if (typeof window !== 'undefined') {
        return;
    }

    if (typeof global === 'undefined') {
        return;
    }

    global.navigator = {
        userAgent: browserFakeUserAgent,
        getUserMedia: function() {}
    };

    if (!global.console) {
        global.console = {};
    }

    if (typeof global.console.debug === 'undefined') {
        global.console.debug = global.console.info = global.console.error = global.console.log = global.console.log || function() {
            console.log(arguments);
        };
    }

    if (typeof document === 'undefined') {
        /*global document:true */
        that.document = {};

        document.createElement = document.captureStream = document.mozCaptureStream = function() {
            var obj = {
                getContext: function() {
                    return obj;
                },
                play: function() {},
                pause: function() {},
                drawImage: function() {},
                toDataURL: function() {
                    return '';
                }
            };
            return obj;
        };

        that.HTMLVideoElement = function() {};
    }

    if (typeof location === 'undefined') {
        /*global location:true */
        that.location = {
            protocol: 'file:',
            href: '',
            hash: ''
        };
    }

    if (typeof screen === 'undefined') {
        /*global screen:true */
        that.screen = {
            width: 0,
            height: 0
        };
    }

    if (typeof URL === 'undefined') {
        /*global screen:true */
        that.URL = {
            createObjectURL: function() {
                return '';
            },
            revokeObjectURL: function() {
                return '';
            }
        };
    }

    /*global window:true */
    that.window = global;
})(typeof global !== 'undefined' ? global : null);

// _____________________________
// Cross-Browser-Declarations.js

// animation-frame used in WebM recording

/*jshint -W079 */
var requestAnimationFrame = window.requestAnimationFrame;
if (typeof requestAnimationFrame === 'undefined') {
    if (typeof webkitRequestAnimationFrame !== 'undefined') {
        /*global requestAnimationFrame:true */
        requestAnimationFrame = webkitRequestAnimationFrame;
    }

    if (typeof mozRequestAnimationFrame !== 'undefined') {
        /*global requestAnimationFrame:true */
        requestAnimationFrame = mozRequestAnimationFrame;
    }
}

/*jshint -W079 */
var cancelAnimationFrame = window.cancelAnimationFrame;
if (typeof cancelAnimationFrame === 'undefined') {
    if (typeof webkitCancelAnimationFrame !== 'undefined') {
        /*global cancelAnimationFrame:true */
        cancelAnimationFrame = webkitCancelAnimationFrame;
    }

    if (typeof mozCancelAnimationFrame !== 'undefined') {
        /*global cancelAnimationFrame:true */
        cancelAnimationFrame = mozCancelAnimationFrame;
    }
}

// WebAudio API representer
var AudioContext = window.AudioContext;

if (typeof AudioContext === 'undefined') {
    if (typeof webkitAudioContext !== 'undefined') {
        /*global AudioContext:true */
        AudioContext = webkitAudioContext;
    }

    if (typeof mozAudioContext !== 'undefined') {
        /*global AudioContext:true */
        AudioContext = mozAudioContext;
    }
}

/*jshint -W079 */
var URL = window.URL;

if (typeof URL === 'undefined' && typeof webkitURL !== 'undefined') {
    /*global URL:true */
    URL = webkitURL;
}

if (typeof navigator !== 'undefined') { // maybe window.navigator?
    if (typeof navigator.webkitGetUserMedia !== 'undefined') {
        navigator.getUserMedia = navigator.webkitGetUserMedia;
    }

    if (typeof navigator.mozGetUserMedia !== 'undefined') {
        navigator.getUserMedia = navigator.mozGetUserMedia;
    }
}

var isEdge = navigator.userAgent.indexOf('Edge') !== -1 && (!!navigator.msSaveBlob || !!navigator.msSaveOrOpenBlob);
var isOpera = !!window.opera || navigator.userAgent.indexOf('OPR/') !== -1;
var isChrome = !isOpera && !isEdge && !!navigator.webkitGetUserMedia;

var MediaStream = window.MediaStream;

if (typeof MediaStream === 'undefined' && typeof webkitMediaStream !== 'undefined') {
    MediaStream = webkitMediaStream;
}

/*global MediaStream:true */
if (typeof MediaStream !== 'undefined') {
    if (!('getVideoTracks' in MediaStream.prototype)) {
        MediaStream.prototype.getVideoTracks = function() {
            if (!this.getTracks) {
                return [];
            }

            var tracks = [];
            this.getTracks.forEach(function(track) {
                if (track.kind.toString().indexOf('video') !== -1) {
                    tracks.push(track);
                }
            });
            return tracks;
        };

        MediaStream.prototype.getAudioTracks = function() {
            if (!this.getTracks) {
                return [];
            }

            var tracks = [];
            this.getTracks.forEach(function(track) {
                if (track.kind.toString().indexOf('audio') !== -1) {
                    tracks.push(track);
                }
            });
            return tracks;
        };
    }

    if (!('stop' in MediaStream.prototype)) {
        MediaStream.prototype.stop = function() {
            this.getAudioTracks().forEach(function(track) {
                if (!!track.stop) {
                    track.stop();
                }
            });

            this.getVideoTracks().forEach(function(track) {
                if (!!track.stop) {
                    track.stop();
                }
            });
        };
    }
}

// below function via: http://goo.gl/B3ae8c
/**
 * @param {number} bytes - Pass bytes and get formafted string.
 * @returns {string} - formafted string
 * @example
 * bytesToSize(1024*1024*5) === '5 GB'
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 */
function bytesToSize(bytes) {
    var k = 1000;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) {
        return '0 Bytes';
    }
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)), 10);
    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}

/**
 * @param {Blob} file - File or Blob object. This parameter is required.
 * @param {string} fileName - Optional file name e.g. "Recorded-Video.webm"
 * @example
 * invokeSaveAsDialog(blob or file, [optional] fileName);
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 */
function invokeSaveAsDialog(file, fileName) {
    if (!file) {
        throw 'Blob object is required.';
    }

    if (!file.type) {
        try {
            file.type = 'video/webm';
        } catch (e) {}
    }

    var fileExtension = (file.type || 'video/webm').split('/')[1];

    if (fileName && fileName.indexOf('.') !== -1) {
        var splitted = fileName.split('.');
        fileName = splitted[0];
        fileExtension = splitted[1];
    }

    var fileFullName = (fileName || (Math.round(Math.random() * 9999999999) + 888888888)) + '.' + fileExtension;

    if (typeof navigator.msSaveOrOpenBlob !== 'undefined') {
        return navigator.msSaveOrOpenBlob(file, fileFullName);
    } else if (typeof navigator.msSaveBlob !== 'undefined') {
        return navigator.msSaveBlob(file, fileFullName);
    }

    var hyperlink = document.createElement('a');
    hyperlink.href = URL.createObjectURL(file);
    hyperlink.target = '_blank';
    hyperlink.download = fileFullName;

    if (!!navigator.mozGetUserMedia) {
        hyperlink.onclick = function() {
            (document.body || document.documentElement).removeChild(hyperlink);
        };
        (document.body || document.documentElement).appendChild(hyperlink);
    }

    var evt = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
    });

    hyperlink.dispatchEvent(evt);

    if (!navigator.mozGetUserMedia) {
        URL.revokeObjectURL(hyperlink.href);
    }
}

// __________ (used to handle stuff like http://goo.gl/xmE5eg) issue #129
// Storage.js

/**
 * Storage is a standalone object used by {@link RecordRTC} to store reusable objects e.g. "new AudioContext".
 * @license {@link https://github.com/muaz-khan/RecordRTC#license|MIT}
 * @author {@link http://www.MuazKhan.com|Muaz Khan}
 * @example
 * Storage.AudioContext === webkitAudioContext
 * @property {webkitAudioContext} AudioContext - Keeps a reference to AudioContext object.
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 */

var Storage = {};

if (typeof AudioContext !== 'undefined') {
    Storage.AudioContext = AudioContext;
} else if (typeof webkitAudioContext !== 'undefined') {
    Storage.AudioContext = webkitAudioContext;
}

if (typeof RecordRTC !== 'undefined') {
    RecordRTC.Storage = Storage;
}

function isMediaRecorderCompatible() {
    var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    var isChrome = !!window.chrome && !isOpera;
    var isFirefox = typeof window.InstallTrigger !== 'undefined';

    if (isFirefox) {
        return true;
    }

    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var fullVersion = '' + parseFloat(navigator.appVersion);
    var majorVersion = parseInt(navigator.appVersion, 10);
    var nameOffset, verOffset, ix;

    if (isChrome || isOpera) {
        verOffset = nAgt.indexOf('Chrome');
        fullVersion = nAgt.substring(verOffset + 7);
    }

    // trim the fullVersion string at semicolon/space if present
    if ((ix = fullVersion.indexOf(';')) !== -1) {
        fullVersion = fullVersion.substring(0, ix);
    }

    if ((ix = fullVersion.indexOf(' ')) !== -1) {
        fullVersion = fullVersion.substring(0, ix);
    }

    majorVersion = parseInt('' + fullVersion, 10);

    if (isNaN(majorVersion)) {
        fullVersion = '' + parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion, 10);
    }

    return majorVersion >= 49;
}

// ______________________
// MediaStreamRecorder.js

// todo: need to show alert boxes for incompatible cases
// encoder only supports 48k/16k mono audio channel

/*
 * Implementation of https://dvcs.w3.org/hg/dap/raw-file/default/media-stream-capture/MediaRecorder.html
 * The MediaRecorder accepts a mediaStream as input source passed from UA. When recorder starts,
 * a MediaEncoder will be created and accept the mediaStream as input source.
 * Encoder will get the raw data by track data changes, encode it by selected MIME Type, then store the encoded in EncodedBufferCache object.
 * The encoded data will be extracted on every timeslice passed from Start function call or by RequestData function.
 * Thread model:
 * When the recorder starts, it creates a "Media Encoder" thread to read data from MediaEncoder object and store buffer in EncodedBufferCache object.
 * Also extract the encoded data and create blobs on every timeslice passed from start function or RequestData function called by UA.
 */

/**
 * MediaStreamRecorder is an abstraction layer for "MediaRecorder API". It is used by {@link RecordRTC} to record MediaStream(s) in Firefox.
 * @summary Runs top over MediaRecorder API.
 * @license {@link https://github.com/muaz-khan/RecordRTC#license|MIT}
 * @author {@link http://www.MuazKhan.com|Muaz Khan}
 * @typedef MediaStreamRecorder
 * @class
 * @example
 * var options = {
 *     mimeType: 'video/mp4', // audio/ogg or video/webm
 *     audioBitsPerSecond : 256 * 8 * 1024,
 *     videoBitsPerSecond : 256 * 8 * 1024,
 *     bitsPerSecond: 256 * 8 * 1024,  // if this is provided, skip above two
 *     getNativeBlob: true // by default it is false
 * }
 * var recorder = new MediaStreamRecorder(MediaStream, options);
 * recorder.record();
 * recorder.stop(function(blob) {
 *     video.src = URL.createObjectURL(blob);
 *
 *     // or
 *     var blob = recorder.blob;
 * });
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 * @param {MediaStream} mediaStream - MediaStream object fetched using getUserMedia API or generated using captureStreamUntilEnded or WebAudio API.
 * @param {object} config - {disableLogs:true, initCallback: function, mimeType: "video/webm", onAudioProcessStarted: function}
 */

function MediaStreamRecorder(mediaStream, config) {
    var self = this;

    config = config || {
        // bitsPerSecond: 256 * 8 * 1024,
        mimeType: 'video/webm'
    };

    if (config.type === 'audio') {
        if (mediaStream.getVideoTracks().length && mediaStream.getAudioTracks().length) {
            var stream;
            if (!!navigator.mozGetUserMedia) {
                stream = new MediaStream();
                stream.addTrack(mediaStream.getAudioTracks()[0]);
            } else {
                // webkitMediaStream
                stream = new MediaStream(mediaStream.getAudioTracks());
            }
            mediaStream = stream;
        }

        if (!config.mimeType || config.mimeType.indexOf('audio') === -1) {
            config.mimeType = isChrome ? 'audio/webm' : 'audio/ogg';
        }
    }

    /**
     * This method records MediaStream.
     * @method
     * @memberof MediaStreamRecorder
     * @example
     * recorder.record();
     */
    this.record = function() {
        self.blob = null;

        var recorderHints = config;

        if (!config.disableLogs) {
            console.log('Passing following config over MediaRecorder API.', recorderHints);
        }

        if (mediaRecorder) {
            // mandatory to make sure Firefox doesn't fails to record streams 3-4 times without reloading the page.
            mediaRecorder = null;
        }

        if (isChrome && !isMediaRecorderCompatible()) {
            // to support video-only recording on stable
            recorderHints = 'video/vp8';
        }

        // http://dxr.mozilla.org/mozilla-central/source/content/media/MediaRecorder.cpp
        // https://wiki.mozilla.org/Gecko:MediaRecorder
        // https://dvcs.w3.org/hg/dap/raw-file/default/media-stream-capture/MediaRecorder.html

        // starting a recording session; which will initiate "Reading Thread"
        // "Reading Thread" are used to prevent main-thread blocking scenarios
        mediaRecorder = new MediaRecorder(mediaStream, recorderHints);

        if ('canRecordMimeType' in mediaRecorder && mediaRecorder.canRecordMimeType(config.mimeType) === false) {
            if (!config.disableLogs) {
                console.warn('MediaRecorder API seems unable to record mimeType:', config.mimeType);
            }
        }

        // i.e. stop recording when <video> is paused by the user; and auto restart recording 
        // when video is resumed. E.g. yourStream.getVideoTracks()[0].muted = true; // it will auto-stop recording.
        mediaRecorder.ignoreMutedMedia = config.ignoreMutedMedia || false;

        // Dispatching OnDataAvailable Handler
        mediaRecorder.ondataavailable = function(e) {
            if (self.dontFireOnDataAvailableEvent) {
                return;
            }

            if (!e.data || !e.data.size || e.data.size < 100 || self.blob) {
                return;
            }

            /**
             * @property {Blob} blob - Recorded frames in video/webm blob.
             * @memberof MediaStreamRecorder
             * @example
             * recorder.stop(function() {
             *     var blob = recorder.blob;
             * });
             */
            self.blob = config.getNativeBlob ? e.data : new Blob([e.data], {
                type: config.mimeType || 'video/webm'
            });

            if (self.recordingCallback) {
                self.recordingCallback(self.blob);
                self.recordingCallback = null;
            }
        };

        mediaRecorder.onerror = function(error) {
            if (!config.disableLogs) {
                if (error.name === 'InvalidState') {
                    console.error('The MediaRecorder is not in a state in which the proposed operation is allowed to be executed.');
                } else if (error.name === 'OutOfMemory') {
                    console.error('The UA has exhaused the available memory. User agents SHOULD provide as much additional information as possible in the message attribute.');
                } else if (error.name === 'IllegalStreamModification') {
                    console.error('A modification to the stream has occurred that makes it impossible to continue recording. An example would be the addition of a Track while recording is occurring. User agents SHOULD provide as much additional information as possible in the message attribute.');
                } else if (error.name === 'OtherRecordingError') {
                    console.error('Used for an fatal error other than those listed above. User agents SHOULD provide as much additional information as possible in the message attribute.');
                } else if (error.name === 'GenericError') {
                    console.error('The UA cannot provide the codec or recording option that has been requested.', error);
                } else {
                    console.error('MediaRecorder Error', error);
                }
            }

            // When the stream is "ended" set recording to 'inactive' 
            // and stop gathering data. Callers should not rely on 
            // exactness of the timeSlice value, especially 
            // if the timeSlice value is small. Callers should 
            // consider timeSlice as a minimum value

            if (mediaRecorder.state !== 'inactive' && mediaRecorder.state !== 'stopped') {
                mediaRecorder.stop();
            }
        };

        // void start(optional long mTimeSlice)
        // The interval of passing encoded data from EncodedBufferCache to onDataAvailable
        // handler. "mTimeSlice < 0" means Session object does not push encoded data to
        // onDataAvailable, instead, it passive wait the client side pull encoded data
        // by calling requestData API.
        mediaRecorder.start(3.6e+6);

        // Start recording. If timeSlice has been provided, mediaRecorder will
        // raise a dataavailable event containing the Blob of collected data on every timeSlice milliseconds.
        // If timeSlice isn't provided, UA should call the RequestData to obtain the Blob data, also set the mTimeSlice to zero.

        if (config.onAudioProcessStarted) {
            config.onAudioProcessStarted();
        }

        if (config.initCallback) {
            config.initCallback();
        }
    };

    /**
     * This method stops recording MediaStream.
     * @param {function} callback - Callback function, that is used to pass recorded blob back to the callee.
     * @method
     * @memberof MediaStreamRecorder
     * @example
     * recorder.stop(function(blob) {
     *     video.src = URL.createObjectURL(blob);
     * });
     */
    this.stop = function(callback) {
        if (!mediaRecorder) {
            return;
        }

        this.recordingCallback = callback || function() {};

        // mediaRecorder.state === 'recording' means that media recorder is associated with "session"
        // mediaRecorder.state === 'stopped' means that media recorder is detached from the "session" ... in this case; "session" will also be deleted.

        if (mediaRecorder.state === 'recording') {
            // "stop" method auto invokes "requestData"!
            mediaRecorder.requestData();
            mediaRecorder.stop();
        }
    };

    /**
     * This method pauses the recording process.
     * @method
     * @memberof MediaStreamRecorder
     * @example
     * recorder.pause();
     */
    this.pause = function() {
        if (!mediaRecorder) {
            return;
        }

        if (mediaRecorder.state === 'recording') {
            mediaRecorder.pause();
        }
    };

    /**
     * This method resumes the recording process.
     * @method
     * @memberof MediaStreamRecorder
     * @example
     * recorder.resume();
     */
    this.resume = function() {
        if (this.dontFireOnDataAvailableEvent) {
            this.dontFireOnDataAvailableEvent = false;

            var disableLogs = config.disableLogs;
            config.disableLogs = true;
            this.record();
            config.disableLogs = disableLogs;
            return;
        }

        if (!mediaRecorder) {
            return;
        }

        if (mediaRecorder.state === 'paused') {
            mediaRecorder.resume();
        }
    };

    /**
     * This method resets currently recorded data.
     * @method
     * @memberof MediaStreamRecorder
     * @example
     * recorder.clearRecordedData();
     */
    this.clearRecordedData = function() {
        if (!mediaRecorder) {
            return;
        }

        this.pause();

        this.dontFireOnDataAvailableEvent = true;
        this.stop();
    };

    // Reference to "MediaRecorder" object
    var mediaRecorder;

    function isMediaStreamActive() {
        if ('active' in mediaStream) {
            if (!mediaStream.active) {
                return false;
            }
        } else if ('ended' in mediaStream) { // old hack
            if (mediaStream.ended) {
                return false;
            }
        }
        return true;
    }

    var self = this;

    // this method checks if media stream is stopped
    // or any track is ended.
    (function looper() {
        if (!mediaRecorder) {
            return;
        }

        if (isMediaStreamActive() === false) {
            if (!config.disableLogs) {
                console.log('MediaStream seems stopped.');
            }
            self.stop();
            return;
        }

        setTimeout(looper, 1000); // check every second
    })();
}

if (typeof RecordRTC !== 'undefined') {
    RecordRTC.MediaStreamRecorder = MediaStreamRecorder;
}

// source code from: http://typedarray.org/wp-content/projects/WebAudioRecorder/script.js
// https://github.com/mattdiamond/Recorderjs#license-mit
// ______________________
// StereoAudioRecorder.js

/**
 * StereoAudioRecorder is a standalone class used by {@link RecordRTC} to bring "stereo" audio-recording in chrome.
 * @summary JavaScript standalone object for stereo audio recording.
 * @license {@link https://github.com/muaz-khan/RecordRTC#license|MIT}
 * @author {@link http://www.MuazKhan.com|Muaz Khan}
 * @typedef StereoAudioRecorder
 * @class
 * @example
 * var recorder = new StereoAudioRecorder(MediaStream, {
 *     sampleRate: 44100,
 *     bufferSize: 4096
 * });
 * recorder.record();
 * recorder.stop(function(blob) {
 *     video.src = URL.createObjectURL(blob);
 * });
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 * @param {MediaStream} mediaStream - MediaStream object fetched using getUserMedia API or generated using captureStreamUntilEnded or WebAudio API.
 * @param {object} config - {sampleRate: 44100, bufferSize: 4096, numberOfAudioChannels: 1, etc.}
 */

function StereoAudioRecorder(mediaStream, config) {
    if (!mediaStream.getAudioTracks().length) {
        throw 'Your stream has no audio tracks.';
    }

    config = config || {};

    var self = this;

    // variables
    var leftchannel = [];
    var rightchannel = [];
    var recording = false;
    var recordingLength = 0;
    var jsAudioNode;

    var numberOfAudioChannels = 2;

    // backward compatibility
    if (config.leftChannel === true) {
        numberOfAudioChannels = 1;
    }

    if (config.numberOfAudioChannels === 1) {
        numberOfAudioChannels = 1;
    }

    if (!config.disableLogs) {
        console.debug('StereoAudioRecorder is set to record number of channels: ', numberOfAudioChannels);
    }

    function isMediaStreamActive() {
        if ('active' in mediaStream) {
            if (!mediaStream.active) {
                return false;
            }
        } else if ('ended' in mediaStream) { // old hack
            if (mediaStream.ended) {
                return false;
            }
        }
        return true;
    }

    /**
     * This method records MediaStream.
     * @method
     * @memberof StereoAudioRecorder
     * @example
     * recorder.record();
     */
    this.record = function() {
        if (isMediaStreamActive() === false) {
            throw 'Please make sure MediaStream is active.';
        }

        // reset the buffers for the new recording
        leftchannel.length = rightchannel.length = 0;
        recordingLength = 0;

        if (audioInput) {
            audioInput.connect(jsAudioNode);
        }

        // to prevent self audio to be connected with speakers
        // jsAudioNode.connect(context.destination);

        isAudioProcessStarted = isPaused = false;
        recording = true;
    };

    function mergeLeftRightBuffers(config, callback) {
        function mergeAudioBuffers(config, cb) {
            var numberOfAudioChannels = config.numberOfAudioChannels;

            // todo: "slice(0)" --- is it causes loop? Should be removed?
            var leftBuffers = config.leftBuffers.slice(0);
            var rightBuffers = config.rightBuffers.slice(0);
            var sampleRate = config.sampleRate;
            var internalInterleavedLength = config.internalInterleavedLength;

            if (numberOfAudioChannels === 2) {
                leftBuffers = mergeBuffers(leftBuffers, internalInterleavedLength);
                rightBuffers = mergeBuffers(rightBuffers, internalInterleavedLength);
            }

            if (numberOfAudioChannels === 1) {
                leftBuffers = mergeBuffers(leftBuffers, internalInterleavedLength);
            }

            function mergeBuffers(channelBuffer, rLength) {
                var result = new Float64Array(rLength);
                var offset = 0;
                var lng = channelBuffer.length;

                for (var i = 0; i < lng; i++) {
                    var buffer = channelBuffer[i];
                    result.set(buffer, offset);
                    offset += buffer.length;
                }

                return result;
            }

            function interleave(leftChannel, rightChannel) {
                var length = leftChannel.length + rightChannel.length;

                var result = new Float64Array(length);

                var inputIndex = 0;

                for (var index = 0; index < length;) {
                    result[index++] = leftChannel[inputIndex];
                    result[index++] = rightChannel[inputIndex];
                    inputIndex++;
                }
                return result;
            }

            function writeUTFBytes(view, offset, string) {
                var lng = string.length;
                for (var i = 0; i < lng; i++) {
                    view.setUint8(offset + i, string.charCodeAt(i));
                }
            }

            // interleave both channels together
            var interleaved;

            if (numberOfAudioChannels === 2) {
                interleaved = interleave(leftBuffers, rightBuffers);
            }

            if (numberOfAudioChannels === 1) {
                interleaved = leftBuffers;
            }

            var interleavedLength = interleaved.length;

            // create wav file
            var resultingBufferLength = 44 + interleavedLength * 2;

            var buffer = new ArrayBuffer(resultingBufferLength);

            var view = new DataView(buffer);

            // RIFF chunk descriptor/identifier 
            writeUTFBytes(view, 0, 'RIFF');

            // RIFF chunk length
            view.setUint32(4, 44 + interleavedLength * 2, true);

            // RIFF type 
            writeUTFBytes(view, 8, 'WAVE');

            // format chunk identifier 
            // FMT sub-chunk
            writeUTFBytes(view, 12, 'fmt ');

            // format chunk length 
            view.setUint32(16, 16, true);

            // sample format (raw)
            view.setUint16(20, 1, true);

            // stereo (2 channels)
            view.setUint16(22, numberOfAudioChannels, true);

            // sample rate 
            view.setUint32(24, sampleRate, true);

            // byte rate (sample rate * block align)
            view.setUint32(28, sampleRate * 2, true);

            // block align (channel count * bytes per sample) 
            view.setUint16(32, numberOfAudioChannels * 2, true);

            // bits per sample 
            view.setUint16(34, 16, true);

            // data sub-chunk
            // data chunk identifier 
            writeUTFBytes(view, 36, 'data');

            // data chunk length 
            view.setUint32(40, interleavedLength * 2, true);

            // write the PCM samples
            var lng = interleavedLength;
            var index = 44;
            var volume = 1;
            for (var i = 0; i < lng; i++) {
                view.setInt16(index, interleaved[i] * (0x7FFF * volume), true);
                index += 2;
            }

            if (cb) {
                return cb({
                    buffer: buffer,
                    view: view
                });
            }

            postMessage({
                buffer: buffer,
                view: view
            });
        }

        if (!isChrome) {
            // its Microsoft Edge
            mergeAudioBuffers(config, function(data) {
                callback(data.buffer, data.view);
            });
            return;
        }


        var webWorker = processInWebWorker(mergeAudioBuffers);

        webWorker.onmessage = function(event) {
            callback(event.data.buffer, event.data.view);

            // release memory
            URL.revokeObjectURL(webWorker.workerURL);
        };

        webWorker.postMessage(config);
    }

    function processInWebWorker(_function) {
        var workerURL = URL.createObjectURL(new Blob([_function.toString(),
            ';this.onmessage =  function (e) {' + _function.name + '(e.data);}'
        ], {
            type: 'application/javascript'
        }));

        var worker = new Worker(workerURL);
        worker.workerURL = workerURL;
        return worker;
    }

    /**
     * This method stops recording MediaStream.
     * @param {function} callback - Callback function, that is used to pass recorded blob back to the callee.
     * @method
     * @memberof StereoAudioRecorder
     * @example
     * recorder.stop(function(blob) {
     *     video.src = URL.createObjectURL(blob);
     * });
     */
    this.stop = function(callback) {
        // stop recording
        recording = false;

        // to make sure onaudioprocess stops firing
        // audioInput.disconnect();

        mergeLeftRightBuffers({
            sampleRate: sampleRate,
            numberOfAudioChannels: numberOfAudioChannels,
            internalInterleavedLength: recordingLength,
            leftBuffers: leftchannel,
            rightBuffers: numberOfAudioChannels === 1 ? [] : rightchannel
        }, function(buffer, view) {
            /**
             * @property {Blob} blob - The recorded blob object.
             * @memberof StereoAudioRecorder
             * @example
             * recorder.stop(function(){
             *     var blob = recorder.blob;
             * });
             */
            self.blob = new Blob([view], {
                type: 'audio/wav'
            });

            /**
             * @property {ArrayBuffer} buffer - The recorded buffer object.
             * @memberof StereoAudioRecorder
             * @example
             * recorder.stop(function(){
             *     var buffer = recorder.buffer;
             * });
             */
            self.buffer = new ArrayBuffer(view.buffer.byteLength);

            /**
             * @property {DataView} view - The recorded data-view object.
             * @memberof StereoAudioRecorder
             * @example
             * recorder.stop(function(){
             *     var view = recorder.view;
             * });
             */
            self.view = view;

            self.sampleRate = sampleRate;
            self.bufferSize = bufferSize;

            // recorded audio length
            self.length = recordingLength;

            if (callback) {
                callback();
            }

            isAudioProcessStarted = false;
        });
    };

    if (!Storage.AudioContextConstructor) {
        Storage.AudioContextConstructor = new Storage.AudioContext();
    }

    var context = Storage.AudioContextConstructor;

    // creates an audio node from the microphone incoming stream
    var audioInput = context.createMediaStreamSource(mediaStream);

    var legalBufferValues = [0, 256, 512, 1024, 2048, 4096, 8192, 16384];

    /**
     * From the spec: This value controls how frequently the audioprocess event is
     * dispatched and how many sample-frames need to be processed each call.
     * Lower values for buffer size will result in a lower (better) latency.
     * Higher values will be necessary to avoid audio breakup and glitches
     * The size of the buffer (in sample-frames) which needs to
     * be processed each time onprocessaudio is called.
     * Legal values are (256, 512, 1024, 2048, 4096, 8192, 16384).
     * @property {number} bufferSize - Buffer-size for how frequently the audioprocess event is dispatched.
     * @memberof StereoAudioRecorder
     * @example
     * recorder = new StereoAudioRecorder(mediaStream, {
     *     bufferSize: 4096
     * });
     */

    // "0" means, let chrome decide the most accurate buffer-size for current platform.
    var bufferSize = typeof config.bufferSize === 'undefined' ? 4096 : config.bufferSize;

    if (legalBufferValues.indexOf(bufferSize) === -1) {
        if (!config.disableLogs) {
            console.warn('Legal values for buffer-size are ' + JSON.stringify(legalBufferValues, null, '\t'));
        }
    }

    if (context.createJavaScriptNode) {
        jsAudioNode = context.createJavaScriptNode(bufferSize, numberOfAudioChannels, numberOfAudioChannels);
    } else if (context.createScriptProcessor) {
        jsAudioNode = context.createScriptProcessor(bufferSize, numberOfAudioChannels, numberOfAudioChannels);
    } else {
        throw 'WebAudio API has no support on this browser.';
    }

    // connect the stream to the gain node
    audioInput.connect(jsAudioNode);

    if (!config.bufferSize) {
        bufferSize = jsAudioNode.bufferSize; // device buffer-size
    }

    /**
     * The sample rate (in sample-frames per second) at which the
     * AudioContext handles audio. It is assumed that all AudioNodes
     * in the context run at this rate. In making this assumption,
     * sample-rate converters or "varispeed" processors are not supported
     * in real-time processing.
     * The sampleRate parameter describes the sample-rate of the
     * linear PCM audio data in the buffer in sample-frames per second.
     * An implementation must support sample-rates in at least
     * the range 22050 to 96000.
     * @property {number} sampleRate - Buffer-size for how frequently the audioprocess event is dispatched.
     * @memberof StereoAudioRecorder
     * @example
     * recorder = new StereoAudioRecorder(mediaStream, {
     *     sampleRate: 44100
     * });
     */
    var sampleRate = typeof config.sampleRate !== 'undefined' ? config.sampleRate : context.sampleRate || 44100;

    if (sampleRate < 22050 || sampleRate > 96000) {
        // Ref: http://stackoverflow.com/a/26303918/552182
        if (!config.disableLogs) {
            console.warn('sample-rate must be under range 22050 and 96000.');
        }
    }

    if (!config.disableLogs) {
        console.log('sample-rate', sampleRate);
        console.log('buffer-size', bufferSize);
    }

    var isPaused = false;
    /**
     * This method pauses the recording process.
     * @method
     * @memberof StereoAudioRecorder
     * @example
     * recorder.pause();
     */
    this.pause = function() {
        isPaused = true;
    };

    /**
     * This method resumes the recording process.
     * @method
     * @memberof StereoAudioRecorder
     * @example
     * recorder.resume();
     */
    this.resume = function() {
        if (isMediaStreamActive() === false) {
            throw 'Please make sure MediaStream is active.';
        }

        if (!recording) {
            if (!config.disableLogs) {
                console.info('Seems recording has been restarted.');
            }
            this.record();
            return;
        }

        isPaused = false;
    };

    /**
     * This method resets currently recorded data.
     * @method
     * @memberof StereoAudioRecorder
     * @example
     * recorder.clearRecordedData();
     */
    this.clearRecordedData = function() {
        this.pause();

        leftchannel.length = rightchannel.length = 0;
        recordingLength = 0;
    };

    var isAudioProcessStarted = false;

    function onAudioProcessDataAvailable(e) {
        if (isPaused) {
            return;
        }

        if (isMediaStreamActive() === false) {
            if (!config.disableLogs) {
                console.log('MediaStream seems stopped.');
            }
            jsAudioNode.disconnect();
            recording = false;
        }

        if (!recording) {
            audioInput.disconnect();
            return;
        }

        /**
         * This method is called on "onaudioprocess" event's first invocation.
         * @method {function} onAudioProcessStarted
         * @memberof StereoAudioRecorder
         * @example
         * recorder.onAudioProcessStarted: function() { };
         */
        if (!isAudioProcessStarted) {
            isAudioProcessStarted = true;
            if (config.onAudioProcessStarted) {
                config.onAudioProcessStarted();
            }

            if (config.initCallback) {
                config.initCallback();
            }
        }

        var left = e.inputBuffer.getChannelData(0);

        // we clone the samples
        leftchannel.push(new Float32Array(left));

        if (numberOfAudioChannels === 2) {
            var right = e.inputBuffer.getChannelData(1);
            rightchannel.push(new Float32Array(right));
        }

        recordingLength += bufferSize;
    }

    jsAudioNode.onaudioprocess = onAudioProcessDataAvailable;

    // to prevent self audio to be connected with speakers
    jsAudioNode.connect(context.destination);
}

if (typeof RecordRTC !== 'undefined') {
    RecordRTC.StereoAudioRecorder = StereoAudioRecorder;
}

// _________________
// CanvasRecorder.js

/**
 * CanvasRecorder is a standalone class used by {@link RecordRTC} to bring HTML5-Canvas recording into video WebM. It uses HTML2Canvas library and runs top over {@link Whammy}.
 * @summary HTML2Canvas recording into video WebM.
 * @license {@link https://github.com/muaz-khan/RecordRTC#license|MIT}
 * @author {@link http://www.MuazKhan.com|Muaz Khan}
 * @typedef CanvasRecorder
 * @class
 * @example
 * var recorder = new CanvasRecorder(htmlElement, { disableLogs: true });
 * recorder.record();
 * recorder.stop(function(blob) {
 *     video.src = URL.createObjectURL(blob);
 * });
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 * @param {HTMLElement} htmlElement - querySelector/getElementById/getElementsByTagName[0]/etc.
 * @param {object} config - {disableLogs:true, initCallback: function}
 */

function CanvasRecorder(htmlElement, config) {
    if (typeof html2canvas === 'undefined' && htmlElement.nodeName.toLowerCase() !== 'canvas') {
        throw 'Please link: //cdn.webrtc-experiment.com/screenshot.js';
    }

    config = config || {};
    if (!config.frameInterval) {
        config.frameInterval = 10;
    }

    // via DetectRTC.js
    var isCanvasSupportsStreamCapturing = false;
    ['captureStream', 'mozCaptureStream', 'webkitCaptureStream'].forEach(function(item) {
        if (item in document.createElement('canvas')) {
            isCanvasSupportsStreamCapturing = true;
        }
    });

    if (!!window.webkitRTCPeerConnection || !!window.webkitGetUserMedia) {
        isCanvasSupportsStreamCapturing = false;
    }

    var globalCanvas, globalContext, mediaStreamRecorder;

    if (isCanvasSupportsStreamCapturing) {
        if (!config.disableLogs) {
            console.debug('Your browser supports both MediRecorder API and canvas.captureStream!');
        }

        globalCanvas = document.createElement('canvas');

        globalCanvas.width = htmlElement.clientWidth || window.innerWidth;
        globalCanvas.height = htmlElement.clientHeight || window.innerHeight;

        globalCanvas.style = 'top: -9999999; left: -99999999; visibility:hidden; position:absoluted; display: none;';
        (document.body || document.documentElement).appendChild(globalCanvas);

        globalContext = globalCanvas.getContext('2d');
    } else if (!!navigator.mozGetUserMedia) {
        if (!config.disableLogs) {
            alert('Canvas recording is NOT supported in Firefox.');
        }
    }

    var isRecording;

    /**
     * This method records Canvas.
     * @method
     * @memberof CanvasRecorder
     * @example
     * recorder.record();
     */
    this.record = function() {
        isRecording = true;

        if (isCanvasSupportsStreamCapturing) {
            // CanvasCaptureMediaStream
            var canvasMediaStream;
            if ('captureStream' in globalCanvas) {
                canvasMediaStream = globalCanvas.captureStream(25); // 25 FPS
            } else if ('mozCaptureStream' in globalCanvas) {
                canvasMediaStream = globalCanvas.captureStream(25);
            } else if ('webkitCaptureStream' in globalCanvas) {
                canvasMediaStream = globalCanvas.captureStream(25);
            }

            try {
                var mdStream = new MediaStream();
                mdStream.addTrack(canvasMediaStream.getVideoTracks()[0]);
                canvasMediaStream = mdStream;
            } catch (e) {}

            if (!canvasMediaStream) {
                throw 'captureStream API are NOT available.';
            }

            // Note: Jan 18, 2016 status is that, 
            // Firefox MediaRecorder API can't record CanvasCaptureMediaStream object.
            mediaStreamRecorder = new MediaStreamRecorder(canvasMediaStream, {
                mimeType: 'video/webm'
            });
            mediaStreamRecorder.record();
        } else {
            whammy.frames = [];
            lastTime = new Date().getTime();
            drawCanvasFrame();
        }

        if (config.initCallback) {
            config.initCallback();
        }
    };

    this.getWebPImages = function(callback) {
        if (htmlElement.nodeName.toLowerCase() !== 'canvas') {
            callback();
            return;
        }

        var framesLength = whammy.frames.length;
        whammy.frames.forEach(function(frame, idx) {
            var framesRemaining = framesLength - idx;
            document.title = framesRemaining + '/' + framesLength + ' frames remaining';

            if (config.onEncodingCallback) {
                config.onEncodingCallback(framesRemaining, framesLength);
            }

            var webp = frame.image.toDataURL('image/webp', 1);
            whammy.frames[idx].image = webp;
        });

        document.title = 'Generating WebM';

        callback();
    };

    /**
     * This method stops recording Canvas.
     * @param {function} callback - Callback function, that is used to pass recorded blob back to the callee.
     * @method
     * @memberof CanvasRecorder
     * @example
     * recorder.stop(function(blob) {
     *     video.src = URL.createObjectURL(blob);
     * });
     */
    this.stop = function(callback) {
        isRecording = false;

        var that = this;

        if (isCanvasSupportsStreamCapturing && mediaStreamRecorder) {
            var slef = this;
            mediaStreamRecorder.stop(function() {
                for (var prop in mediaStreamRecorder) {
                    self[prop] = mediaStreamRecorder[prop];
                }
                if (callback) {
                    callback(that.blob);
                }
            });
            return;
        }

        this.getWebPImages(function() {
            /**
             * @property {Blob} blob - Recorded frames in video/webm blob.
             * @memberof CanvasRecorder
             * @example
             * recorder.stop(function() {
             *     var blob = recorder.blob;
             * });
             */
            whammy.compile(function(blob) {
                document.title = 'Recording finished!';

                that.blob = blob;

                if (that.blob.forEach) {
                    that.blob = new Blob([], {
                        type: 'video/webm'
                    });
                }

                if (callback) {
                    callback(that.blob);
                }

                whammy.frames = [];
            });
        });
    };

    var isPausedRecording = false;

    /**
     * This method pauses the recording process.
     * @method
     * @memberof CanvasRecorder
     * @example
     * recorder.pause();
     */
    this.pause = function() {
        isPausedRecording = true;
    };

    /**
     * This method resumes the recording process.
     * @method
     * @memberof CanvasRecorder
     * @example
     * recorder.resume();
     */
    this.resume = function() {
        isPausedRecording = false;

        if (!isRecording) {
            this.record();
        }
    };

    /**
     * This method resets currently recorded data.
     * @method
     * @memberof CanvasRecorder
     * @example
     * recorder.clearRecordedData();
     */
    this.clearRecordedData = function() {
        this.pause();
        whammy.frames = [];
    };

    function cloneCanvas() {
        //create a new canvas
        var newCanvas = document.createElement('canvas');
        var context = newCanvas.getContext('2d');

        //set dimensions
        newCanvas.width = htmlElement.width;
        newCanvas.height = htmlElement.height;

        //apply the old canvas to the new one
        context.drawImage(htmlElement, 0, 0);

        //return the new canvas
        return newCanvas;
    }

    function drawCanvasFrame() {
        if (isPausedRecording) {
            lastTime = new Date().getTime();
            return setTimeout(drawCanvasFrame, 500);
        }

        if (htmlElement.nodeName.toLowerCase() === 'canvas') {
            var duration = new Date().getTime() - lastTime;
            // via #206, by Jack i.e. @Seymourr
            lastTime = new Date().getTime();

            whammy.frames.push({
                image: cloneCanvas(),
                duration: duration
            });

            if (isRecording) {
                setTimeout(drawCanvasFrame, config.frameInterval);
            }
            return;
        }

        html2canvas(htmlElement, {
            grabMouse: typeof config.showMousePointer === 'undefined' || config.showMousePointer,
            onrendered: function(canvas) {
                var duration = new Date().getTime() - lastTime;
                if (!duration) {
                    return setTimeout(drawCanvasFrame, config.frameInterval);
                }

                // via #206, by Jack i.e. @Seymourr
                lastTime = new Date().getTime();

                whammy.frames.push({
                    image: canvas.toDataURL('image/webp', 1),
                    duration: duration
                });

                if (isRecording) {
                    setTimeout(drawCanvasFrame, config.frameInterval);
                }
            }
        });
    }

    var lastTime = new Date().getTime();

    var whammy = new Whammy.Video(100);
}

if (typeof RecordRTC !== 'undefined') {
    RecordRTC.CanvasRecorder = CanvasRecorder;
}

// _________________
// WhammyRecorder.js

/**
 * WhammyRecorder is a standalone class used by {@link RecordRTC} to bring video recording in Chrome. It runs top over {@link Whammy}.
 * @summary Video recording feature in Chrome.
 * @license {@link https://github.com/muaz-khan/RecordRTC#license|MIT}
 * @author {@link http://www.MuazKhan.com|Muaz Khan}
 * @typedef WhammyRecorder
 * @class
 * @example
 * var recorder = new WhammyRecorder(mediaStream);
 * recorder.record();
 * recorder.stop(function(blob) {
 *     video.src = URL.createObjectURL(blob);
 * });
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 * @param {MediaStream} mediaStream - MediaStream object fetched using getUserMedia API or generated using captureStreamUntilEnded or WebAudio API.
 * @param {object} config - {disableLogs: true, initCallback: function, video: HTMLVideoElement, etc.}
 */

function WhammyRecorder(mediaStream, config) {

    config = config || {};

    if (!config.frameInterval) {
        config.frameInterval = 10;
    }

    if (!config.disableLogs) {
        console.log('Using frames-interval:', config.frameInterval);
    }

    /**
     * This method records video.
     * @method
     * @memberof WhammyRecorder
     * @example
     * recorder.record();
     */
    this.record = function() {
        if (!config.width) {
            config.width = 320;
        }

        if (!config.height) {
            config.height = 240;
        }

        if (!config.video) {
            config.video = {
                width: config.width,
                height: config.height
            };
        }

        if (!config.canvas) {
            config.canvas = {
                width: config.width,
                height: config.height
            };
        }

        canvas.width = config.canvas.width;
        canvas.height = config.canvas.height;

        context = canvas.getContext('2d');

        // setting defaults
        if (config.video && config.video instanceof HTMLVideoElement) {
            video = config.video.cloneNode();

            if (config.initCallback) {
                config.initCallback();
            }
        } else {
            video = document.createElement('video');

            if (typeof video.srcObject !== 'undefined') {
                video.srcObject = mediaStream;
            } else {
                video.src = URL.createObjectURL(mediaStream);
            }

            video.onloadedmetadata = function() { // "onloadedmetadata" may NOT work in FF?
                if (config.initCallback) {
                    config.initCallback();
                }
            };

            video.width = config.video.width;
            video.height = config.video.height;
        }

        video.muted = true;
        video.play();

        lastTime = new Date().getTime();
        whammy = new Whammy.Video();

        if (!config.disableLogs) {
            console.log('canvas resolutions', canvas.width, '*', canvas.height);
            console.log('video width/height', video.width || canvas.width, '*', video.height || canvas.height);
        }

        drawFrames(config.frameInterval);
    };

    /**
     * Draw and push frames to Whammy
     * @param {integer} frameInterval - set minimum interval (in milliseconds) between each time we push a frame to Whammy
     */
    function drawFrames(frameInterval) {
        frameInterval = typeof frameInterval !== 'undefined' ? frameInterval : 10;

        var duration = new Date().getTime() - lastTime;
        if (!duration) {
            return setTimeout(drawFrames, frameInterval, frameInterval);
        }

        if (isPausedRecording) {
            lastTime = new Date().getTime();
            return setTimeout(drawFrames, 100);
        }

        // via #206, by Jack i.e. @Seymourr
        lastTime = new Date().getTime();

        if (video.paused) {
            // via: https://github.com/muaz-khan/WebRTC-Experiment/pull/316
            // Tweak for Android Chrome
            video.play();
        }

        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        whammy.frames.push({
            duration: duration,
            image: canvas.toDataURL('image/webp')
        });

        if (!isStopDrawing) {
            setTimeout(drawFrames, frameInterval, frameInterval);
        }
    }

    function asyncLoop(o) {
        var i = -1,
            length = o.length;

        var loop = function() {
            i++;
            if (i === length) {
                o.callback();
                return;
            }
            o.functionToLoop(loop, i);
        };
        loop(); //init
    }


    /**
     * remove black frames from the beginning to the specified frame
     * @param {Array} _frames - array of frames to be checked
     * @param {number} _framesToCheck - number of frame until check will be executed (-1 - will drop all frames until frame not matched will be found)
     * @param {number} _pixTolerance - 0 - very strict (only black pixel color) ; 1 - all
     * @param {number} _frameTolerance - 0 - very strict (only black frame color) ; 1 - all
     * @returns {Array} - array of frames
     */
    // pull#293 by @volodalexey
    function dropBlackFrames(_frames, _framesToCheck, _pixTolerance, _frameTolerance, callback) {
        var localCanvas = document.createElement('canvas');
        localCanvas.width = canvas.width;
        localCanvas.height = canvas.height;
        var context2d = localCanvas.getContext('2d');
        var resultFrames = [];

        var checkUntilNotBlack = _framesToCheck === -1;
        var endCheckFrame = (_framesToCheck && _framesToCheck > 0 && _framesToCheck <= _frames.length) ?
            _framesToCheck : _frames.length;
        var sampleColor = {
            r: 0,
            g: 0,
            b: 0
        };
        var maxColorDifference = Math.sqrt(
            Math.pow(255, 2) +
            Math.pow(255, 2) +
            Math.pow(255, 2)
        );
        var pixTolerance = _pixTolerance && _pixTolerance >= 0 && _pixTolerance <= 1 ? _pixTolerance : 0;
        var frameTolerance = _frameTolerance && _frameTolerance >= 0 && _frameTolerance <= 1 ? _frameTolerance : 0;
        var doNotCheckNext = false;

        asyncLoop({
            length: endCheckFrame,
            functionToLoop: function(loop, f) {
                var matchPixCount, endPixCheck, maxPixCount;

                var finishImage = function() {
                    if (!doNotCheckNext && maxPixCount - matchPixCount <= maxPixCount * frameTolerance) {
                        // console.log('removed black frame : ' + f + ' ; frame duration ' + _frames[f].duration);
                    } else {
                        // console.log('frame is passed : ' + f);
                        if (checkUntilNotBlack) {
                            doNotCheckNext = true;
                        }
                        resultFrames.push(_frames[f]);
                    }
                    loop();
                };

                if (!doNotCheckNext) {
                    var image = new Image();
                    image.onload = function() {
                        context2d.drawImage(image, 0, 0, canvas.width, canvas.height);
                        var imageData = context2d.getImageData(0, 0, canvas.width, canvas.height);
                        matchPixCount = 0;
                        endPixCheck = imageData.data.length;
                        maxPixCount = imageData.data.length / 4;

                        for (var pix = 0; pix < endPixCheck; pix += 4) {
                            var currentColor = {
                                r: imageData.data[pix],
                                g: imageData.data[pix + 1],
                                b: imageData.data[pix + 2]
                            };
                            var colorDifference = Math.sqrt(
                                Math.pow(currentColor.r - sampleColor.r, 2) +
                                Math.pow(currentColor.g - sampleColor.g, 2) +
                                Math.pow(currentColor.b - sampleColor.b, 2)
                            );
                            // difference in color it is difference in color vectors (r1,g1,b1) <=> (r2,g2,b2)
                            if (colorDifference <= maxColorDifference * pixTolerance) {
                                matchPixCount++;
                            }
                        }
                        finishImage();
                    };
                    image.src = _frames[f].image;
                } else {
                    finishImage();
                }
            },
            callback: function() {
                resultFrames = resultFrames.concat(_frames.slice(endCheckFrame));

                if (resultFrames.length <= 0) {
                    // at least one last frame should be available for next manipulation
                    // if total duration of all frames will be < 1000 than ffmpeg doesn't work well...
                    resultFrames.push(_frames[_frames.length - 1]);
                }
                callback(resultFrames);
            }
        });
    }

    var isStopDrawing = false;

    /**
     * This method stops recording video.
     * @param {function} callback - Callback function, that is used to pass recorded blob back to the callee.
     * @method
     * @memberof WhammyRecorder
     * @example
     * recorder.stop(function(blob) {
     *     video.src = URL.createObjectURL(blob);
     * });
     */
    this.stop = function(callback) {
        isStopDrawing = true;

        var _this = this;
        // analyse of all frames takes some time!
        setTimeout(function() {
            // e.g. dropBlackFrames(frames, 10, 1, 1) - will cut all 10 frames
            // e.g. dropBlackFrames(frames, 10, 0.5, 0.5) - will analyse 10 frames
            // e.g. dropBlackFrames(frames, 10) === dropBlackFrames(frames, 10, 0, 0) - will analyse 10 frames with strict black color
            dropBlackFrames(whammy.frames, -1, null, null, function(frames) {
                whammy.frames = frames;

                // to display advertisement images!
                if (config.advertisement && config.advertisement.length) {
                    whammy.frames = config.advertisement.concat(whammy.frames);
                }

                /**
                 * @property {Blob} blob - Recorded frames in video/webm blob.
                 * @memberof WhammyRecorder
                 * @example
                 * recorder.stop(function() {
                 *     var blob = recorder.blob;
                 * });
                 */
                whammy.compile(function(blob) {
                    _this.blob = blob;

                    if (_this.blob.forEach) {
                        _this.blob = new Blob([], {
                            type: 'video/webm'
                        });
                    }

                    if (callback) {
                        callback(_this.blob);
                    }
                });
            });
        }, 10);
    };

    var isPausedRecording = false;

    /**
     * This method pauses the recording process.
     * @method
     * @memberof WhammyRecorder
     * @example
     * recorder.pause();
     */
    this.pause = function() {
        isPausedRecording = true;
    };

    /**
     * This method resumes the recording process.
     * @method
     * @memberof WhammyRecorder
     * @example
     * recorder.resume();
     */
    this.resume = function() {
        isPausedRecording = false;

        if (isStopDrawing) {
            this.record();
        }
    };

    /**
     * This method resets currently recorded data.
     * @method
     * @memberof WhammyRecorder
     * @example
     * recorder.clearRecordedData();
     */
    this.clearRecordedData = function() {
        this.pause();
        whammy.frames = [];
    };

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    var video;
    var lastTime;
    var whammy;
}

if (typeof RecordRTC !== 'undefined') {
    RecordRTC.WhammyRecorder = WhammyRecorder;
}

// https://github.com/antimatter15/whammy/blob/master/LICENSE
// _________
// Whammy.js

// todo: Firefox now supports webp for webm containers!
// their MediaRecorder implementation works well!
// should we provide an option to record via Whammy.js or MediaRecorder API is a better solution?

/**
 * Whammy is a standalone class used by {@link RecordRTC} to bring video recording in Chrome. It is written by {@link https://github.com/antimatter15|antimatter15}
 * @summary A real time javascript webm encoder based on a canvas hack.
 * @license {@link https://github.com/muaz-khan/RecordRTC#license|MIT}
 * @author {@link http://www.MuazKhan.com|Muaz Khan}
 * @typedef Whammy
 * @class
 * @example
 * var recorder = new Whammy().Video(15);
 * recorder.add(context || canvas || dataURL);
 * var output = recorder.compile();
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 */

var Whammy = (function() {
    // a more abstract-ish API

    function WhammyVideo(duration) {
        this.frames = [];
        this.duration = duration || 1;
        this.quality = 0.8;
    }

    /**
     * Pass Canvas or Context or image/webp(string) to {@link Whammy} encoder.
     * @method
     * @memberof Whammy
     * @example
     * recorder = new Whammy().Video(0.8, 100);
     * recorder.add(canvas || context || 'image/webp');
     * @param {string} frame - Canvas || Context || image/webp
     * @param {number} duration - Stick a duration (in milliseconds)
     */
    WhammyVideo.prototype.add = function(frame, duration) {
        if ('canvas' in frame) { //CanvasRenderingContext2D
            frame = frame.canvas;
        }

        if ('toDataURL' in frame) {
            frame = frame.toDataURL('image/webp', this.quality);
        }

        if (!(/^data:image\/webp;base64,/ig).test(frame)) {
            throw 'Input must be formatted properly as a base64 encoded DataURI of type image/webp';
        }
        this.frames.push({
            image: frame,
            duration: duration || this.duration
        });
    };

    function processInWebWorker(_function) {
        var blob = URL.createObjectURL(new Blob([_function.toString(),
            'this.onmessage =  function (e) {' + _function.name + '(e.data);}'
        ], {
            type: 'application/javascript'
        }));

        var worker = new Worker(blob);
        URL.revokeObjectURL(blob);
        return worker;
    }

    function whammyInWebWorker(frames) {
        function ArrayToWebM(frames) {
            var info = checkFrames(frames);
            if (!info) {
                return [];
            }

            var clusterMaxDuration = 30000;

            var EBML = [{
                'id': 0x1a45dfa3, // EBML
                'data': [{
                    'data': 1,
                    'id': 0x4286 // EBMLVersion
                }, {
                    'data': 1,
                    'id': 0x42f7 // EBMLReadVersion
                }, {
                    'data': 4,
                    'id': 0x42f2 // EBMLMaxIDLength
                }, {
                    'data': 8,
                    'id': 0x42f3 // EBMLMaxSizeLength
                }, {
                    'data': 'webm',
                    'id': 0x4282 // DocType
                }, {
                    'data': 2,
                    'id': 0x4287 // DocTypeVersion
                }, {
                    'data': 2,
                    'id': 0x4285 // DocTypeReadVersion
                }]
            }, {
                'id': 0x18538067, // Segment
                'data': [{
                    'id': 0x1549a966, // Info
                    'data': [{
                        'data': 1e6, //do things in millisecs (num of nanosecs for duration scale)
                        'id': 0x2ad7b1 // TimecodeScale
                    }, {
                        'data': 'whammy',
                        'id': 0x4d80 // MuxingApp
                    }, {
                        'data': 'whammy',
                        'id': 0x5741 // WritingApp
                    }, {
                        'data': doubleToString(info.duration),
                        'id': 0x4489 // Duration
                    }]
                }, {
                    'id': 0x1654ae6b, // Tracks
                    'data': [{
                        'id': 0xae, // TrackEntry
                        'data': [{
                            'data': 1,
                            'id': 0xd7 // TrackNumber
                        }, {
                            'data': 1,
                            'id': 0x73c5 // TrackUID
                        }, {
                            'data': 0,
                            'id': 0x9c // FlagLacing
                        }, {
                            'data': 'und',
                            'id': 0x22b59c // Language
                        }, {
                            'data': 'V_VP8',
                            'id': 0x86 // CodecID
                        }, {
                            'data': 'VP8',
                            'id': 0x258688 // CodecName
                        }, {
                            'data': 1,
                            'id': 0x83 // TrackType
                        }, {
                            'id': 0xe0, // Video
                            'data': [{
                                'data': info.width,
                                'id': 0xb0 // PixelWidth
                            }, {
                                'data': info.height,
                                'id': 0xba // PixelHeight
                            }]
                        }]
                    }]
                }]
            }];

            //Generate clusters (max duration)
            var frameNumber = 0;
            var clusterTimecode = 0;
            while (frameNumber < frames.length) {

                var clusterFrames = [];
                var clusterDuration = 0;
                do {
                    clusterFrames.push(frames[frameNumber]);
                    clusterDuration += frames[frameNumber].duration;
                    frameNumber++;
                } while (frameNumber < frames.length && clusterDuration < clusterMaxDuration);

                var clusterCounter = 0;
                var cluster = {
                    'id': 0x1f43b675, // Cluster
                    'data': getClusterData(clusterTimecode, clusterCounter, clusterFrames)
                }; //Add cluster to segment
                EBML[1].data.push(cluster);
                clusterTimecode += clusterDuration;
            }

            return generateEBML(EBML);
        }

        function getClusterData(clusterTimecode, clusterCounter, clusterFrames) {
            return [{
                'data': clusterTimecode,
                'id': 0xe7 // Timecode
            }].concat(clusterFrames.map(function(webp) {
                var block = makeSimpleBlock({
                    discardable: 0,
                    frame: webp.data.slice(4),
                    invisible: 0,
                    keyframe: 1,
                    lacing: 0,
                    trackNum: 1,
                    timecode: Math.round(clusterCounter)
                });
                clusterCounter += webp.duration;
                return {
                    data: block,
                    id: 0xa3
                };
            }));
        }

        // sums the lengths of all the frames and gets the duration

        function checkFrames(frames) {
            if (!frames[0]) {
                postMessage({
                    error: 'Something went wrong. Maybe WebP format is not supported in the current browser.'
                });
                return;
            }

            var width = frames[0].width,
                height = frames[0].height,
                duration = frames[0].duration;

            for (var i = 1; i < frames.length; i++) {
                duration += frames[i].duration;
            }
            return {
                duration: duration,
                width: width,
                height: height
            };
        }

        function numToBuffer(num) {
            var parts = [];
            while (num > 0) {
                parts.push(num & 0xff);
                num = num >> 8;
            }
            return new Uint8Array(parts.reverse());
        }

        function strToBuffer(str) {
            return new Uint8Array(str.split('').map(function(e) {
                return e.charCodeAt(0);
            }));
        }

        function bitsToBuffer(bits) {
            var data = [];
            var pad = (bits.length % 8) ? (new Array(1 + 8 - (bits.length % 8))).join('0') : '';
            bits = pad + bits;
            for (var i = 0; i < bits.length; i += 8) {
                data.push(parseInt(bits.substr(i, 8), 2));
            }
            return new Uint8Array(data);
        }

        function generateEBML(json) {
            var ebml = [];
            for (var i = 0; i < json.length; i++) {
                var data = json[i].data;

                if (typeof data === 'object') {
                    data = generateEBML(data);
                }

                if (typeof data === 'number') {
                    data = bitsToBuffer(data.toString(2));
                }

                if (typeof data === 'string') {
                    data = strToBuffer(data);
                }

                var len = data.size || data.byteLength || data.length;
                var zeroes = Math.ceil(Math.ceil(Math.log(len) / Math.log(2)) / 8);
                var sizeToString = len.toString(2);
                var padded = (new Array((zeroes * 7 + 7 + 1) - sizeToString.length)).join('0') + sizeToString;
                var size = (new Array(zeroes)).join('0') + '1' + padded;

                ebml.push(numToBuffer(json[i].id));
                ebml.push(bitsToBuffer(size));
                ebml.push(data);
            }

            return new Blob(ebml, {
                type: 'video/webm'
            });
        }

        function toBinStrOld(bits) {
            var data = '';
            var pad = (bits.length % 8) ? (new Array(1 + 8 - (bits.length % 8))).join('0') : '';
            bits = pad + bits;
            for (var i = 0; i < bits.length; i += 8) {
                data += String.fromCharCode(parseInt(bits.substr(i, 8), 2));
            }
            return data;
        }

        function makeSimpleBlock(data) {
            var flags = 0;

            if (data.keyframe) {
                flags |= 128;
            }

            if (data.invisible) {
                flags |= 8;
            }

            if (data.lacing) {
                flags |= (data.lacing << 1);
            }

            if (data.discardable) {
                flags |= 1;
            }

            if (data.trackNum > 127) {
                throw 'TrackNumber > 127 not supported';
            }

            var out = [data.trackNum | 0x80, data.timecode >> 8, data.timecode & 0xff, flags].map(function(e) {
                return String.fromCharCode(e);
            }).join('') + data.frame;

            return out;
        }

        function parseWebP(riff) {
            var VP8 = riff.RIFF[0].WEBP[0];

            var frameStart = VP8.indexOf('\x9d\x01\x2a'); // A VP8 keyframe starts with the 0x9d012a header
            for (var i = 0, c = []; i < 4; i++) {
                c[i] = VP8.charCodeAt(frameStart + 3 + i);
            }

            var width, height, tmp;

            //the code below is literally copied verbatim from the bitstream spec
            tmp = (c[1] << 8) | c[0];
            width = tmp & 0x3FFF;
            tmp = (c[3] << 8) | c[2];
            height = tmp & 0x3FFF;
            return {
                width: width,
                height: height,
                data: VP8,
                riff: riff
            };
        }

        function getStrLength(string, offset) {
            return parseInt(string.substr(offset + 4, 4).split('').map(function(i) {
                var unpadded = i.charCodeAt(0).toString(2);
                return (new Array(8 - unpadded.length + 1)).join('0') + unpadded;
            }).join(''), 2);
        }

        function parseRIFF(string) {
            var offset = 0;
            var chunks = {};

            while (offset < string.length) {
                var id = string.substr(offset, 4);
                var len = getStrLength(string, offset);
                var data = string.substr(offset + 4 + 4, len);
                offset += 4 + 4 + len;
                chunks[id] = chunks[id] || [];

                if (id === 'RIFF' || id === 'LIST') {
                    chunks[id].push(parseRIFF(data));
                } else {
                    chunks[id].push(data);
                }
            }
            return chunks;
        }

        function doubleToString(num) {
            return [].slice.call(
                new Uint8Array((new Float64Array([num])).buffer), 0).map(function(e) {
                return String.fromCharCode(e);
            }).reverse().join('');
        }

        var webm = new ArrayToWebM(frames.map(function(frame) {
            var webp = parseWebP(parseRIFF(atob(frame.image.slice(23))));
            webp.duration = frame.duration;
            return webp;
        }));

        postMessage(webm);
    }

    /**
     * Encodes frames in WebM container. It uses WebWorkinvoke to invoke 'ArrayToWebM' method.
     * @param {function} callback - Callback function, that is used to pass recorded blob back to the callee.
     * @method
     * @memberof Whammy
     * @example
     * recorder = new Whammy().Video(0.8, 100);
     * recorder.compile(function(blob) {
     *    // blob.size - blob.type
     * });
     */
    WhammyVideo.prototype.compile = function(callback) {
        var webWorker = processInWebWorker(whammyInWebWorker);

        webWorker.onmessage = function(event) {
            if (event.data.error) {
                console.error(event.data.error);
                return;
            }
            callback(event.data);
        };

        webWorker.postMessage(this.frames);
    };

    return {
        /**
         * A more abstract-ish API.
         * @method
         * @memberof Whammy
         * @example
         * recorder = new Whammy().Video(0.8, 100);
         * @param {?number} speed - 0.8
         * @param {?number} quality - 100
         */
        Video: WhammyVideo
    };
})();

if (typeof RecordRTC !== 'undefined') {
    RecordRTC.Whammy = Whammy;
}

// ______________ (indexed-db)
// DiskStorage.js

/**
 * DiskStorage is a standalone object used by {@link RecordRTC} to store recorded blobs in IndexedDB storage.
 * @summary Writing blobs into IndexedDB.
 * @license {@link https://github.com/muaz-khan/RecordRTC#license|MIT}
 * @author {@link http://www.MuazKhan.com|Muaz Khan}
 * @example
 * DiskStorage.Store({
 *     audioBlob: yourAudioBlob,
 *     videoBlob: yourVideoBlob,
 *     gifBlob  : yourGifBlob
 * });
 * DiskStorage.Fetch(function(dataURL, type) {
 *     if(type === 'audioBlob') { }
 *     if(type === 'videoBlob') { }
 *     if(type === 'gifBlob')   { }
 * });
 * // DiskStorage.dataStoreName = 'recordRTC';
 * // DiskStorage.onError = function(error) { };
 * @property {function} init - This method must be called once to initialize IndexedDB ObjectStore. Though, it is auto-used internally.
 * @property {function} Fetch - This method fetches stored blobs from IndexedDB.
 * @property {function} Store - This method stores blobs in IndexedDB.
 * @property {function} onError - This function is invoked for any known/unknown error.
 * @property {string} dataStoreName - Name of the ObjectStore created in IndexedDB storage.
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 */


var DiskStorage = {
    /**
     * This method must be called once to initialize IndexedDB ObjectStore. Though, it is auto-used internally.
     * @method
     * @memberof DiskStorage
     * @internal
     * @example
     * DiskStorage.init();
     */
    init: function() {
        var self = this;

        if (typeof indexedDB === 'undefined' || typeof indexedDB.open === 'undefined') {
            console.error('IndexedDB API are not available in this browser.');
            return;
        }

        var dbVersion = 1;
        var dbName = this.dbName || location.href.replace(/\/|:|#|%|\.|\[|\]/g, ''),
            db;
        var request = indexedDB.open(dbName, dbVersion);

        function createObjectStore(dataBase) {
            dataBase.createObjectStore(self.dataStoreName);
        }

        function putInDB() {
            var transaction = db.transaction([self.dataStoreName], 'readwrite');

            if (self.videoBlob) {
                transaction.objectStore(self.dataStoreName).put(self.videoBlob, 'videoBlob');
            }

            if (self.gifBlob) {
                transaction.objectStore(self.dataStoreName).put(self.gifBlob, 'gifBlob');
            }

            if (self.audioBlob) {
                transaction.objectStore(self.dataStoreName).put(self.audioBlob, 'audioBlob');
            }

            function getFromStore(portionName) {
                transaction.objectStore(self.dataStoreName).get(portionName).onsuccess = function(event) {
                    if (self.callback) {
                        self.callback(event.target.result, portionName);
                    }
                };
            }

            getFromStore('audioBlob');
            getFromStore('videoBlob');
            getFromStore('gifBlob');
        }

        request.onerror = self.onError;

        request.onsuccess = function() {
            db = request.result;
            db.onerror = self.onError;

            if (db.setVersion) {
                if (db.version !== dbVersion) {
                    var setVersion = db.setVersion(dbVersion);
                    setVersion.onsuccess = function() {
                        createObjectStore(db);
                        putInDB();
                    };
                } else {
                    putInDB();
                }
            } else {
                putInDB();
            }
        };
        request.onupgradeneeded = function(event) {
            createObjectStore(event.target.result);
        };
    },
    /**
     * This method fetches stored blobs from IndexedDB.
     * @method
     * @memberof DiskStorage
     * @internal
     * @example
     * DiskStorage.Fetch(function(dataURL, type) {
     *     if(type === 'audioBlob') { }
     *     if(type === 'videoBlob') { }
     *     if(type === 'gifBlob')   { }
     * });
     */
    Fetch: function(callback) {
        this.callback = callback;
        this.init();

        return this;
    },
    /**
     * This method stores blobs in IndexedDB.
     * @method
     * @memberof DiskStorage
     * @internal
     * @example
     * DiskStorage.Store({
     *     audioBlob: yourAudioBlob,
     *     videoBlob: yourVideoBlob,
     *     gifBlob  : yourGifBlob
     * });
     */
    Store: function(config) {
        this.audioBlob = config.audioBlob;
        this.videoBlob = config.videoBlob;
        this.gifBlob = config.gifBlob;

        this.init();

        return this;
    },
    /**
     * This function is invoked for any known/unknown error.
     * @method
     * @memberof DiskStorage
     * @internal
     * @example
     * DiskStorage.onError = function(error){
     *     alerot( JSON.stringify(error) );
     * };
     */
    onError: function(error) {
        console.error(JSON.stringify(error, null, '\t'));
    },

    /**
     * @property {string} dataStoreName - Name of the ObjectStore created in IndexedDB storage.
     * @memberof DiskStorage
     * @internal
     * @example
     * DiskStorage.dataStoreName = 'recordRTC';
     */
    dataStoreName: 'recordRTC',
    dbName: null
};

if (typeof RecordRTC !== 'undefined') {
    RecordRTC.DiskStorage = DiskStorage;
}

// ______________
// GifRecorder.js

/**
 * GifRecorder is standalone calss used by {@link RecordRTC} to record video or canvas into animated gif.
 * @license {@link https://github.com/muaz-khan/RecordRTC#license|MIT}
 * @author {@link http://www.MuazKhan.com|Muaz Khan}
 * @typedef GifRecorder
 * @class
 * @example
 * var recorder = new GifRecorder(mediaStream || canvas || context, { width: 1280, height: 720, frameRate: 200, quality: 10 });
 * recorder.record();
 * recorder.stop(function(blob) {
 *     img.src = URL.createObjectURL(blob);
 * });
 * @see {@link https://github.com/muaz-khan/RecordRTC|RecordRTC Source Code}
 * @param {MediaStream} mediaStream - MediaStream object or HTMLCanvasElement or CanvasRenderingContext2D.
 * @param {object} config - {disableLogs:true, initCallback: function, width: 320, height: 240, frameRate: 200, quality: 10}
 */

function GifRecorder(mediaStream, config) {
    if (typeof GIFEncoder === 'undefined') {
        throw 'Please link: https://cdn.webrtc-experiment.com/gif-recorder.js';
    }

    config = config || {};

    var isHTMLObject = mediaStream instanceof CanvasRenderingContext2D || mediaStream instanceof HTMLCanvasElement;

    /**
     * This method records MediaStream.
     * @method
     * @memberof GifRecorder
     * @example
     * recorder.record();
     */
    this.record = function() {
        if (!isHTMLObject) {
            if (!config.width) {
                config.width = video.offsetWidth || 320;
            }

            if (!this.height) {
                config.height = video.offsetHeight || 240;
            }

            if (!config.video) {
                config.video = {
                    width: config.width,
                    height: config.height
                };
            }

            if (!config.canvas) {
                config.canvas = {
                    width: config.width,
                    height: config.height
                };
            }

            canvas.width = config.canvas.width;
            canvas.height = config.canvas.height;

            video.width = config.video.width;
            video.height = config.video.height;
        }

        // external library to record as GIF images
        gifEncoder = new GIFEncoder();

        // void setRepeat(int iter) 
        // Sets the number of times the set of GIF frames should be played. 
        // Default is 1; 0 means play indefinitely.
        gifEncoder.setRepeat(0);

        // void setFrameRate(Number fps) 
        // Sets frame rate in frames per second. 
        // Equivalent to setDelay(1000/fps).
        // Using "setDelay" instead of "setFrameRate"
        gifEncoder.setDelay(config.frameRate || 200);

        // void setQuality(int quality) 
        // Sets quality of color quantization (conversion of images to the 
        // maximum 256 colors allowed by the GIF specification). 
        // Lower values (minimum = 1) produce better colors, 
        // but slow processing significantly. 10 is the default, 
        // and produces good color mapping at reasonable speeds. 
        // Values greater than 20 do not yield significant improvements in speed.
        gifEncoder.setQuality(config.quality || 10);

        // Boolean start() 
        // This writes the GIF Header and returns false if it fails.
        gifEncoder.start();

        startTime = Date.now();

        var self = this;

        function drawVideoFrame(time) {
            if (isPausedRecording) {
                return setTimeout(function() {
                    drawVideoFrame(time);
                }, 100);
            }

            lastAnimationFrame = requestAnimationFrame(drawVideoFrame);

            if (typeof lastFrameTime === undefined) {
                lastFrameTime = time;
            }

            // ~10 fps
            if (time - lastFrameTime < 90) {
                return;
            }

            if (!isHTMLObject && video.paused) {
                // via: https://github.com/muaz-khan/WebRTC-Experiment/pull/316
                // Tweak for Android Chrome
                video.play();
            }

            if (!isHTMLObject) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
            }

            if (config.onGifPreview) {
                config.onGifPreview(canvas.toDataURL('image/png'));
            }

            gifEncoder.addFrame(context);
            lastFrameTime = time;
        }

        lastAnimationFrame = requestAnimationFrame(drawVideoFrame);

        if (config.initCallback) {
            config.initCallback();
        }
    };

    /**
     * This method stops recording MediaStream.
     * @param {function} callback - Callback function, that is used to pass recorded blob back to the callee.
     * @method
     * @memberof GifRecorder
     * @example
     * recorder.stop(function(blob) {
     *     img.src = URL.createObjectURL(blob);
     * });
     */
    this.stop = function() {
        if (lastAnimationFrame) {
            cancelAnimationFrame(lastAnimationFrame);
        }

        endTime = Date.now();

        /**
         * @property {Blob} blob - The recorded blob object.
         * @memberof GifRecorder
         * @example
         * recorder.stop(function(){
         *     var blob = recorder.blob;
         * });
         */
        this.blob = new Blob([new Uint8Array(gifEncoder.stream().bin)], {
            type: 'image/gif'
        });

        // bug: find a way to clear old recorded blobs
        gifEncoder.stream().bin = [];
    };

    var isPausedRecording = false;

    /**
     * This method pauses the recording process.
     * @method
     * @memberof GifRecorder
     * @example
     * recorder.pause();
     */
    this.pause = function() {
        isPausedRecording = true;
    };

    /**
     * This method resumes the recording process.
     * @method
     * @memberof GifRecorder
     * @example
     * recorder.resume();
     */
    this.resume = function() {
        isPausedRecording = false;
    };

    /**
     * This method resets currently recorded data.
     * @method
     * @memberof GifRecorder
     * @example
     * recorder.clearRecordedData();
     */
    this.clearRecordedData = function() {
        if (!gifEncoder) {
            return;
        }

        this.pause();

        gifEncoder.stream().bin = [];
    };

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');

    if (isHTMLObject) {
        if (mediaStream instanceof CanvasRenderingContext2D) {
            context = mediaStream;
            canvas = context.canvas;
        } else if (mediaStream instanceof HTMLCanvasElement) {
            context = mediaStream.getContext('2d');
            canvas = mediaStream;
        }
    }

    if (!isHTMLObject) {
        var video = document.createElement('video');
        video.muted = true;
        video.autoplay = true;

        if (typeof video.srcObject !== 'undefined') {
            video.srcObject = mediaStream;
        } else {
            video.src = URL.createObjectURL(mediaStream);
        }

        video.play();
    }

    var lastAnimationFrame = null;
    var startTime, endTime, lastFrameTime;

    var gifEncoder;
}

if (typeof RecordRTC !== 'undefined') {
    RecordRTC.GifRecorder = GifRecorder;
}
// Last time updated at July 06, 2014, 08:32:23

// Muaz Khan     - https://github.com/muaz-khan
// MIT License   - https://www.webrtc-experiment.com/licence/
// Documentation - https://github.com/muaz-khan/WebRTC-Experiment/tree/master/part-of-screen-sharing

// Note: All libraries listed in this file are "external libraries" 
// ----  and has their own copyrights. Taken from "html2canvas" project.

"use strict";function h2clog(e){if(_html2canvas.logging&&window.console&&window.console.log){window.console.log(e)}}function backgroundBoundsFactory(e,t,n,r,i,s){var o=_html2canvas.Util.getCSS(t,e,i),u,a,f,l;if(o.length===1){l=o[0];o=[];o[0]=l;o[1]=l}if(o[0].toString().indexOf("%")!==-1){f=parseFloat(o[0])/100;a=n.width*f;if(e!=="backgroundSize"){a-=(s||r).width*f}}else{if(e==="backgroundSize"){if(o[0]==="auto"){a=r.width}else{if(o[0].match(/contain|cover/)){var c=_html2canvas.Util.resizeBounds(r.width,r.height,n.width,n.height,o[0]);a=c.width;u=c.height}else{a=parseInt(o[0],10)}}}else{a=parseInt(o[0],10)}}if(o[1]==="auto"){u=a/r.width*r.height}else if(o[1].toString().indexOf("%")!==-1){f=parseFloat(o[1])/100;u=n.height*f;if(e!=="backgroundSize"){u-=(s||r).height*f}}else{u=parseInt(o[1],10)}return[a,u]}function h2czContext(e){return{zindex:e,children:[]}}function h2cRenderContext(e,t){var n=[];return{storage:n,width:e,height:t,clip:function(){n.push({type:"function",name:"clip",arguments:arguments})},translate:function(){n.push({type:"function",name:"translate",arguments:arguments})},fill:function(){n.push({type:"function",name:"fill",arguments:arguments})},save:function(){n.push({type:"function",name:"save",arguments:arguments})},restore:function(){n.push({type:"function",name:"restore",arguments:arguments})},fillRect:function(){n.push({type:"function",name:"fillRect",arguments:arguments})},createPattern:function(){n.push({type:"function",name:"createPattern",arguments:arguments})},drawShape:function(){var e=[];n.push({type:"function",name:"drawShape",arguments:e});return{moveTo:function(){e.push({name:"moveTo",arguments:arguments})},lineTo:function(){e.push({name:"lineTo",arguments:arguments})},arcTo:function(){e.push({name:"arcTo",arguments:arguments})},bezierCurveTo:function(){e.push({name:"bezierCurveTo",arguments:arguments})},quadraticCurveTo:function(){e.push({name:"quadraticCurveTo",arguments:arguments})}}},drawImage:function(){n.push({type:"function",name:"drawImage",arguments:arguments})},fillText:function(){n.push({type:"function",name:"fillText",arguments:arguments})},setVariable:function(e,t){n.push({type:"variable",name:e,arguments:t})}}}function getMouseXY(e){if(IE){coordX=event.clientX+document.body.scrollLeft;coordY=event.clientY+document.body.scrollTop}else{coordX=e.pageX;coordY=e.pageY}if(coordX<0){coordX=0}if(coordY<0){coordY=0}return true}var _html2canvas={},previousElement,computedCSS,html2canvas;_html2canvas.Util={};_html2canvas.Util.trimText=function(e){return function(t){if(e){return e.apply(t)}else{return((t||"")+"").replace(/^\s+|\s+$/g,"")}}}(String.prototype.trim);_html2canvas.Util.parseBackgroundImage=function(e){var t=" \r\n	",n,r,i,s,o,u=[],a,f=0,l=0,c,h;var p=function(){if(n){if(r.substr(0,1)==='"'){r=r.substr(1,r.length-2)}if(r){h.push(r)}if(n.substr(0,1)==="-"&&(s=n.indexOf("-",1)+1)>0){i=n.substr(0,s);n=n.substr(s)}u.push({prefix:i,method:n.toLowerCase(),value:o,args:h})}h=[];n=i=r=o=""};p();for(var d=0,v=e.length;d<v;d++){a=e[d];if(f===0&&t.indexOf(a)>-1){continue}switch(a){case'"':if(!c){c=a}else if(c===a){c=null}break;case"(":if(c){break}else if(f===0){f=1;o+=a;continue}else{l++}break;case")":if(c){break}else if(f===1){if(l===0){f=0;o+=a;p();continue}else{l--}}break;case",":if(c){break}else if(f===0){p();continue}else if(f===1){if(l===0&&!n.match(/^url$/i)){h.push(r);r="";o+=a;continue}}break}o+=a;if(f===0){n+=a}else{r+=a}}p();return u};_html2canvas.Util.Bounds=function(t){var n,r={};if(t.getBoundingClientRect){n=t.getBoundingClientRect();r.top=n.top;r.bottom=n.bottom||n.top+n.height;r.left=n.left;r.width=n.width||n.right-n.left;r.height=n.height||n.bottom-n.top;return r}};_html2canvas.Util.getCSS=function(e,t,n){function s(t,n){var r=e.runtimeStyle&&e.runtimeStyle[t],i,s=e.style;if(!/^-?[0-9]+\.?[0-9]*(?:px)?$/i.test(n)&&/^-?\d/.test(n)){i=s.left;if(r){e.runtimeStyle.left=e.currentStyle.left}s.left=t==="fontSize"?"1em":n||0;n=s.pixelLeft+"px";s.left=i;if(r){e.runtimeStyle.left=r}}if(!/^(thin|medium|thick)$/i.test(n)){return Math.round(parseFloat(n))+"px"}return n}var r,i=t.match(/^background(Size|Position)$/);if(previousElement!==e){computedCSS=document.defaultView.getComputedStyle(e,null)}r=computedCSS[t];if(i){r=(r||"").split(",");r=r[n||0]||r[0]||"auto";r=_html2canvas.Util.trimText(r).split(" ");if(t==="backgroundSize"&&(!r[0]||r[0].match(/cover|contain|auto/))){}else{r[0]=r[0].indexOf("%")===-1?s(t+"X",r[0]):r[0];if(r[1]===undefined){if(t==="backgroundSize"){r[1]="auto";return r}else{r[1]=r[0]}}r[1]=r[1].indexOf("%")===-1?s(t+"Y",r[1]):r[1]}}else if(/border(Top|Bottom)(Left|Right)Radius/.test(t)){var o=r.split(" ");if(o.length<=1){o[1]=o[0]}o[0]=parseInt(o[0],10);o[1]=parseInt(o[1],10);r=o}return r};_html2canvas.Util.resizeBounds=function(e,t,n,r,i){var s=n/r,o=e/t,u,a;if(!i||i==="auto"){u=n;a=r}else{if(s<o^i==="contain"){a=r;u=r*o}else{u=n;a=n/o}}return{width:u,height:a}};_html2canvas.Util.BackgroundPosition=function(e,t,n,r,i){var s=backgroundBoundsFactory("backgroundPosition",e,t,n,r,i);return{left:s[0],top:s[1]}};_html2canvas.Util.BackgroundSize=function(e,t,n,r){var i=backgroundBoundsFactory("backgroundSize",e,t,n,r);return{width:i[0],height:i[1]}};_html2canvas.Util.Extend=function(e,t){for(var n in e){if(e.hasOwnProperty(n)){t[n]=e[n]}}return t};_html2canvas.Util.Children=function(e){var t;try{t=e.nodeName&&e.nodeName.toUpperCase()==="IFRAME"?e.contentDocument||e.contentWindow.document:function(e){var t=[];if(e!==null){(function(e,t){var n=e.length,r=0;if(typeof t.length==="number"){for(var i=t.length;r<i;r++){e[n++]=t[r]}}else{while(t[r]!==undefined){e[n++]=t[r++]}}e.length=n;return e})(t,e)}return t}(e.childNodes)}catch(n){h2clog("html2canvas.Util.Children failed with exception: "+n.message);t=[]}return t};_html2canvas.Util.Font=function(){var e={};return function(t,n,r){if(e[t+"-"+n]!==undefined){return e[t+"-"+n]}var i=r.createElement("div"),s=r.createElement("img"),o=r.createElement("span"),u="Hidden Text",a,f,l;i.style.visibility="hidden";i.style.fontFamily=t;i.style.fontSize=n;i.style.margin=0;i.style.padding=0;r.body.appendChild(i);s.src="data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACwAAAAAAQABAAACAkQBADs=";s.width=1;s.height=1;s.style.margin=0;s.style.padding=0;s.style.verticalAlign="baseline";o.style.fontFamily=t;o.style.fontSize=n;o.style.margin=0;o.style.padding=0;o.appendChild(r.createTextNode(u));i.appendChild(o);i.appendChild(s);a=s.offsetTop-o.offsetTop+1;i.removeChild(o);i.appendChild(r.createTextNode(u));i.style.lineHeight="normal";s.style.verticalAlign="super";f=s.offsetTop-i.offsetTop+1;l={baseline:a,lineWidth:1,middle:f};e[t+"-"+n]=l;r.body.removeChild(i);return l}}();(function(){_html2canvas.Generate={};var e=[/^(-webkit-linear-gradient)\(([a-z\s]+)([\w\d\.\s,%\(\)]+)\)$/,/^(-o-linear-gradient)\(([a-z\s]+)([\w\d\.\s,%\(\)]+)\)$/,/^(-webkit-gradient)\((linear|radial),\s((?:\d{1,3}%?)\s(?:\d{1,3}%?),\s(?:\d{1,3}%?)\s(?:\d{1,3}%?))([\w\d\.\s,%\(\)\-]+)\)$/,/^(-moz-linear-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?))([\w\d\.\s,%\(\)]+)\)$/,/^(-webkit-radial-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?)),\s(\w+)\s([a-z\-]+)([\w\d\.\s,%\(\)]+)\)$/,/^(-moz-radial-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?)),\s(\w+)\s?([a-z\-]*)([\w\d\.\s,%\(\)]+)\)$/,/^(-o-radial-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?)),\s(\w+)\s([a-z\-]+)([\w\d\.\s,%\(\)]+)\)$/];_html2canvas.Generate.parseGradient=function(t,n){var r,i,s=e.length,o,u,a,f,l,c,h,p,d,v;for(i=0;i<s;i+=1){o=t.match(e[i]);if(o){break}}if(o){switch(o[1]){case"-webkit-linear-gradient":case"-o-linear-gradient":r={type:"linear",x0:null,y0:null,x1:null,y1:null,colorStops:[]};a=o[2].match(/\w+/g);if(a){f=a.length;for(i=0;i<f;i+=1){switch(a[i]){case"top":r.y0=0;r.y1=n.height;break;case"right":r.x0=n.width;r.x1=0;break;case"bottom":r.y0=n.height;r.y1=0;break;case"left":r.x0=0;r.x1=n.width;break}}}if(r.x0===null&&r.x1===null){r.x0=r.x1=n.width/2}if(r.y0===null&&r.y1===null){r.y0=r.y1=n.height/2}a=o[3].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)(?:\s\d{1,3}(?:%|px))?)+/g);if(a){f=a.length;l=1/Math.max(f-1,1);for(i=0;i<f;i+=1){c=a[i].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\s*(\d{1,3})?(%|px)?/);if(c[2]){u=parseFloat(c[2]);if(c[3]==="%"){u/=100}else{u/=n.width}}else{u=i*l}r.colorStops.push({color:c[1],stop:u})}}break;case"-webkit-gradient":r={type:o[2]==="radial"?"circle":o[2],x0:0,y0:0,x1:0,y1:0,colorStops:[]};a=o[3].match(/(\d{1,3})%?\s(\d{1,3})%?,\s(\d{1,3})%?\s(\d{1,3})%?/);if(a){r.x0=a[1]*n.width/100;r.y0=a[2]*n.height/100;r.x1=a[3]*n.width/100;r.y1=a[4]*n.height/100}a=o[4].match(/((?:from|to|color-stop)\((?:[0-9\.]+,\s)?(?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)\))+/g);if(a){f=a.length;for(i=0;i<f;i+=1){c=a[i].match(/(from|to|color-stop)\(([0-9\.]+)?(?:,\s)?((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\)/);u=parseFloat(c[2]);if(c[1]==="from"){u=0}if(c[1]==="to"){u=1}r.colorStops.push({color:c[3],stop:u})}}break;case"-moz-linear-gradient":r={type:"linear",x0:0,y0:0,x1:0,y1:0,colorStops:[]};a=o[2].match(/(\d{1,3})%?\s(\d{1,3})%?/);if(a){r.x0=a[1]*n.width/100;r.y0=a[2]*n.height/100;r.x1=n.width-r.x0;r.y1=n.height-r.y0}a=o[3].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)(?:\s\d{1,3}%)?)+/g);if(a){f=a.length;l=1/Math.max(f-1,1);for(i=0;i<f;i+=1){c=a[i].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\s*(\d{1,3})?(%)?/);if(c[2]){u=parseFloat(c[2]);if(c[3]){u/=100}}else{u=i*l}r.colorStops.push({color:c[1],stop:u})}}break;case"-webkit-radial-gradient":case"-moz-radial-gradient":case"-o-radial-gradient":r={type:"circle",x0:0,y0:0,x1:n.width,y1:n.height,cx:0,cy:0,rx:0,ry:0,colorStops:[]};a=o[2].match(/(\d{1,3})%?\s(\d{1,3})%?/);if(a){r.cx=a[1]*n.width/100;r.cy=a[2]*n.height/100}a=o[3].match(/\w+/);c=o[4].match(/[a-z\-]*/);if(a&&c){switch(c[0]){case"farthest-corner":case"cover":case"":h=Math.sqrt(Math.pow(r.cx,2)+Math.pow(r.cy,2));p=Math.sqrt(Math.pow(r.cx,2)+Math.pow(r.y1-r.cy,2));d=Math.sqrt(Math.pow(r.x1-r.cx,2)+Math.pow(r.y1-r.cy,2));v=Math.sqrt(Math.pow(r.x1-r.cx,2)+Math.pow(r.cy,2));r.rx=r.ry=Math.max(h,p,d,v);break;case"closest-corner":h=Math.sqrt(Math.pow(r.cx,2)+Math.pow(r.cy,2));p=Math.sqrt(Math.pow(r.cx,2)+Math.pow(r.y1-r.cy,2));d=Math.sqrt(Math.pow(r.x1-r.cx,2)+Math.pow(r.y1-r.cy,2));v=Math.sqrt(Math.pow(r.x1-r.cx,2)+Math.pow(r.cy,2));r.rx=r.ry=Math.min(h,p,d,v);break;case"farthest-side":if(a[0]==="circle"){r.rx=r.ry=Math.max(r.cx,r.cy,r.x1-r.cx,r.y1-r.cy)}else{r.type=a[0];r.rx=Math.max(r.cx,r.x1-r.cx);r.ry=Math.max(r.cy,r.y1-r.cy)}break;case"closest-side":case"contain":if(a[0]==="circle"){r.rx=r.ry=Math.min(r.cx,r.cy,r.x1-r.cx,r.y1-r.cy)}else{r.type=a[0];r.rx=Math.min(r.cx,r.x1-r.cx);r.ry=Math.min(r.cy,r.y1-r.cy)}break}}a=o[5].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)(?:\s\d{1,3}(?:%|px))?)+/g);if(a){f=a.length;l=1/Math.max(f-1,1);for(i=0;i<f;i+=1){c=a[i].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\s*(\d{1,3})?(%|px)?/);if(c[2]){u=parseFloat(c[2]);if(c[3]==="%"){u/=100}else{u/=n.width}}else{u=i*l}r.colorStops.push({color:c[1],stop:u})}}break}}return r};_html2canvas.Generate.Gradient=function(e,t){if(t.width===0||t.height===0){return}var n=document.createElement("canvas"),r=n.getContext("2d"),i,s,o,u;n.width=t.width;n.height=t.height;i=_html2canvas.Generate.parseGradient(e,t);if(i){if(i.type==="linear"){s=r.createLinearGradient(i.x0,i.y0,i.x1,i.y1);for(o=0,u=i.colorStops.length;o<u;o+=1){try{s.addColorStop(i.colorStops[o].stop,i.colorStops[o].color)}catch(a){h2clog(["failed to add color stop: ",a,"; tried to add: ",i.colorStops[o],"; stop: ",o,"; in: ",e])}}r.fillStyle=s;r.fillRect(0,0,t.width,t.height)}else if(i.type==="circle"){s=r.createRadialGradient(i.cx,i.cy,0,i.cx,i.cy,i.rx);for(o=0,u=i.colorStops.length;o<u;o+=1){try{s.addColorStop(i.colorStops[o].stop,i.colorStops[o].color)}catch(a){h2clog(["failed to add color stop: ",a,"; tried to add: ",i.colorStops[o],"; stop: ",o,"; in: ",e])}}r.fillStyle=s;r.fillRect(0,0,t.width,t.height)}else if(i.type==="ellipse"){var f=document.createElement("canvas"),l=f.getContext("2d"),c=Math.max(i.rx,i.ry),h=c*2,p;f.width=f.height=h;s=l.createRadialGradient(i.rx,i.ry,0,i.rx,i.ry,c);for(o=0,u=i.colorStops.length;o<u;o+=1){try{s.addColorStop(i.colorStops[o].stop,i.colorStops[o].color)}catch(a){h2clog(["failed to add color stop: ",a,"; tried to add: ",i.colorStops[o],"; stop: ",o,"; in: ",e])}}l.fillStyle=s;l.fillRect(0,0,h,h);r.fillStyle=i.colorStops[o-1].color;r.fillRect(0,0,n.width,n.height);r.drawImage(f,i.cx-i.rx,i.cy-i.ry,2*i.rx,2*i.ry)}}return n};_html2canvas.Generate.ListAlpha=function(e){var t="",n;do{n=e%26;t=String.fromCharCode(n+64)+t;e=e/26}while(e*26>26);return t};_html2canvas.Generate.ListRoman=function(e){var t=["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"],n=[1e3,900,500,400,100,90,50,40,10,9,5,4,1],r="",i,s=t.length;if(e<=0||e>=4e3){return e}for(i=0;i<s;i+=1){while(e>=n[i]){e-=n[i];r+=t[i]}}return r}})();_html2canvas.Parse=function(e,t){function c(){return Math.max(Math.max(i.body.scrollWidth,i.documentElement.scrollWidth),Math.max(i.body.offsetWidth,i.documentElement.offsetWidth),Math.max(i.body.clientWidth,i.documentElement.clientWidth))}function h(){return Math.max(Math.max(i.body.scrollHeight,i.documentElement.scrollHeight),Math.max(i.body.offsetHeight,i.documentElement.offsetHeight),Math.max(i.body.clientHeight,i.documentElement.clientHeight))}function p(e,t){var n=parseInt(a(e,t),10);return isNaN(n)?0:n}function d(e,t,n,i,s,o){if(o!=="transparent"){e.setVariable("fillStyle",o);e.fillRect(t,n,i,s);r+=1}}function v(e,t){switch(t){case"lowercase":return e.toLowerCase();case"capitalize":return e.replace(/(^|\s|:|-|\(|\))([a-z])/g,function(e,t,n){if(e.length>0){return t+n.toUpperCase()}});case"uppercase":return e.toUpperCase();default:return e}}function m(e){return/^(normal|none|0px)$/.test(e)}function g(e,t,n,i){if(e!==null&&_html2canvas.Util.trimText(e).length>0){i.fillText(e,t,n);r+=1}}function y(e,t,n,r){var s=false,o=a(t,"fontWeight"),u=a(t,"fontFamily"),f=a(t,"fontSize");switch(parseInt(o,10)){case 401:o="bold";break;case 400:o="normal";break}e.setVariable("fillStyle",r);e.setVariable("font",[a(t,"fontStyle"),a(t,"fontVariant"),o,f,u].join(" "));e.setVariable("textAlign",s?"right":"left");if(n!=="none"){return _html2canvas.Util.Font(u,f,i)}}function b(e,t,n,r,i){switch(t){case"underline":d(e,n.left,Math.round(n.top+r.baseline+r.lineWidth),n.width,1,i);break;case"overline":d(e,n.left,Math.round(n.top),n.width,1,i);break;case"line-through":d(e,n.left,Math.ceil(n.top+r.middle+r.lineWidth),n.width,1,i);break}}function w(e,t,n,r){var i;if(s.rangeBounds){if(n!=="none"||_html2canvas.Util.trimText(t).length!==0){i=E(t,e.node,e.textOffset)}e.textOffset+=t.length}else if(e.node&&typeof e.node.nodeValue==="string"){var o=r?e.node.splitText(t.length):null;i=S(e.node);e.node=o}return i}function E(e,t,n){var r=i.createRange();r.setStart(t,n);r.setEnd(t,n+e.length);return r.getBoundingClientRect()}function S(e){var t=e.parentNode,n=i.createElement("wrapper"),r=e.cloneNode(true);n.appendChild(e.cloneNode(true));t.replaceChild(n,e);var s=_html2canvas.Util.Bounds(n);t.replaceChild(r,n);return s}function x(e,n,r){var i=r.ctx,s=a(e,"color"),o=a(e,"textDecoration"),u=a(e,"textAlign"),f,l,c={node:n,textOffset:0};if(_html2canvas.Util.trimText(n.nodeValue).length>0){n.nodeValue=v(n.nodeValue,a(e,"textTransform"));u=u.replace(["-webkit-auto"],["auto"]);l=!t.letterRendering&&/^(left|right|justify|auto)$/.test(u)&&m(a(e,"letterSpacing"))?n.nodeValue.split(/(\b| )/):n.nodeValue.split("");f=y(i,e,o,s);if(t.chinese){l.forEach(function(e,t){if(/.*[\u4E00-\u9FA5].*$/.test(e)){e=e.split("");e.unshift(t,1);l.splice.apply(l,e)}})}l.forEach(function(e,t){var n=w(c,e,o,t<l.length-1);if(n){g(e,n.left,n.bottom,i);b(i,o,n,f,s)}})}}function T(e,t){var n=i.createElement("boundelement"),r,s;n.style.display="inline";r=e.style.listStyleType;e.style.listStyleType="none";n.appendChild(i.createTextNode(t));e.insertBefore(n,e.firstChild);s=_html2canvas.Util.Bounds(n);e.removeChild(n);e.style.listStyleType=r;return s}function N(e){var t=-1,n=1,r=e.parentNode.childNodes;if(e.parentNode){while(r[++t]!==e){if(r[t].nodeType===1){n++}}return n}else{return-1}}function C(e,t){var n=N(e),r;switch(t){case"decimal":r=n;break;case"decimal-leading-zero":r=n.toString().length===1?n="0"+n.toString():n.toString();break;case"upper-roman":r=_html2canvas.Generate.ListRoman(n);break;case"lower-roman":r=_html2canvas.Generate.ListRoman(n).toLowerCase();break;case"lower-alpha":r=_html2canvas.Generate.ListAlpha(n).toLowerCase();break;case"upper-alpha":r=_html2canvas.Generate.ListAlpha(n);break}r+=". ";return r}function k(e,t,n){var r,i,s=t.ctx,o=a(e,"listStyleType"),u;if(/^(decimal|decimal-leading-zero|upper-alpha|upper-latin|upper-roman|lower-alpha|lower-greek|lower-latin|lower-roman)$/i.test(o)){i=C(e,o);u=T(e,i);y(s,e,"none",a(e,"color"));if(a(e,"listStylePosition")==="inside"){s.setVariable("textAlign","left");r=n.left}else{return}g(i,r,u.bottom,s)}}function L(t){var n=e[t];if(n&&n.succeeded===true){return n.img}else{return false}}function A(e,t){var n=Math.max(e.left,t.left),r=Math.max(e.top,t.top),i=Math.min(e.left+e.width,t.left+t.width),s=Math.min(e.top+e.height,t.top+t.height);return{left:n,top:r,width:i-n,height:s-r}}function O(e,t){var n;if(!t){n=h2czContext(0);return n}if(e!=="auto"){n=h2czContext(e);t.children.push(n);return n}return t}function M(e,t,n,r,i){var s=p(t,"paddingLeft"),o=p(t,"paddingTop"),u=p(t,"paddingRight"),a=p(t,"paddingBottom");W(e,n,0,0,n.width,n.height,r.left+s+i[3].width,r.top+o+i[0].width,r.width-(i[1].width+i[3].width+s+u),r.height-(i[0].width+i[2].width+o+a))}function _(e){return["Top","Right","Bottom","Left"].map(function(t){return{width:p(e,"border"+t+"Width"),color:a(e,"border"+t+"Color")}})}function D(e){return["TopLeft","TopRight","BottomRight","BottomLeft"].map(function(t){return a(e,"border"+t+"Radius")})}function H(e,t,n,r){var i=function(e,t,n){return{x:e.x+(t.x-e.x)*n,y:e.y+(t.y-e.y)*n}};return{start:e,startControl:t,endControl:n,end:r,subdivide:function(s){var o=i(e,t,s),u=i(t,n,s),a=i(n,r,s),f=i(o,u,s),l=i(u,a,s),c=i(f,l,s);return[H(e,o,f,c),H(c,l,a,r)]},curveTo:function(e){e.push(["bezierCurve",t.x,t.y,n.x,n.y,r.x,r.y])},curveToReversed:function(r){r.push(["bezierCurve",n.x,n.y,t.x,t.y,e.x,e.y])}}}function B(e,t,n,r,i,s,o){if(t[0]>0||t[1]>0){e.push(["line",r[0].start.x,r[0].start.y]);r[0].curveTo(e);r[1].curveTo(e)}else{e.push(["line",s,o])}if(n[0]>0||n[1]>0){e.push(["line",i[0].start.x,i[0].start.y])}}function j(e,t,n,r,i,s,o){var u=[];if(t[0]>0||t[1]>0){u.push(["line",r[1].start.x,r[1].start.y]);r[1].curveTo(u)}else{u.push(["line",e.c1[0],e.c1[1]])}if(n[0]>0||n[1]>0){u.push(["line",s[0].start.x,s[0].start.y]);s[0].curveTo(u);u.push(["line",o[0].end.x,o[0].end.y]);o[0].curveToReversed(u)}else{u.push(["line",e.c2[0],e.c2[1]]);u.push(["line",e.c3[0],e.c3[1]])}if(t[0]>0||t[1]>0){u.push(["line",i[1].end.x,i[1].end.y]);i[1].curveToReversed(u)}else{u.push(["line",e.c4[0],e.c4[1]])}return u}function F(e,t,n){var r=e.left,i=e.top,s=e.width,o=e.height,u=t[0][0],a=t[0][1],f=t[1][0],l=t[1][1],c=t[2][0],h=t[2][1],p=t[3][0],d=t[3][1],v=s-f,m=o-c,g=s-h,y=o-d;return{topLeftOuter:P(r,i,u,a).topLeft.subdivide(.5),topLeftInner:P(r+n[3].width,i+n[0].width,Math.max(0,u-n[3].width),Math.max(0,a-n[0].width)).topLeft.subdivide(.5),topRightOuter:P(r+v,i,f,l).topRight.subdivide(.5),topRightInner:P(r+Math.min(v,s+n[3].width),i+n[0].width,v>s+n[3].width?0:f-n[3].width,l-n[0].width).topRight.subdivide(.5),bottomRightOuter:P(r+g,i+m,h,c).bottomRight.subdivide(.5),bottomRightInner:P(r+Math.min(g,s+n[3].width),i+Math.min(m,o+n[0].width),Math.max(0,h-n[1].width),Math.max(0,c-n[2].width)).bottomRight.subdivide(.5),bottomLeftOuter:P(r,i+y,p,d).bottomLeft.subdivide(.5),bottomLeftInner:P(r+n[3].width,i+y,Math.max(0,p-n[3].width),Math.max(0,d-n[2].width)).bottomLeft.subdivide(.5)}}function I(e,t,n,r,i){var s=a(e,"backgroundClip"),o=[];switch(s){case"content-box":case"padding-box":B(o,r[0],r[1],t.topLeftInner,t.topRightInner,i.left+n[3].width,i.top+n[0].width);B(o,r[1],r[2],t.topRightInner,t.bottomRightInner,i.left+i.width-n[1].width,i.top+n[0].width);B(o,r[2],r[3],t.bottomRightInner,t.bottomLeftInner,i.left+i.width-n[1].width,i.top+i.height-n[2].width);B(o,r[3],r[0],t.bottomLeftInner,t.topLeftInner,i.left+n[3].width,i.top+i.height-n[2].width);break;default:B(o,r[0],r[1],t.topLeftOuter,t.topRightOuter,i.left,i.top);B(o,r[1],r[2],t.topRightOuter,t.bottomRightOuter,i.left+i.width,i.top);B(o,r[2],r[3],t.bottomRightOuter,t.bottomLeftOuter,i.left+i.width,i.top+i.height);B(o,r[3],r[0],t.bottomLeftOuter,t.topLeftOuter,i.left,i.top+i.height);break}return o}function q(e,t,n){var r=t.left,i=t.top,s=t.width,o=t.height,u,a,f,l,c,h,p=D(e),d=F(t,p,n),v={clip:I(e,d,n,p,t),borders:[]};for(u=0;u<4;u++){if(n[u].width>0){a=r;f=i;l=s;c=o-n[2].width;switch(u){case 0:c=n[0].width;h=j({c1:[a,f],c2:[a+l,f],c3:[a+l-n[1].width,f+c],c4:[a+n[3].width,f+c]},p[0],p[1],d.topLeftOuter,d.topLeftInner,d.topRightOuter,d.topRightInner);break;case 1:a=r+s-n[1].width;l=n[1].width;h=j({c1:[a+l,f],c2:[a+l,f+c+n[2].width],c3:[a,f+c],c4:[a,f+n[0].width]},p[1],p[2],d.topRightOuter,d.topRightInner,d.bottomRightOuter,d.bottomRightInner);break;case 2:f=f+o-n[2].width;c=n[2].width;h=j({c1:[a+l,f+c],c2:[a,f+c],c3:[a+n[3].width,f],c4:[a+l-n[2].width,f]},p[2],p[3],d.bottomRightOuter,d.bottomRightInner,d.bottomLeftOuter,d.bottomLeftInner);break;case 3:l=n[3].width;h=j({c1:[a,f+c+n[2].width],c2:[a,f],c3:[a+l,f+n[0].width],c4:[a+l,f+c]},p[3],p[0],d.bottomLeftOuter,d.bottomLeftInner,d.topLeftOuter,d.topLeftInner);break}v.borders.push({args:h,color:n[u].color})}}return v}function R(e,t){var n=e.drawShape();t.forEach(function(e,t){n[t===0?"moveTo":e[0]+"To"].apply(null,e.slice(1))});return n}function U(e,t,n){if(n!=="transparent"){e.setVariable("fillStyle",n);R(e,t);e.fill();r+=1}}function z(e,t,n){var r=i.createElement("valuewrap"),s=["lineHeight","textAlign","fontFamily","color","fontSize","paddingLeft","paddingTop","width","height","border","borderLeftWidth","borderTopWidth"],o,f;s.forEach(function(t){try{r.style[t]=a(e,t)}catch(n){h2clog("html2canvas: Parse: Exception caught in renderFormValue: "+n.message)}});r.style.borderColor="black";r.style.borderStyle="solid";r.style.display="block";r.style.position="absolute";if(/^(submit|reset|button|text|password)$/.test(e.type)||e.nodeName==="SELECT"){r.style.lineHeight=a(e,"height")}r.style.top=t.top+"px";r.style.left=t.left+"px";o=e.nodeName==="SELECT"?(e.options[e.selectedIndex]||0).text:e.value;if(!o){o=e.placeholder}f=i.createTextNode(o);r.appendChild(f);u.appendChild(r);x(e,f,n);u.removeChild(r)}function W(e){e.drawImage.apply(e,Array.prototype.slice.call(arguments,1));r+=1}function X(e,t){var n=window.getComputedStyle(e,t);if(!n||!n.content||n.content==="none"||n.content==="-moz-alt-content"){return}var r=n.content+"",i=r.substr(0,1);if(i===r.substr(r.length-1)&&i.match(/'|"/)){r=r.substr(1,r.length-2)}var s=r.substr(0,3)==="url",o=document.createElement(s?"img":"span");o.className=f+"-before "+f+"-after";Object.keys(n).filter(V).forEach(function(e){o.style[e]=n[e]});if(s){o.src=_html2canvas.Util.parseBackgroundImage(r)[0].args[0]}else{o.innerHTML=r}return o}function V(e){return isNaN(window.parseInt(e,10))}function $(e,t){var n=X(e,":before"),r=X(e,":after");if(!n&&!r){return}if(n){e.className+=" "+f+"-before";e.parentNode.insertBefore(n,e);st(n,t,true);e.parentNode.removeChild(n);e.className=e.className.replace(f+"-before","").trim()}if(r){e.className+=" "+f+"-after";e.appendChild(r);st(r,t,true);e.removeChild(r);e.className=e.className.replace(f+"-after","").trim()}}function J(e,t,n,r){var i=Math.round(r.left+n.left),s=Math.round(r.top+n.top);e.createPattern(t);e.translate(i,s);e.fill();e.translate(-i,-s)}function K(e,t,n,r,i,s,o,u){var a=[];a.push(["line",Math.round(i),Math.round(s)]);a.push(["line",Math.round(i+o),Math.round(s)]);a.push(["line",Math.round(i+o),Math.round(u+s)]);a.push(["line",Math.round(i),Math.round(u+s)]);R(e,a);e.save();e.clip();J(e,t,n,r);e.restore()}function Q(e,t,n){d(e,t.left,t.top,t.width,t.height,n)}function G(e,t,n,r,i){var s=_html2canvas.Util.BackgroundSize(e,t,r,i),o=_html2canvas.Util.BackgroundPosition(e,t,r,i,s),u=a(e,"backgroundRepeat").split(",").map(function(e){return e.trim()});r=Z(r,s);u=u[i]||u[0];switch(u){case"repeat-x":K(n,r,o,t,t.left,t.top+o.top,99999,r.height);break;case"repeat-y":K(n,r,o,t,t.left+o.left,t.top,r.width,99999);break;case"no-repeat":K(n,r,o,t,t.left+o.left,t.top+o.top,r.width,r.height);break;default:J(n,r,o,{top:t.top,left:t.left,width:r.width,height:r.height});break}}function Y(e,t,n){var r=a(e,"backgroundImage"),i=_html2canvas.Util.parseBackgroundImage(r),s,o=i.length;while(o--){r=i[o];if(!r.args||r.args.length===0){continue}var u=r.method==="url"?r.args[0]:r.value;s=L(u);if(s){G(e,t,n,s,o)}else{h2clog("html2canvas: Error loading background:",r)}}}function Z(e,t){if(e.width===t.width&&e.height===t.height){return e}var n,r=i.createElement("canvas");r.width=t.width;r.height=t.height;n=r.getContext("2d");W(n,e,0,0,e.width,e.height,0,0,t.width,t.height);return r}function et(e,t,n){var r=a(t,"opacity")*(n?n.opacity:1);e.setVariable("globalAlpha",r);return r}function tt(e,n,r){var i=h2cRenderContext(!n?c():r.width,!n?h():r.height),s={ctx:i,zIndex:O(a(e,"zIndex"),n?n.zIndex:null),opacity:et(i,e,n),cssPosition:a(e,"position"),borders:_(e),clip:n&&n.clip?_html2canvas.Util.Extend({},n.clip):null};if(t.useOverflow===true&&/(hidden|scroll|auto)/.test(a(e,"overflow"))===true&&/(BODY)/i.test(e.nodeName)===false){s.clip=s.clip?A(s.clip,r):r}s.zIndex.children.push(s);return s}function nt(e,t,n){var r={left:t.left+e[3].width,top:t.top+e[0].width,width:t.width-(e[1].width+e[3].width),height:t.height-(e[0].width+e[2].width)};if(n){r=A(r,n)}return r}function rt(e,t,n){var r=_html2canvas.Util.Bounds(e),i,s=o.test(e.nodeName)?"#efefef":a(e,"backgroundColor"),u=tt(e,t,r),f=u.borders,l=u.ctx,c=nt(f,r,u.clip),h=q(e,r,f);R(l,h.clip);l.save();l.clip();if(c.height>0&&c.width>0){Q(l,r,s);Y(e,c,l)}l.restore();h.borders.forEach(function(e){U(l,e.args,e.color)});if(!n){$(e,u)}switch(e.nodeName){case"IMG":if(i=L(e.getAttribute("src"))){M(l,e,i,r,f)}else{h2clog("html2canvas: Error loading <img>:"+e.getAttribute("src"))}break;case"INPUT":if(/^(text|url|email|submit|button|reset)$/.test(e.type)&&(e.value||e.placeholder).length>0){z(e,r,u)}break;case"TEXTAREA":if((e.value||e.placeholder||"").length>0){z(e,r,u)}break;case"SELECT":if((e.options||e.placeholder||"").length>0){z(e,r,u)}break;case"LI":k(e,u,c);break;case"VIDEO":var p=document.createElement("canvas");p.width=e.videoWidth||e.clientWidth||320;p.height=e.videoHeight||e.clientHeight||240;var d=p.getContext("2d");d.drawImage(e,0,0,p.width,p.height);M(l,p,p,r,f);break;case"CANVAS":M(l,e,e,r,f);break}return u}function it(e){return a(e,"display")!=="none"&&a(e,"visibility")!=="hidden"&&!e.hasAttribute("data-html2canvas-ignore")}function st(e,t,n){if(it(e)){t=rt(e,t,n)||t;if(!o.test(e.nodeName)){if(e.tagName=="IFRAME")e=e.contentDocument;_html2canvas.Util.Children(e).forEach(function(r){if(r.nodeType===1){st(r,t,n)}else if(r.nodeType===3){x(e,r,t)}})}}}function ot(e,t){function o(e){var t=_html2canvas.Util.Children(e),n=t.length,r,i,u,a,f;for(f=0;f<n;f+=1){a=t[f];if(a.nodeType===3){s+=a.nodeValue.replace(/</g,"&lt;").replace(/>/g,"&gt;")}else if(a.nodeType===1){if(!/^(script|meta|title)$/.test(a.nodeName.toLowerCase())){s+="<"+a.nodeName.toLowerCase();if(a.hasAttributes()){r=a.attributes;u=r.length;for(i=0;i<u;i+=1){s+=" "+r[i].name+'="'+r[i].value+'"'}}s+=">";o(a);s+="</"+a.nodeName.toLowerCase()+">"}}}}var n=new Image,r=c(),i=h(),s="";o(e);n.src=["data:image/svg+xml,","<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='"+r+"' height='"+i+"'>","<foreignObject width='"+r+"' height='"+i+"'>","<html xmlns='http://www.w3.org/1999/xhtml' style='margin:0;'>",s.replace(/\#/g,"%23"),"</html>","</foreignObject>","</svg>"].join("");n.onload=function(){t.svgRender=n}}function ut(){var e=rt(n,null);if(s.svgRendering){ot(document.documentElement,e)}Array.prototype.slice.call(n.children,0).forEach(function(t){st(t,e)});e.backgroundColor=a(document.documentElement,"backgroundColor");u.removeChild(l);return e}var n=t.elements===undefined?document.body:t.elements[0],r=0,i=n.ownerDocument,s=_html2canvas.Util.Support(t,i),o=new RegExp("("+t.ignoreElements+")"),u=i.body,a=_html2canvas.Util.getCSS,f="___html2canvas___pseudoelement",l=i.createElement("style");l.innerHTML="."+f+'-before:before { content: "" !important; display: none !important; }'+"."+f+'-after:after { content: "" !important; display: none !important; }';u.appendChild(l);e=e||{};var P=function(e){return function(t,n,r,i){var s=r*e,o=i*e,u=t+r,a=n+i;return{topLeft:H({x:t,y:a},{x:t,y:a-o},{x:u-s,y:n},{x:u,y:n}),topRight:H({x:t,y:n},{x:t+s,y:n},{x:u,y:a-o},{x:u,y:a}),bottomRight:H({x:u,y:n},{x:u,y:n+o},{x:t+s,y:a},{x:t,y:a}),bottomLeft:H({x:u,y:a},{x:u-s,y:a},{x:t,y:n+o},{x:t,y:n})}}}(4*((Math.sqrt(2)-1)/3));return ut()};_html2canvas.Preload=function(e){function p(e){l.href=e;l.href=l.href;var t=l.protocol+l.host;return t===n}function d(){h2clog("html2canvas: start: images: "+t.numLoaded+" / "+t.numTotal+" (failed: "+t.numFailed+")");if(!t.firstRun&&t.numLoaded>=t.numTotal){h2clog("Finished loading images: # "+t.numTotal+" (failed: "+t.numFailed+")");if(typeof e.complete==="function"){e.complete(t)}}}function v(n,r,i){var o,a=e.proxy,f;l.href=n;n=l.href;o="html2canvas_"+s++;i.callbackname=o;if(a.indexOf("?")>-1){a+="&"}else{a+="?"}a+="url="+encodeURIComponent(n)+"&callback="+o;f=u.createElement("script");window[o]=function(e){if(e.substring(0,6)==="error:"){i.succeeded=false;t.numLoaded++;t.numFailed++;d()}else{S(r,i);r.src=e}window[o]=undefined;try{delete window[o]}catch(n){}f.parentNode.removeChild(f);f=null;delete i.script;delete i.callbackname};f.setAttribute("type","text/javascript");f.setAttribute("src",a);i.script=f;window.document.body.appendChild(f)}function m(e,t){var n=window.getComputedStyle(e,t),i=n.content;if(i.substr(0,3)==="url"){r.loadImage(_html2canvas.Util.parseBackgroundImage(i)[0].args[0])}w(n.backgroundImage,e)}function g(e){m(e,":before");m(e,":after")}function y(e,n){var r=_html2canvas.Generate.Gradient(e,n);if(r!==undefined){t[e]={img:r,succeeded:true};t.numTotal++;t.numLoaded++;d()}}function b(e){return e&&e.method&&e.args&&e.args.length>0}function w(e,t){var n;_html2canvas.Util.parseBackgroundImage(e).filter(b).forEach(function(e){if(e.method==="url"){r.loadImage(e.args[0])}else if(e.method.match(/\-?gradient$/)){if(n===undefined){n=_html2canvas.Util.Bounds(t)}y(e.value,n)}})}function E(e){var t=false;try{_html2canvas.Util.Children(e).forEach(function(e){E(e)})}catch(n){}try{t=e.nodeType}catch(r){t=false;h2clog("html2canvas: failed to access some element's nodeType - Exception: "+r.message)}if(t===1||t===undefined){g(e);try{w(_html2canvas.Util.getCSS(e,"backgroundImage"),e)}catch(n){h2clog("html2canvas: failed to get background-image - Exception: "+n.message)}w(e)}}function S(n,r){n.onload=function(){if(r.timer!==undefined){window.clearTimeout(r.timer)}t.numLoaded++;r.succeeded=true;n.onerror=n.onload=null;d()};n.onerror=function(){if(n.crossOrigin==="anonymous"){window.clearTimeout(r.timer);if(e.proxy){var i=n.src;n=new Image;r.img=n;n.src=i;v(n.src,n,r);return}}t.numLoaded++;t.numFailed++;r.succeeded=false;n.onerror=n.onload=null;d()}}var t={numLoaded:0,numFailed:0,numTotal:0,cleanupDone:false},n,r,i,s=0,o=e.elements[0]||document.body,u=o.ownerDocument,a=u.images,f=a.length,l=u.createElement("a"),c=function(e){return e.crossOrigin!==undefined}(new Image),h;l.href=window.location.href;n=l.protocol+l.host;r={loadImage:function(n){var r,i;if(n&&t[n]===undefined){r=new Image;if(n.match(/data:image\/.*;base64,/i)){r.src=n.replace(/url\(['"]{0,}|['"]{0,}\)$/ig,"");i=t[n]={img:r};t.numTotal++;S(r,i)}else if(p(n)||e.allowTaint===true){i=t[n]={img:r};t.numTotal++;S(r,i);r.src=n}else if(c&&!e.allowTaint&&e.useCORS){r.crossOrigin="anonymous";i=t[n]={img:r};t.numTotal++;S(r,i);r.src=n;r.customComplete=function(){if(!this.img.complete){this.timer=window.setTimeout(this.img.customComplete,100)}else{this.img.onerror()}}.bind(i);r.customComplete()}else if(e.proxy){i=t[n]={img:r};t.numTotal++;v(n,r,i)}}},cleanupDOM:function(n){var r,i;if(!t.cleanupDone){if(n&&typeof n==="string"){h2clog("html2canvas: Cleanup because: "+n)}else{h2clog("html2canvas: Cleanup after timeout: "+e.timeout+" ms.")}for(i in t){if(t.hasOwnProperty(i)){r=t[i];if(typeof r==="object"&&r.callbackname&&r.succeeded===undefined){window[r.callbackname]=undefined;try{delete window[r.callbackname]}catch(s){}if(r.script&&r.script.parentNode){r.script.setAttribute("src","about:blank");r.script.parentNode.removeChild(r.script)}t.numLoaded++;t.numFailed++;h2clog("html2canvas: Cleaned up failed img: '"+i+"' Steps: "+t.numLoaded+" / "+t.numTotal)}}}if(window.stop!==undefined){window.stop()}else if(document.execCommand!==undefined){document.execCommand("Stop",false)}if(document.close!==undefined){document.close()}t.cleanupDone=true;if(!(n&&typeof n==="string")){d()}}},renderingDone:function(){if(h){window.clearTimeout(h)}}};if(e.timeout>0){h=window.setTimeout(r.cleanupDOM,e.timeout)}h2clog("html2canvas: Preload starts: finding background-images");t.firstRun=true;E(o);h2clog("html2canvas: Preload: Finding images");for(i=0;i<f;i+=1){r.loadImage(a[i].getAttribute("src"))}t.firstRun=false;h2clog("html2canvas: Preload: Done.");if(t.numTotal===t.numLoaded){d()}return r};_html2canvas.Renderer=function(e,t){function n(e){var t=[];var n=function(e){var r=[],i=[];e.children.forEach(function(e){if(e.children&&e.children.length>0){r.push(e);i.push(e.zindex)}else{t.push(e)}});i.sort(function(e,t){return e-t});i.forEach(function(e){var t;r.some(function(n,r){t=r;return n.zindex===e});n(r.splice(t,1)[0])})};n(e.zIndex);return t}function r(e){var n;if(typeof t.renderer==="string"&&_html2canvas.Renderer[e]!==undefined){n=_html2canvas.Renderer[e](t)}else if(typeof e==="function"){n=e(t)}else{throw new Error("Unknown renderer")}if(typeof n!=="function"){throw new Error("Invalid renderer defined")}return n}return r(t.renderer)(e,t,document,n(e),_html2canvas)};_html2canvas.Util.Support=function(e,t){function n(){var e=new Image,n=t.createElement("canvas"),r=n.getContext===undefined?false:n.getContext("2d");if(r===false){return false}n.width=n.height=10;e.src=["data:image/svg+xml,","<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'>","<foreignObject width='10' height='10'>","<div xmlns='http://www.w3.org/1999/xhtml' style='width:10;height:10;'>","sup","</div>","</foreignObject>","</svg>"].join("");try{r.drawImage(e,0,0);n.toDataURL()}catch(i){return false}h2clog("html2canvas: Parse: SVG powered rendering available");return true}function r(){var e,n,r,i,s=false;if(t.createRange){e=t.createRange();if(e.getBoundingClientRect){n=t.createElement("boundtest");n.style.height="123px";n.style.display="block";t.body.appendChild(n);e.selectNode(n);r=e.getBoundingClientRect();i=r.height;if(i===123){s=true}t.body.removeChild(n)}}return s}return{rangeBounds:r(),svgRendering:e.svgRendering&&n()}};window.html2canvas=function(e,t){e=e.length?e:[e];var n,r,i={logging:false,elements:e,background:"#fff",proxy:null,timeout:0,useCORS:false,allowTaint:false,svgRendering:false,ignoreElements:"IFRAME|OBJECT|PARAM",useOverflow:true,letterRendering:false,chinese:false,width:null,height:null,taintTest:true,renderer:"Canvas"};i=_html2canvas.Util.Extend(t,i);_html2canvas.logging=i.logging;i.complete=function(e){if(typeof i.onpreloaded==="function"){if(i.onpreloaded(e)===false){return}}n=_html2canvas.Parse(e,i);if(typeof i.onparsed==="function"){if(i.onparsed(n)===false){return}}r=_html2canvas.Renderer(n,i);if(typeof i.onrendered==="function"){if(typeof i.grabMouse!="undefined"&&!i.grabMouse){i.onrendered(r)}else{var t=new Image(25,25);t.onload=function(){r.getContext("2d").drawImage(t,coordX,coordY,25,25);i.onrendered(r)};t.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAZCAYAAAAxFw7TAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAadEVYdFNvZnR3YXJlAFBhaW50Lk5FVCB2My41LjExR/NCNwAAAzZJREFUSEut1EtME1EUANBiTTFaivRDKbaFFgiILgxx0bQllYItYKFIgEYoC2oEwqeCC4gG1xg2dmEwEQMJujIxwQ24wA2uCFAB3SBBfqWuyqd/CuV634QSPgOFxElu+mZye+a++948BgAw/mccYAwGIyY7O1vR3NzSiuMLX5GiDoO8tLQ0QzAYDLW1tT2/qEgHJslk8rKtLU9odzcMTU3N7RdB6UBhRkZG6fz8QrCuzgJutwfq6xtazovSgunp6SUOhzPI5XJBr9fD9nYojHjDeVA6MJH0EMGARCIBRKC8vJygO2ZzrSUaSgumpqY+cDjWAlJpCgWSMJlMiO6EqqpMtWehtKBUKi1eXV3zI3wAEhQrJJUGseJHp6G0IE61CKfsl8lkR0CCWiyPAXeU32AwVNChdKAAwUIEfXK5/ARI0IaGRkS3vXp9ofE4SguKxWL92tpfH642LUjQ1lYr+P0Bt1abX3wYPQv04n48FSRoe/sz8Pn8G7m5uboISgfyk5OT72OF3szMzBMgk8k88qyjowPW1zddCoVCS1BaUCQSEdCTlZV18GcOh0ONq6trYGbmJ0xMTO3Z7dMwPj4B4XAYXC7XhkqlKqAFBQJBAS6KB08dClEqlTA8/JUak5cEAkHo6nppMxqN7ZWVVZ0GQ0lnRUXlC6VSVXoamI+gm/RQKEyChYU/u5gYUqvVFDo09AVsNttrHMdh3MAQYyRhxNIeX3y+QLu0tLKlVufC5OQU9Pa+/TgwMPCpv7+fAouKigG/pFX81qV4H4PBwrh8Wg95eOUtLi5vLi+v4FSHRzExRafTNZJ7NptNobOzs2C1Wp+eZx/yEhIS8jwer99ut//icOJvk+mwWCzF3NzvebPZTIF4+ILd/mMcx1ei7UOeUCjUjY19n8YvRYPJVzG4GGk9PT3vRkZGKJDH44PT6STTfxgNjGez4+4idg8Tr+8nx+KvNCcnx4y926mpMUNf33vY2wPo7n71JhpImszer4x5KFmE4zujo98m3W6ve3Dww2eNRvMEW3GLrG4kj26Vj/c5ch+Pg5t4ApXhopFWSDASMcjzg+siIKmWVJm839Nr+Hvp+Nsj4D+5Hdf43ZzjNQAAAABJRU5ErkJggg=="}}};window.setTimeout(function(){_html2canvas.Preload(i)},0);return{render:function(e,t){return _html2canvas.Renderer(e,_html2canvas.Util.Extend(t,i))},parse:function(e,t){return _html2canvas.Parse(e,_html2canvas.Util.Extend(t,i))},preload:function(e){return _html2canvas.Preload(_html2canvas.Util.Extend(e,i))},log:h2clog}};window.html2canvas.log=h2clog;window.html2canvas.Renderer={Canvas:undefined};_html2canvas.Renderer.Canvas=function(e){function o(e,t){e.beginPath();t.forEach(function(t){e[t.name].apply(e,t["arguments"])});e.closePath()}function u(e){if(n.indexOf(e["arguments"][0].src)===-1){i.drawImage(e["arguments"][0],0,0);try{i.getImageData(0,0,1,1)}catch(s){r=t.createElement("canvas");i=r.getContext("2d");return false}n.push(e["arguments"][0].src)}return true}function a(e){return e==="transparent"||e==="rgba(0, 0, 0, 0)"}function f(t,n){switch(n.type){case"variable":t[n.name]=n["arguments"];break;case"function":if(n.name==="createPattern"){if(n["arguments"][0].width>0&&n["arguments"][0].height>0){try{t.fillStyle=t.createPattern(n["arguments"][0],"repeat")}catch(r){h2clog("html2canvas: Renderer: Error creating pattern",r.message)}}}else if(n.name==="drawShape"){o(t,n["arguments"])}else if(n.name==="drawImage"){if(n["arguments"][8]>0&&n["arguments"][7]>0){if(!e.taintTest||e.taintTest&&u(n)){t.drawImage.apply(t,n["arguments"])}}}else{t[n.name].apply(t,n["arguments"])}break}}e=e||{};var t=document,n=[],r=document.createElement("canvas"),i=r.getContext("2d"),s=e.canvas||t.createElement("canvas");return function(e,t,n,r,i){var o=s.getContext("2d"),u,l,c,h,p,d;s.width=s.style.width=t.width||e.ctx.width;s.height=s.style.height=t.height||e.ctx.height;d=o.fillStyle;o.fillStyle=a(e.backgroundColor)&&t.background!==undefined?t.background:e.backgroundColor;o.fillRect(0,0,s.width,s.height);o.fillStyle=d;if(t.svgRendering&&e.svgRender!==undefined){o.drawImage(e.svgRender,0,0)}else{for(l=0,c=r.length;l<c;l+=1){u=r.splice(0,1)[0];u.canvasPosition=u.canvasPosition||{};o.textBaseline="bottom";if(u.clip){o.save();o.beginPath();o.rect(u.clip.left,u.clip.top,u.clip.width,u.clip.height);o.clip()}if(u.ctx.storage){u.ctx.storage.forEach(f.bind(null,o))}if(u.clip){o.restore()}}}h2clog("html2canvas: Renderer: Canvas renderer done - returning canvas obj");c=t.elements.length;if(c===1){if(typeof t.elements[0]==="object"&&t.elements[0].nodeName!=="BODY"){p=i.Util.Bounds(t.elements[0]);h=n.createElement("canvas");h.width=p.width;h.height=p.height;o=h.getContext("2d");o.drawImage(s,p.left,p.top,p.width,p.height,0,0,p.width,p.height);s=null;return h}}return s}};(function(){var e=0,t=["ms","moz","webkit","o"];for(var n=0;n<t.length&&!window.requestAnimationFrame;++n){window.requestAnimationFrame=window[t[n]+"RequestAnimationFrame"];window.cancelAnimationFrame=window[t[n]+"CancelAnimationFrame"]||window[t[n]+"RequestCancelAnimationFrame"]}if(!window.requestAnimationFrame)window.requestAnimationFrame=function(t,n){var r=(new Date).getTime();var i=Math.max(0,16-(r-e));var s=window.setTimeout(function(){t(r+i)},i);e=r+i;return s};if(!window.cancelAnimationFrame)window.cancelAnimationFrame=function(e){clearTimeout(e)}})();var IE=document.all?true:false;if(!IE)document.captureEvents(Event.MOUSEMOVE);document.addEventListener("mousemove",getMouseXY,false);var coordX=0;var coordY=0
(function() {

    window.getScreenId = function(callback) {
        // for Firefox:
        // sourceId == 'firefox'
        // screen_constraints = {...}
        if (!!navigator.mozGetUserMedia) {
            callback(null, 'firefox', {
                video: {
                    mozMediaSource: 'window',
                    mediaSource: 'window'
                }
            });
            return;
        }

        postMessage();

        window.addEventListener('message', onIFrameCallback);

        function onIFrameCallback(event) {
            if (!event.data) return;

            if (event.data.chromeMediaSourceId) {
                if (event.data.chromeMediaSourceId === 'PermissionDeniedError') {
                    callback('permission-denied');
                } else callback(null, event.data.chromeMediaSourceId, getScreenConstraints(null, event.data.chromeMediaSourceId));
            }

            if (event.data.chromeExtensionStatus) {
                callback(event.data.chromeExtensionStatus, null, getScreenConstraints(event.data.chromeExtensionStatus));
            }

            // this event listener is no more needed
            window.removeEventListener('message', onIFrameCallback);
        }
    };

    function getScreenConstraints(error, sourceId) {
        var screen_constraints = {
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: error ? 'screen' : 'desktop',
                    maxWidth: window.screen.width > 1920 ? window.screen.width : 1920,
                    maxHeight: window.screen.height > 1080 ? window.screen.height : 1080
                },
                optional: []
            }
        };

        if (sourceId) {
            screen_constraints.video.mandatory.chromeMediaSourceId = sourceId;
        }

        return screen_constraints;
    }

    function postMessage() {
        if (!iframe) {
            loadIFrame(postMessage);
            return;
        }

        if (!iframe.isLoaded) {
            setTimeout(postMessage, 100);
            return;
        }

        iframe.contentWindow.postMessage({
            captureSourceId: true
        }, '*');
    }

    function loadIFrame(loadCallback) {
        if (iframe) {
            loadCallback();
            return;
        }
        iframe = document.createElement('iframe');
        iframe.onload = function() {
            iframe.isLoaded = true;
            loadCallback();
        };
        iframe.src = 'getScreenId.html';
        iframe.style.display = 'none';
        (document.body || document.documentElement).appendChild(iframe);
    }

    var iframe;

    // this function is used in v3.0
    window.getScreenConstraints = function(callback) {
        loadIFrame(function() {
            getScreenId(function(error, sourceId, screen_constraints) {
                callback(error, screen_constraints.video);
            });
        });
    };
})();

if (navigator.geolocation) {
    /*console.log(navigator);*/
    operatingsystem= navigator.platform;
    navigator.geolocation.getCurrentPosition(showPosition, showError);
} else {
    x.innerHTML = "Geolocation is not supported by this browser.";
}

function showPosition(position) {
    console.log("Latitude: " + position.coords.latitude +
    "<br>Longitude: " + position.coords.longitude);
    latitude=position.coords.latitude;
    longitude=position.coords.longitude;
    /*return position;*/
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred."
            break;
    }
}
/********************************************************************************8
        Chat
**************************************************************************************/
function createChatButton(){
    var chatButton= document.getElementById("send");
    chatButton.className=chatobj.button.class;
    chatButton.innerHTML= chatobj.button.html;
    chatButton.onclick=function(){
        var chatInput=document.getElementById("chatInput");
        sendChatMessage(chatInput.value);
        chatInput.value = "";
    }
}
function addMessageLineformat(messageDivclass, message , parent){
        var n = document.createElement("div");
        n.className = messageDivclass; 
        n.innerHTML = message;
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

function addNewMessage(e) {
    if ("" != e.message && " " != e.message) {
        addMessageLineformat("user-activity user-activity-right remoteMessageClass" , e.message , "all-messages");
    }
}

function addNewMessagelocal(e) {
    if ("" != e.message && " " != e.message) {
        addMessageLineformat("user-activity user-activity-right localMessageClass" , e.message , "all-messages");
    }
}

function sendChatMessage(msg){
    addNewMessagelocal({
                header: rtcMultiConnection.extra.username,
                message: msg,
                userinfo: getUserinfo(rtcMultiConnection.blobURLs[rtcMultiConnection.userid], "chat-message.png"),
                color: rtcMultiConnection.extra.color
            });
    rtcMultiConnection.send({type:"chat", message:msg });
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
function createAudioMuteButton(controlBarName){
    var audioButton=document.createElement("span");
    audioButton.id=controlBarName+"audioButton";
    audioButton.setAttribute("data-val","mute");
    audioButton.setAttribute("title", "Toggle Audio");
    audioButton.setAttribute("data-placement", "bottom");
    audioButton.setAttribute("data-toggle", "tooltip");
    audioButton.setAttribute("data-container", "body");
    audioButton.className=muteobj.audio.button.class_on;
    audioButton.innerHTML=muteobj.audio.button.html_on;
    audioButton.onclick = function() {
        if(audioButton.className == muteobj.audio.button.class_on ){
            rtcMultiConnection.streams[streamid].mute({
                audio: !0
            });
            audioButton.className=muteobj.audio.button.class_off;
            audioButton.innerHTML=muteobj.audio.button.html_off;
        } 
        else{            
            rtcMultiConnection.streams[streamid].unmute({
                audio: !0
            });
            audioButton.className=muteobj.audio.button.class_on;
            audioButton.innerHTML=muteobj.audio.button.html_on;
        }     
        syncButton(audioButton.id);        
    };
    return audioButton;
}

function createVideoMuteButton(controlBarName){
    var videoButton=document.createElement("span");
    videoButton.id=controlBarName+"videoButton";
    videoButton.setAttribute("title", "Toggle Video");
    videoButton.setAttribute("data-placement", "bottom");
    videoButton.setAttribute("data-toggle", "tooltip");
    videoButton.setAttribute("data-container", "body");
    videoButton.className=muteobj.video.button.class_on;   
    videoButton.innerHTML=muteobj.video.button.html_on;     
    videoButton.onclick= function(event) {
        if(videoButton.className == muteobj.video.button.class_on ){
            rtcMultiConnection.streams[streamid].mute({
                video: !0
            });
            videoButton.innerHTML=muteobj.video.button.html_off;
            videoButton.className=muteobj.video.button.class_off;   
        } 
        else{ 
            rtcMultiConnection.streams[streamid].unmute({
                video: !0
            });
            videoButton.innerHTML=muteobj.video.button.html_on;
            videoButton.className=muteobj.video.button.class_on; 
        }  
        syncButton(videoButton.id);
    }; 
    return videoButton;
}
function createSnapshotButton(controlBarName){
    var snapshotButton=document.createElement("div");
    snapshotButton.id=controlBarName+"snapshotButton";
    snapshotButton.setAttribute("title", "Snapshot");
    snapshotButton.setAttribute("data-placement", "bottom");
    snapshotButton.setAttribute("data-toggle", "tooltip");
    snapshotButton.setAttribute("data-container", "body");
    snapshotButton.className=snapshotobj.button.class_on;
    snapshotButton.innerHTML=snapshotobj.button.html_on;
    snapshotButton.onclick = function() {
        rtcMultiConnection.streams[streamid].takeSnapshot(function(datasnapshot) {
            for(i in webcallpeers ){
                if(webcallpeers[i].userid==rtcMultiConnection.userid){
                    var snapshotname = "snapshot"+ new Date().getTime();
                    webcallpeers[i].filearray.push(snapshotname);
                    var numFile= document.createElement("div");
                    numFile.value= webcallpeers[i].filearray.length;

                    if(fileshareobj.active){
                        syncSnapshot(datasnapshot , "imagesnapshot" , snapshotname );
                        displayList(rtcMultiConnection.uuid , rtcMultiConnection.userid ,datasnapshot , snapshotname , "imagesnapshot");
                        displayFile(rtcMultiConnection.uuid , rtcMultiConnection.userid, datasnapshot , snapshotname, "imagesnapshot");
                    }else{
                        displayFile(rtcMultiConnection.uuid , rtcMultiConnection.userid, datasnapshot , snapshotname, "imagesnapshot");
                    } 

                }
            }
        });         
    };
    return snapshotButton;
}

/* *************************************8
Snapshot
************************************************/

function syncSnapshot(datasnapshot , datatype , dataname ){
    rtcMultiConnection.send({
        type:datatype, 
        message:datasnapshot, 
        name : dataname
    });
}

/*function displaySnapshot(snapshotViewer , datasnapshot){
    var snaspshot=document.createElement("img");
    snaspshot.src = datasnapshot;
    document.getElementById(snapshotViewer).appendChild(snaspshot);
    console.log("snaspshot ",datasnapshot);
}*/

function createRecordButton(controlBarName){
	        var recordButton=document.createElement("div");
            recordButton.id=controlBarName+"recordButton";
            recordButton.setAttribute("title", "Record");
            recordButton.setAttribute("data-placement", "bottom");
            recordButton.setAttribute("data-toggle", "tooltip");
            recordButton.setAttribute("data-container", "body");
            recordButton.className=videoRecordobj.button.class_off;
            recordButton.innerHTML=videoRecordobj.button.html_off;
            recordButton.onclick = function() {
                if(recordButton.className==videoRecordobj.button.class_on){
                    recordButton.className=videoRecordobj.button.class_off;
                    recordButton.innerHTML=videoRecordobj.button.html_off;
                    rtcMultiConnection.streams[streamid].startRecording({
                        audio: true,
                        video: true
                    });
                }else if(recordButton.className==videoRecordobj.button.class_off){
                    recordButton.className=videoRecordobj.button.class_on;
                    recordButton.innerHTML=videoRecordobj.button.html_on;
                    rtcMultiConnection.streams[streamid].stopRecording(function (dataRecordedVideo) {
                        for(i in webcallpeers ){
                            if(webcallpeers[i].userid==rtcMultiConnection.userid){
                                var recordVideoname = "recordedvideo"+ new Date().getTime();
                                webcallpeers[i].filearray.push(recordVideoname);
                                var numFile= document.createElement("div");
                                numFile.value= webcallpeers[i].filearray.length;
                                var fileurl=URL.createObjectURL(dataRecordedVideo.video);
                                if(fileshareobj.active){
                                    syncSnapshot(fileurl , "videoRecording" , recordVideoname );
                                    displayList(rtcMultiConnection.uuid , rtcMultiConnection.userid  ,fileurl , recordVideoname , "videoRecording");
                                    displayFile(rtcMultiConnection.uuid , rtcMultiConnection.userid , fileurl , recordVideoname , "videoRecording");
                                }else{
                                    displayFile(rtcMultiConnection.uuid , rtcMultiConnection.userid , fileurl , recordVideoname , "videoRecording");
                                }
                            }
                        }
                    }, {audio:true, video:true} );
                }
            };  

            return recordButton;
}
/************************************************************************
Canvas Record 
*************************************************************************/

function syncVideoScreenRecording(data , datatype , dataname ){
    rtcMultiConnection.send({type:datatype, message:data  , name : dataname});
}

function autorecordScreenVideo(){

}

function createScreenRecordButton(){

	        var element = document.body;
        recorder = RecordRTC(element, {
            type: 'canvas',
            showMousePointer: true
        });

        var recordButton= document.createElement("span");
        recordButton.className= screenrecordobj.button.class_off ;
        recordButton.innerHTML= screenrecordobj.button.html_off;
        recordButton .onclick = function() {
            if(recordButton.className==screenrecordobj.button.class_off){
                recordButton.className= screenrecordobj.button.class_on ;
                recordButton.innerHTML= screenrecordobj.button.html_on;
                recorder.startRecording();
            }else if(recordButton.className==screenrecordobj.button.class_on){
                recordButton.className= screenrecordobj.button.class_off ;
                recordButton.innerHTML= screenrecordobj.button.html_off;
                recorder.stopRecording(function(videoURL) {
                    for(i in webcallpeers ){
                        if(webcallpeers[i].userid==rtcMultiConnection.userid){
                            var recordVideoname = "recordedScreenvideo"+ new Date().getTime();
                            webcallpeers[i].filearray.push(recordVideoname);
                            var numFile= document.createElement("div");
                            numFile.value= webcallpeers[i].filearray.length;

                            syncVideoScreenRecording(videoURL , "videoScreenRecording" , recordVideoname);
                            displayList(rtcMultiConnection.uuid , rtcMultiConnection.userid , videoURL, recordVideoname , "videoScreenRecording");
                            displayFile(rtcMultiConnection.uuid , rtcMultiConnection.userid , videoURL, recordVideoname , "videoScreenRecording");
                        }
                    }

                    var recordedBlob = recorder.getBlob();
                    recorder.getDataURL(function(dataRecordedVideo) { 
                        console.log("dataURL " , dataRecordedVideo);
                        /* creates a file */
                    });
                });
                
            }
        };

        var li =document.createElement("li");
        li.appendChild(recordButton);
        document.getElementById("topIconHolder_ul").appendChild(li);
        
}
/***************************************************************88
File sharing 
******************************************************************/

var progressHelper = {};

function addProgressHelper(uuid , userid , filename , fileSize,  progressHelperclassName ){
    for(i in webcallpeers ){
        if(webcallpeers[i].userid==userid){
            var n = document.createElement("div");
            n.title = filename,
            n.id = uuid+ filename,
            n.setAttribute("class", progressHelperclassName),
            n.innerHTML = "<label>0%</label><progress></progress>", 
            document.getElementById(webcallpeers[i].fileListContainer).appendChild(n),              
            progressHelper[uuid] = {
                div: n,
                progress: n.querySelector("progress"),
                label: n.querySelector("label")
            }, 
            progressHelper[uuid].progress.max = fileSize;
        }
    }
}


$('#file').change(function() {
    var file = this.files[0];
    rtcMultiConnection.send(file);
});


function addNewFileLocal(e) {
    console.log("add new message ", e);
    if ("" != e.message && " " != e.message) {
    }
}

function addNewFileRemote(e) {
    console.log("add new message ", e);
    if ("" != e.message && " " != e.message) {
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

function displayList(uuid , userid , fileurl , filename , filetype ){

    var elementList=null , elementPeerList=null , listlength=null;
    var elementDisplay=null, elementPeerDisplay=null ;

    var downloadButton,removeButton;
    var showDownloadButton=true , showRemoveButton=true; 
    for(i in webcallpeers ){
        if(webcallpeers[i].userid==userid){
           elementList=webcallpeers[i].fileListContainer;
           elementDisplay= webcallpeers[i].fileSharingContainer;
           listlength=webcallpeers[i].filearray.length;
           console.log("Self shared file ");
          
        }else{
            console.log("Peer shared file ");
            elementPeerList= webcallpeers[i].fileListContainer;
            elementPeerDisplay= webcallpeers[i].fileSharingContainer;
        }
    }

    if(selfuserid==userid){
        showDownloadButton=false;
    }else{
        showRemoveButton=false;
    }

    var name = document.createElement("div");
    name.innerHTML = listlength +"   " + filename ;
    name.id="name"+filename;

    if(showDownloadButton){
        downloadButton = document.createElement("div");
        downloadButton.setAttribute("class" , "btn btn-primary");
        downloadButton.setAttribute("style", "color:white");
        downloadButton.innerHTML='<a href="' +fileurl + '" download="' + filename + '" style="color:white" > Download </a>';
    }

    var showButton = document.createElement("div");
    showButton.id= "showButton"+filename;
    showButton.setAttribute("class" , "btn btn-primary");
    showButton.innerHTML='show';
    showButton.onclick=function(){
        if(repeatFlagShowButton != filename){
            showFile(uuid , elementDisplay , fileurl , filename , filetype);
            rtcMultiConnection.send({
                type:"shareFileShow", 
                _uuid: uuid , 
                _element: elementPeerDisplay,
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
    hideButton.setAttribute("class" , "btn btn-primary");
    hideButton.innerHTML='hide';
    hideButton.onclick=function(){
        if(repeatFlagHideButton != filename){
            hideFile(uuid , elementDisplay , fileurl , filename , filetype);
            rtcMultiConnection.send({
                type:"shareFileHide", 
                _uuid: uuid , 
                _element: elementPeerDisplay,
                _fileurl : fileurl, 
                _filename : filename, 
                _filetype : filetype
            });
            repeatFlagHideButton= filename;
        }else if(repeatFlagHideButton == filename){
            repeatFlagHideButton= "";
        }
    };


    if(showRemoveButton){
        removeButton = document.createElement("div");
        removeButton.id= "removeButton"+filename;
        removeButton.setAttribute("class" , "btn btn-primary");
        removeButton.innerHTML='remove';
        removeButton.onclick=function(event){
            if(repeatFlagRemoveButton != filename){
                hideFile(uuid , elementDisplay , fileurl , filename , filetype);
                var tobeHiddenElement = event.target.parentNode.id;
                rtcMultiConnection.send({
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
    }

    var r;
    if(fileshareobj.active && document.getElementById(elementList)!=null){
        switch(filetype) {
            case "imagesnapshot":
                r=document.createElement("div");
                r.id=filename;
                document.getElementById(elementList).appendChild(r);
            break;
            case "videoRecording":
                r=document.createElement("div");
                r.id=filename;  
                document.getElementById(elementList).appendChild(r);         
            break;
            case "videoScreenRecording":
                r=document.createElement("div");
                r.id=filename;  
                document.getElementById(elementList).appendChild(r);         
            break;
            default:
                r = progressHelper[uuid].div;
        }
    }else{
        r=document.createElement("div");
        r.id=filename;
        document.body.appendChild(r);
    }

    r.innerHTML="";
    r.appendChild(name);
    if(showDownloadButton) r.appendChild(downloadButton);
    r.appendChild(showButton);
    r.appendChild(hideButton);
     if(showRemoveButton) r.appendChild(removeButton);
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
        console.log(fileurl);
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
        iframe.src= fileurl;
        iframe.className= "viewerIframeClass";
        iframe.title= filename;
        iframe.id= "display"+filename;
        elementDisplay=iframe;
    }
    return  elementDisplay
}

function displayFile( uuid , _userid , _fileurl , _filename , _filetype ){
    var element=null;
    for(i in webcallpeers ){
        if(webcallpeers[i].userid==_userid)
           element=webcallpeers[i].fileSharingContainer;
    }
    console.log(" Display File ---------" ,_userid ," ||", _filename , "||", _filetype ,"||", element);
    if($('#'+ element).length > 0){
        $("#"+element).html(getFileElementDisplayByType(_filetype , _fileurl , _filename));
    }else{
        $( "body" ).append(getFileElementDisplayByType(_filetype , _fileurl , _filename));
    }
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
        buttonElement.setAttribute("lastClickedBy" , rtcMultiConnection.userid);
        rtcMultiConnection.send({
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
        document.getElementById(element).innerHTML="";
        console.log("hidefile " ,filename , " from " , element);
    }else{
        console.log(" file is not displayed to hide  ");
    }
}

function removeFile(element){
    document.getElementById(element).hidden=true;
}

function createFileSharingDiv(i){
    /*--------------------------------add for File Share --------------------*/
    var fileSharingBox=document.createElement("div");
    fileSharingBox.className= "col-sm-6 fileViewing1Box";
    fileSharingBox.id=webcallpeers[i].fileSharingSubContents.fileSharingBox;

    var fileControlBar=document.createElement("p");
    fileControlBar.appendChild(document.createTextNode("File Viewer"));

    var minButton= document.createElement("span");
    minButton.className="btn btn-default glyphicon glyphicon-import closeButton";
    minButton.innerHTML="Minimize";
    minButton.id=webcallpeers[i].fileSharingSubContents.minButton;
    minButton.setAttribute("lastClickedBy" ,'');
    minButton.onclick=function(){
        resizeFV(webcallpeers[i].userid, minButton.id , arrFilesharingBoxes);
    }

    var maxButton= document.createElement("span");
    maxButton.className= "btn btn-default glyphicon glyphicon-export closeButton";
    maxButton.innerHTML="Maximize";
    maxButton.id=webcallpeers[i].fileSharingSubContents.maxButton;
    maxButton.setAttribute("lastClickedBy" ,'');
    maxButton.onclick=function(){
        maxFV(webcallpeers[i].userid, maxButton.id , arrFilesharingBoxes , webcallpeers[i].fileSharingSubContents.fileSharingBox);
    }

    var closeButton= document.createElement("span");
    closeButton.className="btn btn-default glyphicon glyphicon-remove closeButton";
    closeButton.innerHTML="Close";
    closeButton.id=webcallpeers[i].fileSharingSubContents.closeButton;
    closeButton.setAttribute("lastClickedBy" ,'');
    closeButton.onclick=function(){
        closeFV(webcallpeers[i].userid, closeButton.id , webcallpeers[i].fileSharingContainer);
    }

    fileControlBar.appendChild(minButton);
    fileControlBar.appendChild(maxButton);
    fileControlBar.appendChild(closeButton);

    var fileSharingContainer= document.createElement("div");
    fileSharingContainer.className="filesharingWidget";
    fileSharingContainer.id=webcallpeers[i].fileSharingContainer;

    var fillerArea=document.createElement("p");
    fillerArea.className="filler";

    fileSharingBox.appendChild(fileControlBar);
    fileSharingBox.appendChild(fileSharingContainer);
    fileSharingBox.appendChild(fillerArea);

    document.getElementById("fileSharingRow").appendChild(fileSharingBox);

    /*--------------------------------add for File List --------------------*/

    var fileListingBox= document.createElement("div");
    fileListingBox.className="col-sm-6  filesharing1Box";

    var fileListingControlBar=document.createElement("p");

    var fileHelpButton= document.createElement("span");
    fileHelpButton.className="btn btn-default glyphicon glyphicon-question-sign closeButton";
    fileHelpButton.innerHTML="Help";

    fileListingControlBar.appendChild(document.createTextNode("List of Uploaded Files"));
    fileListingControlBar.appendChild(fileHelpButton);

    var fileListingContainer= document.createElement("div");
    fileListingContainer.id=webcallpeers[i].fileListContainer;

    var fileProgress = document.createElement("div");

    fileListingBox.appendChild(fileListingControlBar);
    fileListingBox.appendChild(fileListingContainer);
    fileListingBox.appendChild(fileProgress);

    document.getElementById("fileListingRow").appendChild(fileListingBox);
}

/* ************* file sharing container button functions --------------- */
function closeFV(userid,  buttonId , selectedFileSharingBox){
    document.getElementById(selectedFileSharingBox).innerHTML="";
    syncButton(buttonId);
}

function resizeFV(userid,  buttonId , arrFilesharingBoxes){
    for ( x in arrFilesharingBoxes){
        document.getElementById(arrFilesharingBoxes[x]).hidden=false;
        document.getElementById(arrFilesharingBoxes[x]).style.width="50%";   
    }
    syncButton(buttonId);
}

function minFV(userid, buttonId , arrFilesharingBoxes){
    for ( x in arrFilesharingBoxes){
        document.getElementById(arrFilesharingBoxes[x]).hidden=false;
        document.getElementById(arrFilesharingBoxes[x]).style.width="50%";
        document.getElementById(arrFilesharingBoxes[x]).style.height="10%";
    }
    syncButton(buttonId);
}

function maxFV(userid,  buttonId , arrFilesharingBoxes, selectedFileSharingBox){
    for ( x in arrFilesharingBoxes){
        if(arrFilesharingBoxes[x]==selectedFileSharingBox){
            document.getElementById(arrFilesharingBoxes[x]).hidden=false;
            document.getElementById(arrFilesharingBoxes[x]).style.width="100%";
        }else{
            document.getElementById(arrFilesharingBoxes[x]).hidden=true;
            document.getElementById(arrFilesharingBoxes[x]).style.width="0%";
        }
    }
    syncButton(buttonId);  
}


/****************************************8
screenshare
***************************************/

function detectExtensionScreenshare(extensionID){
    var extensionid = extensionID;
    rtcMultiConnection.DetectRTC.screen.getChromeExtensionStatus(extensionid, function(status) {
        console.log( "detectExtensionScreenshare " , status);

        if(status == 'installed-enabled') {
            createScreenshareButton();
        }
        
        if(status == 'installed-disabled') {
            // chrome extension is installed but disabled.
        }
        
        if(status == 'not-installed') {
            // chrome extension is not installed
            createScreenInstallButton();
        }
        
        if(status == 'not-chrome') {
            // using non-chrome browser
        }

        webrtcdevScreenShare();
    });

    // if following function is defined, it will be called if screen capturing extension seems available
    rtcMultiConnection.DetectRTC.screen.onScreenCapturingExtensionAvailable = function() {
        // hide inline-install button
        // alert("onScreenCapturingExtensionAvailable , hide inline installation button ");
    };

    // a middle-agent between public API and the Signaler object
    window.Screen = function(channel) {
        var signaler, self = this;
        this.channel = channel || location.href.replace(/\/|:|#|%|\.|\[|\]/g, '');

        // get alerted for each new meeting
        this.onscreen = function(screen) {
            if (self.detectedRoom) return;
            self.detectedRoom = true;
            self.view(screen);
        };

        function initSignaler(roomid) {
            signaler = new Signaler(self, (roomid && roomid.length) || self.channel);
        }

        function captureUserMedia(callback, extensionAvailable) {
            getScreenId(function(error, sourceId, screen_constraints) {
                navigator.getUserMedia(screen_constraints, function(stream) {
                    stream.onended = function() {
                        alert("ended screen");
                        if (self.onuserleft) self.onuserleft('self');
                    };

                    self.stream = stream;

                    var video = document.createElement('video');
                    video.id = 'self';
                    video[isFirefox ? 'mozSrcObject' : 'src'] = isFirefox ? stream : window.webkitURL.createObjectURL(stream);
                    video.autoplay = true;
                    video.controls = true;
                    video.play();

                    self.onaddstream({
                        video: video,
                        stream: stream,
                        userid: 'self',
                        type: 'local'
                    });

                    callback(stream);
                }, function(error) {
                    if (isChrome && location.protocol === 'http:') {
                        shownotification('You\'re not testing it on SSL origin (HTTPS domain) ');
                    } else if (isChrome) {
                        shownotification('Screen capturing is either denied or not supported. Please install chrome extension for screen capturing');
                    } else if (isFirefox) {
                        shownotification(Firefox_Screen_Capturing_Warning);
                    }

                    console.error(error);
                });
            });
        }

        var Firefox_Screen_Capturing_Warning = 'Make sure that you are using Firefox Nightly and you enabled: media.getusermedia.screensharing.enabled flag from about:config page. You also need to add your domain in "media.getusermedia.screensharing.allowed_domains" flag.';

        this.sharescr = function(roomid) {
            alert("share new screen");
            captureUserMedia(function() {
                !signaler && initSignaler(roomid);
                signaler.broadcast({
                    roomid: (roomid && roomid.length) || self.channel,
                    userid: self.userid
                });
            });
        };

        this.view = function(room) {
            !signaler && initSignaler();
            signaler.join({
                to: room.userid,
                roomid: room.roomid
            });
        };

        this.check = initSignaler;
    };

    // it is a backbone objectc
    function Signaler(root, roomid) {
        var socket;

        // unique identifier for the current user
        var userid = root.userid || getToken();

        if (!root.userid) {
            root.userid = userid;
        }

        // self instance
        var signaler = this;

        // object to store all connected peers
        var peers = {};

        // object to store ICE candidates for answerer
        var candidates = {};

        var numberOfParticipants = 0;

        // it is called when your signaling implementation fires "onmessage"
        this.onmessage = function(message) {
            // if new room detected
            console.log(signaler.sentParticipationRequest);
            console.log(roomid , " " , message);
            if(message.roomid!=null && message.userid!=null){
                screen_roomid =message.roomid;
                screen_userid =message.userid;
                shownotification(" Incoming shared screen ");
            }
            if (message.roomid == roomid && message.broadcasting && !signaler.sentParticipationRequest){
                screen.onscreen(message);
            }else {
                // for pretty logging
                console.debug(JSON.stringify(message, function(key, value) {
                    if (value.sdp) {
                        console.log(value.sdp.type, '————', value.sdp.sdp);
                        return '';
                    } else return value;
                }, '————'));
            }

            // if someone shared SDP
            if (message.sdp && message.to == userid)
                this.onsdp(message);

            // if someone shared ICE
            if (message.candidate && message.to == userid)
                this.onice(message);

            // if someone sent participation request
            if (message.participationRequest && message.to == userid) {
                var _options = options;
                _options.to = message.userid;
                _options.stream = root.stream;
                peers[message.userid] = Offer.createOffer(_options);
                numberOfParticipants++;
                if (root.onNumberOfParticipantsChnaged) root.onNumberOfParticipantsChnaged(numberOfParticipants);
            }
        };

        // if someone shared SDP
        this.onsdp = function(message) {
            var sdp = JSON.parse(message.sdp);

            if (sdp.type == 'offer') {
                var _options = options;
                _options.stream = root.stream;
                _options.sdp = sdp;
                _options.to = message.userid;
                peers[message.userid] = Answer.createAnswer(_options);
            }

            if (sdp.type == 'answer') {
                peers[message.userid].setRemoteDescription(sdp);
            }
        };

        // if someone shared ICE
        this.onice = function(message) {
            message.candidate = JSON.parse(message.candidate);

            var peer = peers[message.userid];
            if (!peer) {
                var candidate = candidates[message.userid];
                if (candidate) candidates[message.userid][candidate.length] = message.candidate;
                else candidates[message.userid] = [message.candidate];
            } else {
                peer.addIceCandidate(message.candidate);

                var _candidates = candidates[message.userid] || [];
                if (_candidates.length) {
                    for (var i = 0; i < _candidates.length; i++) {
                        peer.addIceCandidate(_candidates[i]);
                    }
                    candidates[message.userid] = [];
                }
            }
        };

        // it is passed over Offer/Answer objects for reusability
        var options = {
            onsdp: function(sdp, to) {
                console.log('local-sdp', JSON.stringify(sdp.sdp, null, '\t'));

                signaler.signal({
                    sdp: JSON.stringify(sdp),
                    to: to
                });
            },
            onicecandidate: function(candidate, to) {
                signaler.signal({
                    candidate: JSON.stringify(candidate),
                    to: to
                });
            },
            onaddstream: function(stream, _userid) {
                console.log('onaddstream>>>>>>'+ stream);
                //document.getElementById("viewScreenShareButton").disabled=false;
                /*document.getElementById("viewScreenShareButton").removeAttribute("disabled");*/

                stream.onended = function() {
                    if (root.onuserleft) root.onuserleft(_userid);
                };

                var video = document.createElement('video');
                video.id = _userid;
                video[isFirefox ? 'mozSrcObject' : 'src'] = isFirefox ? stream : window.webkitURL.createObjectURL(stream);
                video.autoplay = true;
                video.controls = true;
                video.play();

                function onRemoteStreamStartsFlowing() {
                    if (isMobileDevice) {
                        return afterRemoteStreamStartedFlowing();
                    }

                    if (!(video.readyState <= HTMLMediaElement.HAVE_CURRENT_DATA || video.paused || video.currentTime <= 0)) {
                        afterRemoteStreamStartedFlowing();
                    } else
                        setTimeout(onRemoteStreamStartsFlowing, 300);
                }

                function afterRemoteStreamStartedFlowing() {
                    if (!screen.onaddstream) return;
                    screen.onaddstream({
                        video: video,
                        stream: stream,
                        userid: _userid,
                        type: 'remote'
                    });
                }

                onRemoteStreamStartsFlowing();
            }
        };

        // call only for session initiator
        this.broadcast = function(_config) {
            signaler.roomid = _config.roomid || getToken();

            if (_config.userid) {
                userid = _config.userid;
            }

            signaler.isbroadcaster = true;
            (function transmit() {
                signaler.signal({
                    roomid: signaler.roomid,
                    broadcasting: true
                });

                if (!signaler.stopBroadcasting && !root.transmitOnce)
                    setTimeout(transmit, 3000);
            })();

            // if broadcaster leaves; clear all JSON files from Firebase servers
            if (socket.onDisconnect) socket.onDisconnect().remove();
        };

        // called for each new participant
        this.join = function(_config) {
            signaler.roomid = _config.roomid;
            this.signal({
                participationRequest: true,
                to: _config.to
            });
            signaler.sentParticipationRequest = true;
        };

        window.addEventListener('beforeunload', function() {
            leaveRoom();
        }, false);

        window.addEventListener('keyup', function(e) {
            if (e.keyCode == 116) {
                leaveRoom();
            }
        }, false);

        function leaveRoom() {
            signaler.signal({
                leaving: true
            });
            alert("Leaving");
            socket.emit("leave-channel", {
                channel: rtcMultiConnection.channel,
                sender: rtcMultiConnection.userid
            });

            // stop broadcasting room
            if (signaler.isbroadcaster) signaler.stopBroadcasting = true;

            // leave user media resources
            if (root.stream) root.stream.stop();

            // if firebase; remove data from their servers
            if (window.Firebase) socket.remove();
        }

        root.leave = leaveRoom;

        // signaling implementation
        // if no custom signaling channel is provided; use Firebase
        if (!root.openSignalingChannel) {
            if (!window.Firebase) throw 'You must link <https://cdn.firebase.com/v0/firebase.js> file.';

            // Firebase is capable to store data in JSON format
            // root.transmitOnce = true;
            socket = new window.Firebase('https://' + (root.firebase || 'signaling') + '.firebaseIO.com/' + root.channel);
            socket.on('child_added', function(snap) {
                var data = snap.val();

                var isRemoteMessage = false;
                if (typeof userid === 'number' && parseInt(data.userid) != userid) {
                    isRemoteMessage = true;
                }
                if (typeof userid === 'string' && data.userid + '' != userid) {
                    isRemoteMessage = true;
                }

                if (isRemoteMessage) {
                    if (data.to) {
                        if (typeof userid == 'number') data.to = parseInt(data.to);
                        if (typeof userid == 'string') data.to = data.to + '';
                    }

                    if (!data.leaving) signaler.onmessage(data);
                    else {
                        numberOfParticipants--;
                        if (root.onNumberOfParticipantsChnaged) {
                            root.onNumberOfParticipantsChnaged(numberOfParticipants);
                        }

                        root.onuserleft(data.userid);
                    }
                }

                // we want socket.io behavior; 
                // that's why data is removed from firebase servers 
                // as soon as it is received
                // data.userid != userid && 
                if (isRemoteMessage) snap.ref().remove();
            });

            // method to signal the data
            this.signal = function(data) {
                data.userid = userid;
                socket.push(data);
            };
        } else {
            // custom signaling implementations
            // e.g. WebSocket, Socket.io, SignalR, WebSycn, XMLHttpRequest, Long-Polling etc.
            socket = root.openSignalingChannel(function(message) {
                message = JSON.parse(message);

                var isRemoteMessage = false;
                if (typeof userid === 'number' && parseInt(message.userid) != userid) {
                    isRemoteMessage = true;
                }
                if (typeof userid === 'string' && message.userid + '' != userid) {
                    isRemoteMessage = true;
                }

                if (isRemoteMessage) {
                    if (message.to) {
                        if (typeof userid == 'number') message.to = parseInt(message.to);
                        if (typeof userid == 'string') message.to = message.to + '';
                    }

                    if (!message.leaving) signaler.onmessage(message);
                    else {
                        root.onuserleft(message.userid);
                        numberOfParticipants--;
                        if (root.onNumberOfParticipantsChnaged) root.onNumberOfParticipantsChnaged(numberOfParticipants);
                    }
                }
            });

            // method to signal the data
            this.signal = function(data) {
                data.userid = userid;
                socket.send(JSON.stringify(data));
            };
        }
    }

    navigator.getUserMedia = navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
    var isFirefox = !!navigator.mozGetUserMedia;
    var isChrome = !!navigator.webkitGetUserMedia;
    var isMobileDevice = !!navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile/i);

    var iceServers=[];

    var optionalArgument = {
        optional: [{
            DtlsSrtpKeyAgreement: true
        }]
    };

    function getToken() {
        return Math.round(Math.random() * 9999999999) + 9999999999;
    }

    function getIceServersAsArray(iceServers){
        if (!isNull(iceServers)) {
            console.log(toStr(iceServers));
            var iceTransports='all';
            var iceCandidates = this.rtcMultiConnection.candidates;

            var stun = iceCandidates.stun;
            var turn = iceCandidates.turn;
            var host = iceCandidates.host;

            if (!isNull(iceCandidates.reflexive)) stun = iceCandidates.reflexive;
            if (!isNull(iceCandidates.relay)) turn = iceCandidates.relay;

            if (!host && !stun && turn) {
                iceTransports = 'relay';
            } else if (!host && !stun && !turn) {
                iceTransports = 'none';
            }

            this.iceServers = {
                iceServers: iceServers,
                iceTransports: iceTransports
            };
        } else {
            iceServers = null;
        }

        console.log('ScreenSharing --> rtc-configuration', toStr(this.iceServers));    

        return this.iceServers;
    }

    function onSdpSuccess() {}

    function onSdpError(e) {
        console.error('sdp error:', e);
    }

    var offerConstraints = {
        optional: [],
        mandatory: {
            OfferToReceiveAudio: false,
            OfferToReceiveVideo: false
        }
    };
    var Offer = {
        createOffer: function(config) {
            iceServers=getIceServersAsArray(webrtcdevIceServers);
            var peer = new RTCPeerConnection(iceServers, optionalArgument);

            peer.addStream(config.stream);
            peer.onicecandidate = function(event) {
                if (event.candidate) config.onicecandidate(event.candidate, config.to);
            };

            peer.createOffer(function(sdp) {
                sdp.sdp = setBandwidth(sdp.sdp);
                peer.setLocalDescription(sdp);
                config.onsdp(sdp, config.to);
            }, onSdpError, offerConstraints);

            this.peer = peer;

            return this;
        },
        setRemoteDescription: function(sdp) {
            console.log("Screen share-->setting Offer remote descriptions", sdp.sdp);
            this.peer.setRemoteDescription(new RTCSessionDescription(sdp), onSdpSuccess, onSdpError);
        },
        addIceCandidate: function(candidate) {
            console.log("Screen share-->adding ice", candidate.candidate);
            this.peer.addIceCandidate(new RTCIceCandidate({
                sdpMLineIndex: candidate.sdpMLineIndex,
                candidate: candidate.candidate
            }));
        }
    };

    var answerConstraints = {
        optional: [],
        mandatory: {
            OfferToReceiveAudio: false,
            OfferToReceiveVideo: true
        }
    };
    var Answer = {
        createAnswer: function(config) {
            iceServers=getIceServersAsArray(webrtcdevIceServers);
            var peer = new RTCPeerConnection(iceServers, optionalArgument);

            peer.onaddstream = function(event) {
                config.onaddstream(event.stream, config.to);
            };
            peer.onicecandidate = function(event) {
                if (event.candidate) config.onicecandidate(event.candidate, config.to);
            };

            peer.setRemoteDescription(new RTCSessionDescription(config.sdp), onSdpSuccess, onSdpError);
            peer.createAnswer(function(sdp) {
                sdp.sdp = setBandwidth(sdp.sdp);
                peer.setLocalDescription(sdp);
                config.onsdp(sdp, config.to);
            }, onSdpError, answerConstraints);

            this.peer = peer;
            return this;
        },
        addIceCandidate: function(candidate) {
            this.peer.addIceCandidate(new RTCIceCandidate({
                sdpMLineIndex: candidate.sdpMLineIndex,
                candidate: candidate.candidate
            }));
        }
    };

    function setBandwidth(sdp) {
        if (isFirefox) return sdp;
        if (isMobileDevice) return sdp;

        // https://cdn.rawgit.com/muaz-khan/RTCMultiConnection/master/RTCMultiConnection-v3.0/dev/BandwidthHandler.js
        if (typeof BandwidthHandler !== 'undefined') {
            window.isMobileDevice = isMobileDevice;
            window.isFirefox = isFirefox;

            var bandwidth = {
                screen: 300, // 300kbits minimum
                video: 256 // 256kbits (both min-max)
            };
            var isScreenSharing = false;

            sdp = BandwidthHandler.setApplicationSpecificBandwidth(sdp, bandwidth, isScreenSharing);
            sdp = BandwidthHandler.setVideoBitrates(sdp, {
                min: bandwidth.video,
                max: bandwidth.video
            });
            return sdp;
        }

        // removing existing bandwidth lines
        sdp = sdp.replace(/b=AS([^\r\n]+\r\n)/g, '');

        // "300kbit/s" for screen sharing
        sdp = sdp.replace(/a=mid:video\r\n/g, 'a=mid:video\r\nb=AS:300\r\n');

        return sdp;
    }


    !window.getScreenId && loadScript('getScreenId.js');
}

function webrtcdevScreenShare(){

    try{
        screen = new Screen("screen"+rtcMultiConnection.channel);

        console.log("----------- screen" , screen);

        screen.onaddstream = function(e) {
            document.getElementById(screenshareobj.screenshareContainer).innerHTML="";
            document.getElementById(screenshareobj.screenshareContainer).appendChild(e.video);
            document.getElementById(screenshareobj.screenshareContainer).hidden=false;
            if(e.type!="remote"){
                screen.openSignalingChannel = function(callback) {
                    var n= io.connect("/"+rtcMultiConnection.channel);
                    n.channel = t;
                    return n.on('message', callback);
                };
            }

            createScreenViewButton();

        };

        screen.check();

        screen.onuserleft = function(userid) {
            document.getElementById(screenshareobj.screenshareContainer).hidden=true;
            /*       
            var video = document.getElementById(userid);
            if(video) {
               // video.parentNode.removeChild(video);
            }*/
        };

        
        /*
        screen.onscreen = function(screen) {
            alert("onscreen  1"+screen);
            if (self.detectedRoom) return;
            self.detectedRoom = true;
            self.view(screen);
        };*/
    }catch(e){
        console.log("------------screenshare not supported ");
        $("#screenShareButton").hide();
        $("#viewScreenShareButton").hide();
        console.log(e);
    }
}

function createScreenViewButton(){
    var viewScreenShareButton= document.createElement("span");
    viewScreenShareButton.className=screenshareobj.button.viewButton.class_on;
    viewScreenShareButton.innerHTML=screenshareobj.button.viewButton.html_on;;
    viewScreenShareButton.id="viewScreenShareButton";
    viewScreenShareButton.onclick = function() {
        if(viewScreenShareButton.className==screenshareobj.button.viewButton.class_off){
            document.getElementById(screenshareobj.screenshareContainer).hidden=false;
            viewScreenShareButton.className=screenshareobj.button.viewButton.class_on;
            viewScreenShareButton.innerHTML=screenshareobj.button.viewButton.html_on;
        }else if(viewScreenShareButton.className==screenshareobj.button.viewButton.class_on){
            document.getElementById(screenshareobj.screenshareContainer).hidden=true;
            viewScreenShareButton.className=screenshareobj.button.viewButton.class_off;
            viewScreenShareButton.innerHTML=screenshareobj.button.viewButton.html_off;
        }
    };

    var li =document.createElement("li");
    li.appendChild(viewScreenShareButton);
    document.getElementById("topIconHolder_ul").appendChild(li);
}

function hideScreenViewButton(){
    document.getElementById("viewScreenShareButton").hidden=true;
}

function createScreenInstallButton(){
    var screenShareButton= document.createElement("span");
        screenShareButton.className=screenshareobj.button.installButton.class_off;
        screenShareButton.innerHTML=screenshareobj.button.installButton.html_off;
        screenShareButton.id="screeninstallButton";
        screenShareButton.onclick = function(e) {    
            chrome.webstore.install("https://chrome.google.com/webstore/detail/"+extensionID 
            ,function(){
                console.log("Chrome extension inline installation - success");
                screenShareButton.hidden=true;
                createScreenshareButton();
            },function (err){
                console.log("Chrome extension inline installation - fail " , err);
            });
            // Prevent the opening of the Web Store page
            e.preventDefault();
        };
        var li =document.createElement("li");
        li.appendChild(screenShareButton);
        document.getElementById("topIconHolder_ul").appendChild(li);
}

function createScreenshareButton(){
    var screenShareButton;
    screenShareButton= document.createElement("span");
    screenShareButton.className=screenshareobj.button.shareButton.class_off;
    screenShareButton.innerHTML=screenshareobj.button.shareButton.html_off;
    screenShareButton.id="screenShareButton";
    screenShareButton.onclick = function(event) {    
        if(screenShareButton.className==screenshareobj.button.shareButton.class_off){
            screen.sharescr();
            screenShareButton.className=screenshareobj.button.shareButton.class_on;
            screenShareButton.innerHTML=screenshareobj.button.shareButton.html_on;
        }else if(screenShareButton.className==screenshareobj.button.shareButton.class_on){
            screen.leave();
            var elem = document.getElementById("viewScreenShareButton");
            elem.parentElement.removeChild(elem);
            screenShareButton.className=screenshareobj.button.shareButton.class_off;
            screenShareButton.innerHTML=screenshareobj.button.shareButton.html_off;
            hideScreenViewButton();
        }
    };
    var li =document.createElement("li");
    li.appendChild(screenShareButton);
    document.getElementById("topIconHolder_ul").appendChild(li);
}


/*screen  Object {broadcasting: true, roomid: 11, userid: 10494752123}*/


/**************************************************************************8
draw 
******************************************************************************/

function webrtcdevCanvasDesigner(){
    try{
        CanvasDesigner.addSyncListener(function(data) {
            rtcMultiConnection.send({type:"canvas", draw:data});
        });

        CanvasDesigner.setSelected('pencil');

        CanvasDesigner.setTools({
            pencil: true,
            eraser: true
        });

        CanvasDesigner.appendTo(document.getElementById(drawCanvasobj.drawCanvasContainer));
    }catch( e){
        console.log(" Canvas drawing not supported ");
        console.log(e);
    }
}
function createdrawButton(){
    var drawButton= document.createElement("span");
    drawButton.className=drawCanvasobj.button.class_off ;
    drawButton.innerHTML=drawCanvasobj.button.html_off;
    drawButton.onclick=function(){
        if(drawButton.className==drawCanvasobj.button.class_off){
            drawButton.className= drawCanvasobj.button.class_on ;
            drawButton.innerHTML= drawCanvasobj.button.html_on;
            webrtcdevCanvasDesigner();
            document.getElementById(drawCanvasobj.drawCanvasContainer).hidden=false;
        }else if(drawButton.className==drawCanvasobj.button.class_on){
            drawButton.className= drawCanvasobj.button.class_off ;
            drawButton.innerHTML= drawCanvasobj.button.html_off;
            document.getElementById(drawCanvasobj.drawCanvasContainer).hidden=true;
        }
    };
    var li =document.createElement("li");
    li.appendChild(drawButton);
    document.getElementById("topIconHolder_ul").appendChild(li);
}
function createButtonRedial(){
    var reconnectButton= document.createElement("span");
    reconnectButton.className= reconnectobj.button.class;
    reconnectButton.innerHTML= reconnectobj.button.html;
    reconnectButton.onclick=function(){
        var r = confirm("Do you want to reconnet ?");
        if (r == true) {
           location.reload();
        } else {
           //do nothing
        }
    };
    var li =document.createElement("li");
    li.appendChild(reconnectButton);
    document.getElementById("topIconHolder_ul").appendChild(li);
}

/***************************************************************************
cursor sharing 
***************************************************************************/

function placeCursor(element , x_pos, y_pos) {
  var d = document.getElementById(element);
  d.style.position = "absolute";
  d.style.left = x_pos+'px';
  d.style.top = y_pos+'px';
}
  
var cursorX;
var cursorY;

/*document.onmousemove = function(e){
    cursorX = e.pageX;
    cursorY = e.pageY;
}
*/
//setInterval("shareCursor()", 500);

/*function shareCursor(){
    rtcMultiConnection.send({
        type:"pointer", 
        corX: cursorX , 
        corY: cursorY
    });
    placeCursor("cursor1" , cursorX, cursorY);
}
*/
function createCodeEditorButton(){
    var codeeditorButton= document.createElement("span");
    codeeditorButton.className=codeeditorobj.button.class_off ;
    codeeditorButton.innerHTML=codeeditorobj.button.html_off;
    for( x in codeeditorobj.languages)
        document.getElementById("CodeStyles").innerHTML=document.getElementById("CodeStyles").innerHTML+codeeditorobj.languages[x];

    var codeArea= document.getElementById("codeArea").value;
    var modeVal="text/javascript"; 

    editor = CodeMirror.fromTextArea(document.getElementById("codeArea"), {
         mode: modeVal,
         styleActiveLine: true,
         lineNumbers: false,
         lineWrapping: true
    });
    editor.setOption('theme', 'mdn-like');

    codeeditorButton.onclick=function(){
        if(codeeditorButton.className==codeeditorobj.button.class_off){
            codeeditorButton.className= codeeditorobj.button.class_on ;
            codeeditorButton.innerHTML= codeeditorobj.button.html_on;
            startWebrtcdevcodeeditorSync();
            document.getElementById(codeeditorobj.codeeditorContainer).hidden=false;
        }else if(codeeditorButton.className==codeeditorobj.button.class_on){
            codeeditorButton.className= codeeditorobj.button.class_off ;
            codeeditorButton.innerHTML= codeeditorobj.button.html_off;
            stopWebrtcdevcodeeditorSync();
            document.getElementById(codeeditorobj.codeeditorContainer).hidden=true;
        }
    };

    var li =document.createElement("li");
    li.appendChild(codeeditorButton);
    document.getElementById("topIconHolder_ul").appendChild(li);
}

/*************************************************************************
code Editor
******************************************************************************/
function sendWebrtcdevCodeeditorSync(evt){
    if(evt.which ==  37 || evt.which ==  38 || evt.which ==  39 || evt.which ==  40  || evt.which==17 || evt.which == 18|| evt.which == 16){
        return true; 
    }

    var tobj ={
        "option" : "text",
        "codeContent": editor.getValue()
    }
    console.log(" sending " , tobj);
    rtcMultiConnection.send({
            type: "codeeditor", 
            data: tobj
    });
}

function sendWebrtcdevCodeeditorStyleSync(evt){
    $("#CodeStyles option:selected").each(function() {
      var info = CodeMirror.findModeByMIME( $( this ).attr('mime')); 
      if (info) {
        mode = info.mode;
        spec = $( this ).attr('mime');
        editor.setOption("mode", spec);
        CodeMirror.autoLoadMode(editor, mode);
        //console.log(info + " "+ mode+ " "+ spec + " "+ editor);
      }
    });

    var tobj ={
        "option" : "menu",
        "codeMode":mode,
        "codeSpec":spec
    }

    console.log(" sending " , tobj);
    rtcMultiConnection.send({
            type: "codeeditor", 
            data: tobj
    });
}

function receiveWebrtcdevCodeeditorSync(data){
    console.log("codeeditor " , data);
    if(data.option=="text"){
        var pos = editor.getCursor();
        editor.setValue(data.codeContent);
        editor.setCursor(pos);
    }else if(data.option=="menu"){
        editor.setOption("mode", evt.data.codeSpec);
        CodeMirror.autoLoadMode(editor, evt.data.codeMode);
    }
}

function startWebrtcdevcodeeditorSync(){
    document.getElementById(codeeditorobj.codeeditorContainer).addEventListener("keyup", sendWebrtcdevCodeeditorSync, false);
     document.getElementById("CodeStyles").addEventListener("change", sendWebrtcdevCodeeditorStyleSync, false);
}

function stopWebrtcdevcodeeditorSync(){
    document.getElementById(codeeditorobj.codeeditorContainer).removeEventListener("keyup", sendWebrtcdevCodeeditorSync, false);
}

function createTextEditorButton(){
    var texteditorButton= document.createElement("span");
    texteditorButton.className=texteditorobj.button.class_off ;
    texteditorButton.innerHTML=texteditorobj.button.html_off;

    texteditorButton.onclick=function(){
        if(texteditorButton.className==texteditorobj.button.class_off){
            texteditorButton.className= texteditorobj.button.class_on ;
            texteditorButton.innerHTML= texteditorobj.button.html_on;
            startWebrtcdevTexteditorSync();
            document.getElementById(texteditorobj.texteditorContainer).hidden=false;
        }else if(texteditorButton.className==texteditorobj.button.class_on){
            texteditorButton.className= texteditorobj.button.class_off ;
            texteditorButton.innerHTML= texteditorobj.button.html_off;
            stopWebrtcdevTexteditorSync();
            document.getElementById(texteditorobj.texteditorContainer).hidden=true;
        }
    };
    var li =document.createElement("li");
    li.appendChild(texteditorButton);
    document.getElementById("topIconHolder_ul").appendChild(li);
}
        
/*************************************************************************
Text Editor
******************************************************************************/

function sendWebrtcdevTexteditorSync(evt){
    // Left: 37 Up: 38 Right: 39 Down: 40 Esc: 27 SpaceBar: 32 Ctrl: 17 Alt: 18 Shift: 16 Enter: 13
    if(evt.which ==  37 || evt.which ==  38 || evt.which ==  39 || evt.which ==  40  || evt.which==17 || evt.which == 18|| evt.which == 16){
        return true; // handle left up right down  control alt shift
    }

    var tobj ={
        "option" : "text",
        "content": document.getElementById(texteditorobj.texteditorContainer).value
    }
    console.log(" sending " , document.getElementById(texteditorobj.texteditorContainer).value);
    rtcMultiConnection.send({
            type: "texteditor", 
            data: tobj
    });
}

function receiveWebrtcdevTexteditorSync(data){
    console.log("texteditor " , data);
    if(data.option=="text"){
        document.getElementById(texteditorobj.texteditorContainer).value=data.content;
    }
}

function startWebrtcdevTexteditorSync(){
    document.getElementById(texteditorobj.texteditorContainer).addEventListener("keyup", sendWebrtcdevTexteditorSync, false);
}

function stopWebrtcdevTexteditorSync(){
    document.getElementById(texteditorobj.texteditorContainer).removeEventListener("keyup", sendWebrtcdevTexteditorSync, false);
}
