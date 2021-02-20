var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const googleMapsClient = require('@google/maps').createClient({
      /*REMOVE THIS API KEY */
      key: 'YOUR_API_KEY',
      Promise: Promise
});

var Workers = require('../models/workers');
var Users = require('../models/users');

router.post('/createWorker', [

      body('area').not().equals("Choose..."),
      body('experience').not().isEmpty()

], function (req, res, next) {

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
      }

      var worker = new Workers({
            _id: new mongoose.Types.ObjectId(),
            user: req.body.user,
            area: req.body.area,
            experience: req.body.experience,
            ratingCounter: null,
            ratingTotal: null,
      });

      Workers.create(worker, function (error, data) {
            if (error = null) {
                  throw Error(error);
            }

            Users.findByIdAndUpdate(req.body.user, { "workerState": true }, { new: true }, function (err, result) {

                  if (err) {
                        res.send(err)
                  }
                  else {
                        res.send(result)
                        console.log(result)
                  }

            });
      });


});

router.post('/findWorker', function (req, res, next) {

      Workers.findOne({ _id: req.body._id }, function (err, result) {

            if (err) {
                  res.send(err)
            }
            else {
                  res.send(result)
            }
      });
});

router.post('/findWorkerbyUser', function (req, res, next) {

      Workers.find({ user: req.body._id }).populate("user").exec(function (err, result) {

            if (err) {
                  res.send(err)
            }
            else {
                  res.send(result)
            }
      });
});

router.get('/allWorkers', function (req, res, next) {

      Workers.find().populate("user").exec(function (err, result) {

            if (err) {
                  res.send(err)
            }
            else {
                  var cords = [];
                  var resultsCount = 0;

                  for (let i = 0; i < result.length; i++) {

                        var address = result[i]["user"][0]["address"];

                        googleMapsClient.geocode({
                              address: address
                        }).asPromise()
                              .then((response) => {

                                    var geoLocation = response.json.results[0].geometry.location;
                                    var user = result[i];
                                    var final = Object.assign({}, geoLocation, user);

                                    cords.push(final);

                                    resultsCount++;
                                    if (resultsCount === result.length) {
                                          res.send(cords);
                                    }

                              })
                              .catch((err) => {
                                    console.log(err);
                              });
                  }

            }
      });
});




module.exports = router;
