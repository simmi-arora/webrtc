
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

function startShareCursor(){

  document.onmousemove = function(e){
    cursorX = e.pageX;
    cursorY = e.pageY;
  }

  setInterval("shareCursor()", 500);

}
/*document.onmousemove = function(e){
    cursorX = e.pageX;
    cursorY = e.pageY;
}
*/
//setInterval("shareCursor()", 500);

function shareCursor(){
    rtcMultiConnection.send({
        type:"pointer", 
        corX: cursorX , 
        corY: cursorY
    });
    placeCursor("cursor1" , cursorX, cursorY);
}
