/**************************************************8
Timer 
***************************************************/
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

/**
 * function to start session timer with timerobj
 * @method
 * @name startsessionTimer
 * @param {json} timerobj
 */
function startsessionTimer(timerobj){

    if(timerobj.counter.hours && timerobj.counter.minutes && timerobj.counter.seconds ){
        hours = document.getElementById(timerobj.counter.hours);
        mins = document.getElementById(timerobj.counter.minutes);
        secs = document.getElementById(timerobj.counter.seconds);

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
    //alert(" Time for session validy is "+m +" minutes :"+ c+ " seconds");
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

        if(timerobj.span.currentTime_id && document.getElementById(timerobj.span.currentTime_id)){
            var timerspanlocal = document.getElementById(timerobj.span.currentTime_id);
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
 * function to fetch and show local peers time zone based on locally captured values
 * @method
 * @name startTime
 */
function timeZone(){
    try{
        if(timerobj.span.currentTimeZone_id && document.getElementById(timerobj.span.currentTimeZone_id)){
            zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            var timerzonelocal = document.getElementById(timerobj.span.currentTimeZone_id);
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
 * function to fetch and show local peers time zone based on locally captured values
 * @method
 * @name startTime
 */
function peertimeZone(zone ){
    try{
        if(timerobj.span.remoteTimeZone_id && 
            document.getElementById(timerobj.span.remoteTimeZone_id) && 
            !document.getElementById(timerobj.span.remoteTimeZone_id).innerHTML){
            let timerzonepeer = document.getElementById(timerobj.span.remoteTimeZone_id);
            timerzonepeer.innerHTML = zone;
        }else{
            webrtcdev.error("timerobj.span.remoteTimeZone_id DOM doesnt exist ");
        }
    }catch(e){
        webrtcdev.error(e);
    }
}

/**
 * function to fetch and show Peers peers time based on onmesaage val
 * @name startPeersTime
 */
var remotetime;
var remotezone;

function startPeersTime(date,zone){
    
    try{

        if(!remotetime) remotetime = date;
        if(!remotezone) remotezone = zone;
        //webrtcdev.log(" [timerjs] startPeersTime " , remotetime , remotezone);

        options = {
          //year: 'numeric', month: 'numeric', day: 'numeric',
          hour: 'numeric', minute: 'numeric', second: 'numeric',
          hour12: false,
          timeZone: remotezone 
        };

        if(timerobj.span.remoteTime_id && document.getElementById(timerobj.span.remoteTime_id)){
            let timerspanpeer = document.getElementById(timerobj.span.remoteTime_id);
            //timerspanpeer.innerHTML = new Date().toLocaleString('', { timeZone: zone})
           timerspanpeer.innerHTML = new Date().toLocaleString('en-US', options );
           //timerspanpeer.innerHTML = new Intl.DateTimeFormat('en-US', options ).format(date);
           
            var t = setTimeout(startPeersTime, 1000);
        }else{
            webrtcdev.info(" timerobj.span.remoteTime_id DOM does not exist");
        }
    }catch(e){
        webrtcdev.error(e);   
    }
}

function activateBttons(timerobj){
    if(timerobj.container.minbutton_id && document.getElementById(timerobj.container.minbutton_id)){
        var button= document.getElementById(timerobj.container.minbutton_id);
        button.onclick=function(e){
            if(document.getElementById(timerobj.container.id).hidden)
                document.getElementById(timerobj.container.id).hidden=false;
            else
                document.getElementById(timerobj.container.id).hidden=true;
        }  
    }
}

function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}