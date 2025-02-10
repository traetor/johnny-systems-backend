class Actor {
    static async getAll() {
        try {
            const result = await pool.query(`
            SELECT actors.*, 
                   COALESCE(COUNT(movie_actors.movie_id), 0) AS movieCount
            FROM actors
            LEFT JOIN movie_actors ON actors.id = movie_actors.actor_id
            GROUP BY actors.id
            ORDER BY actors.name ASC
        `);
            console.log("Dane zwrócone przez bazę:", result.rows);
            return result.rows;
        } catch (err) {
            console.error("Błąd SQL:", err);
            throw err;
        }
    }

    static async create(name) {
        const result = await pool.query('INSERT INTO actors (name) VALUES ($1) RETURNING *', [name]);
        return result.rows[0];
    }
}

module.exports = Actor;