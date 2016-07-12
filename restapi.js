module.exports = function(realtimecomm, options , app, properties) {
    
    console.log("<------------------------ REST API-------------------> ");
    var restify = require('restify');
    var server = restify.createServer(options);

    server.use(
      function crossOrigin(req,res,next){
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        return next();
      }
    );


    function extracter(mixObj){
        console.log(mixObj);

        var keys = [];
        for(var k in mixObj) {
            keys.push(k);
        }
        return JSON.parse(keys);
    }

    /**
     * @api {get} /webrtc/details Get the session details 
     *
     * @apiName webrtc details
     * @apiGroup WebRTC
     *
     * @apiParam {String} version This is for getting the version of project 
     *
     * @apiSampleRequest https://localhost:8087/webrtc/details
     */
    function getWebRTCdetails(req, res, callback){
        console.log("params----------" , req.params);
        res.json({ type:true , data : req.params.version });
    }


    /**
      * @api {get} /session/all-sessions All Sessions  
      *
      * @apiName Get All sessions 
      * @apiGroup Session
      * @apiDescription 
      * get all session details 
      *
      * @apiSampleRequest https://localhost:8087/session/all-sessions
      *
     */
    function getAllSessions(req, res, callback) {
        var result =realtimecomm.getAllChannels('json');
        res.json({ type:true , data : result });
    }

    /**
     * @api {get} /session/getsession Get the session details 
     *
     * @apiName GetSession
     * @apiGroup Session
     *
     * @apiParam {String} channelid This is for getting the unique channel 
     *
     * @apiSampleRequest https://localhost:8087/session/getsession
     */
    function getSession(req, res, callback) { 

        if(!req.params.channelid){
            res.json({ 
                type: true, 
                data: "channelid is required" 
            });
            return;
        }

        var result =realtimecomm.getChannel(req.params.channelid, 'json');
        res.json({ type:true , data : result });
    }

    /**
      * @api {get} /user/all-users All users details  
      *
      * @apiName Get user
      * @apiGroup User
      * @apiDescription 
      * get all users details 
      *
      * @apiSampleRequest https://localhost:8087/user/all-users
      *
     */
    function getAllUsers(req, res, callback) {
        var result =realtimecomm.getAllActiveUsers('json');
        res.json({ type:true , data : result });
    }


    /**
     * @api {get} /user/getuser Get user details 
     *
     * @apiName Get User
     * @apiGroup User
     * @apiDescription 
     * get user details based on userid
     * @apiParam {String} userid  The id of user 
     *
     * @apiSampleRequest https://localhost:8087/user/getuser
     *
     */
    function getUser(req, res, callback) { 

        if(!req.params.userid){
            res.json({ 
                type: true, 
                data: "userid is required" 
            });
            return;
        }

        var result =realtimecomm.getUser(req.params.userid, 'json');
        res.json({ type:true , data : result });
    }



    function getSessionClients(req, res, callback) {
        var result =realtimecomm.getChannelClients('json');
        res.json({ type:true , data : result });
    }


    server.use(restify.acceptParser(server.acceptable));
    /*server.use(restify.authorizationParser());*/
    server.use(restify.dateParser());
    server.use(restify.queryParser());
    /*server.use(restify.jsonp());*/
    server.use(restify.CORS());
    /*server.use(restify.fullResponse());*/
    server.use(restify.bodyParser({ mapParams: true }));
    /*server.use(restify.bodyParser());*/
    /*server.use(restify.bodyParser({ mapParams: false }));*/

    server.get('/webrtc/details',getWebRTCdetails);

    server.get('/session/all-sessions',getAllSessions);
    server.get('/session/getsession',getSession);
    server.get('/session/clients',getSessionClients);

    server.get('/user/all-users',getAllUsers);
    server.get('/user/getuser',getUser);

    function unknownMethodHandler(req, res) {
      if (req.method.toLowerCase() === 'options') {

        var allowHeaders = ['Accept', 'Accept-Version', 'Content-Type', 'Api-Version', 'Origin', 'X-Requested-With']; // added Origin & X-Requested-With

        if (res.methods.indexOf('OPTIONS') === -1) res.methods.push('OPTIONS');

        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Headers', allowHeaders.join(', '));
        res.header('Access-Control-Allow-Methods', res.methods.join(', '));
        res.header('Access-Control-Allow-Origin', req.headers.origin);

        return res.send(204);
      }
      else
        return res.send(new restify.MethodNotAllowedError());
    }

    server.on('MethodNotAllowed', unknownMethodHandler);

    server.listen(properties.restPort, function() {
      console.log('%s listening at %s', server.name, server.url);
    });

    console.log(" REST server env => "+ properties.enviornment+ " running at\n "+properties.restPort);

    return module;
};


