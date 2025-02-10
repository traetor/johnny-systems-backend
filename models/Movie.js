const pool = require('../db');

class Movie {
    static async getAll() {
        const result = await pool.query(`
            SELECT movies.*, 
                ARRAY_AGG(actors.name) AS actors 
            FROM movies
            LEFT JOIN movie_actors ON movies.id = movie_actors.movie_id
            LEFT JOIN actors ON movie_actors.actor_id = actors.id
            GROUP BY movies.id
            ORDER BY movies.year DESC
        `);
        return result.rows;
    }

    static async create({ title, year, image_url, description, actors }) {
        const result = await pool.query(
            `INSERT INTO movies (title, year, image_url, description) VALUES ($1, $2, $3, $4) RETURNING *`,
            [title, year, image_url, description]
        );

        const movieId = result.rows[0].id;

        for (let actorName of actors) {
            let actor = await pool.query(`SELECT id FROM actors WHERE name = $1`, [actorName]);
            if (actor.rows.length === 0) {
                actor = await pool.query(`INSERT INTO actors (name) VALUES ($1) RETURNING id`, [actorName]);
            }
            await pool.query(`INSERT INTO movie_actors (movie_id, actor_id) VALUES ($1, $2)`, [movieId, actor.rows[0].id]);
        }

        return result.rows[0];
    }
}

module.exports = Movie;
