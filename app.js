var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
var pool = require('./db');
var passport = require('passport');
var session = require('express-session');
var flash = require('express-flash');
var methodOverride = require("method-override");
var PORT = process.env.PORT || 3000;

var indexRouter = require('./routes/index');
var restaurantRouter = require('./routes/restaurants');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(methodOverride('_method'));


app.use('/', indexRouter);
app.use('/restaurants', restaurantRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(PORT, function () {
  console.log(`Running on ${PORT}`);
});

module.exports = app;
