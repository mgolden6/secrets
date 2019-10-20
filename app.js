// jshint esversion:6
// require modules
require("dotenv").config();
const express = require("express");
const passport = require("passport");
const cookieSession = require("cookie-session");
const mongooseConfig = require("./config/mongoose");
const passportConfig = require("./config/passport");
const authRoutes = require("./routes/auth");
const secretRoutes = require("./routes/secret");
const bodyParser = require("body-parser");

// create an express instance
const app = express();

// set up view engine (ejs)
app.set("view engine", "ejs");

// set up cookie-session
app.use(cookieSession({
    // maxAge in millisecons
    // 1 day = 24 hrs/day * 60 min/hr * 60 s/min * 1000 ms/s
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY]
}));

// initialize passport (for cookies here?)
app.use(passport.initialize());
app.use(passport.session());
// end set up cookie-session

// configure access to local files
app.use(express.static("public"));

// configure body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// set up routes
// home
app.get("/", (req, res) => {
    res.render("home");
});

// auth
app.use("/auth", authRoutes);

// secret
app.use("/secret", secretRoutes);

// test express server
app.listen(process.env.PORT, () => {
    console.log("Server started on port " + process.env.PORT);
});