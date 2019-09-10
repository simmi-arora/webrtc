/*-----------------------------------------------------------------------------------*/
/*                    Code Editor  JS                                                */
/*-----------------------------------------------------------------------------------*/

function createCodeEditorButton(){
    var codeeditorButton= document.createElement("span");
    codeeditorButton.className=codeeditorobj.button.class_off ;
    codeeditorButton.innerHTML=codeeditorobj.button.html_off;
    for( x in codeeditorobj.languages)
        document.getElementById("CodeStyles").innerHTML=document.getElementById("CodeStyles").innerHTML+codeeditorobj.languages[x];

    var codeArea= document.getElementById("codeArea").value;
    var modeVal="text/javascript"; 

    editor = CodeMirror.fromTextArea(document.getElementById("codeArea"), {
         mode: modeVal,
         styleActiveLine: true,
         lineNumbers: false,
         lineWrapping: true
    });
    editor.setOption('theme', 'mdn-like');

    codeeditorButton.onclick=function(){
        if(codeeditorButton.className==codeeditorobj.button.class_off){
            codeeditorButton.className= codeeditorobj.button.class_on ;
            codeeditorButton.innerHTML= codeeditorobj.button.html_on;
            startWebrtcdevcodeeditorSync();
            document.getElementById(codeeditorobj.codeeditorContainer).hidden=false;
        }else if(codeeditorButton.className==codeeditorobj.button.class_on){
            codeeditorButton.className= codeeditorobj.button.class_off ;
            codeeditorButton.innerHTML= codeeditorobj.button.html_off;
            stopWebrtcdevcodeeditorSync();
            document.getElementById(codeeditorobj.codeeditorContainer).hidden=true;
        }
    };

    var li =document.createElement("li");
    li.appendChild(codeeditorButton);
    document.getElementById("topIconHolder_ul").appendChild(li);
}

function sendWebrtcdevCodeeditorSync(evt){
    if(evt.which ==  37 || evt.which ==  38 || evt.which ==  39 || evt.which ==  40  || evt.which==17 || evt.which == 18|| evt.which == 16){
        return true; 
    }

    var tobj ={
        "option" : "text",
        "codeContent": editor.getValue()
    }
    webrtcdev.log(" sending " , tobj);
    rtcMultiConnection.send({
            type: "codeeditor", 
            data: tobj
    });
}

function sendWebrtcdevCodeeditorStyleSync(evt){
    $("#CodeStyles option:selected").each(function() {
      var info = CodeMirror.findModeByMIME( $( this ).attr('mime')); 
      if (info) {
        mode = info.mode;
        spec = $( this ).attr('mime');
        editor.setOption("mode", spec);
        CodeMirror.autoLoadMode(editor, mode);
        //webrtcdev.log(info + " "+ mode+ " "+ spec + " "+ editor);
      }
    });

    var tobj ={
        "option" : "menu",
        "codeMode":mode,
        "codeSpec":spec
    }

    webrtcdev.log(" sending " , tobj);
    rtcMultiConnection.send({
            type: "codeeditor", 
            data: tobj
    });
}

function receiveWebrtcdevCodeeditorSync(data){
    webrtcdev.log("codeeditor " , data);
    if(data.option=="text"){
        var pos = editor.getCursor();
        editor.setValue(data.codeContent);
        editor.setCursor(pos);
    }else if(data.option=="menu"){
        editor.setOption("mode", evt.data.codeSpec);
        CodeMirror.autoLoadMode(editor, evt.data.codeMode);
    }
}

function startWebrtcdevcodeeditorSync(){
    document.getElementById(codeeditorobj.codeeditorContainer).addEventListener("keyup", sendWebrtcdevCodeeditorSync, false);
     document.getElementById("CodeStyles").addEventListener("change", sendWebrtcdevCodeeditorStyleSync, false);
}

function stopWebrtcdevcodeeditorSync(){
    document.getElementById(codeeditorobj.codeeditorContainer).removeEventListener("keyup", sendWebrtcdevCodeeditorSync, false);
}

/*-----------------------------------------------------------------------------------*/
