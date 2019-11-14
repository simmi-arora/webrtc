function createTextEditorButton() {
    var texteditorButton = document.createElement("span");
    texteditorButton.className = texteditorobj.button.class_off;
    texteditorButton.innerHTML = texteditorobj.button.html_off;

    texteditorButton.onclick = function () {
        if (texteditorButton.className == texteditorobj.button.class_off) {
            texteditorButton.className = texteditorobj.button.class_on;
            texteditorButton.innerHTML = texteditorobj.button.html_on;
            startWebrtcdevTexteditorSync();
            document.getElementById(texteditorobj.texteditorContainer).hidden = false;
        } else if (texteditorButton.className == texteditorobj.button.class_on) {
            texteditorButton.className = texteditorobj.button.class_off;
            texteditorButton.innerHTML = texteditorobj.button.html_off;
            stopWebrtcdevTexteditorSync();
            document.getElementById(texteditorobj.texteditorContainer).hidden = true;
        }
    };
    var li = document.createElement("li");
    li.appendChild(texteditorButton);
    document.getElementById("topIconHolder_ul").appendChild(li);
}

/*************************************************************************
 Text Editor
 ******************************************************************************/

function sendWebrtcdevTexteditorSync(evt) {
    // Left: 37 Up: 38 Right: 39 Down: 40 Esc: 27 SpaceBar: 32 Ctrl: 17 Alt: 18 Shift: 16 Enter: 13
    if (evt.which == 37 || evt.which == 38 || evt.which == 39 || evt.which == 40 || evt.which == 17 || evt.which == 18 || evt.which == 16) {
        return true; // handle left up right down  control alt shift
    }

    var tobj = {
        "option": "text",
        "content": document.getElementById(texteditorobj.texteditorContainer).value
    }
    webrtcdev.log(" sending ", document.getElementById(texteditorobj.texteditorContainer).value);
    rtcMultiConnection.send({
        type: "texteditor",
        data: tobj
    });
}

function receiveWebrtcdevTexteditorSync(data) {
    webrtcdev.log("texteditor ", data);
    if (data.option == "text") {
        document.getElementById(texteditorobj.texteditorContainer).value = data.content;
    }
}

function startWebrtcdevTexteditorSync() {
    document.getElementById(texteditorobj.texteditorContainer).addEventListener("keyup", sendWebrtcdevTexteditorSync, false);
}

function stopWebrtcdevTexteditorSync() {
    document.getElementById(texteditorobj.texteditorContainer).removeEventListener("keyup", sendWebrtcdevTexteditorSync, false);
}
