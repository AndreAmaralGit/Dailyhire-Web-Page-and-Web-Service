const mongoose = require('mongoose');
const { json } = require('express');

const notificationSchema = mongoose.Schema({
  content: String,
  user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }]
});


module.exports = mongoose.model('Notifications', notificationSchema);