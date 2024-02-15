/* 
DIT/FT/1B/06
P1935318
Li Yiming
*/ 

var db = require("./databaseConfig");
 
var userDB = {
    // (11) Get all offers
    getOffers: function (id,callback) {
        var sqlCmd = "SELECT * FROM offers WHERE fk_listing_id = ?";

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

    // (12) Add offering
    addOffer: function (data, callback) {
        var sqlCmd = "INSERT INTO offers (offer, fk_listing_id, fk_offeror_id) VALUES (?, ?, ?)";

        var values = [
            data.offer,
            data.fk_listing_id,
            data.fk_offeror_id
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
};

module.exports = userDB;
 