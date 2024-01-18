require('dotenv').config();
const path = require('path');
const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is-auth');

const Message = require('../models/message');
const Chat = require('../models/chat');

const postMessage = async (req, res, next) => {
	req.isLoggedIn = req.cookies.jwt ? true : false;
	const userId = req.user[0].id;
	const chatId = req.body.chatId;
	const body = req.body.body;
	const created_at = new Date();
	const message = new Message(null, userId, chatId, body, created_at);
	message
		.save()
		.then((result) => {
			res.redirect(`/chat/${chatId}`);
		})
		.catch((err) => console.log(err));
};

router.post('/chat/send', isAuth, postMessage);

module.exports = router;
