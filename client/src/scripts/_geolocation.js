/*-----------------------------------------------------------------------------------*/
/*                    Geo JS                                                   */
/*-----------------------------------------------------------------------------------*/

if (navigator.geolocation) {
    /*webrtcdev.log(navigator);*/
    operatingsystem = navigator.platform;
    navigator.geolocation.getCurrentPosition(showPosition, showError);
} else {
    x.innerHTML = "Geolocation is not supported by this browser.";
}

/**
 * shows position from lat and long
 * @method
 * @name showPosition
 * @param {object} position
 */
function showPosition(position) {
    webrtcdev.log("Latitude: " + position.coords.latitude +
        "<br>Longitude: " + position.coords.longitude);
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    /*return position;*/
}

/**
 * This method handles erro in position data
 * @method
 * @name showError
 * @param {object} error
 */
function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            shownotification("User denied the request for Geolocation.")
            break;
        case error.POSITION_UNAVAILABLE:
            shownotification("Location information is unavailable.")
            break;
        case error.TIMEOUT:
            shownotification("The request to get user location timed out.")
            break;
        case error.UNKNOWN_ERROR:
            shownotification("An unknown error occurred.")
            break;
    }
}

/*-----------------------------------------------------------------------------------*/