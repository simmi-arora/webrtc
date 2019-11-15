
/**
 * find if view button is provided or need to be created
 * @method
 * @name createOrAssignScreenviewButton
 */
function createOrAssignScreenviewButton() {
    if (screenshareobj.button.viewButton.id && getElementById(screenshareobj.button.viewButton.id)) {
        let button = getElementById(screenshareobj.button.viewButton.id);
        assignScreenViewButton(button);
    } else {
        createScreenViewButton();
    }
}

/**
 * create the view button for screnshare
 * @method
 * @name createScreenViewButton
 */
function createScreenViewButton() {
    if (getElementById("viewScreenShareButton"))
        return;
    var viewScreenShareButton = document.createElement("span");
    viewScreenShareButton.className = screenshareobj.button.viewButton.class_off;
    viewScreenShareButton.innerHTML = screenshareobj.button.viewButton.html_off;
    viewScreenShareButton.id = "viewScreenShareButton";
    webrtcdevViewscreen(screenRoomid);
    viewScreenShareButton.onclick = function () {
        if (viewScreenShareButton.className == screenshareobj.button.viewButton.class_off) {
            getElementById(screenshareobj.screenshareContainer).hidden = false;
            viewScreenShareButton.className = screenshareobj.button.viewButton.class_on;
            viewScreenShareButton.innerHTML = screenshareobj.button.viewButton.html_on;
        } else if (viewScreenShareButton.className == screenshareobj.button.viewButton.class_on) {
            getElementById(screenshareobj.screenshareContainer).hidden = true;
            viewScreenShareButton.className = screenshareobj.button.viewButton.class_off;
            viewScreenShareButton.innerHTML = screenshareobj.button.viewButton.html_off;
        }
    };

    if (getElementById("topIconHolder_ul")) {
        let li = document.createElement("li");
        li.appendChild(viewScreenShareButton);
        getElementById("topIconHolder_ul").appendChild(li);
    }
}

/**
 * assign the view button for screnshare with existing buttom dom
 * @method
 * @name assignScreenViewButton
 */
function assignScreenViewButton(button) {
    /*
    if(getElementById(screenshareobj.button.viewButton.id))
        return;*/
    webrtcdevViewscreen(screenRoomid);
    button.onclick = function () {
        if (button.className == screenshareobj.button.viewButton.class_off) {
            getElementById(screenshareobj.screenshareContainer).hidden = false;
            button.className = screenshareobj.button.viewButton.class_on;
            button.innerHTML = screenshareobj.button.viewButton.html_on;
        } else if (button.className == screenshareobj.button.viewButton.class_on) {
            getElementById(screenshareobj.screenshareContainer).hidden = true;
            button.className = screenshareobj.button.viewButton.class_off;
            button.innerHTML = screenshareobj.button.viewButton.html_off;
        }
    };
}

/**
 * if viewScreenShareButton button exists , remove it
 * @method
 * @name removeScreenViewButton
 */
function removeScreenViewButton() {
    if (getElementById("viewScreenShareButton")) {
        let elem = getElementById("viewScreenShareButton");
        elem.parentElement.removeChild(elem);
    }
    return;
}


/**
 * If button id are present then assign sreen share button or creatr a new one
 * @method
 * @name createOrAssignScreenshareButton
 * @param {json} screenshareobject
 */
function createOrAssignScreenshareButton(screenshareobj) {
    webrtcdev.log("createOrAssignScreenshareButton ", screenshareobj);
    if (screenshareobj.button.shareButton.id && getElementById(screenshareobj.button.shareButton.id)) {
        assignScreenShareButton(screenshareobj.button.shareButton);
        hideScreenInstallButton();
        showScreenShareButton();
    } else {
        createScreenShareButton();
    }
}

/**
 * create Screen share Button
 * @method
 * @name createScreenshareButton
 */
