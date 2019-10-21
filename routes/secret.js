// jshint esversion:6
// require modules
const express = require("express");
const secretRouter = express.Router();

// authorization check
const authCheck = (req, res, next) => {
    if (!req.user) {
        // if user is not logged in
        res.redirect("/auth/login");
    } else {
        // if user is logged in
        next();
    }
};

// view secrets
secretRouter.route("/view")
    .get(authCheck, (req, res) => {
        res.render("view", {
            first_name: req.user.first_name
        });
    });

// submit secrets
secretRouter.route("/submit")
    .get(authCheck, (req, res) => {
        res.render("submit", {
            first_name: req.user.first_name
        });
    })
    .post(authCheck, (req, res) => {
        res.redirect("view");
    });

module.exports = secretRouter;