const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

exports.register = (req, res) => {
    const { username, email, password } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) throw err;
        User.create({ username, email, password: hash, avatar: null }, (err, result) => {
            if (err) return res.status(500).send(err);
            res.status(201).send({ message: 'User registered successfully' });
        });
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    User.findByEmail(email, (err, users) => {
        if (err) return res.status(500).send(err);
        if (users.length === 0) return res.status(404).send({ message: 'User not found' });

        const user = users[0];
        bcrypt.compare(password, user.password, (err, match) => {
            if (err) return res.status(500).send(err);
            if (!match) return res.status(401).send({ message: 'Invalid credentials' });

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.send({ token });
        });
    });
};
