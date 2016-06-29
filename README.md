# webrtc
web real time communication platform 

![alt webrtc development ] (http://s20.postimg.org/sywx5rjx5/webrtc_development_logo_1_1.png)


[![Build Status][BS img]][Build Status]
[![Dependency Status][DS img]][Dependency Status]
[![NPM Status][NS img]][NPM Status]


[Build Status]: https://travis-ci.org/altanai/webrtc
[Dependency Status]: https://david-dm.org/altanai/webrtc
[NPM Status]: https://www.npmjs.com/package/webrtcdevelopment


[BS img]: https://api.travis-ci.org/altanai/webrtc.png
[DS img]: https://david-dm.org/altanai/webrtc.svg
[NS img]: https://nodei.co/npm/webrtcdevelopment.png

This is a ready to deploy webrtc SDK and SaaS for a customized and flexible communication and collaboration solution .

Architecture 

Technologies used 

1. WebRTC 

2. Node (v5.0.0)
asynchronous event driven JavaScript runtime

3. socket.io ( v0.9)


To run this project following steps need to be followed in that order :

##### 1. get the project from github 
```
git clone https://github.com/altanai/webrtc.git webrtc
```

##### 2. install nvm ( node version manager ) 
```
sudo apt-get install nvm
nvm use v0.10.32
```

##### 3. install npm and update the dependencies 
It will read the package.json and update the dependencies in node_modules folder on project location
```
sudo apt-get install npm
npm install
```

##### 4. Start up the Server 

###### To start the Server in dev mode  
It will stop the server as soon as Ctrl+ C is hit or the terminal widnow is closed . 
node 
read more about [node] ( )

###### To start the Server using npm start ( using package.json) , behaves same as earlier run using node

###### To start the Server using forever module 
Keeps running even when window is swirched off 
```
npm install forever -g
cd WebCall
forever start webrtcserver.js
```


read more :

###### To start the Server using PM2 ( a process manager for nodejs)
readmore : 

##### 5. Run the webRTC call locally
open tab on chrome or mozilla browser and add a link to the https server using nodejs script
https://127.0.0.1:8084
