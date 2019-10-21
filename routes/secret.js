// jshint esversion:6
// require modules
const express = require("express");
const secretRouter = express.Router();

// authorization check
const authCheck = (req, res, next) => {

    console.log("4. Hit authCheck...");


    if (!req.user) {
        // if user is not logged in

        console.log("5-BAD: FAILED authCheck -> rerouting to Login");

        res.redirect("/auth/login");
    } else {
        // if user is logged in

        console.log("5-GOOD: PASSED authCheck -> proceeding next page");

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