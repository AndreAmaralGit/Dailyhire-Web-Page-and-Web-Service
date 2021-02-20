var express = require('express');
var router = express.Router();
var multer = require('multer');
var mongoose = require('mongoose');
const path = require('path');

var Users = require('../models/users');

// Set Storage Engine

const storage = multer.diskStorage({
      destination: './public/images/uploads/',
      filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
      }
});

// Init Upload

const upload = multer({
      storage: storage,
      fileFilter: function (req, file, cb) {
            checkFileType(file, cb);
      }
}).single('img');

// Check File Type

function checkFileType(file, cb) {

      var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return cb(new Error('Only images are allowed'))
        }
        cb(null, true)
}


router.post('/uploadPhoto', (req, res) => {
      upload(req, res, (err) => {

            if (err) {
                  res.send(err);
            } else {
                  if (req.file == undefined) {
                        res.status(401).send({
                              "Message": "You must choose a image"
                        })

                  } else {
                        res.status(200).send(req.file.filename)
                  }

            }


      });
});


module.exports = router;