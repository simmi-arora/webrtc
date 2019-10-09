/*-----------------------------------------------------------------------------------*/
/*                        timer JS                                                   */
/*-----------------------------------------------------------------------------------*/
/**
 * {@link https://github.com/altanai/webrtc/blob/master/client/build/scripts/_timer.js|TIMER} 
 * @summary Takes local and remote peers time , localtion and show and shows timer for session
 * @author {@link https://telecom.altanai.com/about-me/|Altanai}
 * @typedef _turn.js
 * @function
 */

var hours,mins,secs;
var today = new Date();
var zone="";
var t ;
var worker = null; 

try{
    //worker = new Worker('js/timekeeper.js');
    // worker.addEventListener('message', function(e) {
    //     if(e.data.time){
    //         let timerspanpeer = getElementById(e.data.remotetimeid);
    //         timerspanpeer.innerHTML = e.data.time;
    //     }

    // }, false);
}catch(e){
    webrtcdev.error("[Timer]" , e)
}
/**
 * function to start session timer with timerobj
 * @method
 * @name startsessionTimer
 * @param {json} timerobj
 */
function startsessionTimer(timerobj){

    if(timerobj.counter.hours && timerobj.counter.minutes && timerobj.counter.seconds ){
        hours = getElementById(timerobj.counter.hours);
        mins = getElementById(timerobj.counter.minutes);
        secs = getElementById(timerobj.counter.seconds);

        if(timerobj.type=="forward"){
            startForwardTimer();
            hours.innerHTML=0;
            mins.innerHTML=0;
            secs.innerHTML=0;

        }else if (timerobj.type=="backward"){
            hours.innerHTML=0;
            mins.innerHTML=3;
            secs.innerHTML=0;
            startBackwardTimer();
        }
    }else{
        webrtcdev.error(" timerobj.counter DOM elemnts not found ");
    }

}

/**
 * function to start forward increasing session timer 
 * @method
 * @name startForwardTimer
 */
function startForwardTimer(){
    webrtcdev.log("[timerjs] startForwardTimer");
    var cd = secs;
    var cdm = mins;
    var c = parseInt(cd.innerHTML,10);
    var m =  parseInt(cdm.innerHTML,10);
    ftimer(cd , c , cdm ,  m); 
}

/**
 * function to start backward decreasing session timer 
 * @method
 * @name startBackwardTimer
 */
function startBackwardTimer(){
    webrtcdev.log("[timerjs] startBackwardTimer", hours ,mins , secs);
    var cd = secs;
    var cdm = mins;
    var c = parseInt(cd.innerHTML,10);
    var m =  parseInt(cdm.innerHTML,10);
    //alert(" Time for session validy is "+m +" minutes :"+ c+ " seconds");
    btimer(cd , c , cdm ,  m);  
}

/**
 * function to start backward decreasing session timer 
 * @method
 * @name Timer
 * @param {cd} timerobj
 * @param {c} timerobj
 * @param {cdm} timerobj
 * @param {m} timerobj
 */
function ftimer(cd , c , cdm , m ){
    var interv = setInterval(function() {
        c++;
        secs.innerHTML= c;

        if (c == 60) {
            c = 0;
            m++;  
            mins.innerHTML = m;                    
        }
    }, 1000);
}

function btimer(cd , c , cdm , m ){
    var interv = setInterval(function() {
        c--;
        secs.innerHTML= c;

        if (c == 0) {
            c = 60;
            m--;  
            mins.innerHTML=m;
            if(m<0)  {
                clearInterval(interv); 
                //alert("time over");
            }                     
        }
    }, 1000);
}

function getDate(){
    var now = new Date();
    return now;
}

function prepareTime(){

}


/**
 * function to start local peers time based on locally captured time zone 
 * @method
 * @name startTime
 */
function startTime() {
    try{

        if(timerobj.span.currentTime_id && getElementById(timerobj.span.currentTime_id)){
            var timerspanlocal = getElementById(timerobj.span.currentTime_id);
            timerspanlocal.innerHTML = new Date().toLocaleTimeString();
            var t = setTimeout(startTime, 1000);
        }else{
            webrtcdev.error(" No place for timerobj.span.currentTime_id");
        }
    }catch(e){
        webrtcdev.error(e);
    }
    //webrtcdev.log(" localdate :" , today);
}


/**
 * creates and appends remotetimecontainer belonging to userid to parentTimecontainer
 * @method
 * @name createRemotetimeArea
 */
function createRemotetimeArea(userid){
    let remotetimecontainer = document.createElement("ul");
    remotetimecontainer.id="remoteTimerArea_"+userid;
    var peerinfo = findPeerInfo(userid);
    if(getElementById(peerinfo.videoContainer)){
        var parentTimecontainer = getElementById(peerinfo.videoContainer).parentNode;
        parentTimecontainer.appendChild(remotetimecontainer);
        return remotetimecontainer;
    }else{
        return null;
    }
}

/**
 * function to fetch and show local peers time zone based on locally captured values
 * @method
 * @name peertimeZone
 * @param {str} zone
 * @param {id} userid
 */
