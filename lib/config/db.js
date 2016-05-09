var mysql = require('mysql');

//Create the MySQL Pool

var pool = mysql.createPool({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '#',
    database: 'webrtcsessions'
});

module.exports = pool;
