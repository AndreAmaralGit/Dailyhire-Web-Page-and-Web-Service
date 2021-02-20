var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('frontPage');
});

router.get('/clientMap', function (req, res, next) {
  res.render('map');
});

router.get('/createService', function (req, res, next) {
  res.render('createService');
});

router.get('/profile', function (req, res, next) {
  res.render('profile');
});

router.get('/myServices', function (req, res, next) {
  res.render('myServices');
});

router.get('/serviceHistory', function (req, res, next) {
  res.render('serviceHistory');
});

router.get('/messages', function (req, res, next) {
  res.render('messages');
});

router.get('/aboutPage', function (req, res, next) {
  res.render('aboutUs');
});

router.get('/user/:id', function (req, res, next) {
  res.sendFile('rdfUser.html', { root: './views' });
});

router.get('/service/:id', function (req, res, next) {
  res.sendFile('rdfService.html', { root: './views' });
});


//  worker routes

router.get('/searchService', function (req, res, next) {
  res.render('searchService');
});

router.get('/profileWorker', function (req, res, next) {
  res.render('profileWorker');
});

router.get('/messagesWorker', function (req, res, next) {
  res.render('messagesWorker');
});

router.get('/myServicesWorker', function (req, res, next) {
  res.render('myServicesWorker');
});

router.get('/serviceHistoryWorker', function (req, res, next) {
  res.render('serviceHistoryWorker');
});

module.exports = router;
