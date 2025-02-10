const pool = require('../config/db');

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

    static async update(id, { title, year, image_url, description, actors }) {
        const result = await pool.query(
            `UPDATE movies SET title = $1, year = $2, image_url = $3, description = $4 WHERE id = $5 RETURNING *`,
            [title, year, image_url, description, id]
        );

        if (result.rows.length === 0) {
            return null; // Jeśli film o podanym ID nie istnieje
        }

        const updatedMovie = result.rows[0];

        // Można dodać logikę aktualizacji aktorów, jeśli to konieczne
        // np. usunięcie starych aktorów i dodanie nowych (w zależności od logiki aplikacji)

        return updatedMovie;
    }

    static async delete(id) {
        const result = await pool.query(
            `DELETE FROM movies WHERE id = $1 RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return null; // Jeśli film o podanym ID nie istnieje
        }

        return result.rows[0]; // Zwracamy usunięty film
    }
}

module.exports = Movie;
