
/***************************************************************************
cursor sharing 
***************************************************************************/

var cursorX;
var cursorY;

function placeCursor(element , x_pos, y_pos) {
  //console.log(" place cursor "  , x_pos , y_pos);
  element.style.position = "absolute";
/*  element.style.left = '100px';
  element.style.top = '100px';*/
  element.style.left = x_pos+'px';
  element.style.top = y_pos+'px';
}

function startShareCursor(){
  document.onmousemove = function(e){
    cursorX = e.pageX;
    cursorY = e.pageY;
  }
  setInterval(shareCursor, 500);
}

/*function assignButtonCursor(bid){
  var button =document.getElementById(bid);
  button.onclick=function(){
    startShareCursor();
  }
}*/

function shareCursor(){
    var element = document.getElementById("cursor1");
    placeCursor( element, cursorX, cursorY);

    rtcConn.send({
        type:"pointer", 
        corX: cursorX , 
        corY: cursorY
    });
}

function createCursorButton(controlBarName, peerinfo, streamid, stream ){
    var button=document.createElement("span");
    button.id=controlBarName+"cursorButton";
    button.setAttribute("data-val","mute");
    button.setAttribute("title", "Pointer");
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