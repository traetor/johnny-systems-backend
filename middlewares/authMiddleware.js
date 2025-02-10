const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

exports.authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) return res.status(401).send({ message: 'No token provided' });

    jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Failed to authenticate token' });
        }

        req.user = decoded; // Zapisujemy dane użytkownika w obiekcie req
        next(); // Przechodzimy do kolejnego middleware lub kontrolera
    });
};

// Middleware do sprawdzania, czy użytkownik ma id 38
exports.isAdmin = (req, res, next) => {
    if (req.user.id !== 38) {  // Sprawdzamy id użytkownika
        return res.status(403).send({ message: 'You do not have permission to perform this action' });
    }
    next(); // Jeśli użytkownik ma id 38, przechodzi dalej
};