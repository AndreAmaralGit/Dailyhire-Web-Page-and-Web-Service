var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Notifications = require('../models/notification');

router.post('/createNotification', function (req, res, next) {

      var notification = new Notifications({
            content: req.body.content,
            user: req.body.user
      });

      Notifications.find({ content: req.body.content, user: req.body.user }, function (err, data) {

            if (err) {
                  res.send(err);
            }

            if (data.length > 0) {

                  res.status(400).send({
                        "Message": "Notification already exists"
                  })

            } else {

                  Notifications.create(notification, function (error, data) {
                        if (error = null) {
                              throw Error(error);
                        }

                        res.status(200).send({
                              "Message": "Notification Created with success"
                        })
                  });

            }

      });
});


router.post('/findNotifications', function (req, res, next) {

      Notifications.find({ user: req.body.user }, function (err, result) {

            if (err) {
                  res.send(err)
            }
            else {
                  res.send(result)

            }

      });

});

router.post('/clearNotifications', function (req, res, next) {

      Notifications.deleteMany({ user: req.body.user }, function (err, result) {

            if (err) {
                  res.send(err)
            }
            else {
                  res.status(200).send({
                        "Message": "Successful deletion"
                  })
            }

      });

});

module.exports = router;