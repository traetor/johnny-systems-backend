// models/Actor.js
const pool = require('../config/db');

class Actor {
    static async getAll() {
        const result = await pool.query('SELECT * FROM actors ORDER BY name ASC');
        return result.rows;
    }

    static async create(name) {
        const result = await pool.query('INSERT INTO actors (name) VALUES ($1) RETURNING *', [name]);
        return result.rows[0];
    }
}

module.exports = Actor;