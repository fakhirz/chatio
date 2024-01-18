const db = require('../util/database');

module.exports = class Message {
	constructor(id, sender_id, chat_id, body, created_at) {
		this.id = id;
		this.sender_id = sender_id;
		this.chat_id = chat_id;
		this.body = body;
		this.created_at = created_at;
	}

	save() {
		return db.execute('INSERT INTO message (id, sender_id, chat_id, body, created_at) VALUES(?, ?, ?, ?, ?)', [
			this.id,
			this.sender_id,
			this.chat_id,
			this.body,
			this.created_at
		]);
	}
	static fetchByChatId(chatId) {
		const id = chatId[0];
		return db.execute(
			'SELECT message.sender_id, message.body AS message_body, message.created_at AS message_timestamp FROM chat INNER JOIN message ON chat.id = message.chat_id WHERE chat.`id` = ?',
			[ id ]
		);
		// return db.execute('SELECT * FROM message WHERE `sender_id` = ?', [ userId ]);
	}

	static deleteById(id) {}

	static fetchAll() {
		return db.execute('SELECT * FROM message');
	}

	static findById(id) {
		return db.execute('SELECT * FROM message WHERE `id` = ?');
	}
};
