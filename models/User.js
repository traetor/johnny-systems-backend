const db = require('../config/db');

class User {
    static create(data, callback) {
        const sql = "INSERT INTO users (username, email, password, avatar) VALUES (?, ?, ?, ?)";
        db.query(sql, [data.username, data.email, data.password, data.avatar], callback);
    }

    static findByEmail(email, callback) {
        const sql = "SELECT * FROM users WHERE email = ?";
        db.query(sql, [email], callback);
    }

    static findById(id, callback) {
        const sql = "SELECT * FROM users WHERE id = ?";
        db.query(sql, [id], callback);
    }

    static update(id, data, callback) {
        const sql = "UPDATE users SET username = ?, email = ?, avatar = ? WHERE id = ?";
        db.query(sql, [data.username, data.email, data.avatar, id], callback);
    }
}

module.exports = User;
