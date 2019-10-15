// jshint esversion:6
const mongoose = require("mongoose");

// import each model
const User = require("../models/user");

// combine models into a single object
const models = {
    User
};

// create a function to connect to the database
const connectDB = () => {

    // configure mongoose for Users
    // connect to the userDB with a remote or local URI...
    const dbURI = "mongodb://localhost:27017/" + process.env.USER_DB || "mongodb+srv://" + process.env.MONGODB_UN + ":" + process.env.MONGODB_PW + "@cluster0-mlepv.mongodb.net/" + process.env.USER_DB + "?retryWrites=true&w=majority";

    // ... OR connect to the userDB with a mongoDB.Atlas URI
    // const dbURI = "mongodb+srv://" + process.env.MONGODB_UN + ":" + process.env.MONGODB_PW + "@cluster0-mlepv.mongodb.net/" + process.env.USER_DB + "?retryWrites=true&w=majority";

    return mongoose.connect(dbURI, { useNewUrlParser: true });
};

// export the function that connects to the db
// export { connectDB };

// export all models
module.exports = models;