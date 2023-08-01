const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        required: true,
        type: String,
    },
    password: {
        required : true,
        type: String,
    },
    products: [],
},
    {timestamps: true},);
const User = mongoose.model("User", UserSchema)
module.exports = User;