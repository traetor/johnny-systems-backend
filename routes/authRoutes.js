const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minut
    max: 5, // Limit do 5 prób logowania na IP
    message: {
        message: "Zbyt wiele prób logowania z tego IP, spróbuj ponownie za 15 minut"
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Rejestracja nowego użytkownika
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: Użytkownik zarejestrowany pomyślnie
 *       400:
 *         description: Niepoprawne żądanie
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Logowanie użytkownika
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Użytkownik zalogowany pomyślnie
 *       401:
 *         description: Niepoprawne dane logowania
 */
router.post('/login', loginLimiter, authController.login);

router.get('/activate/:token', authController.activate);

/**
 * @swagger
 * /api/auth/check-email/{email}:
 *   get:
 *     summary: Sprawdź dostępność emaila
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email dostępny
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 available:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Błąd serwera
 */
router.get('/check-email/:email', authController.checkEmailAvailability);

/**
 * @swagger
 * /api/auth/check-username/{username}:
 *   get:
 *     summary: Sprawdź dostępność nazwy użytkownika
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Nazwa użytkownika dostępna
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 available:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Błąd serwera
 */
router.get('/check-username/:username', authController.checkUsernameAvailability);

module.exports = router;
