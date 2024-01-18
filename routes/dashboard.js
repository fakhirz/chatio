const path = require('path');
const express = require('express');
const router = express.Router();
const Chat = require('../models/chat');
const Message = require('../models/message');
const isAuth = require('../middleware/is-auth');
const User = require('../models/user');

const getDashboard = async (req, res, next) => {
	req.isLoggedIn = req.cookies.jwt ? true : false;
	const userId = req.user[0].id;
	const chats = await Chat.getAllUserChats(userId);
	User.fetchAll(userId)
		.then(([ users ]) => {
			res.render('admin/dashboard', {
				users: users,
				chats: chats,
				pageTitle: 'Dashboard',
				selectedChat: 1,
				path: '/',
				isAuthenticated: req.isLoggedIn,
				loggedInUser: req.user[0]
			});
		})
		.catch((err) => console.log(err));
};

router.get('/', isAuth, getDashboard);

module.exports = router;
