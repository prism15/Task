const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const User = require('../models/user');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
//const User = require('../models/user');
const router = express.Router();

//router.use('view engine','ejs');
router.get('/', function (req, res) {
	console.log("In Login");
	res.render('login');
});
/*router.get("/login",function(req,res){
  res.redirect("login");
});*/
router.get('/register', function (req, res) {
	res.render('/register');
});
router.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});
router.post("/",function(req,res){
  res.render("/login");
});
router.post("/home",function(req,res){
  res.redirect("/");
});
router.post('/register', function (req, res) {
	User.register({ username: req.body.username }, req.body.password, function (
		err,
		user
	) {
		if (err) {
			console.log(err);
			res.redirect('./register');
		} else {
			passport.authenticate('local')(req, res, function () {
				res.redirect('/');
			});
		}
	});
});
router.post('/', function (req, res, next) {
	console.log('logged in');
	passport.authenticate('local', function (err, user, info) {
		console.log('in passport');
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.redirect('/login');
		}
		req.logIn(user, function (err) {
			if (err) {
				return next(err);
			}
			const ID = user._id;
			console.log(ID);
			console.log('before redirect');
			return res.redirect('/home');
		});
	})(req, res, next);
});

module.exports = router;
