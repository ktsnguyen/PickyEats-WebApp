var express = require('express');
var router = express.Router();
var pool = require('../db');
var bcrypt = require('bcrypt');
var session = require('express-session');
var flash = require('express-flash');
var passport = require('passport');

const initializePassport = require('../passport-config');

initializePassport(passport);

/* GET home page. */
router.get('/', checkAuthenticated, function(req, res, next) {
  res.render('index');
});

router.get('/register', checkAuthenticated, function(req, res, next) {
  res.render('register');
});

router.post('/register', async function(req, res, next) {
  try {
    const { username, email} = req.body;
    let { password } = req.body;
    if (username === "" || email === "" || password === "") {
      req.flash("registerFailed", "One or more field is missing");
      res.redirect('/register');
    } else {
      password = await bcrypt.hash(req.body.password, 10);
      const registerAccount = await pool.query("INSERT INTO credentials(username, email, password) VALUES($1,$2,$3)", [username, email, password]);
      res.redirect('/');
    };
  } catch (err) {
    console.error(err.message);
  };
});

router.post('/', passport.authenticate('local', {
  successRedirect: '/restaurants',
  failureRedirect: '/',
  failureFlash: true
}));

router.get('/logout', function(req, res, next) {
  req.logOut();
  req.flash('success', "You have logged out");
  res.redirect('/');
});


function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/restaurants');
  };
  next();
};

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  }
  return res.redirect('/');
};


module.exports = router;
