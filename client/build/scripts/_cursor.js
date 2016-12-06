
/***************************************************************************
cursor sharing 
***************************************************************************/

function placeCursor(element , x_pos, y_pos) {
  console.log(" place cursor "  , x_pos , y_pos);
  d.style.position = "absolute";
  d.style.left = x_pos+'px';
  d.style.top = y_pos+'px';
}
  
var cursorX;
var cursorY;

function startShareCursor(){
  document.onmousemove = function(e){
    cursorX = e.pageX;
    cursorY = e.pageY;
  }
  setInterval(shareCursor, 500);
}

function assignButtonCursor(bid){
  var button =document.getElementById(bid);
  button.onclick=function(){
    startShareCursor();
  }
}

function shareCursor(){
    rtcConn.send({
        type:"pointer", 
        corX: cursorX , 
        corY: cursorY
    });

    var d = document.getElementById("cursor1");
    placeCursor( d, cursorX, cursorY);
}

function createCursorButton(controlBarName, peerinfo, streamid, stream ){
    var button=document.createElement("span");
    button.id=controlBarName+"cursorButton";
    button.setAttribute("data-val","mute");
    button.setAttribute("title", "Toggle Audio");
    button.setAttribute("data-placement", "bottom");
    button.setAttribute("data-toggle", "tooltip");
    button.setAttribute("data-container", "body");
    button.className=cursorobj.button.class_on;
    button.innerHTML=cursorobj.button.html_on;
    button.onclick = function() {
        if(button.className == cursorobj.button.class_on ){
            startShareCursor();
            button.className=cursorobj.button.class_off;
            button.innerHTML=cursorobj.button.html_off;
        } 
        else{            
            button.className=cursorobj.button.class_on;
            button.innerHTML=cursorobj.button.html_on;
        }     
        //syncButton(audioButton.id);        
    };
    return button;
}