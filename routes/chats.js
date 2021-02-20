var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Chats = require('../models/chat');
var Messages = require('../models/message');
var Users = require('../models/users');

router.post('/createChat', function (req, res, next) {

      var chat = new Chats({
            _id: new mongoose.Types.ObjectId(),
            room: new mongoose.Types.ObjectId(),
            participant1: req.body.participant1,
            participant2: req.body.participant2
      });

      var message = new Messages({
            content: req.body.content,
            chat: chat["_id"]
      });

      Chats.find({ participant1: req.body.participant1, participant2: req.body.participant2 }, function (err, data) {

            if (err) {
                  res.send(err);
            }

            if (data == "") {

                  Chats.create(chat, function (error, data) {
                        if (error = null) {
                              throw Error(error);
                        }

                        Messages.create(message, function (error, data) {
                              if (error = null) {
                                    throw Error(error);
                              }

                              res.status(200).send({
                                    "Message": "Chat and Message Created with success"
                              })
                        });

                  });

            } else {

                  var message2 = new Messages({
                        content: req.body.content,
                        chat: data[0]["_id"]
                  });

                  Messages.create(message2, function (error, data) {
                        if (error = null) {
                              throw Error(error);
                        }

                        res.status(200).send({
                              "Message": "Message Created with success"
                        })
                  });

            }

      });






});

router.post('/clientChats', function (req, res, next) {

      Chats.find({ $or: [{ participant1: req.body.participant1 }, { participant2: req.body.participant1 }] }).populate('participant1').populate('participant2').exec(function (err, result) {

            if (err) {
                  res.send(err)
            }
            else {
                  res.send(result)
            }

      });

});


module.exports = router;