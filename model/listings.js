/* 
DIT/FT/1B/06
P1935318
Li Yiming
*/ 

var db = require("./databaseConfig");

var userDB = {
 
    // (6) Get listings
    getListings: function (callback) {
        var sqlCmd = "SELECT * FROM listings";

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

    // (7) Get listing by id
    getListing: function(id ,callback){
                
        var sqlCmd = "SELECT * FROM listings where id = ?";

        db.connection.query(sqlCmd, id, function(err, result){

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
        
    // (8) Add listing
    addListing: function (data, callback) {
        var sqlCmd = "INSERT INTO listings (title, description, price, fk_poster_id) VALUES (?, ?, ?, ?)";

        var values = [
            data.title,
            data.description,
            data.price,
            data.fk_poster_id
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
    
    // (9) Delete listings
    deleteListing: function (id,callback) {
        var sqlCmd = "DELETE from listings WHERE id = ?";

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

    // (10) Update listing
    editListing: function (data, callback) {
        var sqlCmd = "UPDATE listings SET title = ?, description = ?, price = ?, fk_poster_id = ? WHERE id = ?";
        var values = [
            data.title,
            data.description,
            data.price,
            data.fk_poster_id,
            data.id
        ];
        db.connection.query(sqlCmd,values, function (err, result) {

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

