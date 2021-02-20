var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Messages = require('../models/message');

router.post('/findMessages', function (req, res, next) {

      Messages.find({chat: req.body.chat}, function (err, result) {

            if(err){
                  res.send(err)
              }
              else{
                  res.send(result)
              }

      });

});

module.exports = router;