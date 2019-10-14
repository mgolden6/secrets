// jshint esversion:6
// require modules
const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const mongoose = require("mongoose");

// configure mongoose
// connect to a the userDB
mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

// test connection to db
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

// compile schema into a model
const User = mongoose.model("User", userSchema);

// auth: register
authRouter.route("/register")

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

// auth: login
authRouter.route("/login")

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

// auth: google
authRouter.get("/google", (req, res) => {
    // handle with passport
    res.send("setup passport to log in with google");
});

// auth: logout
authRouter.get("/logout", (req, res) => {
    // handle with passport
    res.send("setup passport to log out");
});

module.exports = authRouter;