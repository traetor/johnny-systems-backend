const pool = require('../config/db');

class User {
    static create(data, callback) {
        const sql = "INSERT INTO users (username, email, password, avatar) VALUES ($1, $2, $3, $4) RETURNING *";
        pool.query(sql, [data.username, data.email, data.password, data.avatar], (err, res) => {
            if (err) return callback(err);
            callback(null, res.rows[0]);
        });
    }

    static findByEmail(email, callback) {
        const sql = "SELECT * FROM users WHERE email = $1";
        pool.query(sql, [email], (err, res) => {
            if (err) return callback(err);
            callback(null, res.rows);
        });
    }

    static findById(id, callback) {
        const sql = "SELECT * FROM users WHERE id = $1";
        pool.query(sql, [id], (err, res) => {
            if (err) return callback(err);
            callback(null, res.rows);
        });
    }

    static update(id, data, callback) {
        const sql = "UPDATE users SET username = $1, email = $2, avatar = $3 WHERE id = $4 RETURNING *";
        pool.query(sql, [data.username, data.email, data.avatar, id], (err, res) => {
            if (err) return callback(err);
            callback(null, res.rows[0]);
        });
    }

    static activate(token, callback) {
        const sql = "UPDATE users SET is_active = TRUE, activation_token = NULL WHERE activation_token = $1 RETURNING *";
        pool.query(sql, [token], (err, res) => {
            if (err) return callback(err);
            callback(null, res.rows[0]);
        });
    }
}

module.exports = User;
