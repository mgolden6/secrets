//jshint esversion:6
//require modules
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

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
//register a new user
app.post("/register", function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save(function(err){
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
});

//check credentials and login
app.post("/login", function (req, res) {
    User.findOne({email: req.body.username}, function (err, foundUser){
        if (err) {
            console.log(err);            
        } else {
            if (foundUser) {
                if (foundUser.password === req.body.password) {
                    res.render("secrets");
                }
            }
        }
    });
});





//test express server
app.listen(port, function () {
    console.log("Server started on port " + port);
});