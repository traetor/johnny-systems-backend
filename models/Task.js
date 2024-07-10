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

    static findByStatusAndUserId(status, user_id, callback) {
        const sql = "SELECT * FROM tasks WHERE status = $1 AND user_id = $2";
        pool.query(sql, [status, user_id], (err, res) => {
            if (err) return callback(err);
            callback(null, res.rows);
        });
    }

    static update(id, data, callback) {
        // Buduj zapytanie SQL dynamicznie na podstawie obiektu data
        const keys = Object.keys(data);
        const values = keys.map((key, index) => `$${index + 1}`);

        const sql = `UPDATE tasks SET ${keys.map((key, index) => `${key} = ${values[index]}`).join(', ')} WHERE id = $${keys.length + 1} RETURNING *`;

        // Połącz tablicę wartości i dodaj id na końcu
        const params = [...Object.values(data), id];

        pool.query(sql, params, (err, res) => {
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
