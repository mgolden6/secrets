// jshint esversion:6
// require modules
require('dotenv').config();
const express = require("express");
const authRoutes = require("./routes/auth-routes");
const secretRoutes = require("./routes/secret-routes");
const bodyParser = require("body-parser");

// configure express
const port = 3000;
const app = express();

// set up view engine (ejs)
app.set("view engine", "ejs");

// configure access to local files
app.use(express.static("public"));

// configure body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// set up routes
// home
app.get("/", (req, res) => {
    res.render("home");
});

// auth
app.use("/auth", authRoutes);

// secret
app.use("/secret", secretRoutes);

// test express server
app.listen(port, () => {
    console.log("Server started on port " + port);
});