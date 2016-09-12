
/**************************************************8
Timer 
***************************************************/
function startsessionTimer(timer){
    if(timer.style=="forward"){
        startForwardTimer();
    }else if (timer.style=="backward"){
        startBackwardTimer();
    }
}

function startBackwardTimer(){
    var cd = $('#countdownSecond');
    var cdm = $('#countdownMinutes');
    var c = parseInt(cd.text(),10);
    var m =  parseInt(cdm.text(),10);
    //alert(" Time for session validy is "+m +" minutes :"+ c+ " seconds");
    timer(cd , c , cdm ,  m);  
}

function startForwardTimer(){
    alert("time started ");
}

function timer(cd , c , cdm , m ){
    console.log(m);
    var interv = setInterval(function() {
        c--;
        cd.html(c);

        if (c == 0) {
            c = 60;
            m--;  
            $('#countdownMinutes').html(m);
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

function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    var timerspan=document.getElementById(timerobj.span.currentTime_id);
    timerspan.innerHTML =   h + ":" + m + ":" + s;
    var t = setTimeout(startTime, 500);
}
function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}

function timeZone(){
    var timerspan=document.getElementById(timerobj.span.currentTimeZonr_id);
    timerspan.innerHTML = Intl.DateTimeFormat().resolvedOptions().timeZone;
}