// jshint esversion:6
// require modules
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const mongoose = require("mongoose");

// configure express
const app = express();

// configure body-parser (CAN I JUST USE router.use?)
app.use(bodyParser.urlencoded({ extended: true }));

// configure mongoose
// connect to a db
mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

// test db connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', function () {
    console.log("mongoose connected @ auth-routes.js");
});

// build schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// configure encryption (LEVEL 2: Encryption + Environment Variables)
// userSchema.plugin(encrypt, {
//     secret: process.env.SECRET_STRING,
//     encryptedFields: ["password"]
// });

// compile schema into a model
const User = mongoose.model("User", userSchema);

// registration
router.route("/register")

    .get((req, res) => {
        res.render("register");
    })

    .post((req, res) => {
        //LEVEL 4: Salting & Hashing with bcrypt
        bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
            if (err) {
                console.log(err);
            } else {
                const newUser = new User({
                    email: req.body.username,
                    //Replace LEVEL 3 (md5 Hashing) with LEVEL 4 (bcryt hash)
                    password: hash
                });
                newUser.save((err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.render("secrets");
                    }
                });
            }
        });
    });

// login
router.route("/login")

    .get((req, res) => {
        res.render("login");
    })

    .post((req, res) => {
        // find if the user/email exists
        User.findOne({ email: req.body.username }, (err, foundUser) => {
            if (err) {
                console.log(err);
            } else {
                if (foundUser) {
                    // compare foundUser's entered password vs. stored password
                    // Replace LEVEL 3 (compare register & login Hash's -w- md5) -w- LEVEL 4 (salt & hash with bcrypt)
                    bcrypt.compare(req.body.password, foundUser.password, (err, result) => {
                        if (err) {
                            console.log(err);
                        } if (result === true) {
                            res.render("secrets");
                        }
                    });
                }
            }
        });
    });

// auth with google
router.get("/google", (req, res) => {
    // handle with passport
    res.send("setup passport to log in with google");
});

// auth logout
router.get("/logout", (req, res) => {
    // handle with passport
    res.send("setup passport to log out");
});

module.exports = router;