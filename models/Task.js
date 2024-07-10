const pool = require('../config/db');

class Task {
    static create(data, callback) {
        const sql = "INSERT INTO tasks (user_id, title, description, status) VALUES ($1, $2, $3, $4) RETURNING *";
        pool.query(sql, [data.user_id, data.title, data.description, data.status], (err, res) => {
            if (err) return callback(err);
            callback(null, res.rows[0]);
        });
    }

    static findByUserId(user_id, callback) {
        const sql = "SELECT * FROM tasks WHERE user_id = $1";
        pool.query(sql, [user_id], (err, res) => {
            if (err) return callback(err);
            callback(null, res.rows);
        });
    }

    static update(id, data, callback) {
        const sql = "UPDATE tasks SET title = $1, description = $2, status = $3 WHERE id = $4 RETURNING *";
        pool.query(sql, [data.title, data.description, data.status, id], (err, res) => {
            if (err) return callback(err);
            callback(null, res.rows[0]);
        });
    }

    static delete(id, callback) {
        const sql = "DELETE FROM tasks WHERE id = $1";
        pool.query(sql, [id], (err, res) => {
            if (err) return callback(err);
            callback(null, res.rowCount);
        });
    }
}

module.exports = Task;
