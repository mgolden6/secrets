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
                            res.redirect("login");
                        }
                        else {
                            // if not, create new user
                            const newUser = new models.User({
                                first_name: req.body.first_name,
                                last_name: req.body.last_name,
                                email: req.body.email,
                                password: hash,
                                reg_method: "ChronicMOBILE",
                                // use the date (in milliseconds) for our reg_id
                                reg_id: Date.parse(new Date())
                            });
                            // then save the new User
                            newUser.save((err) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log("successfully saved new user: " + newUser);

                                    // log in the new User
                                    req.login(newUser, (err) => {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            // then grant newUser access once saved & logged in
                                            res.redirect("/secret/view");
                                        }
                                    });
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
        res.render("login", { login_message: "Log In" });
    })
    .post((req, res) => {

        console.log("1. Hit login.post route");

        // find if the user/email exists
        models.User.findOne({
            email: req.body.email
        }, (err, currentUser) => {
            if (err) {
                console.log(err);
            } else {
                if (currentUser) {

                    console.log("2. Found user: " + currentUser.first_name);

                    // user exists, so compare entered password vs stored password
                    bcrypt.compare(req.body.password, currentUser.password, (err, result) => {
                        if (err) {
                            console.log(err);
                        } if (result === true) {
                            // passwords match: grant access

                            console.log("3. Passwords match!");

                            req.login(currentUser, (err) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    res.redirect("/secret/view");
                                }
                            });

                        } else {
                            // passwords don't match: try again
                            res.render("login", { login_message: "Login failed, please try again" });
                        }
                    });
                } else {
                    // user doesn't exist
                    console.log("user doesn't exist, please register");
                    res.redirect("register");
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
    res.redirect("/secret/view");
});

// logout
authRouter.get("/logout", (req, res) => {
    // handle with passport
    req.logout();
    res.redirect("../");
});

module.exports = authRouter;