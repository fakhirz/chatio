const db = require('../util/database');

module.exports = class Chat {
	constructor(id, name, created_at, userId, chatId) {
		this.id = id;
		this.name = name;
		this.created_at = created_at;
	}

	save() {
		return db.execute('INSERT INTO chat (id, name, created_at) VALUES(?, ?, ?)', [
			this.id,
			this.name,
			this.created_at
		]);
	}
	saveMiddle(userId, chatId) {
		return db.execute('INSERT INTO user_chat_middle (user_id, chat_id) VALUES(?, ?)', [ userId, chatId ]);
	}
	static deleteById(id) {}

	static fetchAll() {
		return db.execute('SELECT * FROM chat');
	}
	static getAllUsersChats() {
		return db.execute(
			'SELECT user.id AS user_id, user.name, user.email, chat.id AS chat_id, chat.name AS chat_name FROM user_chat_middle INNER JOIN user ON user.id = user_chat_middle.user_id INNER JOIN chat ON user_chat_middle.chat_id = chat.id ORDER BY chat_id'
		);
	}
	static getAllUserChats(id) {
		// console.log('IDS: ', id);
		return db.execute(
			'SELECT chat.id AS id, chat.name AS name FROM user_chat_middle INNER JOIN user ON user.id = user_chat_middle.user_id INNER JOIN chat ON chat.id = user_chat_middle.chat_id WHERE user.`id` = ?',
			[ id ]
		);
	}
	static getExistingUserChatId(chatUserId, userId) {
		// console.log('IDS: ', id);
		return db.execute(
			'SELECT chat_id FROM user_chat_middle WHERE user_id IN (?, ?) GROUP BY chat_id HAVING COUNT(*) = 2',
			[ chatUserId, userId ]
		);
	}
	static async getChatById(id) {
		// console.log('RECEIVED CHAT ID: ', id);
		return db.execute('SELECT id, name FROM chat WHERE `id` = ?', [ id ]);
		// return db.execute(
		// 	'SELECT chat.id AS chat_id, chat.name AS chat_name, message.body AS message_body, message.created_at AS message_timestamp FROM chat INNER JOIN message ON chat.id = message.chat_id WHERE chat.`id` = ?',
		// 	[ id ]
		// );
	}
};
