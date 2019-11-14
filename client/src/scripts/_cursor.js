/*-----------------------------------------------------------------------------------*/
/*                       cursor JS                                                   */
/*-----------------------------------------------------------------------------------*/

var cursorX;
var cursorY;
var cursorinterval;

function placeCursor(element, x_pos, y_pos) {
    element.style.position = "absolute";
    /*element.style.left = '100px';
      element.style.top = '100px';*/
    element.style.left = x_pos + 'px';
    element.style.top = y_pos + 'px';
}

function startShareCursor() {
    document.getElementById("cursor1").setAttribute("style", "display:block");
    document.onmousemove = function (e) {
        cursorX = e.pageX + 10;
        cursorY = e.pageY;
    }
    cursorinterval = setInterval(shareCursor, 500);
}

function stopShareCursor() {
    document.getElementById("cursor1").setAttribute("style", "display:none");
    rtcConn.send({
        type: "pointer",
        action: "stopCursor"
    });
    clearInterval(cursorinterval);
}

/*function assignButtonCursor(bid){
  var button =document.getElementById(bid);
  button.onclick=function(){
    startShareCursor();
  }
}*/

function shareCursor() {
    var element = document.getElementById("cursor1");
    element.hidden = false;

    placeCursor(element, cursorX, cursorY);

    rtcConn.send({
        type: "pointer",
        action: "startCursor",
        corX: cursorX,
        corY: cursorY
    });
}

function createCursorButton(controlBarName, peerinfo, streamid, stream) {
    var button = document.createElement("span");
    button.id = controlBarName + "cursorButton";
    button.setAttribute("data-val", "mute");
    button.setAttribute("title", "Cursor");
    button.className = cursorobj.button.class_on;
    button.innerHTML = cursorobj.button.html_on;
    button.onclick = function () {
        var btnid = button.id;
        var peerinfo;
        if (selfuserid)
            peerinfo = findPeerInfo(selfuserid);
        else
            peerinfo = findPeerInfo(rtcConn.userid);

        if (btnid.indexOf(peerinfo.controlBarName) > -1) {
            if (button.className == cursorobj.button.class_on) {
                startShareCursor();
                button.className = cursorobj.button.class_off;
                button.innerHTML = cursorobj.button.html_off;
            } else if (button.className == cursorobj.button.class_off) {
                stopShareCursor();
                button.className = cursorobj.button.class_on;
                button.innerHTML = cursorobj.button.html_on;
            }
            //syncButton(audioButton.id);   
        } else {
            alert(" Use Local Pointer button ");
        }

    };
    return button;
}


/*-----------------------------------------------------------------------------------*/
/*
    <div id="cursor1" class="fa fa-hand-o-up" style="width:0"></div>
    <div id="cursor2" class="fa fa-hand-o-up" style="width:0"></div>*/