const mongoose = require('mongoose');
const { json } = require('express');

const workers = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    user: [{type: mongoose.Schema.Types.ObjectId, ref: 'Users'}],
    area: String,
    experience: Number,
    ratingCounter: Number,
    ratingTotal: Number,
});


module.exports = mongoose.model('Workers', workers);