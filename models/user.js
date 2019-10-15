// jshint esversion:6
const mongoose = require("mongoose");

// build schema
const userSchema = new mongoose.Schema({
    email: String,
    googleid: String,
    password: String
});

// compile schema into a model
const User = mongoose.model("User", userSchema);

module.exports = User;