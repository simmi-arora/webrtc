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

    function getAllSessions(req, res, callback) {
        var result =realtimecomm.getAllChannels('json');
        res.json({ type:true , data : result });
    }

    function getAllUsers(req, res, callback) {
        var result =realtimecomm.getAllUsers('json');
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

    server.get('/session/all-sessions',getAllSessions);

    server.get('/user/all-users',getAllUsers);

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


