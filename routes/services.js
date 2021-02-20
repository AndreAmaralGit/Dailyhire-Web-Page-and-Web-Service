var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');

var Services = require('../models/services');
var Relations = require('../models/relationService_Worker');
var Workers = require('../models/workers');
var Users = require('../models/users');
const { response } = require('express');

router.post('/createService', [

      body('workArea').not().equals("Choose..."),
      body('startDate').not().isEmpty(),
      body('endDate').not().isEmpty(),
      body('address').not().isEmpty(),

], function (req, res, next) {

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
      }

      var service = new Services({
            _id: new mongoose.Types.ObjectId(),
            workArea: req.body.workArea,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            address: req.body.address,
            description: req.body.description,
            rating: null,
            clientRating: null,
            state: "Pending",
            user: req.body.user
      });

      Services.create(service, function (error, data) {
            if (error = null) {
                  throw Error(error);
            }

            res.status(200).send({
                  "Message": "Service Created with success"
            })
      });
});

router.post('/clientServices', function (req, res, next) {

      Services.find({ user: req.body.user, state: req.body.state }, function (err, result) {

            if (err) {
                  res.send(err)
            }
            else {
                  res.send(result)
            }

      });

});

router.post('/allServicesbyUser', function (req, res, next) {

      Services.find({ user: req.body.user }, function (err, result) {

            if (err) {
                  res.send(err)
            }
            else {
                  res.send(result)
            }

      });

});


router.post('/updateService', function (req, res, next) {

      Services.findByIdAndUpdate(req.body._id, { state: req.body.state, rating: req.body.rating }, function (err, result) {

            if (err) {
                  res.send(err)
            }
            else {

                  Relations.find({ service: result["_id"], state: true }, function (err, result2) {

                        if (err) {
                              res.send(err)
                        }
                        else {

                              Workers.findById(result2[0]["worker"], function (err, result3) {

                                    if (err) {
                                          res.send(err)
                                    }
                                    else {

                                          if (result3["ratingCounter"] == null) {

                                                Workers.findByIdAndUpdate(result2[0]["worker"], { ratingCounter: 1, ratingTotal: req.body.rating }, function (err, result4) {

                                                      if (err) {
                                                            res.send(err)
                                                      }
                                                      else {
                                                            res.send(result4)

                                                      }

                                                })

                                          } else if (req.body.rating == null) {

                                                Workers.findByIdAndUpdate(result2[0]["worker"], { ratingCounter: result3["ratingCounter"], ratingTotal: +result3["ratingTotal"] + +req.body.rating }, function (err, result4) {

                                                      if (err) {
                                                            res.send(err)
                                                      }
                                                      else {
                                                            res.send(result4)

                                                      }

                                                })

                                          } else {

                                                Workers.findByIdAndUpdate(result2[0]["worker"], { ratingCounter: +result3["ratingCounter"] + 1, ratingTotal: +result3["ratingTotal"] + +req.body.rating }, function (err, result4) {

                                                      if (err) {
                                                            res.send(err)
                                                      }
                                                      else {
                                                            res.send(result4)

                                                      }

                                                })

                                          }



                                    }

                              })
                        }


                  })


            }

      })
});

router.post('/serviceApproved', function (req, res, next) {

      Services.findByIdAndUpdate(req.body._id, { state: req.body.state }, function (err, result) {

            if (err) {
                  res.send(err)
            }
            else {

                  console.log(result);

            }

      })
});


router.post('/searchServices', function (req, res, next) {

      Services.find({ workArea: req.body.workArea, state: req.body.state }, function (err, result) {

            if (err) {
                  res.send(err)
            }
            else {

                  res.send(result)
            }

      });

});

router.post('/updateClientRating', function (req, res, next) {

      Services.findByIdAndUpdate(req.body._id, { clientRating: req.body.rating }, function (err, result) {

            if (err) {
                  res.send(err)
            }
            else {

                  var userId = result["user"];

                  Users.findById(userId, function (err, result2) {

                        if (err) {
                              res.send(err)
                        }
                        else {

                              if (result2["ratingCounter"] == null) {

                                    Users.findByIdAndUpdate(userId, { ratingCounter: 1, ratingTotal: req.body.rating }, function (err, result) {

                                          if (err) {
                                                res.send(err)
                                          }
                                          else {
                                                res.send(result)

                                          }

                                    })

                              } else if (req.body.rating == 0) {

                                    Users.findByIdAndUpdate(userId, { ratingCounter: result2["ratingCounter"], ratingTotal: +result2["ratingTotal"] + +req.body.rating }, function (err, result3) {

                                          if (err) {
                                                res.send(err)
                                          }
                                          else {
                                                res.send(result)

                                          }

                                    })

                              } else {

                                    Users.findByIdAndUpdate(userId, { ratingCounter: +result2["ratingCounter"] + 1, ratingTotal: +result2["ratingTotal"] + +req.body.rating }, function (err, result3) {

                                          if (err) {
                                                res.send(err)
                                          }
                                          else {

                                                res.send(result)
                                          }

                                    })

                              }


                        }

                  })


            }

      })

});

router.post('/cancelService', function (req, res, next) {


      Services.findByIdAndUpdate(req.body._id, { state: req.body.state }, function (err, result) {

            if (err) {
                  res.send(err)
            }
            else {

                  res.status(200).send({
                        "Message": "Service canceled with success"
                  })

            }

      })
});

router.post('/searchServiceWithUser', function (req, res, next) {

      Services.find({ workArea: req.body.workArea, state: req.body.state }).populate({ path: 'user' }).exec(function (err, result) {

            if (err) {
                  res.send(err)
            }
            else {

                  res.send(result)
            }

      });

});

router.get('/allServices', function (req, res, next) {

      Services.find({}, function (err, result) {

            if (err) {
                  res.send(err)
            }
            else {
                  res.send(result)
            }
      });
});


router.post('/findService', function (req, res, next) {

      Services.findOne({ _id: req.body._id }, function (err, result) {

            if (err) {
                  res.send(err)
            }
            else {
                  res.send(result)
            }
      });
});

module.exports = router;
