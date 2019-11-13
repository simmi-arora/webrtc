/*-----------------------------------------------------------------------------------*/
/*                        Tracing JS                                                   */
/*-----------------------------------------------------------------------------------*/

/**
 * collect all webrtcStats and stream to Server to be stored in a file with seesion id as the file name 
 * @method
 * @name sendCallTraces
 * @param {string} traces
 * @return Http request 
 */
this.sendwebrtcdevLogs= function(url, key , msg) {
	const data = new FormData();
	const fileField = webrtcdevlogs;
	data.append('name', username||"no name");
	data.append('scimage', document.getElementById("help-screenshot-body").src);
	data.append("apikey", "dnE5aGpkUE03U1k4K3V5V0FUU3A4aGpGV2JHbkVsanhUVVBGU0NiaTZKcz0=");
	data.append("useremail", selfemail);
	data.append("sesionid", sesionid);
	data.append("message", msg);
	data.append("logfileContent", webrtcdevlogs);

	var helpstatus = document.getElementById("helpStatus");

	return fetch(url, {
			method: 'POST',
			body: data
		})
		.then(res => res.text())

		.then(text => console.log(text),
	        helpstatus.innerHTML="Email sent for help",
	        helpstatus.setAttribute("style","color:green")
		)
		.catch(error => console.error(error),
			helpstatus.innerHTML="Email could not be sent for Help",
        	helpstatus.setAttribute("style","color:red")
		);
}


/**
 * add user id and email and status to page header area in debug mode 
 * @method
 * @name showUserStats
 */
this.showUserStats= showUserStats = function(){
	var data = " userid-"+selfuserid+ 
        " Email-"+ selfemail+ 
        " Audio-"+ outgoing.audio + 
        " Video-"+ outgoing.video + 
        " Role- "+ role;
	if(document.getElementById("userstatus")){
		document.getElementById("userstatus").innerHTML=data;
	}else{
		document.getElementById("mainDiv").prepend(data);
	}
}

/**
 * getwebcallpeers
 * @method
 * @name getwebcallpeers
 */
this.getwebcallpeers = function(){
	return webcallpeers;
}

/**
 * get screenshost to send along with debug logs
 * @method
 * @name getscreenshot
 */
this.getscreenshot= function(name){
	// "#bodyDiv"
	var parentdom = document.querySelector(name);
	/*html2canvas(document.querySelector("#bodyDiv")).then(canvas => {*/
	html2canvas(parentdom).then(canvas => {
	    /*document.getElementById("help-screenshot-body").src = canvas.toDataURL();*/
	    return canvas.toDataURL();
	});
}

/**
 * get screenshost to send along with dbeug logs
 * @method
 * @name getScreenshotOfElement
 */
function getScreenshotOfElement(element, posX, posY, width, height, callback) {
    html2canvas(element, {
        onrendered: function (canvas) {
            var context = canvas.getContext('2d');
            var imageData = context.getImageData(posX, posY, width, height).data;
            var outputCanvas = document.createElement('canvas');
            var outputContext = outputCanvas.getContext('2d');
            outputCanvas.width = width;
            outputCanvas.height = height;

            var idata = outputContext.createImageData(width, height);
            idata.data.set(imageData);
            outputContext.putImageData(idata, 0, 0);
            callback(outputCanvas.toDataURL().replace("data:image/png;base64,", ""));
        },
        width: width,
        height: height,
        useCORS: true,
        taintTest: false,
        allowTaint: false
    });
}
/*-----------------------------------------------------------------------------------*/