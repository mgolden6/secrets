// jshint esversion:6
// require modules
const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const mongoose = require("mongoose");
const models = require("../models/index");
const passport = require("passport");

// auth/register
authRouter.route("/register")
    .get((req, res) => {
        res.render("register");
    })
    .post((req, res) => {
        // salt & hash the password immediately
        bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
            if (err) {
                console.log(err);
            } else {
                // check if user already exists in our db
                models.User.findOne({
                    email: req.body.email
                }).then((existingUser) => {
                    if (existingUser) {
                        // user already exists
                        console.log("user already exists: " + existingUser);
                        // send them to the login page
                        res.render("login");
                    } else {
                        //if not, save new user
                        const newUser = new models.User({
                            first_name: req.body.first_name,
                            last_name: req.body.last_name,
                            email: req.body.email,
                            password: hash,
                            reg_method: "ChronicMOBILE"
                        });
                        newUser.save((err) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("successfully saved new user: " + newUser);
                                res.render("secrets");
                            }
                        });
                    }
                });
            }
        });
    });

// auth/login
authRouter.route("/login")
    .get((req, res) => {
        res.render("login");
    })
    .post((req, res) => {
        // find if the user/email exists
        models.User.findOne({ email: req.body.email }, (err, existingUser) => {
            if (err) {
                console.log(err);
            } else {
                if (existingUser) {
                    // user exists, so compare entered password vs stored password
                    bcrypt.compare(req.body.password, existingUser.password, (err, result) => {
                        if (err) {
                            console.log(err);
                        } if (result === true) {
                            // passwords match: grant access
                            res.render("secrets");
                        } else {
                            // passwords don't match: try again
                            console.log("incorrect password, please try again");
                            res.render("login");
                        }
                    });
                } else {
                    // user doesn't exist
                    console.log("user doesn't exist, please register");
                    res.render("register");
                }
            }
        });
    });

// auth/google
// STEP1: our initial request to Google via /config/passport.js
authRouter.get("/google", passport.authenticate("google", {
    scope: [
        "email",
        "profile"
    ]
}));

// STEP2: callback route from Google to our app
authRouter.get("/google/redirect", passport.authenticate("google"), (req, res) => {
    res.send("Google reached our callback URI");
});

// auth/logout
authRouter.get("/logout", (req, res) => {
    // handle with passport
    res.send("setup passport to log out");
});

module.exports = authRouter;