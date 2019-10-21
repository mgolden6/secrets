// jshint esversion:6
// require modules
const express = require("express");
const secretRouter = express.Router();

// authorization check
const authCheck = (req, res, next) => {
    console.log("4. Hit authCheck...");
    if (!req.user) {
        // user is not logged in: redirect to login
        res.redirect("/auth/login");
    } else {
        // user is logged in, proceed
        next();
    }
};

// view secrets
secretRouter.route("/view")
    // check if authorized to view
    .get(authCheck, (req, res) => {
        // render view page if authorized
        res.render("view", {
            // personalize view page
            first_name: req.user.first_name
        });
    });

// submit secrets
secretRouter.route("/submit")
    // check if authorized to view
    .get(authCheck, (req, res) => {
        // render submit page if authorized
        res.render("submit", {
            // personalize submit page
            first_name: req.user.first_name
        });
    })
    // already authorized to "/submit" route to have gotten here,
    // so no need to check authorization again
    .post((req, res) => {
        // we're not actually storing new secrets
        // we could by adding a new schema, etc.
        // instead, we are just ridirecting back to view page
        res.redirect("view");
    });

module.exports = secretRouter;