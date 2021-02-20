const mongoose = require('mongoose');
const { json } = require('express');

const chatSchema = mongoose.Schema({
      _id: mongoose.Schema.Types.ObjectId,
      room:  mongoose.Schema.Types.ObjectId,
      participant1: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],  //Always the client
      participant2: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }]  //Always the worker
});

module.exports = mongoose.model('Chats', chatSchema);