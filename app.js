
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var firebase = require("firebase/app");

var mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/users');
var serviceRouter = require('./routes/services');
var workerRouter = require('./routes/workers');
var relationRouter = require('./routes/relationService_Workers');
var chatRouter = require('./routes/chats');
var messageRouter = require('./routes/messages');
var notificationRouter = require('./routes/notifications');
var photosRouter = require('./routes/photos');

var app = express();

mongoose.connect("YOUR_MONGO_URL", { useUnifiedTopology: true, useNewUrlParser: true });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/services', serviceRouter);
app.use('/workers', workerRouter);
app.use('/relations', relationRouter);
app.use('/chats', chatRouter);
app.use('/messages', messageRouter);
app.use('/notifications', notificationRouter);
app.use('/photos', photosRouter);

/*
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
*/
module.exports = app;
