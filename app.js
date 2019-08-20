//jshint esversion:6
//require modules
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
//replace LEVEL 2 (Encryption) with LEVEL 3 (md5 Hashing)
// const encrypt = require("mongoose-encryption");
//replace LEVEL 3 (md5 hashing) with LEVEL 4 (bcrypt's Salting & better Hashing)
// const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const mongoose = require("mongoose");

//configure express
const port = 3000;
const app = express();

//configure ejs
app.set("view engine", "ejs");

//configure body-parser
app.use(bodyParser.urlencoded({ extended: true }));

//configure access to local files
app.use(express.static("public"));

//configure mongoose
//connect to a db
mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

//test connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("mongoose connected");
});

//build schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

//configure encryption (LEVEL 2: Encryption + Environment Variables)
// userSchema.plugin(encrypt, {
//     secret: process.env.SECRET_STRING,
//     encryptedFields: ["password"]
// });

//compile schema into a model
const User = mongoose.model("User", userSchema);

//get routes
app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});

//post routes
//register a new user (LEVEL 1: User Name & Password)
app.post("/register", function (req, res) {
    //LEVEL 4: Salting & Hashing with bcrypt
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        if (err) {
            console.log(err);
        } else {
            const newUser = new User({
                email: req.body.username,
                //Replace LEVEL 3 (md5 Hashing) with LEVEL 4 (bcryt hash)
                password: hash
            });
            newUser.save(function (err) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("secrets");
                }
            });
        }
    });
});

//check credentials and login
app.post("/login", function (req, res) {
    User.findOne({ email: req.body.username }, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                //Replace LEVEL 3 (compare register & login Hash's -w- md5) -w- LEVEL 4 (salt & hash with bcrypt)
                bcrypt.compare(req.body.password, foundUser.password, function (err, result) {
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

//test express server
app.listen(port, function () {
    console.log("Server started on port " + port);
});