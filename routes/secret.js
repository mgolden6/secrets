// jshint esversion:6
// require modules
const express = require("express");
const secretRouter = express.Router();

// submit
secretRouter.route("/submit")

    .get((req, res) => {
        res.render("submit");
    })

    .post((req, res) => {
        res.send("finish code to submit a secrete");
    });

module.exports = secretRouter;