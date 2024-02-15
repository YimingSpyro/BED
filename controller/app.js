/* 
DIT/FT/1B/06
P1935318
Li Yiming 
*/
var express = require('express');

var app = express();
var bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const isLoggedInMiddleware = require("../isLoggedInMiddleware");

const users = require("../model/users.js");
const listings = require("../model/listings.js");
const offers = require("../model/offers.js");
const likes = require("../model/likes.js");


var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(bodyParser.json());
app.use(urlencodedParser);
 
const cors = require("cors");
app.use(cors());

// login
app.post("/login/", function (req, res) {
    console.log("Last MF for servicing POST /login/...");

    var data = {
        username: req.body.username,
        password: req.body.password
    };

    users.verify(data, function (err, result) {

        if (err) {
            // case 1: (err, null)
            var output = JSON.stringify({ "Result": "Internal Error" })
            res.status(500).type("json").send(output);
        }
        else {
            // case 2: (null, null)
            if (result == null) {
                var output = JSON.stringify({ "Result": "Invalid username/password. Try again." })
                res.status(401).type("json").send(output);
            }

            // case 3: (null user)
            else {
                const payload = {
                    user_id: result.id
                };

                const options = {
                    algorithm: "HS256"
                }

                var jwt_secret = process.env.JWT_SECRET

                jwt.sign(payload, jwt_secret, options, function (error, token) {
                    if (error) {
                        console.log(error);
                        res.status(401).send();
                        return;
                    }

                    var success_package = {
                        token: token,
                        user_id: payload.user_id
                    }
                    res.status(200).send(success_package);
                })

            }
        }



    });

});

// (1) GET users
app.get('/users/', function (req, res) {
    console.log("Last MF for servicing GET /users...");

    var statusCode = 0;
    var message = "";

    //contact the model layer
    users.getUsers(function (err, result) {
        if (err) {
            statusCode = 500;
            message = err;
        }
        else {
            statusCode = 200;
            message = result;

        }
        //build output package
        var jsonData = {
            "message": message
        };

        // Sending data out
        res.status(statusCode);
        res.type("json")
        res.send(JSON.stringify(jsonData));
    });


});

// (2) Add new users
app.post('/users/', function (req, res) {
    console.log("Last MF for servicing POST /users...");

    var statusCode = 0;
    var message = "";


    var data = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }

    //contact the model layer
    users.addUsers(data, function (err, result) {
        if (err) {
            statusCode = 500;
            message = err;
        }
        else {
            statusCode = 201;
            message = result.insertId;
        }

        var jsonData = {
            "userID": message
        };

        res.status(statusCode);
        res.type("json")
        res.send(JSON.stringify(jsonData));
    });


});

// (3) Get user by ID
app.get('/users/:id/', function (req, res) {
    console.log("Last MF for servicing GET /users/:id...");

    var statusCode = 0;
    var message = "";

    var id = req.params.id

    //contact the model layer
    users.getUser(id, function (err, result) {
        if (err) {
            statusCode = 500;
            message = "not found";
        }
        else {
            statusCode = 200;
            message = result;

        }
        //build output package
        var jsonData = {
            "message": message
        };
        // Sending data out
        res.status(statusCode);
        res.type("json")
        res.send(JSON.stringify(message));
    });


});

// (4) Update user
app.put('/users/:id/', isLoggedInMiddleware, function (req, res) {
    console.log("Last MF for servicing PUT /users/id...");
    const userID = parseInt(req.params.id);
    if (isNaN(userID)) {
      res.status(400).send();
      return;
    }
  
    // user ID in the request params should be the same as the logged in user ID
    if (userID !== req.decodedToken.user_id) {
      res.status(403).send();
      return;
    }

    var statusCode = 0;
    var message = "";


    var data = {
        id: req.params.id,
        username: req.body.username,
    }

    users.editUser(data, function (err, result) {
        if (err) {
            statusCode = 500;
            message = "no user";
        }
        else {
            statusCode = 204;


        }
        // Sending data out
        res.status(statusCode);
        res.type("json")
        res.send(JSON.stringify(message));
    });


});

