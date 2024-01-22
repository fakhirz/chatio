const db = require('../util/database');

const httpCodes = require('../libraries/httpCodes');

require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const isAuth = async (req, res, next) => {
	const token = req.cookies.jwt;
	if (token) {
		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken) => {
			if (err) {
				console.log(err);
				return res.status(httpCodes.NOT_LOGGED_IN).send('User not Authenticated!');
			} else {
				await db
					.execute('SELECT * FROM user WHERE `id` = ?', [ decodedToken.id ])
					.then((user) => {
						if (!user) {
							return res.status(httpCodes.NOT_LOGGED_IN).send('User Not Found');
						}
						req.user = user[0];
					})
					.catch((err) => console.log(err));
				next();
			}
		});
	} else {
		return res.status(httpCodes.NOT_LOGGED_IN).redirect('/auth/login');
	}
};

module.exports = isAuth;
