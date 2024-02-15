/* 
DIT/FT/1B/06 
P1935318
Li Yiming 
*/

var db = require("./databaseConfig");
const bcrypt = require("bcrypt-nodejs")

const saltRounds = 10;

var userDB = {

    // Verify
    verify: function (data, callback) {
        // username is a unique column, so this statement will have
        // either 0 or 1 record returned
        var sqlCmd = "SELECT * FROM users WHERE username = ?";

        var values = [
            data.username,
            data.password,
        ];

        db.connection.query(sqlCmd, values, function (err, result) {

            if (err) {
                console.log(err);
                return callback(err, null);
            }
            else {
                console.log(result);

                //(null, null)
                if (result.length == 0) {
                    return callback(null, null)
                }
                else {
                    //(null, one username)

                    // now we have
                    // 1. password user tries to sign in with (data.password)
                    // 2. password stored in the database (result[0].password)(hashed)

                    var user = result[0];

                    bcrypt.compare(data.password, user.password, function (err, cmp_result) {
                        if (err) {
                            return callback(err, null)
                        }
                        else {
                            if (!cmp_result) {
                                return callback(null, null);
                            }
                            else {
                                return callback(null, user)
                            }
                        }
                    })
                }


            }
        });
    },

    // (1) Get Users
    getUsers: function (callback) {
        var sqlCmd = "SELECT id, username, created_at FROM users";

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

    // (2) Add Users
    addUsers: function (data, callback) {

        var sqlCmd = "INSERT INTO users (username, password) VALUES (?, ?)";
        bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(data.password, salt, null, function (err, hash) {

                var values = [
                    data.username,
                    hash
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
            });
        });

    },

    // (3) Get User by ID
    getUser: function (id, callback) {

        var sqlCmd = "SELECT id, username, created_at FROM users where id = ?";

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

    // (4) Put
    editUser: function (data, callback) {
        var sqlCmd = "UPDATE users SET username = ? WHERE id = ?";
        var values = [
            data.username,
            data.id
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

    // (5) Get listings
    getListings: function (id, callback) {
        var sqlCmd = "SELECT * FROM listings WHERE fk_poster_id = ? ORDER BY created_at DESC;";

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

    // Search
    search: function (title, callback) {

        var sqlCmd = `SELECT * FROM listings WHERE title LIKE '%${title}%' `;
        
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


};

module.exports = userDB;
 