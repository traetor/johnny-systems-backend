class Actor {
    static async getAll() {
        const result = await pool.query(`
            SELECT actors.*, 
                COUNT(movie_actors.movie_id) AS movieCount
            FROM actors
            LEFT JOIN movie_actors ON actors.id = movie_actors.actor_id
            GROUP BY actors.id
            ORDER BY actors.name ASC
        `);
        return result.rows;
    }

    static async create(name) {
        const result = await pool.query('INSERT INTO actors (name) VALUES ($1) RETURNING *', [name]);
        return result.rows[0];
    }
}

module.exports = Actor;