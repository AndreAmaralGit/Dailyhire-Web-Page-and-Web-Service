var socket_io = require('socket.io');
var io = socket_io();
var socketApi = {};

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Messages = require('./models/message');
var Chats = require('./models/chat');
const { db } = require('./models/message');

socketApi.io = io;

const connect = mongoose.connect("YOUR_MONGO_URL", { useUnifiedTopology: true, useNewUrlParser: true });

// sempre que o socketio receber uma conexão vai devoltar realizar o broadcast dela
io.on('connection', function (socket) {

  console.log('user connected');

  socket.on('room', function (sala) {

    socket.join(sala);

  });



  socket.on('chat message', function ({ id: id, msg: msg, sala: sala }) {

    io.to(sala).emit('chat message', msg);

    let message = new Messages({
      content: msg,
      chat: id
    });
    
          //save chat to the database
          connect.then(db => {
            console.log("connected correctly to the server");
    
            let message = new Messages({
              content: msg,
              chat: id
            });
    
            message.save();
          });
          
  });


});

module.exports = socketApi;