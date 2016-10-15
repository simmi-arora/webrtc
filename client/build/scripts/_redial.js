/**********************************
Reconnect 
****************************************/
/*
add code hetre for redial 
*/

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

function assignButtonRedial(id){
    document.getElementById(id).onclick=function(){
        var r = confirm("Do you want to reconnet ?");
        if (r == true) {
           rtcConn.rejoin(rtcConn.connectionDescription);
           //location.reload();
        } else {
           //do nothing
        }
    };
}