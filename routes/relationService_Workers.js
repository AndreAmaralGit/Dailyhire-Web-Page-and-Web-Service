var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');

var Relations = require('../models/relationService_Worker');
var Users = require('../models/users');
var Workers = require('../models/workers');
var Services = require('../models/services');
var Notifications = require('../models/notification');


router.post('/createRelation', [

      body('service').not().isEmpty(),
      body('worker').not().isEmpty(),

], function (req, res, next) {

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
      }

      var relation = new Relations({
            _id: new mongoose.Types.ObjectId(),
            service: req.body.service,
            worker: req.body.worker,
            state: false
      });

      Relations.create(relation, function (error, data) {
            if (error = null) {
                  throw Error(error);
            }

            res.status(200).send({
                  "Message": "Relation Created with success"
            })
      });
});


router.post('/listRelations', function (req, res, next) {

      Relations.find({ service: req.body.service, state: req.body.state }).populate({ path: 'worker', populate: { path: 'user' } }).exec(function (err, result) {

            if (err) {
                  res.send(err)
            }
            else {
                  res.send(result)
            }

      });
});

router.post('/updateRelation', function (req, res, next) {


      Relations.findByIdAndUpdate(req.body._id, { state: true }, function (err, result) {

            if (err) {
                  res.send(err)
            }
            else {

                  Services.findByIdAndUpdate(req.body.service, { state: req.body.state }, function (err, result) {

                        if (err) {
                              res.send(err)
                        }
                        else {

                              res.send(result)

                        }

                  })

            }

      })
});


router.post('/searchRelation', function (req, res, next) {

      Relations.find({ service: req.body.service, worker: req.body.worker }).exec(function (err, result) {

            if (err) {
                  res.send(err)
            }
            else {
                  res.send(result)
            }

      });
});

router.post('/findRelationbyWorker', function (req, res, next) {

      Relations.find({ worker: req.body.worker, state: req.body.state }).populate({ path: 'service', populate: { path: 'user' } }).exec(function (err, result) {

            if (err) {
                  res.send(err)
            }
            else {
                  res.send(result)
            }

      });
});

router.post('/findRelationsbyUser', function (req, res, next) {

      Relations.find({ service: req.body.service, state: req.body.state }).populate({ path: 'worker', populate: { path: 'user' } }).populate({ path: 'service' }).exec(function (err, result) {

            if (err) {
                  res.send(err)
            }
            else {
                  res.send(result)
            }

      });
});


router.post('/allRelationsbyWorker', function (req, res, next) {

      Relations.find({ worker: req.body.worker }).exec(function (err, result) {

            if (err) {
                  res.send(err)
            }
            else {
                  res.send(result)
            }

      });
});

module.exports = router;
