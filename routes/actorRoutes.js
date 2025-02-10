// routes/actorRoutes.js
const express = require('express');
const router = express.Router();
const actorController = require('../controllers/actorController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware'); // Middleware autoryzacji

/**
 * @swagger
 * tags:
 *   name: Actors
 *   description: Actor management
 */

/**
 * @swagger
 * /api/actors:
 *   get:
 *     summary: Get all actors
 *     tags: [Actors]
 *     responses:
 *       200:
 *         description: A list of actors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 */
router.get('/', actorController.getAllActors);

/**
 * @swagger
 * /api/actors:
 *   post:
 *     summary: Create a new actor
 *     tags: [Actors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Leonardo DiCaprio"
 *     responses:
 *       201:
 *         description: Actor created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, isAdmin, actorController.createActor);

module.exports = router;