function createScreenshareButton() {
    screenShareButton = document.createElement("span");
    screenShareButton.className = screenshareobj.button.shareButton.class_off;
    screenShareButton.innerHTML = screenshareobj.button.shareButton.html_off;
    screenShareButton.id = "screenShareButton";
    screenShareButton.onclick = function (event) {
        if (screenShareButton.className == screenshareobj.button.shareButton.class_off) {
            let time = new Date().getUTCMilliseconds();
            screenRoomid = "screenshare" + "_" + sessionid + "_" + time;
            webrtcdevSharescreen(screenRoomid);
            screenShareButton.className = screenshareobj.button.shareButton.class_on;
            screenShareButton.innerHTML = screenshareobj.button.shareButton.html_on;
        } else if (screenShareButton.className == screenshareobj.button.shareButton.class_on) {
            screenShareButton.className = screenshareobj.button.shareButton.class_off;
            screenShareButton.innerHTML = screenshareobj.button.shareButton.html_off;
            webrtcdevStopShareScreen();
        } else {
            webrtcdev.log("[svreenshare js] createScreenshareButton ,classname neither on nor off", creenShareButton.className);
        }
    };
    let li = document.createElement("li");
    li.appendChild(screenShareButton);
    getElementById("topIconHolder_ul").appendChild(li);
    return screenShareButton;
}


/**
 * If button id are present then assign sreen share button or creatr a new one
 * @method
 * @name assignScreenShareButton
 * @param {json} scrshareBtn
 */
function assignScreenShareButton(scrshareBtn) {
    webrtcdev.log("assignScreenShareButton");
    let button = getElementById(scrshareBtn.id);

    button.onclick = function (event) {
        if (button.className == scrshareBtn.class_off) {
            let time = new Date().getUTCMilliseconds();
            screenRoomid = "screenshare" + "_" + sessionid + "_" + time;
            // after posting message to obtain source Id from chrome extension wait for response
            webrtcdevSharescreen(screenRoomid);
            button.className = scrshareBtn.class_on;
            button.innerHTML = scrshareBtn.html_on;
            //f(debug) getElementById(button.id+"buttonstatus").innerHTML("Off");
        } else if (button.className == scrshareBtn.class_on) {
            button.className = scrshareBtn.class_off;
            button.innerHTML = scrshareBtn.html_off;
            webrtcdevStopShareScreen();
            //if(debug) getElementById(button.id+"buttonstatus").innerHTML("On");
        } else {
            webrtcdev.warn("[svreenshare js] createScreenshareButton ,classname neither on nor off", creenShareButton.className);
        }
    }
    return button;
}

function hideScreenShareButton() {
    let button = getElementById(screenshareobj.button.shareButton.id);
    button.hidden = true;
    button.setAttribute("style", "display:none");
}

function showScreenShareButton() {
    let button = getElementById(screenshareobj.button.shareButton.id);
    button.removeAttribute("hidden");
    button.setAttribute("style", "display:block");
}



var counterBeforeFailureNotice = 0;

function screenshareNotification(message, type) {

    if (getElementById("alertBox")) {

        getElementById("alertBox").innerHTML = "";

        if (type == "screenshareBegin") {

            var alertDiv = document.createElement("div");
            resetAlertBox();
            alertDiv.className = "alert alert-info";
            alertDiv.innerHTML = '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' + "You have begun sharing screen , waiting for peer to view";
            getElementById("alertBox").appendChild(alertDiv);

            setTimeout(function () {
                var alertDiv = document.createElement("div");
                resetAlertBox();
                alertDiv.className = "alert alert-danger";
                alertDiv.innerHTML = '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' + "Peer was not able to view screen , please retry";
                getElementById("alertBox").appendChild(alertDiv);
            }, 20000);

        } else if (type == "screenshareStartedViewing") {

            var alertDiv = document.createElement("div");
            resetAlertBox();
            alertDiv.className = "alert alert-success";
            alertDiv.innerHTML = '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' + "Peer has started viewing screen ";
            getElementById("alertBox").appendChild(alertDiv);

        } else if (type == "screenshareError") {

            var alertDiv = document.createElement("div");
            resetAlertBox();
            alertDiv.className = "alert alert-danger";
            alertDiv.innerHTML = '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' + "There was a error while sharing screen , please contact support ";
            getElementById("alertBox").appendChild(alertDiv);

        } else {
            // Handle these msgs too : TBD
        }

    } else {
        alert(message);
    }
}