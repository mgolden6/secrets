// jshint esversion:6
// require modules
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const models = require("../models/index");

// serialize user._id
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// deserialize user._id
passport.deserializeUser((id, done) => {
    models.User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(
    new GoogleStrategy({
        // options for the google strategy
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/redirect"
    },
        // STEP5: Google responds with scope info in "profile"
        // STEP6: serialization of _id occurs with "done"
        (accessToken, refreshToken, profile, done) => {
            // check if user already exists in our db
            models.User.findOne({
                // in the future consider a membership table:
                // same email with multiple 3rd party ID's, etc. 
                third_party_id: profile.id
            }).then((currentUser) => {
                if (currentUser) {
                    // user already exists,
                    // so serialize, create cookie & log in
                    done(null, currentUser);
                } else {
                    // if not, create new user
                    const newUser = new models.User({
                        first_name: profile._json.given_name,
                        last_name: profile._json.family_name,
                        email: profile._json.email,
                        reg_method: "Google",
                        reg_id: profile.id
                    });
                    // then save new user
                    newUser.save((err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            // log in the new User
                            done(null, newUser);
                        }
                    });
                }
            });
        }
    )
);