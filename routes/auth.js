// jshint esversion:6
// require modules
const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const mongoose = require("mongoose");
const models = require("../models/index");
const passport = require("passport");

// register
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
                }, (err, currentUser) => {
                    if (err) {
                        console.log(err);
                    } else {
                        if (currentUser) {
                            // user already exists
                            console.log("user already exists, please log in");
                            // send them to the login page
                            res.render("login");
                        }
                        else {
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
                    }
                });
            }
        });
    });

// login
authRouter.route("/login")
    .get((req, res) => {
        res.render("login");
    })
    .post((req, res) => {
        // find if the user/email exists
        models.User.findOne({
            email: req.body.email
        }, (err, currentUser) => {
            if (err) {
                console.log(err);
            } else {
                if (currentUser) {
                    // user exists, so compare entered password vs stored password
                    bcrypt.compare(req.body.password, currentUser.password, (err, result) => {
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

// google
// STEP1: our initial request to Google when the user selects Google login
// this bundles the scope below, with our GoogleStrategy in passport.js,
// STEP2: Google presents the user with who's (client_id) asking for what (scope)
authRouter.get("/google", passport.authenticate("google", {
    scope: [
        "email",
        "profile"
    ]
}));

// STEP3: if user approves, Google responds with a code to our redirect route
// STEP4: then we send that code back to Google in exchange for information in scope
authRouter.get("/google/redirect", passport.authenticate("google"), (req, res) => {
    res.render("secrets");
});

// logout
authRouter.get("/logout", (req, res) => {
    // handle with passport
    res.redirect("../");
});

module.exports = authRouter;