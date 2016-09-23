# webrtc
web real time communication platform 

![alt webrtc development ](http://s20.postimg.org/sywx5rjx5/webrtc_development_logo_1_1.png)

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

SDK
----

##### Architecture 
The Solution primarily contains nodejs frameworks for hosting the project and webbsockets over socket.io to perform offer - answer handshake and share SDP (Session description protocol ).
![alt webrtc development architecture ](https://s32.postimg.org/uamq0uq9h/webrtcdevelopment_SDK.png)

##### Technologies used 

1. WebRTC 
Web based real time communication framework.
read more on [webrtc](https://altanaitelecom.wordpress.com/2013/08/02/what-is-webrtc/ )

2. Node (v5.0.0)
Asynchronous event driven JavaScript runtime

3. socket.io ( v0.9)
Communication and signalling 

Note  : while its possible to use any prtotocol like SIP , XMPP , AJAX , JSON etc for this purpose , modifying thsi libabry will require a lot of rework . It would be advisble to start from apprtc directly in that case .  

4. Grunt
It is a task Runner and its used to automate running of command in gruntfile
```
grunt -verbose
```

Get Started
----

To run this project following steps need to be followed in that order :

##### 1. get the project from github 
```
git clone https://github.com/altanai/webrtc.git webrtc
```

##### 2. install nvm ( node version manager ) 
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.2/install.sh | bash
. ~/.nvm/nvm.sh
nvm install v5.0.0
nvm use v5.0.0
```

##### 3. install npm and update the dependencies 
It will read the package.json and update the dependencies in node_modules folder on project location

```
	sudo apt-get install npm
	npm install 
```

###### 4. Change ENV variables and Test

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

##### 5. Start up the Server 

To start the Server in dev mode  and stop the server as soon as Ctrl+ C is hit or the terminal widnow is closed . 
```
	node webrtcserver.js
```
read more about [node](https://nodejs.org/en/about/ )

To start the Server using npm start ( using package.json) , behaves same as earlier run using node. We use supervisor to restart the server incase of exceptions or new code .

```
	npm start
```

##### 6. JS and CSS Libs

Make a webpage and give holders for video and button elements that SDK will use .

Inside the head tag of html
    minScripts/webrtcdevelopment_header.css
    minScripts/webrtcdevelopment_header.js

After the body tag of html
    minScripts/webrtcdevelopment.css
    minScripts/webrtcdevelopment.js


##### 7. Configure


Create the webrtc dom object with local and remote objects

local object  :
```
    var local={
        video: "myAloneVideo",              // name of the local video element
        videoClass:"",                      // class of the localvideo
        videoContainer : "singleVideoContainer", // outer container of the video element
        userDisplay:false,                  // do you want to display user details
        userMetaDisplay:false,
        userdetails:{                       //users details include name , emeial , color
            username: username,
            usercolor: "#DDECEF",
            useremail: useremail
        }
    };
```

remote object  :
```
    var remote={
        videoarr: ["myConferenceVideo", "otherConferenceVideo"], // conatiners for the video after session is made 
                                                                // first one is usually the local video holder followed by remote video holders
        videoClass:"",
        maxAllowed: "6",
        videoContainer : "confVideoContainer",
        userDisplay:false,
        userMetaDisplay:false,
        dynamicVideos: false 
    };

```

Incoming and outgoing media configiration  ( self exlanatory ) :
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

    webrtcdomobj= new WebRTCdom(
        local, remote, incoming, outgoing
    );
```

____

Get session id automaically
```
sessionid = init(true);
```
or get session name from user
```
sessionid = init(false);
```

___

Create a session json object with turn credentials nd the session created from above step

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
Set widgets and their properties . Currently available widgets are 
	* Chat
	* Fileshare
	* Screen Record
	* Screen Share
	* Video Record
	* Snapshot
	* Draw on Canvas and Sync
	* Text Editor and Sync
	* Mute (audio amd video)
	* Reconnect

```
	var widgets={
	}
```
Initiate the webrtcdev contructor 
```
    var webrtcdevobj = new WebRTCdev ( 
        session,  incoming,  outgoing ,  widgets
    );
```

Start the session 
```
    startcall();
```

##### 8. VOIP calls and conf
open tab on chrome or mozilla browser and add a link to the https server using nodejs script
https://127.0.0.1:8086/multiparty_fullfeatures.html


Used Libs
----

Following are the additioanl libraries packed with the project 

###### Gulp
Minify and concat the js and css files  into minscripts
```
gulp
```

###### forever 
Keeps running even when window is not active 
```
cd WebCall
forever start webrtcserver.js
```

###### PM2
To start the Server using PM2 ( a process manager for nodejs)

License
----

MIT
