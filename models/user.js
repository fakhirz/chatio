const db = require('../util/database');

module.exports = class User {
	constructor(id, name, email, password) {
		this.id = id;
		this.name = name;
		this.email = email;
		this.password = password;
	}

	save() {
		return db.execute('INSERT INTO user (id, name, email, password) VALUES(?, ?, ?, ?)', [
			this.id,
			this.name,
			this.email,
			this.password
		]);
	}
	static deleteById(id) {}

	static fetchAll(loggedInUserId) {
		return db.execute(
			'SELECT user.id, user.name, user.email, CASE WHEN user_chat_middle.chat_id IS NOT NULL THEN chat_id ELSE 0 END AS haveChat FROM user LEFT JOIN user_chat_middle ON user.id = user_chat_middle.user_id AND user_chat_middle.chat_id IN (SELECT chat_id FROM user_chat_middle WHERE user_id = ?) WHERE user.`id` <> ?',
			[ loggedInUserId, loggedInUserId ]
		);
	}

	static findById(id) {}
};
