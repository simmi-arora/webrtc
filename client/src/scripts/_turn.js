/*********************************************
ICE
**************************************************/
/**
 * {@link https://github.com/altanai/webrtc/blob/master/client/build/scripts/_turn.js|TURN} 
 * @summary JavaScript audio/video recording library runs top over WebRTC getUserMedia API.
 * @author {@link https://telecom.altanai.com/about-me/|Altanai}
 * @typedef _turn.js
 * @function
 * @example
 *  turn    = (session.hasOwnProperty('turn')?session.turn:null);
 *  if(turn!=null ){
 *       getICEServer( turn.username ,turn.secretkey , turn.domain,
 *                      turn.application , turn.room , turn.secure); 
 *   }
 */

var iceServers=[];
function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        xhr = null;
    }
    return xhr;
}

function getICEServer(username , secretkey , domain , appname , roomname , secure){
    var url = 'https://service.xirsys.com/ice';
    var xhr = createCORSRequest('POST', url);
    xhr.onload = function () {
        webrtcdev.log(xhr.responseText);
        if(JSON.parse(xhr.responseText).d==null){
            webrtcdevIceServers = "err";
            shownotification(" media not able to pass through "+ JSON.parse(xhr.responseText).e);
        }else{
            webrtcdevIceServers = JSON.parse(xhr.responseText).d.iceServers;
            webrtcdev.log(" otained iceServers" , webrtcdevIceServers);
        }
    };
    xhr.onerror = function () {
        webrtcdev.error('Woops, there was an error making xhr request.');
    };
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send('ident='+username+'&secret='+secretkey +
        '&domain='+domain +'&application='+appname+
        '&room='+ roomname+'&secure='+secure);
}