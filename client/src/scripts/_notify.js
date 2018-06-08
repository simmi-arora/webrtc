/**
 * function to show bootstrap based notification to client
 * @constructor
 * @param {string} message - message passed inside the notification 
 * @param {string} type - type of message passed inside the notification 
 */
function shownotification(message , type){

  if(document.getElementById("alertBox")){
    var alertDiv =document.createElement("div");
    if(type=="warning")
      alertDiv.className="alert alert-warning fade in";
    else if (type=="crtical")
      alertDiv.className="alert alert-crtical";
    else
      alertDiv.className="alert alert-success fade in";
    
    alertDiv.innerHTML='<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+ message;

    document.getElementById("alertBox").hidden=false;
    // document.getElementById("alertBox").innerHTML="";
    document.getElementById("alertBox").appendChild(alertDiv);

    setTimeout(function() {
      document.getElementById("alertBox").hidden=true;
    }, 3000);
  }else{
    alert(message);
  }

}



function showdesktopnotification() {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
     alert("This browser does not support desktop notification");
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
     // If it's okay let's create a notification
      var options = {
          body: "The remote has joined the session"
          /*icon: "images/villagexpertslogo2.png"*/
      };

     var notification = new Notification("Vilageexperts" , options);
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification("villageexpsrts");
      }

    });

  }

  // At last, if the user has denied notifications, and you 
  // want to be respectful there is no need to bother them any more.
}

Notification.requestPermission().then(function(result) {
  webrtcdev.log(result);
});

function spawnNotification(theBody,theIcon,theTitle) {
  var options = {
    body: theBody,
    icon: theIcon
  }
  var n = new Notification(theTitle,options);
}


