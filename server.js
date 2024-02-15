/* 
DIT/FT/1B/06
P1935318
Li Yiming
*/

// environment
if (process.env.NODE_ENV === "development") {
    require('dotenv').config({ path: ".env.development" });
}


// imports
var app = require('./controller/app.js');

var dbserver = require("./model/databaseConfig")


// config
const hostname = 'localhost';
const port = process.env.PORT;

var server = app.listen(port, hostname, function () {
    console.log("App hosted at localhost:" + port);
});

app.get("/", (req, res) => {
    res.sendFile("/public/index.html", { root: __dirname });
});

app.get("/login/", (req, res) => {
    res.sendFile("/public/login.html", { root: __dirname });
});

app.get("/register/", (req, res) => {
    res.sendFile("/public/register.html", { root: __dirname });
});

app.get("/store/", (req, res) => {
    res.sendFile("/public/store.html", { root: __dirname });
});







var conn = dbserver.getConnection();
dbserver.connectNow(conn);