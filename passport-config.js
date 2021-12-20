var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var pool = require('./db');

function initialize(passport) {
  const authenticateUser = function(username, password, done) {
    pool.query("SELECT * FROM credentials WHERE username = $1", [username], (err, results) => {
      if (err) {
        return done(err);
      };
      if (results.rows.length > 0 ) {
        const user = results.rows[0];
        bcrypt.compare(password, user.password, (err, results) => {
          if (err) {
            return done(err);
          };
          if (results) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Incorrect Password"})
          };
        });
      } else {
          return done(null, false, { message: "Username does not exist"});
      };
    });
  };


passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
}, authenticateUser));

passport.serializeUser((user, done) => {
  return done(null, user.user_id);
});

passport.deserializeUser((id, done) => {
  pool.query("SELECT * FROM credentials WHERE user_id = $1", [id], (err, results) => {
    if (err) {
      return done(err);
    }
    return done(null, results.rows[0]);
  });
});
};








module.exports = initialize
