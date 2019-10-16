// jshint esversion:6
// import each model
const User = require("../models/user");
// Step1: future models would go here

// combine models into a single object
const models = {
    User
    // Step2: "," future models would go here
};

// export all models
module.exports = models;