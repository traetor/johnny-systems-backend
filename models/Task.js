const db = require('../config/db');

class Task {
    static create(data, callback) {
        const sql = "INSERT INTO tasks (user_id, title, description, status) VALUES (?, ?, ?, ?)";
        db.query(sql, [data.user_id, data.title, data.description, data.status], callback);
    }

    static findByUserId(user_id, callback) {
        const sql = "SELECT * FROM tasks WHERE user_id = ?";
        db.query(sql, [user_id], callback);
    }

    static update(id, data, callback) {
        const sql = "UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?";
        db.query(sql, [data.title, data.description, data.status, id], callback);
    }

    static delete(id, callback) {
        const sql = "DELETE FROM tasks WHERE id = ?";
        db.query(sql, [id], callback);
    }
}

module.exports = Task;
