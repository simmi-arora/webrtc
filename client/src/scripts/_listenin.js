/*-----------------------------------------------------------------------------------*/
/*                    listen-in JS                                                   */
/*-----------------------------------------------------------------------------------*/


function getlisteninlink(){
	if(!sessionid) console.error("cant generate listenin link , no sessionid found ")
	try{
		webrtcdev.log(" Current Session ", window.origin );
		let listeninlink = window.origin +"/#"+sessionid+'?appname=webrtcwebcall&role=inspector&audio=0&video=0';
		return listeninlink
	}catch(e){
		webrtcdev.error("ListenIn :", e);
		return false;
	}
}

function mailListenInLink(){
	fetch(url, {
	  method		: 'post',
	  crossDomain	: true,
	  ContentEncoding: 'base64',
	  headers		: {
	    'Accept': 'application/zip, text/plain, */*',
	    'Content-Type': 'application/json',
	    'Authorization' : key
	  },
	  body: { 
            apikey 		: key ,
            useremail	: selfemail, 
            sessionid	: sessionid,
            webrtcZip 	: content , //Zip file (Max File Size 2MB)
            webrtcTxt 	: 'traceswebrtcdev'
        }
	})
	.then(res => res.json())
	.then(res => console.log(res));
}

/*-----------------------------------------------------------------------------------*/
