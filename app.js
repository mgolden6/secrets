// jshint esversion:6
// require modules
require('dotenv').config();
const express = require("express");
const authRoutes = require("./routes/auth-routes");
// const ejs = require("ejs");
const bodyParser = require("body-parser");
// replace LEVEL 2 (Encryption) with LEVEL 3 (md5 Hashing)
// const encrypt = require("mongoose-encryption");
// replace LEVEL 3 (md5 hashing) with LEVEL 4 (bcrypt's Salting & better Hashing)
// const md5 = require("md5");
// moved next 3 lines to authRoutes - bring back when need database & encryption
// const bcrypt = require("bcrypt");
// const saltRounds = 10;
// const mongoose = require("mongoose");

// configure express
const port = 3000;
const app = express();

// set up view engine (ejs)
app.set("view engine", "ejs");

// configure body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// configure access to local files
app.use(express.static("public"));

// set up routes
// point to auth routes
app.use("/auth", authRoutes);

// home
app.get("/", (req, res) => {
    res.render("home");
});

// submit
app.route("/submit")

    .get((req, res) => {
        res.render("submit");
    })

    .post((req, res) => {
        res.send("finish code to submit a secrete");
    });

// test express server
app.listen(port, () => {
    console.log("Server started on port " + port);
});