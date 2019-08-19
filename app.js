//jshint esversion:6
//require modules
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");

//configure express
const port = 3000;
const app = express();

//configure ejs
app.set("view engine", "ejs");

//configure body-parser
app.use(bodyParser.urlencoded({ extended: true }));

//configure access to local files
app.use(express.static("public"));















//test express server
app.listen(port, function () {
    console.log("Server started on port " + port);
});