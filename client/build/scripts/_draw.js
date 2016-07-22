
/**************************************************************************8
draw 
******************************************************************************/

function webrtcdevCanvasDesigner(){
    try{
        CanvasDesigner.addSyncListener(function(data) {
            rtcMultiConnection.send({type:"canvas", draw:data});
        });

        CanvasDesigner.setSelected('pencil');

        CanvasDesigner.setTools({
            pencil: true,
            eraser: true
        });

        CanvasDesigner.appendTo(document.getElementById(drawCanvasobj.drawCanvasContainer));
    }catch( e){
        console.log(" Canvas drawing not supported ");
        console.log(e);
    }
}
function createdrawButton(){
            var drawButton= document.createElement("span");
        drawButton.className=drawCanvasobj.button.class_off ;
        drawButton.innerHTML=drawCanvasobj.button.html_off;
        drawButton.onclick=function(){
            if(drawButton.className==drawCanvasobj.button.class_off){
                drawButton.className= drawCanvasobj.button.class_on ;
                drawButton.innerHTML= drawCanvasobj.button.html_on;
                webrtcdevCanvasDesigner();
                document.getElementById(drawCanvasobj.drawCanvasContainer).hidden=false;
            }else if(drawButton.className==drawCanvasobj.button.class_on){
                drawButton.className= drawCanvasobj.button.class_off ;
                drawButton.innerHTML= drawCanvasobj.button.html_off;
                document.getElementById(drawCanvasobj.drawCanvasContainer).hidden=true;
            }
        };
        var li =document.createElement("li");
        li.appendChild(drawButton);
        document.getElementById("topIconHolder_ul").appendChild(li);
}