// (5) Retrieves all listings of a given user
app.get('/users/:id/listings/', function (req, res) {
    console.log("Last MF for servicing GET /users/:id/listings/...");

    var statusCode = 0;
    var message = "";

    var id = req.params.id

    //contact the model layer
    users.getListings(id, function (err, result) {
        if (err) {
            statusCode = 500;
            message = err;
        }
        else {
            statusCode = 200;
            message = result;

        }


        // Sending data out
        res.status(statusCode);
        res.type("json")
        res.send(JSON.stringify(message));
    });


}); 

// (6) Get all listings in the database.
app.get('/listings/', function (req, res) {
    console.log("Last MF for servicing GET /listings/...");

    var statusCode = 0;
    var message = "";

    //contact the model layer
    listings.getListings(function (err, result) {
        if (err) {
            statusCode = 500;
            message = err;
        }
        else {
            statusCode = 200;
            message = result;

        }

        // Sending data out
        res.status(statusCode);
        res.type("json")
        res.send(JSON.stringify(message));
    });


});

// (7) Retrieves a single listing by its id.
app.get('/listings/:id/', function (req, res) {
    console.log("Last MF for servicing GET /listings/:id...");

    var statusCode = 0;
    var message = "";

    var id = req.params.id

    //contact the model layer
    listings.getListing(id, function (err, result) {
        if (err) {
            statusCode = 500;
            message = err;
        }
        else {
            statusCode = 200;
            message = result;

        }
        //build output package
        var jsonData = {
            "message": message
        };

        // Sending data out
        res.status(statusCode);
        res.type("json")
        res.send(JSON.stringify(message));
    });


});

// (8) Add new listing
app.post('/listings/', isLoggedInMiddleware, function (req, res) {
    console.log("Last MF for servicing POST /listings/...");

    var statusCode = 0;
    var message = "";


    var data = {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        fk_poster_id: req.body.fk_poster_id
    }

    listings.addListing(data, function (err, result) {
        if (err) {
            statusCode = 500;
            message = err;
        }
        else {
            statusCode = 201;
            message = result.insertId;
        }

        var jsonData = {
            "listingID": message
        };

        res.status(statusCode);
        res.type("json")
        res.send(JSON.stringify(jsonData));
    });


});

// (9) Deletes a listing
app.delete('/listings/:id/', isLoggedInMiddleware, function (req, res) {
    console.log("Last MF for servicing DELETE /listings/:id/...");
    const userID = parseInt(req.body.fk_poster_id);
    if (isNaN(userID)) {
      res.status(400).send();
      return;
    }
  
    // user ID in the request params should be the same as the logged in user ID
    if (userID !== req.decodedToken.user_id) {
      res.status(403).send();
      return;
    }

    var statusCode = 0;
    var message = "";

    var id = req.params.id;

    listings.deleteListing(id, function (err, result) {
        if (err) {
            statusCode = 500;
            message = err;
        }
        else {
            statusCode = 204;
        }

        var jsonData = {
            "message": message
        };

        res.status(statusCode);
        res.type("json")
        res.send(JSON.stringify(jsonData));
    });
})

// (10) Updates a listing.
app.put('/listings/:id/', isLoggedInMiddleware, function (req, res) {
    console.log("Last MF for servicing PUT /listings/id...");
    const userID = parseInt(req.body.fk_poster_id);
    if (isNaN(userID)) {
      res.status(400).send();
      return;
    }
  
    // user ID in the request params should be the same as the logged in user ID
    if (userID !== req.decodedToken.user_id) {
      res.status(403).send();
      return;
    }

    var statusCode = 0;
    var message = "";


    var data = {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        fk_poster_id: req.body.fk_poster_id,
        id: req.params.id
    }

    listings.editListing(data, function (err, result) {
        if (err) {
            statusCode = 500;
            message = err;
        }
        else {
            statusCode = 204;
        }

        //build output package
        var jsonData = {
            "message": message
        };

        // Sending data out
        res.status(statusCode);
        res.type("json")
        res.send(JSON.stringify(jsonData));
    });


});

