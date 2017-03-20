if(document.getElementById("ListenInButton")){
	document.getElementById("ListenInButton").onclick=function(){
		alert(window.location+'?appname=webrtcwebcall&role=inspector&audio=0&video=0');
	}
}