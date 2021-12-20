var express = require('express');
var router = express.Router();
var pool = require('../db');
var session = require('express-session');
var flash = require('express-flash');
var passport = require('passport');
var methodOverride = require("method-override");

//POST DATA
router.post('/', async function(req, res, next) {
  try {
    const { restaurant_name } = req.body;
    user_id = req.session.passport.user;
    const newRestaurant = await pool.query("INSERT INTO restaurants(restaurant_name, user_id) VALUES($1, $2) RETURNING *", [restaurant_name, user_id]);
    res.redirect('/');
  } catch (err) {
    console.error(err.message);
  }
});

router.get('/', checkNotAuthenticated, async function(req, res, next) {
  try {
    user_id = req.session.passport.user;
    const allRestaurant = await pool.query("SELECT * FROM restaurants WHERE user_id = $1", [user_id]);
    //res.json(allRestaurant.rows);
    res.render('restaurants', {allRestaurant: allRestaurant.rows});
  } catch (err) {
    console.error(err.message);
  }
});

router.get('/:id/edit', checkNotAuthenticated, async function(req, res, next) {
  try {
    user_id = req.session.passport.user;
    const { id } = req.params;
    const restaurant = await pool.query("SELECT * FROM restaurants WHERE toeat_id = $1 AND user_id = $2", [id, user_id]);
    res.render('edit', {restaurant: restaurant.rows[0]});
  } catch (err) {
    console.error(err.message);
  };
});

//Get a restaurant
router.get('/:id', checkNotAuthenticated, async function(req, res, next) {
  try {
    user_id = req.session.passport.user;
    const { id } = req.params;
    const restaurant = await pool.query("SELECT * FROM restaurants WHERE toeat_id = $1 AND user_id = $2", [id, user_id]);
    res.json(restaurant.rows[0]);
  } catch (err) {
    console.error(err.message);
  };
});

//Update restaurant
router.put('/:id', async function(req, res, next) {
  try {
    const { id } = req.params;
    const { restaurant_name } = req.body;
    user_id = req.session.passport.user;
    const restaurantUpdate = await pool.query("UPDATE restaurants SET restaurant_name = $1 WHERE toeat_id = $2 AND user_id = $3 RETURNING *", [restaurant_name, id, user_id]);
    res.redirect('/')
  } catch (err) {
    console.error(err.message);
  };
});

//Delete
router.delete('/:id', async function (req, res, next) {
  try {
    const { id } = req.params;
    user_id = req.session.passport.user;
    const restaurantDelete = await pool.query("DELETE FROM restaurants WHERE toeat_id = $1 AND user_id = $2 RETURNING *", [id, user_id]);
    res.redirect('/');
  } catch (err) {
    console.err(err.message);
  };
});


function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  };
  return res.redirect('/');
};



module.exports = router;
