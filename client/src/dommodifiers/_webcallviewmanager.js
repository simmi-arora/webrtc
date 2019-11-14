/**
 * Update local cache of user sesssion based object called peerinfo
 * @method
 * @name updateWebCallView
 * @param {json} peerInfo
 */
function updateWebCallView(peerinfo){
    let myrole = role;
    webrtcdev.log("[start.js - updateWebCallView] start with ",
        " peerinfo" , peerinfo , 
        " | myrole :", myrole ,
        " | video indexOf : ", peerinfo.vid.indexOf("videoundefined") );

    try{
        switch(myrole){
            
            case "inspector":
                var vi=0;
                for(var v=0; v<remoteVideos.length; v++){
                    webrtcdev.log("Remote Video index array " , v , " || ", remoteVideos[v] , 
                        document.getElementsByName(remoteVideos[v])  , 
                        document.getElementsByName(remoteVideos[v]).src);
                    if(remoteVideos[v].src){
                        vi++;
                    }
                }

                var remvid;
                var video = document.createElement('video');
                remoteVideos[vi] = video;
                document.getElementById(remoteobj.videoContainer).appendChild(video);
                remvid = remoteVideos[vi];
                webrtcdev.log(" [start.js - updateWebCallView] role-inspector , attaching stream" , remvid, peerinfo.stream );
                attachMediaStream(remvid, peerinfo.stream);
                if(remvid.hidden) removid.hidden = false;
                remvid.id = peerinfo.videoContainer;
                remvid.className = remoteobj.videoClass;
                //attachControlButtons(remvid, peerInfo); 
                if(remoteobj.userDisplay && peerinfo.name ){
                    attachUserDetails( remvid, peerinfo); 
                }
                if(remoteobj.userMetaDisplay && peerinfo.userid){
                    attachMetaUserDetails( remvid, peerinfo ); 
                }
                // Hide the unsed video for Local
                var _templ = document.getElementsByName(localVideo)[0];
                if(_templ) _templ.hidden=true;

                for(v in remoteobj.videoarr){
                    var _templ2 = document.getElementsByName(remoteobj.videoarr[v])[0];
                    if(_templ2) _templ2.setAttribute("style","display:none");
                }

                for(t in document.getElementsByClassName("timeBox")){
                    document.getElementsByClassName("timeBox")[t].hidden=true;
                }
            break;

            case "host":
            case "guest":
            case "participant":

                if(peerinfo.vid.indexOf("videolocal") > -1 ){
                    webrtcdev.info(" [start.js - updateWebCallView] role-participant , peerinfo Vid is Local");
                    // when video is local
                    if(localVideo && document.getElementsByName(localVideo)[0]){
                        var vid = document.getElementsByName(localVideo)[0];
                        vid.muted = true;
                        vid.className = localobj.videoClass;
                        attachMediaStream(vid, peerinfo.stream);

                        // if(localobj.userDisplay && peerInfo.name)
                        //     attachUserDetails( vid, peerInfo ); 

                        if(localobj.userDisplay && peerinfo.name)
                            attachUserDetails( vid, peerinfo ); 
                        
                        if(localobj.userMetaDisplay && peerinfo.userid)
                            attachMetaUserDetails( vid , peerinfo ); 

                        webrtcdev.info(" User is alone in the session  , hiding remote video container" , 
                        "showing users single video conrainer and attaching attachMediaStream and attachUserDetails ");

                    }else{
                        //alert(" Please Add a video container in config for single");
                        webrtcdev.error(" No local video conatainer in localobj -> " , localobj);
                    }

                } else if(peerinfo.vid.indexOf("videoremote") > -1) {
                    webrtcdev.info(" [start.js - updateWebCallView] role-participant , peerinfo Vid is Remote");
                    //when video is remote 

                    // handling local video transition to active
                    if( outgoingVideo && localVideo && selfVideo ){
                        /*chk if local video is added to conf , else adding local video to index 0 */
                        //localvid : video container before p2p session 
                        var localvid = document.getElementsByName(localVideo)[0];
                        // selfvid : local video in a p2p session
                        var selfvid = document.getElementsByName(selfVideo)[0];
                        
                        if(selfvid.played.length==0){
                            if(localvid.played.lebth>0){
                                reattachMediaStream(selfvid, localvid);
                            }else{
                                attachMediaStream(selfvid, webcallpeers[0].stream);
                            }
                            selfvid.id = webcallpeers[0].videoContainer;
                            selfvid.className = remoteobj.videoClass;
                            selfvid.muted = true;
                            attachControlButtons( selfvid, webcallpeers[0]); 

                            if(localobj.userDisplay && webcallpeers[0].name){
                                attachUserDetails( selfvid, webcallpeers[0] );
                            } 

                            if(localobj.userMetaDisplay && webcallpeers[0].userid){
                                attachMetaUserDetails( selfvid, webcallpeers[0] ); 
                            }
                        }else{
                            webrtcdev.log(" not uppdating self video as it is already playing ");
                        }

                        webrtcdev.info(" User is joined by a remote peer , hiding local video container" , 
                        "showing users conf video container and attaching attachMediaStream and attachUserDetails ");

                    }else if(!outgoingVideo){
                        webrtcdev.error(" Outgoing Local video is " , outgoingVideo);
                    }else{
                        //alert(" Please Add a video container in config for video call ");
                        webrtcdev.error(" Local video container not defined ");
                    }

                    // handling remote video addition 
                    if(remoteVideos){

                        /*get the next empty index of video and pointer in remote video array */
                        var vi=0;
                        for(v in remoteVideos){
                            webrtcdev.log("Remote Video index array " , v , " || ", remoteVideos[v] , 
                                document.getElementsByName(remoteVideos[v]),  document.getElementsByName(remoteVideos[v]).src);
                            if(document.getElementsByName(remoteVideos[v])[0] && document.getElementsByName(remoteVideos[v])[0].src !=""){
                                vi++;
                            }
                            // }else if(remoteVideos[v].video){
                            //     vi++;
                            // }
                        }

                        try{
                            if(remoteobj.maxAllowed=="unlimited"){
                                webrtcdev.log("remote video is unlimited , creating video for remoteVideos array ");
                                var video = document.createElement('video');
                                //video.autoplay = "autoplay";
                                remoteVideos[vi] = {
                                    "userid": peerinfo.userid, 
                                    "video" : video
                                };
                                document.getElementById(remoteobj.dynamicVideos.videoContainer).appendChild(video);
                            }else{
                                webrtcdev.log("remote video is limited to size maxAllowed , current index ", vi);
                                var remVideoHolder = document.getElementsByName(remoteVideos[vi]);
                                webrtcdev.log("searching for video with index ", vi , " in remote video : " , remVideoHolder[0] );
                                if(remVideoHolder){
                                    if(remVideoHolder[0]){
                                        remoteVideos[vi] = { 
                                            "userid": peerinfo.userid, 
                                            "video" : remVideoHolder[0] 
                                        };
                                    }
                                }else{
                                    // since remvideo holder doesnt exist just overwrite the last remote with the video 
                                    remoteVideos[remoteVideos.length -1] = { 
                                        "userid": peerinfo.userid, 
                                        "video" : remVideoHolder[0] 
                                    };
                                }
                            }

                            attachMediaStream(remoteVideos[vi].video, peerinfo.stream);
                            //if(remoteVideos[vi].video.hidden) remoteVideos[vi].video.hidden = false;
                            showelem(remoteVideos[vi].video);

                            remoteVideos[vi].video.id = peerinfo.videoContainer;
                            remoteVideos[vi].video.className = remoteobj.videoClass;
                            attachControlButtons(remoteVideos[vi].video, peerinfo); 

                            if(remoteobj.userDisplay && peerinfo.name ) {
                                attachUserDetails( remoteVideos[vi].video, peerinfo); 
                            }
                            
                            if(remoteobj.userMetaDisplay && peerinfo.userid) {
                                attachMetaUserDetails( remoteVideos[vi].video, peerInfo ); 
                            }
                        
                        }catch(e){
                            webrtcdev.error(e);
                        }

                    }else{
                        alert("remote Video containers not defined");
                    }
                
                } else {
                    webrtcdev.error(" PeerInfo vid didnt match either case ");
                }
            break;

            default:
                webrtcdev.log("[start.js - updateWebCallView] Switch default case");
        }

    }catch(err){
        webrtcdev.error("[start.js - updateWebCallView] " , err);
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
function destroyWebCallView(peerInfo , callback){
    webrtcdev.log(" [starjs] destroyWebCallView peerInfo" , peerInfo);
    if( peerInfo.videoContainer && document.getElementById(peerInfo.videoContainer))
        document.getElementById(peerInfo.videoContainer).src="";
    
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