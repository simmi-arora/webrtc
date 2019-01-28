## 1. create a new session 
Naviagte on browser https://localhost:8084/#2435937115056035
which creates websocket over socket.io wss://localhost:8084/socket.io/?EIO=3&transport=websocket

## 2. check for channel presence

#### first client message 
[ "presence", 
  {
    channel: "2435937115056035"
    }
 ]

#### server side 
 Presence Check index of  2435937115056035  is  false
      
#### websocket reponse from server ["presence", false]

## 3. if channel doesnt exist already create 

#### client message to open channel 
  [  "open-channel", 
    {
      channel: "2435937115056035", 
      sender: "gxh0oi2jrs", 
      maxAllowed: 6
     }
   ]
   
#### server reposne 
 ------------open channel-------------  2435937115056035  by  gxh0oi2jrs
registered new in channels  [ '2435937115056035' ]
information added to channel { '2435937115056035':
   { channel: '2435937115056035',
     timestamp: '12/18/2018, 10:18:01 PM',
     maxAllowed: 6,
     users: [ 'gxh0oi2jrs' ],
     status: 'waiting',
     endtimestamp: 0,
     log:
      [ '12/18/2018, 10:18:01 PM:-channel created . User gxh0oi2jrs waiting ' ] } }
     
#### websocket reponse from server
  [  "open-channel-resp", 
   { 
    status: true, 
    channel: "2435937115056035"
    }
    ]
    
  ## 4. Join a session and check for channel presence 
  
  navigate another browser client to same session url such as 
  
   check presence ["presence", {channel: "2435937115056035"}]
   
   ["presence", true]
   
   Presence Check index of  2435937115056035  is  true
   
   ## 5. If channel is present join the channel 
  
  ["join-channel", {channel: "2435937115056035", sender: "2ilwvn9qq39",…}]
   
------------join channel-------------  2435937115056035  by  2ilwvn9qq39  isallowed  true

[ "join-channel-resp"
 {
 status: true, 
 channel: "2435937115056035", 
 users: ["gxh0oi2jrs", "2ilwvn9qq39"]
}]

 
