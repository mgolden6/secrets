// jshint esversion:6
const mongoose = require("mongoose");

// build schema for users
const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        required: [
            true,
            "A valid email address is required"
        ]
    },
    password: String,
    reg_method: String,
    reg_id: String
});

// compile schema into a model
const User = mongoose.model("user", userSchema);

module.exports = User;