// jshint esversion:6
// require modules
const mongoose = require("mongoose");

// try connecting to the userDB locally, then try remote
const dbURI = process.env.MONGODB_LOCAL_URI || process.env.MONGODB_ATLAS_URI;

mongoose.connect(dbURI, { useNewUrlParser: true });

// test connection to db
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', function () {
    console.log("mongoose connected @ " + dbURI);
});