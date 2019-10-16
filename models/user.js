// jshint esversion:6
const mongoose = require("mongoose");

// build schema for users
const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    reg_method: String,
    third_party_id: String
});

// compile schema into a model
const User = mongoose.model("User", userSchema);

module.exports = User;