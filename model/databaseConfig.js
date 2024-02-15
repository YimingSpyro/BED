/* 
DIT/FT/1B/06
P1935318
Li Yiming
*/
 
var mysql=require('mysql');

const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
 
// set up connection
var dbConnect = {
    connection : null,
    getConnection: function(){
        var conn = mysql.createConnection({
            host: DB_HOST,
            port: DB_PORT,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME,
            // retain DATE as a string
            dateStrings: true
        });
        this.connection = conn;
        return conn;
    },
    connectNow: function(connection){

        connection.connect(function(err) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("DB Connection Successful");
                
            }
        });
    }
};
module.exports=dbConnect;