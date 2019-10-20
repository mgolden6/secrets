// jshint esversion:6
// require modules
const express = require("express");
const secretRouter = express.Router();


// view secrets
secretRouter.route("/view")

    .get((req, res) => {
        res.render("view", {
            first_name:req.user.first_name
        });
    });

// submit secrets
secretRouter.route("/submit")

    .get((req, res) => {
        res.render("submit");
    })

    .post((req, res) => {
        res.redirect("view");
    });

module.exports = secretRouter;