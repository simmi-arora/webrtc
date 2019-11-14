/*-----------------------------------------------------------------------------------*/
/*                    listen-in JS                                                   */
/*-----------------------------------------------------------------------------------*/

/**
 * creates a listen in link for the sessionid
 * @method
 * @name getlisteninlink
 * @return {string}listeninlink
 */
this.getlisteninlink = function () {
    if (!sessionid) console.error("cant generate listenin link , no sessionid found ")
    try {
        webrtcdev.log(" Current Session ", window.origin);
        let listeninlink = window.origin + "/#" + sessionid + '?appname=webrtcwebcall&role=inspector&audio=0&video=0';
        return listeninlink
    } catch (e) {
        webrtcdev.error("ListenIn :", e);
        return false;
    }
}

/*-----------------------------------------------------------------------------------*/
