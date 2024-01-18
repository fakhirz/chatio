const path = require('path');
const express = require('express');
const router = express.Router();
const db = require('../util/database');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const httpCodes = require('../libraries/httpCodes');
const isAuth = require('../middleware/is-auth');

const maxAge = 3 * 24 * 60 * 60;

// <<--- FUNCTIONS --->>

const createToken = (user) => {
	return jwt.sign(
		{
			id: user.id,
			name: user.name,
			email: user.email,
			password: user.password
		},
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: maxAge
		}
	);
};

const getSignup = (req, res, next) => {
	req.isLoggedIn = req.cookies.jwt ? true : false;
	res.render('auth/signup', {
		pageTitle: 'Sign Up',
		path: '/auth/signup',
		isAuthenticated: req.isLoggedIn,
		loggedInUser: req.user
	});
};

const postSignup = (req, res, next) => {
	const name = req.body.name;
	const email = req.body.email;
	const password = req.body.password;
	const user = new User(null, name, email, password);
	user
		.save()
		.then((result) => {
			res.redirect('/');
		})
		.catch((err) => console.log(err));
};

const getLogin = (req, res, next) => {
	req.isLoggedIn = req.cookies.jwt ? true : false;
	// console.log(req.isLoggedIn);
	res.render('auth/login', {
		pageTitle: 'Login',
		path: '/auth/login',
		isAuthenticated: req.isLoggedIn,
		loggedInUser: req.user
	});
};

const postLogin = (req, res, next) => {
	const email = req.body.email;
	const password = req.body.password;
	db
		.execute('SELECT * FROM user WHERE `email` = ? AND `password` = ?', [ email, password ])
		.then((result) => {
			const user = result[0][0];
			if (user) {
				const token = createToken(user);
				res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
				res.redirect('/');
			} else {
				console.log('Wrong Credentials!');
				res.redirect('/auth/login');
			}
		})
		.catch((err) => {
			console.log(err);
		});
};
const postLogout = async (req, res, next) => {
	res.clearCookie('jwt');
	res.redirect('/');
};

router.post('/signup', postSignup);

router.get('/signup', getSignup);

router.post('/login', postLogin);

router.get('/login', getLogin);

router.post('/logout', postLogout);

module.exports = router;
