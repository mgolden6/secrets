// jshint esversion:6
// require modules
require('dotenv').config();
const express = require("express");
const authRoutes = require("./routes/auth-routes");

// configure express
const port = 3000;
const app = express();

// set up view engine (ejs)
app.set("view engine", "ejs");

// configure access to local files
app.use(express.static("public"));

// set up routes
// reference auth routes
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