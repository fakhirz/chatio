// routes/chat.js
const express = require('express');
const router = express.Router();
const Chat = require('../models/chat');
const Message = require('../models/message');
const isAuth = require('../middleware/is-auth');

const getChats = async (req, res, next) => {
	req.isLoggedIn = req.cookies.jwt ? true : false;
	const userId = req.user[0].id;
	try {
		const userChats = await Chat.getAllUserChats(userId);
		const chats = userChats[0];
		const messages = await Message.fetchByChatId(chats.map((chat) => chat.id));
		res.render('chat/chat', {
			chats: chats,
			messages: messages[0],
			selectedChat: 1,
			pageTitle: 'Chat',
			path: '/chats',
			isAuthenticated: req.isLoggedIn,
			loggedInUser: req.user[0]
		});
	} catch (err) {
		console.error(err);
		next(err);
	}
};
const postChat = async (req, res, next) => {
	const chatUserId = req.body.chatUserId;
	const userId = req.user[0].id;
	const name = req.body.name;
	const created_at = new Date();
	const chat = new Chat(null, name, created_at);
	try {
		const existingChat = await Chat.getExistingUserChatId(chatUserId, userId);
		if (existingChat[0].length > 0) {
			const existingChatID = existingChat[0][0].chat_id;
			return res.redirect(`/chat/${existingChatID}`);
		} else {
			const [ chatResult ] = await chat.save();
			const participants = [ chatUserId, userId ];
			participants.forEach(async (id) => {
				const [ chatMiddle ] = await chat.saveMiddle(id, chatResult.insertId);
			});
			return res.redirect(`/chat/${chatResult.insertId}`);
		}
	} catch (err) {
		console.log(err);
		next(err);
	}
};

const getChatById = async (req, res, next) => {
	const userId = req.user[0].id;
	const chatId = req.params.chatId;
	try {
		const userChats = await Chat.getAllUserChats(userId);
		const chats = userChats[0];
		const chat = await Chat.getChatById(chatId);
		const messages = await Message.fetchByChatId([ chatId ]);
		res.render('chat/chat', {
			chats: chats,
			messages: messages[0],
			pageTitle: 'Chat',
			path: `/chat/${chatId}`,
			selectedChat: chat[0][0],
			isAuthenticated: req.cookies.jwt ? true : false,
			loggedInUser: req.user[0]
		});
	} catch (err) {
		console.error(err);
		next(err);
	}
};

router.get('/chat', isAuth, getChats);
router.post('/chat/new', isAuth, postChat);
router.get('/chat/:chatId', isAuth, getChatById);

module.exports = router;
