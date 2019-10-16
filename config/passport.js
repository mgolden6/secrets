// jshint esversion:6
// require modules
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");

passport.use(new GoogleStrategy({
    // options for the google strategy
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/redirect"
},
    (accessToken, refreshToken, profile, cb) => {
        // passport callback function
        console.log(
            "first_name: " + profile._json.given_name,
            "last_name: " + profile._json.family_name,
            "email: " + profile._json.email,
            "reg_method: " + "Google",
            "third_party_id: " + profile.id
        );

        // User.findOrCreate({
        //     first_name: profile._json.given_name,
        //     last_name: profile._json.family_name,
        //     email: profile._json.email,
        //     reg_method: "Google",
        //     third_party_id: profile.id
        // },
        //     (err, user) => {
        //         return cb(err, user);
        //     });
    }
));