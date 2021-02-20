const mongoose = require('mongoose');
const { json } = require('express');

const messageSchema = mongoose.Schema({
  content: String,
  chat: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chats' }]
},
  {
    timestamps: true
  }
);


module.exports = mongoose.model('Messages', messageSchema);