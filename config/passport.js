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
        console.log(profile.id, profile.displayName);

        // User.findOrCreate({
        //     googleID: profile.id
        // },
        //     (err, user) => {
        //         return cb(err, user);
        //     });
    }
));