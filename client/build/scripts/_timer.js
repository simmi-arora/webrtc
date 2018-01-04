/**************************************************8
Timer 
***************************************************/
var hours,mins,secs;

function startsessionTimer(timerobj){
    hours=document.getElementById(timerobj.counter.hours);
    mins=document.getElementById(timerobj.counter.minutes);
    secs=document.getElementById(timerobj.counter.seconds);

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
}

function startBackwardTimer(){
    console.log("startBackwardTimer", hours ,mins , secs);
    var cd = secs;
    var cdm = mins;
    var c = parseInt(cd.innerHTML,10);
    var m =  parseInt(cdm.innerHTML,10);
    //alert(" Time for session validy is "+m +" minutes :"+ c+ " seconds");
    btimer(cd , c , cdm ,  m);  
}

function startForwardTimer(){
    console.log("forward vtime started ");
    var cd = secs;
    var cdm = mins;
    var c = parseInt(cd.innerHTML,10);
    var m =  parseInt(cdm.innerHTML,10);
    //alert(" Time for session validy is "+m +" minutes :"+ c+ " seconds");
    ftimer(cd , c , cdm ,  m); 
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

var today,zone;

function startTime() {
    today = new Date();
    //console.log(" localdate :" , today);
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);

    if(timerobj.span.currentTime_id && document.getElementById(timerobj.span.currentTime_id)){
        var timerspan = document.getElementById(timerobj.span.currentTime_id);
        timerspan.innerHTML =   h + ":" + m + ":" + s;
        var t = setTimeout(startTime, 500);
    }else{
        console.error(" No place for timerobj.span.currentTime_id");
    }

}

function timeZone(){
    zone=Intl.DateTimeFormat().resolvedOptions().timeZone;
    var timerspan=document.getElementById(timerobj.span.currentTimeZone_id);
    timerspan.innerHTML = zone;
}

function shareTimePeer(){
    var msg={
        type:"timer", 
        time: (today).toJSON() , 
        zone: zone
    };
    rtcConn.send(msg);
}

function startPeersTime(date,zone){
    /*    
    var smday = new Date();
    smday.setHours(h);
    smday.setMinutes(m);
    smday.setSeconds(s);*/
    console.log(" startPeersTime " , date , zone);
    
    var timerspan=document.getElementById(timerobj.span.remoteTimeZone_id);
    timerspan.innerHTML = zone;

    var remotedate = new Date(date);
    //var remotedate = new Date().toLocaleString('en-US', { timeZone: zone });
    console.log(" remotedate :" , remotedate);
    var h = remotedate.getHours();
    var m = remotedate.getMinutes();
    var s = remotedate.getSeconds();

    h = checkTime(h);
    m = checkTime(m);
    s = checkTime(s);
    var timerspan=document.getElementById(timerobj.span.remoteTime_id);
    timerspan.innerHTML =   h + ":" + m + ":" + s;
    var t = setTimeout(startTime, 500);
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