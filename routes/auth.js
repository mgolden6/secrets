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
                const newUser = new models.User({
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

// auth/login
authRouter.route("/login")
    .get((req, res) => {
        res.render("login");
    })
    .post((req, res) => {
        // find if the user/email exists
        models.User.findOne({ email: req.body.username }, (err, foundUser) => {
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

// auth/google
// STEP1: our initial request to Google via /config/passport.js
authRouter.get("/google", passport.authenticate("google", {
    scope: ["profile"]
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