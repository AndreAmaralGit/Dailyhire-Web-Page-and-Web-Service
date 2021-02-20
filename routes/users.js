var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');

var Users = require('../models/users');

router.post('/login', function (req, res, next) {

      var email = req.body.email;
      var password = req.body.password;

      Users.findOne({ email: email })
            .then(function (data) {

                  if (!data) {
                        res.status(401).send({ "message": "User not found", status: 401 });
                  } else if (data.password != password) {
                        res.status(400).send({ "message": "Wrong password", status: 400 });
                  } else {
                        res.status(200).send(data);
                  }
            });
});

router.post('/createUser', [

      body('name').isLength({ min: 2 }),
      body('address').not().isEmpty(),
      body('email').isEmail().withMessage('Invalid Email').custom((value, { req }) => {
            return new Promise((resolve, reject) => {
                  Users.findOne({ email: req.body.email }, function (err, user) {
                        if (err) {
                              reject(new Error('Server Error'))
                        }
                        if (Boolean(user)) {
                              reject(new Error('E-mail already in use'))
                        }
                        resolve(true)
                  });
            });
      }),
      body('phoneNumber').isLength({ min: 9 }),
      body('birthdate').not().isEmpty(),
      body('password').isLength({ min: 4 })

], function (req, res, next) {

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
      }

      var user = new Users({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            address: req.body.address,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            gender: req.body.gender,
            birthdate: req.body.birthdate,
            password: req.body.password,
            workerState: false,
            ratingCounter: null,
            ratingTotal: null,
            photo: "images/BasicPhoto.png"
      });


      Users.create(user, function (error, data) {
            if (error = null) {
                  throw Error(error);
            }

            res.status(200).send({
                  "Message": "User Created with success"
            })
      });
});

router.post('/updateUser', [

      body('name').isLength({ min: 2 }),
      body('address').not().isEmpty(),
      body('phoneNumber').isLength({ min: 9 }),
      body('birthdate').not().isEmpty(),
      body('password').isLength({ min: 4 }).bail().isAlphanumeric().bail()

], function (req, res, next) {

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
      }

      var user = new Users({
            name: req.body.name,
            address: req.body.address,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            gender: req.body.gender,
            birthdate: req.body.birthdate,
            password: req.body.password,
            photo: req.body.photo
      });

      Users.findByIdAndUpdate(req.body._id, user, { new: true }, function (err, result) {

            if (err) {
                  res.send(err)
            }
            else {
                  res.send(result)
                  console.log(result)
            }

      })
});

router.post('/findUser', function (req, res, next) {

      Users.findOne({ _id: req.body._id }, function (err, result) {

            if (err) {
                  res.send(err)
            }
            else {
                  res.send(result)
            }
      });
});

router.get('/allUsers', function (req, res, next) {

      Users.find({}, function (err, result) {

            if (err) {
                  res.send(err)
            }
            else {
                  res.send(result)
            }
      });
});

module.exports = router;
