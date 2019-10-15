// jshint esversion:6
// require modules
const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const mongoose = require("mongoose");
const passport = require("passport");

// configure mongoose for Users
// connect to the userDB with a remote or local URI...
const dbURI = "mongodb://localhost:27017/" + process.env.USER_DB || "mongodb+srv://" + process.env.MONGODB_UN + ":" + process.env.MONGODB_PW + "@cluster0-mlepv.mongodb.net/" + process.env.USER_DB + "?retryWrites=true&w=majority";

// ... OR connect to the userDB with a mongoDB.Atlas URI
// const dbURI = "mongodb+srv://" + process.env.MONGODB_UN + ":" + process.env.MONGODB_PW + "@cluster0-mlepv.mongodb.net/" + process.env.USER_DB + "?retryWrites=true&w=majority";

mongoose.connect(dbURI, { useNewUrlParser: true });

// test connection to db
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', function () {
    console.log("mongoose connected @ " + dbURI);
});

// import models from "../config/models";
// import models, { connectDB } from "../config/models";

// build schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// compile schema into a model
const User = mongoose.model("User", userSchema);

// auth: REGISTER
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

// auth: LOGIN
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

// auth: GOOGLE
authRouter.get("/google", passport.authenticate("google", {
    scope: ["profile"]
}));

// auth: LOGOUT
authRouter.get("/logout", (req, res) => {
    // handle with passport
    res.send("setup passport to log out");
});

module.exports = authRouter;