const mongoose = require('mongoose');
const { json } = require('express');

const services = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    workArea: String,
    startDate: Date,
    endDate: Date,
    address: String,
    description: String,
    rating: Number,
    clientRating: Number,
    state: String,
    user: [{type: mongoose.Schema.Types.ObjectId, ref: 'Users'}]
});


module.exports = mongoose.model('Services', services);