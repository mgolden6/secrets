// jshint esversion:6
// require modules
const express = require("express");
const secretRouter = express.Router();

// ADD A secret/view ROUTE
// view
secretRouter.route("/view")

    .get((req, res) => {
        res.render("view");
    });

// submit
secretRouter.route("/submit")

    .get((req, res) => {
        res.render("submit");
    })

    .post((req, res) => {
        res.redirect("view");
    });

module.exports = secretRouter;