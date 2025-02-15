const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');  // Middleware autoryzacji

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Movie management
 */

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Get all movies with actors
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: A list of movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   year:
 *                     type: integer
 *                   image_url:
 *                     type: string
 *                   description:
 *                     type: string
 *                   actors:
 *                     type: array
 *                     items:
 *                       type: string
 */
router.get('/', movieController.getMovies);

/**
 * @swagger
 * /api/movies:
 *   post:
 *     summary: Create a new movie
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - year
 *               - image_url
 *               - description
 *               - actors
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Inception"
 *               year:
 *                 type: integer
 *                 example: 2010
 *               image_url:
 *                 type: string
 *                 example: "https://example.com/image.jpg"
 *               description:
 *                 type: string
 *                 example: "A mind-bending thriller about dreams."
 *               actors:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Leonardo DiCaprio", "Joseph Gordon-Levitt"]
 *     responses:
 *       201:
 *         description: Movie created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, isAdmin, movieController.createMovie);

/**
 * @swagger
 * /api/movies/{id}:
 *   put:
 *     summary: Update an existing movie
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the movie to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               year:
 *                 type: integer
 *               image_url:
 *                 type: string
 *               description:
 *                 type: string
 *               actors:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Movie not found
 */
router.put('/:id', authMiddleware, isAdmin, movieController.updateMovie);

/**
 * @swagger
 * /api/movies/{id}:
 *   delete:
 *     summary: Delete a movie
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the movie to delete
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Movie not found
 */
router.delete('/:id', authMiddleware, isAdmin, movieController.deleteMovie);

/**
 * @swagger
 * /api/movies/{id}/actors:
 *   post:
 *     summary: Add actors to a movie
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the movie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               actorIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Actors added successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Movie not found
 *       401:
 *         description: Unauthorized
 */
router.post('/:id/actors', authMiddleware, isAdmin, movieController.addActorsToMovie);

/**
 * @swagger
 * /api/movies/{id}/actors/{actorId}:
 *   delete:
 *     summary: Remove an actor from a movie
 *     tags: [Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the movie
 *       - in: path
 *         name: actorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the actor to remove
 *     responses:
 *       200:
 *         description: Actor removed successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Movie or actor not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id/actors/:actorId', authMiddleware, isAdmin, movieController.removeActorFromMovie);

module.exports = router;