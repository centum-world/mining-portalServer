const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    port:process.env.MYSQL_PORT
});
connection.connect((error)=>{
    if(error){
        console.log(error);
    }else{
        console.log("Connected!");
    }
});

console.log('hii from database');

let updatequery = "update mining_partner set login_counter=? ";
connection.query(updatequery,[login_counter = 0],(err,results)=>{
    if(!err){
        console.log("server up");
    }
});

module.exports = connection;