// (11) Retrieves all offers of a listing.
app.get('/listings/:id/offers/', function (req, res) {
    console.log("Last MF for servicing GET /listings/:id/offers/...");

    var statusCode = 0;
    var message = "";

    var id = req.params.id;

    //contact the model layer
    offers.getOffers(id, function (err, result) {
        if (err) {
            statusCode = 500;
            message = err;
        }
        else {
            statusCode = 200;
            message = result;

        }
        
        // Sending data out
        res.status(statusCode);
        res.type("json")
        res.send(JSON.stringify(message));
    });


});

// (12) Add new offering
app.post('/listings/:id/offers/', isLoggedInMiddleware, function (req, res) {
    console.log("Last MF for servicing POST /listings/:id/offers/...");
    const userID = parseInt(req.params.id);
    if (isNaN(userID)) {
      res.status(400).send();
      return;
    }
  

    var statusCode = 0;
    var message = "";


    var data = {
        fk_listing_id: req.params.id,
        offer: req.body.offer,
        fk_offeror_id: req.body.fk_offeror_id
    }

    offers.addOffer(data, function (err, result) {
        if (err) {
            statusCode = 500;
            message = err;
        }
        else {
            statusCode = 201;
            message = result.insertId;
        }

        var jsonData = {
            "OfferID": message
        };

        res.status(statusCode);
        res.type("json")
        res.send(JSON.stringify(jsonData));
    });


});

/* --- Advanced features --- */
// (13) Get all the likers.
app.get('/likes/', function (req, res) {
    console.log("Last MF for servicing GET /likes/...");

    var statusCode = 0;
    var message = "";

    //contact the model layer
    likes.getLikers(function (err, result) {
        if (err) {
            statusCode = 500;
            message = err;
        }
        else {
            statusCode = 200;
            message = result;

        }
        //build output package
        var jsonData = {
            "message": message
        };

        // Sending data out
        res.status(statusCode);
        res.type("json")
        res.send(JSON.stringify(jsonData));
    });


});

// (13.5) Get no. of likes for specific listing
app.get('/listings/:id/likes/', function (req, res) {
    console.log("Last MF for servicing GET /listings/:id/likes/...");

    var statusCode = 0;
    var message = "";

    var id = req.params.id;

    //contact the model layer
    likes.getLikes(id, function (err, result) {
        if (err) {
            statusCode = 500;
            message = err;
        }
        else {
            statusCode = 200;
            message = result;

        }
        
        // Sending data out
        res.status(statusCode);
        res.type("json")
        res.send(JSON.stringify(message));
    });


});

// (14) liking
app.post('/likes/', function (req, res) {
    console.log("Last MF for servicing POST /likes/...");

    var statusCode = 0;
    var message = "";


    var data = {
        product_name: req.body.product_name,
        fk_liker_id: req.body.fk_liker_id,
        fk_listing_id: req.body.fk_listing_id
    }

    //contact the model layer
    likes.Like(data, function (err, result) {
        if (err) {
            statusCode = 500;
            message = err;
        }
        else {
            statusCode = 201;
            message = result.insertId;
        }

        var jsonData = {
            "LikeID": message
        };

        res.status(statusCode);
        res.type("json")
        res.send(JSON.stringify(jsonData));
    });


});
 
// (15) unliking
app.delete('/likes/:id/', function (req, res) {
    console.log("Last MF for servicing DELETE /likes/:id/...");

    var statusCode = 0;
    var message = "";

    var id = req.params.id;

    likes.Unlike(id, function (err, result) {
        if (err) {
            statusCode = 500;
            message = err;
        }
        else {
            statusCode = 204;
        }

        var jsonData = {
            "message": message
        };

        res.status(statusCode);
        res.type("json")
        res.send(JSON.stringify(jsonData));
    });
})

// (16) search
app.post('/search/', function (req, res) {
    console.log("Last MF for servicing GET /search/...");

    var statusCode = 0;
    var message = "";

    title = req.body.keywords,

    //contact the model layer
    users.search(title, function (err, result) {
        if (err) {
            statusCode = 500;
            message = err;
        }
        else {
            statusCode = 200;
            message = result;
        }

        res.status(statusCode);
        res.type("json")
        res.send(JSON.stringify(message));
        console.log(title)
    });


});

module.exports = app;