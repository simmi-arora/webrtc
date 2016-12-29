module.exports = function(mysql , properties) {
    
    console.log(properties);
    console.log("----------mySQLcontrol---------");
    module.pool = mysql.createPool({
        connectionLimit : 100, //important
        host        :  properties.dbip,
        port        :  properties.dbport,
        user        :  properties.dbuser,
        password    :  properties.dbpass,
        database    :  properties.dbname,
        debug       :  properties.dbdebug
    });

    //creating a new entry into session history table
    module.createSessionHistory = function(data, callback){     
        var date;
        date = new Date();
        date = date.getUTCFullYear() + '-' +
                ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
                ('00' + date.getUTCDate()).slice(-2) + ' ' + 
                ('00' + date.getUTCHours()).slice(-2) + ':' + 
                ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
                ('00' + date.getUTCSeconds()).slice(-2);

        this.pool.getConnection(function(err, connection){
            var sessionhistoryData  = [
                data.room ,
                data.email ,
                data.name ,
                date, 
                '', 
                "ongoing"];
            console.log(sessionhistoryData);

            if(err){
                console.log(err);
            }else{
                connection.query('INSERT INTO sessionhistory ( channel , useremail , username , start_at , end_at ,  status) value (? , ? , ?, ?, ?, ?)', sessionhistoryData, function(err, rows){    
                        if(!err && rows.affectedRows == 1)  callback();                         
                        else                                callback(err,null);
                });
                connection.release();
            }
        }); 
    };


    //reading session hotory for finding the channels presence 
    module.readAllSessionsHistory = function( callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                console.log(err);
            }else{
                connection.query('SELECT * FROM sessionhistory ', function(err, rows , fields){         
                        if(!err && rows.length > 0)          callback(rows , null);
                        else                                 callback(null , err);
                });
                connection.release();   
            }
        });
    };


    //reading session hitory for finding the channels presence 
    module.readSessionHistoryChannelPresence = function(channel, callback){
        var presenceflag=false;

        this.pool.getConnection(function(err, connection){
            if(err){
                console.log(err);
            }else{
                connection.query('SELECT * FROM sessionhistory WHERE channel like ?', [channel],  
                function(err, rows , fields){         
                    if(!err && rows.length > 0){
                        presenceflag=true;
                        callback(presenceflag);
                    }
                    else{
                        callback(presenceflag);
                    }
               });
            }
            connection.release();       
        });
    };


    //for finding info of 1  channels mapped into session history
    module.searchSessionHistoryChannel = function(channel, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                console.log(err);
            }else{       
                connection.query('SELECT * FROM sessionhistory WHERE channel like ?', [channel], function(err, rows , fields){ 
                    if(!err && rows.length > 0){
                        callback(true, rows);
                    }
                    else{
                        callback(false, " " ," " ," " ," "," "," ");
                    }
               });
                connection.release();  
            }     
        
        });
    };


    //for updating the  users as they join a channel
    module.updateSessionHistoryUsers = function(data, callback){
        var roomName = data.room;
        var userName = data.name;
        var userEmail = data.email;

        this.pool.getConnection(function(err, connection){
            connection.query('SELECT * FROM sessionhistory WHERE channel like ? AND status LIKE ongoing', [roomName], function(err, rows , fields){ 
                if(!err && rows.length > 0){
                    connection.query('UPDATE sessionhistory SET  ? WHERE channel like ? AND status LIKE ongoing', 
                        [ { 
                            useremail:  userEmail+","+rows[0].useremail,
                            username: userName+","+rows[0].username
                           }, 
                           roomName
                        ],
                        function(err, rows){
                            callback(err, rows);
                        });
                };
           });
        
           connection.release();       
        
        });
    };

    //for finding the info of 1 user mapped into session history
    module.searchSessionHistoryUsers = function(data, callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                console.log(err);
            }else{       
                connection.query('SELECT * FROM sessionhistory WHERE useremail like %?%', [data.useremail], function(err, rows ){ 
                    if(!err && rows.length > 0){
                        callback(true, rows);
                    }
                    else{
                        callback(false,"");
                    }
               });
                connection.release();  
            }     
        
        });
    };


    /*----------------------------------Providers---------------------------------------------------*/
    module.formatLocalDate=function () {                
        var d = new Date();
         d = d.setDate(d.getDate()-2);
         var da = new Date(d).toISOString();
         var dat = da.substring(0,19);            
         var fdat = dat + 'Z'
         console.log(fdat);
         return fdat;
    };

    module.createProviders=function(data , callback){
        var date = this.formatLocalDate();
        this.pool.getConnection(function(err, connection){

            /*
            var date = new Date();
            date= date.getUTCFullYear() + '-' +
                ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
                ('00' + date.getUTCDate()).slice(-2) + ' ' + 
                ('00' + date.getUTCHours()).slice(-2) + ':' + 
                ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
                ('00' + date.getUTCSeconds()).slice(-2);*/
            //var date= new Date().toISOString().slice(0, 19).replace('T', ' ');

            console.log(date);

            var arrData  = [
                data.first_name,
                data.last_name,
                data.email,
                data.password,
                date,
                parseInt(data.country_code),
                parseInt(data.phone),
                data.address,
                data.city,
                data.state,
                parseInt(data.postal_code),
                data.country,
                data.organisation,
                data.bussiness,
                data.role,
                data.pic_path ];

            console.log(arrData);
            if(err){
                console.log(err);
            }else{
                connection.query('INSERT INTO providers ( '+
                '`first_name` ,`last_name`  ,'+
                '`email`, `password` ,'+
                '`signup_date` ,`country_code` ,'+ 
                '`phone` ,`address` , '+
                '`city`  , `state`  , '+
                '`postal_code` , `country`,'+
                '`organisation` ,`bussiness`,'+ 
                '`role` ,  `pic_path` ) values (? , ? , ?, ?, ?, ? , ? , ?, ?, ?, ?, ?, ?, ?, ? , ?)', arrData, function(err, rows){    
                        if(!err && rows.affectedRows == 1) {
                            callback(true, rows);  
                        }                        
                        else {
                            console.log(err);
                            callback(false, err);
                        }                           
                });
                connection.release();   
            }
        });
    }

    module.readAllProvders = function(data ,callback){
        this.pool.getConnection(function(err, connection){
            if(err){
                console.log(err);
            }else{
                connection.query('SELECT * FROM providers ', function(err, rows , fields){         
                        if(!err && rows.length > 0)          callback(true , rows);
                        else                                 callback(false , err);
                });
                connection.release();   
            }
        });
    };

    module.updateProvders=function(data, callback){

        var date = this.formatLocalDate();
        this.pool.getConnection(function(err, connection){
        
        connection.query('SELECT * FROM providers WHERE email like ?', [data.email],  
        function(err, rows , fields){         
            if(!err && rows.length > 0){

                var arrData  = [
                    (data.first_name=="")       ?rows[0].first_name:data.first_name,
                    (data.last_name=="")        ?rows[0].last_name:data.last_name,
                    (data.country_code=="")     ?rows[0].country_code:parseInt(data.country_code),
                    (data.phone=="")            ?rows[0].phone:parseInt(data.phone),
                    (data.address=="")          ?rows[0].address:data.address,
                    (data.city=="")             ?rows[0].city:data.city,
                    (data.state=="")            ?rows[0].state:data.state,
                    (data.postal_code=="")      ?rows[0].postal_code:parseInt(data.postal_code),
                    (data.country=="")          ?rows[0].country:data.country,
                    (data.organisation=="")     ?rows[0].organisation:data.organisation,
                    (data.bussiness=="")        ?rows[0].bussiness:data.bussiness,
                    (data.role=="")             ?rows[0].role:data.role,
                    (data.pic_path=="")         ?rows[0].pic_path:data.pic_path ,
                    data.email
                    ];
                console.log(arrData);
                connection.query('UPDATE providers set `first_name`=? ,`last_name`=? ,`country_code`=? ,'+ 
                '`phone`=? ,`address` =? , `city`=?  , `state` =? , `postal_code`=? , `country`=?, `organisation`=? ,`bussiness` =?,'+ 
                '`role` =?,  `pic_path` =? WHERE email like ? ', arrData, function(err, rows){    
                        if(!err && rows.affectedRows == 1) {
                            console.log("updated");
                            callback(true, rows);  
                        }                        
                        else {
                            console.log(err);
                            callback(false, err);
                        }                           
                });
                connection.release(); 
            }
            else{
                callback(false , err);
            }
        }); 
                

        });        
    }

    module.searchProviders=function(data , callback){
        console.log(data.email);
        this.pool.getConnection(function(err, connection){
            if(err){
                console.log(err);
            }else{
                connection.query('SELECT * FROM providers WHERE email like ?', [data.email],  
                function(err, rows , fields){         
                    if(!err && rows.length > 0){
                        callback(true, rows);
                    }
                    else{
                        callback(false , err);
                    }
               });
                connection.release();   
            }       
        });
    }

    /*----------------------------------Developers---------------------------------------------------*/

    module.createDevelopers=function(data , callback){

        this.pool.getConnection(function(err, connection){
            var arrData  = [ parseInt(data.provider_id) , data.access_token ];
            if(err){
                console.log(err);
            }else{
                connection.query('INSERT INTO developers ( `provider_id`, `access_token` ) values (?, ?)', arrData, function(err, rows){    
                        if(!err && rows.affectedRows == 1) {
                            callback(true, rows);
                        }                          
                        else callback(false , err);
                });
                connection.release();   
            }
        });
    }

    module.readDevelopers=function(data, callback){
        this.pool.getConnection(function(err, connection){
            var arrData =[parseInt(data.provider_id)];
            if(err){
                console.log(err);
            }else{
                connection.query('select * from developers where `provider_id`=? ', arrData, function(err, rows){    
                        console.log(rows);
                        if(!err && rows.length > 0)    callback(true, rows);      
                        else                            callback(false , err);
                });
                connection.release();   
            }
        });
    }

    module.updateDevelopers=function(data, callback){

        this.pool.getConnection(function(err, connection){
            var arrData =[
                parseInt(data.access_token),
                parseInt(data.access_token)];
            
            if(err){
                console.log(err);
            }else{
                connection.query('select * from developers where `access_token`=? ', arrData, function(err, rows , fields){ 
                    if(!err && rows.length > 0){
                        connection.query('UPDATE developers SET `access_token`=?  where `access_token`=?' , arrData, function(err, rows){    
                            console.log(rows);
                            if(!err && rows.length > 0)     callback(true, rows);      
                            else                            callback(false , err);
                        });
                    }    
                });
                connection.release();   
            }
        });

    }

    module.searchDevelopers=function(data , callback){
        this.pool.getConnection(function(err, connection){
            var arrData =[parseInt(data.access_token)];
            if(err){
                console.log(err);
            }else{
                connection.query('select * from developers where `access_token`=? ', arrData, function(err, rows){    
                        console.log(rows);
                        if(!err && rows.length > 0)     callback(true, rows);      
                        else                            callback(false , err);
                });
                connection.release();   
            }
        });
    }

    return   module;
};