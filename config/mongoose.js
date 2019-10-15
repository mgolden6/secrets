// jshint esversion:6
// require modules
const mongoose = require("mongoose");

// configure mongoose for Users
// name the User database
const userDB = process.env.USER_DB;

// connect to the userDB with a local URI...
const dbURI = "mongodb://localhost:27017/" + userDB;

// ... OR connect to the userDB with a mongoDB.Atlas URI
// const dbURI = "mongodb+srv://" + process.env.MONGODB_UN + ":" + process.env.MONGODB_PW + "@cluster0-mlepv.mongodb.net/" + userDB + "?retryWrites=true&w=majority";

mongoose.connect(dbURI, { useNewUrlParser: true });

// test connection to db
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', function () {
    console.log("mongoose connected @ " + dbURI);
});

// build schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// compile schema into a model
const User = mongoose.model("User", userSchema);