function peerTimeZone(zone , userid){
    try{
        if(timerobj.span.remoteTimeZone_id && 
            getElementById(timerobj.span.remoteTimeZone_id) && 
            !getElementById(timerobj.span.remoteTimeZone_id).innerHTML){
            let timerzonepeer = getElementById(timerobj.span.remoteTimeZone_id);
            timerzonepeer.innerHTML = zone;
        }else{
            webrtcdev.warn("timerobj.span.remoteTimeZone_id DOM doesnt exist , creating it ");
            
            if(getElementById("remoteTimeZone_"+userid))
            return ;

            let timerzonepeer = document.createElement("li");
            timerzonepeer.id= "remoteTimeZone_"+userid;
            timerzonepeer.innerHTML = zone + " , ";

            var remotetimecontainer;
            if(!getElementById("remoteTimerArea_"+userid)){
                remotetimecontainer = createRemotetimeArea(userid);
            }else{
                remotetimecontainer = getElementById("remoteTimerArea_"+userid);
            }
            remotetimecontainer.appendChild(timerzonepeer);
        }
    }catch(e){
        webrtcdev.error(e);
    }
}



/**
 * function to fetch and show Peers peers time based on onmesaage val
 * @name startPeersTime
 * @param {date} date
 * @param {str} zone
 * @param {id} userid
 */

var startPeersTime = function (date,zone,userid){
    
    try{
        var tobj=[];
        
        // Starting peer timer for all peers
        for(var x in webcallpeers){

            webrtcdev.debug(" [timerjs] startPeersTime for " , userid);

            if( window.location.href.indexOf("conference") > -1 && getElementById("remoteTimeDate_"+webcallpeers[x].userid)){
                //if its conference , send to webworkers 
                webrtcdev.info(" timerobj.span.remoteTime_id exist for local and remotes, appending to tobj to send to worker cumulatively");
                tobj.push({
                    zone: webcallpeers[x].zone, 
                    userid :webcallpeers[x].userid,
                    remotetimeid : "remoteTimeDate_"+webcallpeers[x].userid
                });

            } else if(timerobj.span.remoteTime_id && getElementById(timerobj.span.remoteTime_id)){
                // update the time for p2p
                webrtcdev.info(" timerobj.span.remoteTime_id exists and its a p2p session , hence updating it");
                options = {
                  //year: 'numeric', month: 'numeric', day: 'numeric',
                  hour: 'numeric', minute: 'numeric', second: 'numeric',
                  hour12: false,
                  timeZone: webcallpeers[x].zone
                };
                let timerspanpeer = getElementById(timerobj.span.remoteTime_id);
                timerspanpeer.innerHTML = new Date().toLocaleString('en-US', options );
            } else {
                // create the timer for p2p and conferences
                webrtcdev.info(" timerobj.span.remoteTime_id DOM does not exist , creating it" ,
                    timerobj.span.remoteTime_id , getElementById(timerobj.span.remoteTime_id)  );

                if(getElementById("remoteTimeDate_"+userid))
                return ;

                let timerspanpeer = document.createElement("li");
                timerspanpeer.id= "remoteTimeDate_"+userid;
                timerspanpeer.innerHTML = new Date().toLocaleString('en-US', options );

                var remotetimecontainer;
                if(!getElementById("remoteTimerArea_"+userid)){
                    remotetimecontainer = createRemotetimeArea(userid);
                }else{
                    remotetimecontainer = getElementById("remoteTimerArea_"+userid);
                }
                remotetimecontainer.appendChild(timerspanpeer);

                if(window.location.href.indexOf("conference") <= -1){
                    // if its not conf then loop for p2p
                    var t = setTimeout(startPeersTime, 5000);
                }
            }
            peerTimerStarted = true;
        }
        
        webrtcdev.info("[timerjs] tobj " , tobj);
        if(tobj.length > 0){
            worker.postMessage(tobj);
        }

    }catch(e){
        webrtcdev.error(e);   
    }
}


/**
 * function to fetch and show local peers time zone based on locally captured values
 * @method
 * @name timeZone
 */
function timeZone(){
    try{
        if(timerobj.span.currentTimeZone_id && getElementById(timerobj.span.currentTimeZone_id)){
            zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            var timerzonelocal = getElementById(timerobj.span.currentTimeZone_id);
            timerzonelocal.innerHTML = zone;
        }else{
            webrtcdev.error(" timerobj.span.currentTimeZone_id DOM doesnt exist ");
        }
    }catch(e){
        webrtcdev.error(e);
    }
}

/**
 * function to share local tiem and zone to other peer
 * @name shareTimePeer
 */
function shareTimePeer(){
    try{
        var msg={
            type:"timer", 
            time: (today).toJSON() , 
            zone: zone
        };
        rtcConn.send(msg);
    }catch(e){
        webrtcdev.error(e);   
    }
}

/**
 * function to activateButtons
 * @name activateButtons
 */
function activateBttons(timerobj){
    if(timerobj.container.minbutton_id && getElementById(timerobj.container.minbutton_id)){
        var button= getElementById(timerobj.container.minbutton_id);
        button.onclick=function(e){
            if(getElementById(timerobj.container.id).hidden)
                getElementById(timerobj.container.id).hidden=false;
            else
                getElementById(timerobj.container.id).hidden=true;
        }  
    }
}

function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}

/*-----------------------------------------------------------------------------------*/