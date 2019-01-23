/************************************************************************
Track Call Record 
*************************************************************************/
/**
 * collect all webrtcStats and stream to Server to be stored in a file with seesion id as the file name 
 * @method
 * @name sendCallTraces
 * @param {string} traces
 */
// function sendCallTraces(){

// }

/**
 * collect all webrtcdev.log and stream to Server to be stored in a file with seesion id as the file name 
 * @method
 * @name sendwebrtcdevLogs
 * @param {string} logs
 */
// function sendwebrtcdevLogs(url , key){

// 	try{

// 		var zip = new JSZip();
// 		zip.file("webrtcDevSessionLogs.txt", webrtcdevlogs);
// 		// var img = zip.folder("images");
// 		// img.file("smile.gif", imgData, {base64: true});
// 		// zip.generateAsync({type:"blob"})
// 		zip.generateAsync({type:"base64"})
// 		.then(function(content) {
// 		    // see FileSaver.js
// 		    // saveAs(content, "webrtcDevSessionLogs.zip");
// 		    fetch(url, {
// 			  method		: 'post',
// 			  crossDomain	: true,
// 			  ContentEncoding: 'base64',
// 			  headers		: {
// 			    'Accept': 'application/zip, text/plain, */*',
// 			    'Content-Type': 'application/json',
// 			    'Authorization' : key
// 			  },
// 			  body: { 
// 		            apikey 		: key ,
// 		            useremail	: selfemail, 
// 		            sessionid	: sessionid,
// 		            webrtcZip 	: content , //Zip file (Max File Size 2MB)
// 		            webrtcTxt 	: 'traceswebrtcdev'
// 		        }
// 			})
// 			.then(res => res.json())
// 			.then(res => console.log(res));

// 		});

// 	}catch(e){
// 		webrtcdevlogs.error(" Exception in sendwebrtcdevLogs " , e);
// 	}
// }


function sendwebrtcdevLogs(url, key , msg) {
	const data = new FormData();
	const fileField = webrtcdevlogs;
	data.append('name', selfemail);
	data.append('scimage', "");
	data.append("apikey", "dnE5aGpkUE03U1k4K3V5V0FUU3A4aGpGV2JHbkVsanhUVVBGU0NiaTZKcz0=");
	data.append("useremail", selfemail);
	data.append("sesionid", "15247878");
	data.append("message", msg);
	data.append("logfileContent", "WEBRTC LOG");
	var helpstatus = document.getElementById("listeninStatus");

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


function getscreenshot(){
	// return getScreenshotOfElement($("#mainDiv").get(0), 0, 0, 100, 100, function(data) {
	// 	console.log(" ----------- data img" , data);
	//     $("#help-screenshot-body").attr("src", "data:image/png;base64,"+data);
	// });
// html2canvas($('#mainDiv'), {
//   onrendered: function(canvas) {
//     var img = canvas.toDataURL()
//     $("#help-screenshot-body").attr("src", "data:image/png;base64,"+img);
//   }
// });

	html2canvas(document.querySelector("#mainDiv")).then(canvas => {
	    document.getElementById("help-screenshot-body").src = canvas.toDataURL();
	});

}


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