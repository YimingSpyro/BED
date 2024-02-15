/* 
DIT/FT/1B/06
P1935318
Li Yiming
*/

var db = require("./databaseConfig");

var userDB = {
    // (13) Get Likers
    getLikers: function (callback) {
        var sqlCmd = "SELECT * FROM likes";

        db.connection.query(sqlCmd, function (err, result) {

            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log(result);
                return callback(null, result);

            }
        });
    },

    // (13.5) Get No. of Likes
    getLikes: function (id,callback) {
        var sqlCmd = "SELECT * FROM likes WHERE fk_listing_id = ?";

        db.connection.query(sqlCmd,id,function (err, result) {

            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log(result);
                return callback(null, result);

            }
        });
    },

    // (14) Liking
    Like: function (data, callback) {
        var sqlCmd = "INSERT INTO likes (product_name, fk_liker_id, fk_listing_id) VALUES ( ?, ?, ?)";

        var values = [
            data.product_name,
            data.fk_liker_id,
            data.fk_listing_id,
        ];

        db.connection.query(sqlCmd, values, function (err, result) {

            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log(result);
                return callback(null, result);

            }
        });
    },

    // (15) unliking
    Unlike: function (id, callback) {
        var sqlCmd = "DELETE from likes WHERE id = ?";

        db.connection.query(sqlCmd, id, function (err, result) {

            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log(result);
                return callback(null, result);

            }
        });
    },

};

module.exports = userDB;
