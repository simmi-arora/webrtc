/**
 * Update local cache of user sesssion based object called peerinfo
 * @method
 * @name updateWebCallView
 * @param {json} peerInfo
 */
function updateWebCallView(peerinfo) {
    let myrole = role;
    webrtcdev.log("[start.js - updateWebCallView] start with ",
        " peerinfo", peerinfo,
        " | myrole :", myrole,
        " | video indexOf : ", peerinfo.vid.indexOf("videoundefined"));

    try {
        switch (myrole) {

            case "inspector":
                var emptyvideoindex = 0;
                for (var v = 0; v < remoteVideos.length; v++) {
                    webrtcdev.log("Remote Video index array ", v, " || ", remoteVideos[v],
                        document.getElementsByName(remoteVideos[v]),
                        document.getElementsByName(remoteVideos[v]).src);
                    if (remoteVideos[v].src) {
                        emptyvideoindex++;
                    }
                }


                let video = document.createElement('video');
                remoteVideos[emptyvideoindex] = video;
                document.getElementById(remoteobj.videoContainer).appendChild(video);

                let remvid = remoteVideos[emptyvideoindex];
                webrtcdev.log(" [start.js - updateWebCallView] role-inspector , attaching stream", remvid, peerinfo.stream);
                attachMediaStream(remvid, peerinfo.stream);
                if (remvid.hidden) removid.hidden = false;
                remvid.id = peerinfo.videoContainer;
                remvid.className = remoteobj.videoClass;
                //attachControlButtons(remvid, peerInfo);

                if (remoteobj.userDisplay && peerinfo.name) {
                    attachUserDetails(remvid, peerinfo);
                }
                if (remoteobj.userMetaDisplay && peerinfo.userid) {
                    attachMetaUserDetails(remvid, peerinfo);
                }
                // Hide the unsed video for Local
                var _templ = document.getElementsByName(localVideo)[0];
                if (_templ) _templ.hidden = true;

                for (v in remoteobj.videoarr) {
                    var _templ2 = document.getElementsByName(remoteobj.videoarr[v])[0];
                    if (_templ2) _templ2.setAttribute("style", "display:none");
                }

                for (t in document.getElementsByClassName("timeBox")) {
                    document.getElementsByClassName("timeBox")[t].hidden = true;
                }
                break;

            case "participant":

                if (peerinfo.vid.indexOf("videolocal") > -1) {

                    // when video is local
                    webrtcdev.info(" [start.js - updateWebCallView] role-participant , peerinfo Vid is Local");

                    if (localVideo && document.getElementsByName(localVideo)[0]) {
                        let vid = document.getElementsByName(localVideo)[0];
                        vid.muted = true;
                        vid.className = localobj.videoClass;
                        attachMediaStream(vid, peerinfo.stream);

                        // if(localobj.userDisplay && peerInfo.name)
                        //     attachUserDetails( vid, peerInfo ); 

                        if (localobj.userDisplay && peerinfo.name)
                            attachUserDetails(vid, peerinfo);

                        if (localobj.userMetaDisplay && peerinfo.userid)
                            attachMetaUserDetails(vid, peerinfo);

                        webrtcdev.info(" User is alone in the session  , hiding remote video container",
                            "showing users single video container and attaching attachMediaStream and attachUserDetails ");

                    } else {
                        //alert(" Please Add a video container in config for single");
                        webrtcdev.error(" No local video container in localobj -> ", localobj);
                    }

                } else if (peerinfo.vid.indexOf("videoremote") > -1) {

                    //when video is remote
                    webrtcdev.info(" [start.js - updateWebCallView] role-participant , peerinfo Vid is Remote");

                    // handling local video transition to active
                    if (outgoingVideo && localVideo && selfVideo) {
                        /*chk if local video is added to conf , else adding local video to index 0 */
                        //localvid : video container before p2p session 
                        var localvid = document.getElementsByName(localVideo)[0];
                        // selfvid : local video in a p2p session
                        var selfvid = document.getElementsByName(selfVideo)[0];

                        if (selfvid.played.length == 0) {
                            if (localvid.played.lebth > 0) {
                                reattachMediaStream(selfvid, localvid);
                            } else {
                                attachMediaStream(selfvid, webcallpeers[0].stream);
                            }
                            selfvid.id = webcallpeers[0].videoContainer;
                            selfvid.className = remoteobj.videoClass;
                            selfvid.muted = true;
                            attachControlButtons(selfvid, webcallpeers[0]);

                            if (localobj.userDisplay && webcallpeers[0].name) {
                                attachUserDetails(selfvid, webcallpeers[0]);
                            }

                            if (localobj.userMetaDisplay && webcallpeers[0].userid) {
                                attachMetaUserDetails(selfvid, webcallpeers[0]);
                            }
                        } else {
                            webrtcdev.log(" not updating self video as it is already playing ");
                        }

                        webrtcdev.info(" User is joined by a remote peer , hiding local video container",
                            "showing users conf video container and attaching attachMediaStream and attachUserDetails ");

                    } else if (!outgoingVideo) {
                        webrtcdev.error(" Outgoing Local video is ", outgoingVideo);
                    } else {
                        //alert(" Please Add a video container in config for video call ");
                        webrtcdev.error(" Local video container not defined ");
                    }

                    // handling remote video addition 
                    if (remoteVideos) {
                        /* get the next empty index of video and pointer in remote video array */
                        let emptyvideoindex = 0;
                        for (v in remoteVideos) {
                            webrtcdev.log("[webcallviewdevmanager] Remote Video index array ", v, " || ", remoteVideos[v]);

                            /* find of the video container of peer is already present in remoteVideos */
                            if(remoteVideos[v].userid == peerinfo.userid && remoteVideos[v].stream=="" &&
                                !!remoteVideos[v].video ){
                                webrtcdev.log("[webcallviewdevmanager] Remote Video dom exist already for the userid, checking for srcobject ");
                                if(!remoteVideos[v].video.srcObject) {
                                    webrtcdev.log("[webcallviewdevmanager] Remote Video dom exist already but without stream", remoteVideos[v].video);
                                    emptyvideoindex = v;
                                }
                                break;
                            }

                            let vids = document.getElementsByName(remoteVideos[v]);
                            webrtcdev.log("webcallviewdevmanager] Remote Video dom exists  " , !(!vids), vids );
                            if (vids.length <= 0) {
                                webrtcdev.log(" remote video space is empty ");
                                emptyvideoindex = v ;
                                break;
                            }  else if (vids[0] && vids[0].src && vids[0].src != "") {
                                webrtcdev.log(" vid ", vids[0].src)
                                emptyvideoindex++;
                            }

                        }
                        alert("empty index "+ emptyvideoindex);
                        try {
                            if (remoteobj.maxAllowed == "unlimited") {
                                // unlimitted video can be added dynamically
                                webrtcdev.log("remote video is unlimited , creating video for remoteVideos array ");
                                let video = document.createElement('video');
                                //  added  new video element to remoteVideos at current index
                                remoteVideos[emptyvideoindex] = {
                                    "userid": peerinfo.userid,
                                    "stream" : peerinfo.stream,
                                    "video": video
                                };
                                document.getElementById(remoteobj.dynamicVideos.videoContainer).appendChild(video);
                            } else {
                                webrtcdev.log("remote video is limited to size maxAllowed , current index ", emptyvideoindex);
                                //remote video is limited to size maxAllowed
                                let remVideoHolder = document.getElementsByName(remoteVideos[emptyvideoindex]);
                                webrtcdev.log("searching for video with index ", emptyvideoindex , " in remote video : ", remVideoHolder);
                                if (remVideoHolder) {
                                    if (remVideoHolder[0]) {
                                        // since remvideo holder exist at current index , add video element to remoteVideos
                                        remoteVideos[emptyvideoindex] = {
                                            "userid": peerinfo.userid,
                                            "stream" : peerinfo.stream,
                                            "video": remVideoHolder[0]
                                        };
                                        webrtcdev.log(" [webcallviewdevmanager] remoteVideos["+emptyvideoindex+"] updated " , remoteVideos[emptyvideoindex] , peerinfo.stream);
                                    }
                                } else {
                                    webrtcdev.warn(" [webcallviewdevmanager] since remvideo holder doesnt exist just overwrite the last remote with the video ")
                                    // since remvideo holder doesnt exist just overwrite the last remote with the video 
                                    remoteVideos[remoteVideos.length - 1] = {
                                        "userid": peerinfo.userid,
                                        "stream" : peerinfo.stream,
                                        "video": remVideoHolder[0]
                                    };
                                    webrtcdev.log("[webcallviewdevmanager] remoteVideos["+remoteVideos.length-1+"] updated " , remoteVideos[emptyvideoindex]);
                                }
                            }

                            attachMediaStream(remoteVideos[emptyvideoindex].video, peerinfo.stream);
                            //if(remoteVideos[vi].video.hidden) remoteVideos[vi].video.hidden = false;
                            showelem(remoteVideos[emptyvideoindex].video);

                            remoteVideos[emptyvideoindex].video.id = peerinfo.videoContainer;
                            remoteVideos[emptyvideoindex].video.className = remoteobj.videoClass;
                            attachControlButtons(remoteVideos[emptyvideoindex].video, peerinfo);

                            if (remoteobj.userDisplay && peerinfo.name) {
                                attachUserDetails(remoteVideos[emptyvideoindex].video, peerinfo);
                            }

                            if (remoteobj.userMetaDisplay && peerinfo.userid) {
                                attachMetaUserDetails(remoteVideos[emptyvideoindex].video, peerInfo);
                            }

                        } catch (err) {
                            webrtcdev.error("[webcallviewdevmanager] ",err);
                        }

                    } else {
                        alert("remote Video containers not defined");
                    }

                } else {
                    webrtcdev.error("[webcallviewdevmanager]  PeerInfo vid didnt match either case ");
                }
                break;

            default:
                webrtcdev.log("[start.js - updateWebCallView] Switch default case");
        }

    } catch (err) {
        webrtcdev.error("[start.js - updateWebCallView] ", err);
    }

    webrtcdev.log(" [start.js - updateWebCallView] - finish");
}


/**
 * destroy users webcall view
 * @method
 * @name destroyWebCallView
 * @param {json} peerInfo
 * @param {function} callback
 */
function destroyWebCallView(peerInfo, callback) {
    webrtcdev.log(" [starjs] destroyWebCallView peerInfo", peerInfo);
    if (peerInfo.videoContainer && document.getElementById(peerInfo.videoContainer))
        document.getElementById(peerInfo.videoContainer).src = "";

    /*if(fileshareobj.active){
        if(fileshareobj.props.fileShare){
            if(fileshareobj.props.fileShare=="divided")
                webrtcdev.log("dont remove it now ");
                //createFileSharingDiv(peerInfo);
            else if(fileshareobj.props.fileShare=="single")
                webrtcdev.log("No Seprate div created for this peer  s fileshare container is single");
            else
                webrtcdev.log("props undefined ");
        }
    }*/

    callback(true);
}