// jshint esversion:6
// require modules
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const models = require("../models/index");

passport.use(
    new GoogleStrategy({
        // options for the google strategy
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/redirect"
    },
        (accessToken, refreshToken, profile, cb) => {
            // check if user already exists in our db
            models.User.findOne({
                third_party_id: profile.id
            }).then((existingUser) => {
                if (existingUser) {
                    // user already exists
                    console.log("user already exists: " + existingUser);
                } else {
                    // if not, save new user
                    const newUser = new models.User({
                        first_name: profile._json.given_name,
                        last_name: profile._json.family_name,
                        email: profile._json.email,
                        reg_method: "Google",
                        third_party_id: profile.id
                    });
                    newUser.save((err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            res.render("secrets");
                        }
                    });
                }
            });
        }
    )
);