// jshint esversion:6
// require modules
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(new GoogleStrategy({
    // options for the google strategy
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "test"
},
    (accessToken, refreshToken, profile, cd) => {
        // passport callback function
        User.findOrCreate({
            googleID: profile.id
        },
            (err, user) => {
                return cb(err, user);
            });
    }
));