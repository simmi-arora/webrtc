# webrtc

web real time communication platform 

![alt webrtc development ](https://altanaitelecom.files.wordpress.com/2015/05/webrtc_development_logo.png?w=100&h=100)

[![Gitter][GS image]][Gitter]
[![Build Status][BS img]][Build Status]
[![Dependency Status][DS img]][Dependency Status]
[![NPM Status][NS img]][NPM Status]

[Gitter]: https://gitter.im/altanai/webrtc?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge 
[Build Status]: https://travis-ci.org/altanai/webrtc
[Dependency Status]: https://david-dm.org/altanai/webrtc
[NPM Status]: https://www.npmjs.com/package/webrtcdevelopment

[GS img]: https://badges.gitter.im/altanai/webrtc.svg
[BS img]: https://api.travis-ci.org/altanai/webrtc.png
[DS img]: https://david-dm.org/altanai/webrtc.svg
[NS img]: https://nodei.co/npm/webrtcdevelopment.png

This is a ready to deploy webrtc SDK and SaaS for a customized and flexible communication and collaboration solution .


## Architecture 
----

The Solution primarily contains nodejs frameworks for hosting the project and webbsockets over socket.io to perform offer - answer handshake and share SDP (Session description protocol ).
![alt webrtc development architecture ](https://s32.postimg.org/uamq0uq9h/webrtcdevelopment_SDK.png)

### Technologies used 

1. WebRTC 
Web based real time communication framework.
read more on [webrtc](https://altanaitelecom.wordpress.com/2013/08/02/what-is-webrtc/ )


2. Node ( v10.0.0)
Asynchronous event driven JavaScript runtime

3. socket.io ( v0.9)
Communication and signalling 

Note  : while its possible to use any prtotocol like SIP , XMPP , AJAX , JSON etc for this purpose , modifying thsi libabry will require a lot of rework . It would be advisble to start from apprtc directly in that case .  

4. Grunt
It is a task Runner and its used to automate running of command in gruntfile
```
grunt -verbose
```


## SDK
----

Project is divided into 4 parts 

1. Core RTC Conn Lib 
2. Wrappers for the Core Lib containing feature sets and widgets like screensharing , recording , pointer share , machine learning , face detection etc
3. Demo Applicatins like two party full-features , multi-party full features etc which implement and use the SDK by invoking the constructirs , emitters and listeners .
4. SIgnaller over socket.io for SDP excahnge on offer answer model

### Building the SDK

Download the dev dependencies by setting the NODE_ENV to dev . 
This will install all grunt and gulp dependencies used for building the SDK
```
NODE_ENV=development npm install
```

To build the RtcConn , outputs RTCMultiConn
```
grunt rtcconn
```

To build the webrtcdev lib . 
It encapsulates the rtcconn core along with external libs for building various custom features .
Outputs webrtcdevelopment.js , webrtcdevelopment_header.js , webrtcdevelopment.css , webrtcdevelopment_header.css and webrtcdevelopmentserver.js
```
gulp production
```



## Get Started
----

To run this project following steps need to be followed in that order :

**1. Get the project from github**
```
git clone https://github.com/altanai/webrtc.git webrtc
```

**2. install nvm ( node version manager )**
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.2/install.sh | bash
. ~/.nvm/nvm.sh
nvm install v5.0.0
nvm use v5.0.0
```

**3. install npm and update the dependencies**
It will read the package.json and update the dependencies in node_modules folder on project location

```
	sudo apt-get install npm
	npm install 
```

**4. Change ENV variables and Test**

To change the ports for running the https server and rest server, goto env.json
```
{       
    "hostname"      : "host",        
	"enviornment"   : "local",        
	"host"        	: "localhost",
	"jsdebug"      :  true,          
	"httpsPort"    :  8086,
	"restPort"     :  8087,
    "extensionID"   : "elfbfompfpakbefoaicaeoabnnoihoac"
}
```

To run the tests
```
	npm test
```

**5. Start up the Server**

To start the Server in dev mode  and stop the server as soon as Ctrl+ C is hit or the terminal widnow is closed . 
```
	node webrtcserver.js
```
read more about [node](https://nodejs.org/en/about/ )

To start the Server using npm start ( using package.json) , behaves same as earlier run using node. We use supervisor to restart the server incase of exceptions or new code .

```
	npm start
```

**6. JS and CSS Libs**

Make a webpage and give holders for video and button elements that SDK will use .

Inside the head tag of html

    build/webrtcdevelopment_header.css
    build/webrtcdevelopment_header.js

After the body tag of html
    build/webrtcdevelopment.css
    build/webrtcdevelopment.js


**7. Configure**

Create the webrtc dom object with local and remote objects

local object  :
```
    var local={

        video           :   "myAloneVideo",            // name of the local video element
        videoClass      :   "",                        // class of the localvideo
        videoContainer  :   "singleVideoContainer",    // outer container of the video element
        userDisplay :       false,                     // do you want to display user details
        userMetaDisplay :   false,
        userdetails:{                                   // users details include name , email , color
            username    : username,
            usercolor   : "#DDECEF",
            useremail   : useremail,
            role        : "participant"                 // role of user in the session , can be participant , admin , inspector
        }
    };
```

remote object  :
```
    var remote={
        videoarr        : ["myConferenceVideo", "otherConferenceVideo"], // conatiners for the video after session is made 
                                                                // first one is usually the local video holder followed by remote video holders
        videoClass      : "",
        maxAllowed      : "6",
        videoContainer  : "confVideoContainer",
        userDisplay     : false,
        userMetaDisplay : false,
        dynamicVideos   : false 
    };

```

Incoming and outgoing media configiration  ( self exlanatory ) :
```
    var incoming={
        audio :  true,
        video :  true,
        data  :  true,
        screen:  true
    };

    var outgoing={
        audio :  true,
        video :  true,
        data  :  true,
        screen:  true

    };

    webrtcdomobj= new WebRTCdom(
        local, remote, incoming, outgoing
    );
```

**7. Adding Widgets**

set widgets (expained in section below)
```
    var widgets={
    }
```
Set widgets and their properties . 


**8. Creating session**

Get session id automaically
```
sessionid = init(true);
```
or get session name from user
```
sessionid = init(false);
```
Create a session json object with turn credentials and the session created from above step

set preference for the incoming and outgoing media connectection. Bydefault all are set to true . 
```
    var incoming={
        audio:  true,
        video:  true,
        data:   true,
        screen: true
    };

    var outgoing={
        audio:  true,
        video:  true,
        data:   true,
        screen: true
    };
```

finally initiate the webrtcdev contructor 
```
    var webrtcdevobj = new WebRTCdev ( 
        session,  incoming,  outgoing ,  widgets
    );
```

Start the session 
```
    startcall();
```


## Widgets 
----

Currently available widgets are 
    * Chat 
    * Fileshare
    * Timer
    * Screen Record
    * Screen Share
    * Video Record
    * Snapshot
    * Minimising/ maximising Video
    * Mute (audio and/or video)
    * Draw on Canvas and Sync
    * Text Editor and Sync
    * Reconnect

Description of Widgets with SDK invocation

### 1. Chat 

User RTCDataConnection api from webRTC to send peer to peer nessages within a session. If camera is present the SDK captures a screenshot with user's cemars feed at the isnatnt of typing the message and send along with the message. 

When the chat widget is active  , if the dom specified by the container id is present then webSDK uses as it is,  else it creates one default box 

```             
{
    active: true,
    container: {
        id: "chatContainer"                 // dom id of the chat conatiner 
    },
    inputBox:{
        text_id:"chatInputText",            // dom id of the chta's input box
        sendbutton_id:"chatSendButton",     // dom id for the chat's send button
        minbutton_id:"minimizeChatButton"   // dom id for minimizing the Chat conaginer 
    },
    chatBox:{
        id: "chatBoard"                     // dom id for the chat board where all messages are dispalyed 
    },
    button:{                                // on and off button states for the chat widget button
        class_on:"btn btn-warning glyphicon glyphicon-font topPanelButton",  
        html_on:"Chat",
        class_off:"btn btn-success glyphicon glyphicon-font topPanelButton",
        html_off:"Chat"
    }
}
```
Upcoming : Adding emoticons to Chat

### 2. Fileshare 

Uses the RTCDataConnection API from WebRTC to excahnge files peer to peer. Progress bar is displayed for the chunks of file transferrred out of total number of chunks. Many different kindes of file transfer have been tested such as media files ( mp3 , mp4 ) , text or pdf files , microsoft pr libra office dicuments , images ( jpg , png etc ) etc .

File share widgets creates uses 2 conatiners - File Share and File List . If the dom ids of the container are not present on the page , the SDK crestes default conainers and appends them to page 

The list of files with buttons to view , hide or remove them from file viewers are in file Viewer container .
Displaying or playing the text or media files happens in file share conainer , which also has button to maximize , minimize the viewer window or in case of images to rotate them. 

```
{
    active : true,
    fileShareContainer : "fileSharingRow",                  // File sharing container
    fileshare:{                                             // components of file sharing container
         rotateicon:"assets/images/refresh-icon.png",       // rotate icon
         minicon:"assets/images/arrow-icon-down.png",       // min icon 
         maxicon:"assets/images/arrow-icon.png",            // max icon
         closeicon:"assets/images/cross-icon.png"           // close icon
    },
    fileListContainer : "fileListingRow",                   // File List container container 
    filelist:{                                              // components of file list conainer 
         downloadicon:"",                                   // icon donwload 
         trashicon:"",                                      // icon trash
         saveicon:"",                                       // icon save
         showicon:"",                                       // icon show
         hideicon:"",                                       // icon hide
    },
    button:{
        id: "fileshareBtn",                                 // dom for widget button to call file share
        class_on: "col-xs-8 text-center fileshareclass",
        html:"File"
    },
    props:{
        fileShare:"divided",                                // Can be divided for two particiapnts , chatpreview  , single for many participants  , hidden 
        fileList:"divided"                                  // same as aboev Can be divided , single   , hidden
    }
}
```

### 3. Timer 

Creates or assigns a timer for teh ongoing sesssion . Also displays the geolocation and timezone of the peers if perssion if provided . Timer can start upwards or downwards. 
Can be used for billing and policy control .

```
{
    active: true,
    type: "forward",                                        // Forwards timer starts from 0:0:00 goes thereafter, backward timer ticks backword from prespecified time limit
    counter:{                   
        hours: "countdownHours",                            // dom id for hours 
        minutes:"countdownMinutes",                         // dom id for mins
        seconds :"countdownSeconds"                         // dom if for seconds
    },
    upperlimit: {                                           // upperlimit of time for the session 
        hour:0 ,                                            
        min: 3 , 
        sec: 60 
    },
    span:{                                                  // dom ids for local and remote time labels
        currentTime_id:"currentTimeArea",
        currentTimeZone_id:"currentTimeZoneArea",
        remoteTime_id :"remoteTimeArea",
        remoteTimeZone_id:"remoteTimeZoneArea",
        class_on:""
    },
    container:{
        id:'collapseThree',
        minbutton_id:'timerBtn'
    },
    button :{
        id: 'timerBtn'                                      // dom for widget timer button to call
    }
}
```

### 4. Screen Record

Records everything pesent on the tab selected along with audio and displays recording as mp4 file. Use an extension and pre-declared safe-site  to facilitate captuing the tab.

```
{
    active : true,
    videoRecordContainer: true,                                 // container for storing or displaying recorded video
    button:{                                                    // button to control screen control wisget and its on / off states
        id: "scrRecordBtn",
        class_on:"btn btn-lg screenRecordBtnClass On",
        html_on:'<img title="Session Record" src="assets/images/icon_5.png"/>',
        class_off:"btn btn-lg screenRecordBtnClass Off",
        html_off: '<img title="Session Record" src="assets/images/icon_5.png"/>'
    }
},   
```
### 5. Screen-share 

One of the most powerful features of the SDK is to capture the current screen and share it with peer over RTC Peer connection channel. Simmilar to csreen record , uses an extension and pre-declared site ownership to capture the screen and share as peer to peer stream .
Button for screen share has 3 states - 
- install button for inline isnatllation of extension from page , 
- share screen button and 
- view button for incoming screen by peer .

```                 
{
    active : true,
    screenshareContainer: "screenShareRow",                 // container to display screen being shared
    extensionID: props.extensionID,                         // extension id 
    button:{
        installButton:{                                     // widget button to start inline installation of extension
            id:"scrInstallButton",
            class_on:"screeninstall-btn on",
            html_on:"Stop Install",
            class_off:"screeninstall-btn off",
            html_off:"ScreenShare"
        },
        shareButton:{                                       // widget button to start sharing screen , deactivated once already active or when peer is sharig 
            id:"scrShareButton",
            class_on:"btn btn-lg on",
            html_on:'<img title="Stop Screen Share"  src=assets/images/icon_2.png />',
            class_off:"btn btn-lg off",
            html_off:'<img title="Start Screen Share" src=assets/images/icon_2.png />',
            class_busy:"btn btn-lg busy",
            html_busy:'<img title="Peer is Sharing Screen" src=assets/images/icon_2.png />'
        },
        viewButton:{                                        // button to view the icnoming screen share 
            id:"scrViewButton",
            class_on:"screeninstall-btn on",
            html_on:"Stop Viewing",
            class_off:"screeninstall-btn off",
            html_off:"View Screen"
        }
    }
}
```

### 6. Video Record 

Records video stream . Created for each peer video .

```
{
    active : true,
    videoRecordContainer : true,
    button:{
        class_on:"pull-right btn btn-modify-video2_on videoButtonClass on",
        html_on:"<i class='fa fa-circle' title='Stop recording this Video'></i>",
        class_off:"pull-right btn btn-modify-video2 videoButtonClass off",
        html_off:"<i class='fa fa-circle' title='Record this Video'></i>"
    }
}
```

### 7. Snapshot

Takes a snapshot from video stream . Will be created for each inidvidual peer video .

```
{
    active : true,
    snapshotContainer: true,
    button:{
        class_on:"pull-right btn btn-modify-video2 videoButtonClass",
        html_on:"<i class='fa fa-th-large' title='Take a snapshot'></i>"
    }
} 

```

### 8. Minimising/ maximising Video

To enable the user to watch video in full screen mode or to inimize the video to hide it from screen. Will be seprately created for each individual peer video .
    
```
{
    active : true,
    max:{
        button:{                                                                // button to maximise the video to full screen mode 
            id: 'maxVideoButton',
            class_on:"pull-right btn btn-modify-video2 videoButtonClass On",
            html_on:"<i class='fa fa-laptop' title='full Screen'></i>",
            class_off:"pull-right btn btn-modify-video2 videoButtonClass Off",
            html_off:"<i class=' fa fa-laptop' title='full Screen'></i>"
        }  
    } ,
    min :{
        button:{                                                                // button to minimize or hide the video 
            id: 'minVideoButton',
            class_on:"pull-right btn btn-modify-video2 videoButtonClass On",
            html_on:"<i class='fa fa-minus' title='minimize Video'></i>",
            class_off:"pull-right btn btn-modify-video2 videoButtonClass Off",
            html_off:"<i class='fa fa-minus' title='minimize Video'></i>"
        }  
    }                    
}
```

### 9. Mute (audio and/or video)

Mutes the audio or video of the peer video . Created for each peer video.

```
 {
    active: true,
    drawCanvasContainer: "drawBoardRow",
    container:{
            id:'drawContainer',
            minbutton_id:'minimizeDrawButton'
        },
    button:{
        id: "draw-webrtc" , 
        class_on:"btn btn-lg draw-webrtc On",
        html_on:'<img title="Draw" src=assets/images/icon_3.png />',
        class_off:"btn btn-lg draw-webrtc Off",
        html_off:'<img title="Draw" src=assets/images/icon_3.png />'
    }
}
```

### 10 . Reconnect 

Allows a user to recoonect a session without refreshing a page . Will enable him to drop the session and create a new one.

```
{
    active: false,
    button:{
        id: "reconnectBtn",
        class:"btn btn-success glyphicon glyphicon-refresh topPanelButton",
        html:"Reconnect",
        resyncfiles:false
    }
}
```

### 11. Cursor

```
{
    active : true,
    pointer:{
        class_on: "fa fa-hand-o-up fa-3x"
    },
    button:{
        id: 'shareCursorButton',
        class_on:"pull-right btn btn-modify-video2 videoButtonClass On",
        html_on:"<i class='fa fa-hand-o-up' title='Cursor'></i>",
        class_off:"pull-right btn btn-modify-video2 videoButtonClass Off",
        html_off:"<i class='fa fa-hand-o-up' title='Cursor'></i>"
    }                   
},
```

### 12. Inspector 
```
{
    active: true,
    button:{
        id:"ListenInButton",
        textbox : "listenInLink"
    }
}
```
### 13. Debug 
```
 debug   : false,
```

### 14. Help

```
{
  active : true , 
  helpContainer : "help-view-body",
  screenshotContainer: "help-screenshot-body",
  descriptionContainer: "help-description-body"
}
```

### 15. Stats 

```
{
  active : true , 
  statsConainer : "network-stats-body"
}
```


### Assign individual widgets to a json object called widgets 

```
	var widgets={
        
        chat : < add chat widget json >,

        fileshare : < fieshare widget>,

        debug   : false,
            
        reconnect   :{
                            active: false,
                            button:{
                                id: "reconnectBtn",
                                class:"btn btn-success glyphicon glyphicon-refresh topPanelButton",
                                html:"Reconnect",
                                resyncfiles:false
                            }
                        },
            timer   :{
                        active: true,
                        type: "forward",
                        counter:{
                            hours: "countdownHours",
                            minutes:"countdownMinutes",
                            seconds :"countdownSeconds"
                        },
                        upperlimit: {
                            hour:0 , 
                            min: 3 , 
                            sec: 60 
                        },
                        span:{
                            currentTime_id:"currentTimeArea",
                            currentTimeZone_id:"currentTimeZoneArea",
                            remoteTime_id :"remoteTimeArea",
                            remoteTimeZone_id:"remoteTimeZoneArea",
                            class_on:""
                        },
                        container:{
                            id:'collapseThree',
                            minbutton_id:'timerBtn'
                        },
                        button :{
                            id: 'timerBtn'
                        }
                    },
            
            chat    : < chat widget >

            fileShare :< file share widget >

            mute    : < mute unmute widget >

            videoRecord : < video record widget >

            snapshot : < snapshot widget >

            cursor : < widget for cursor sharing >

            minmax  : < widget to maximize or minimize the video >
            
            drawCanvas  : < draw widget >

            screenrecord : < screen record widget >       
            
            screenshare : < screen share >

            listenin : < listen in widget >
            
            help : {
              active : true , 
              helpContainer : "help-view-body",
              screenshotContainer: "help-screenshot-body",
              descriptionContainer: "help-description-body"
            },
            
            statistics:{
              active : true , 
              statsConainer : "network-stats-body"
            }
	}
```


## Event listners 
----

Implemented event listners 

1. onLocalConnect

2. onSessionConnect

3. onScreenShareStarted

4. onScreenShareSEnded

5. onNoCameraCard


##Keys and certs 
----

Add the Key and certs
openssl req -x509 -newkey rsa:4096 -sha256 -nodes -keyout ssl_certs/server.key -out ssl_certs/server.crt -subj "/CN=webrtc.altanai.com" -days 3650


## Demo
----

open tab on chrome or mozilla browser and add a link to the https server using nodejs script
https://127.0.0.1:8086/multiparty_fullfeatures.html

Other implementation of the SDK are 

webrtc_quickstart - https://github.com/altanai/webrtc_quickstart

webrtc_usecases - https://github.com/altanai/webrtc_usercases


## Extra 
----

Following are the additioanl libraries packed with the project 

**Gulp**
Minify and concat the js and css files  into minscripts

**Task Runner**
you can run gulp alone to minify and concat the js and css files  into minscripts
```
gulp
```
or can run grunt to concat , minifify , ugligy , push to git and npm all together 
```
grunt production 
```

**forever**
Keeps running even when window is not active 
```
cd WebCall
forever start webrtcserver.js
```
**Notification / Alerting**

//tbd

**creating doc**
```
 ./node_modules/.bin/esdoc
  open ./docs/index.html
```
**PM2**
To start the Server using PM2 ( a process manager for nodejs)

### License
----

MIT
