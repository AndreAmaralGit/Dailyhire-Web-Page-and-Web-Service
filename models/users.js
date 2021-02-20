const mongoose = require('mongoose');
const { json } = require('express');

const users = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name: String,
    address: String,
    email: {type : String, unique:true} ,
    phoneNumber: Number,
    gender: String,
    birthdate: Date,
    password: String,
    workerState: Boolean,
    ratingCounter: Number,
    ratingTotal: Number,
    photo: String
});


module.exports = mongoose.model('Users', users);