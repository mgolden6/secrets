// jshint esversion:6
import mongoose from "mongoose";

// build schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// compile schema into a model
const User = mongoose.model("User", userSchema);

export default User; 