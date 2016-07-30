
/**************************************************************************8
draw 
******************************************************************************/
var CanvasDesigner = (function() {
    var iframe;
    var tools = {
        line: true,
        pencil: true,
        dragSingle: true,
        dragMultiple: true,
        eraser: true,
        rectangle: true,
        arc: true,
        bezier: true,
        quadratic: true,
        text: true
    };

    var selectedIcon = 'pencil';

    function syncData(data) {
        if (!iframe) return;

        iframe.contentWindow.postMessage({
            canvasDesignerSyncData: data
        }, '*');
    }

    var syncDataListener = function(data) {
        console.log("syncDataListener" , data);
    };
    
    function onMessage() {
        if (!event.data || !event.data.canvasDesignerSyncData) return;
        syncDataListener(event.data.canvasDesignerSyncData);
    }

    /*window.addEventListener('message', onMessage, false);*/

    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
    var eventer = window[eventMethod];
    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

    // Listen to message from child window
    eventer(messageEvent,function(e) {
        console.log('CanvasDesigner parent received message!:  ',e.data);
        if (!e.data || !e.data.canvasDesignerSyncData) return;
        syncDataListener(e.data.canvasDesignerSyncData);
    },false);


    return {
        appendTo: function(parentNode) {
            iframe = document.createElement('iframe');
            iframe.id="drawboard";
            iframe.src = 'widget.html?tools=' + JSON.stringify(tools) + '&selectedIcon=' + selectedIcon;
            iframe.style.width ="100%";
            iframe.style.height="100%";
            iframe.style.border = 0;
            parentNode.appendChild(iframe);
        },
        destroy: function() {
            if(iframe) {
                iframe.parentNode.removeChild(iframe);
            }
            window.removeEventListener('message', onMessage);
        },
        addSyncListener: function(callback) {
            syncDataListener = callback;
        },
        syncData: syncData,
        setTools: function(_tools) {
            tools = _tools;
        },
        setSelected: function(icon) {
            if (typeof tools[icon] !== 'undefined') {
                selectedIcon = icon;
            }
        }
    };
})();

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