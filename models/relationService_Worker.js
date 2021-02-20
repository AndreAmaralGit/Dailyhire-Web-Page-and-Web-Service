const mongoose = require('mongoose');
const { json } = require('express');

const relationService_Worker = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    service: [{type: mongoose.Schema.Types.ObjectId, ref: 'Services'}],
    worker: [{type: mongoose.Schema.Types.ObjectId, ref: 'Workers'}],
    state: Boolean
});


module.exports = mongoose.model('Relations', relationService_Worker);