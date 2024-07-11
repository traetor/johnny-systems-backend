const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    }
});

exports.register = (req, res) => {
    const { username, email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ message: 'Email and password are required' });
    }

    const activationToken = crypto.randomBytes(20).toString('hex');

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) throw err;
        User.create({ username, email, password: hash, avatar: null, activation_token: activationToken }, (err, result) => {
            if (err) return res.status(500).send(err);

            const activationLink = `${process.env.FRONTEND_URL}/activate/${activationToken}`;

            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: 'Account Activation',
                html: `<p>Please click the following link to activate your account: <a href="${activationLink}">Activate</a></p>`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) return res.status(500).send(error);
                res.status(201).send({ message: 'User registered successfully. Please check your email to activate your account.' });
            });
        });
    });
};

exports.activate = (req, res) => {
    const { token } = req.params;

    User.activate(token, (err, user) => {
        if (err) return res.status(500).send(err);
        if (!user) return res.status(400).send({ message: 'Invalid or expired activation token.' });

        res.send({ message: 'Account activated successfully. You can now log in.' });
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ message: 'Email and password are required' });
    }

    User.findByEmail(email, (err, users) => {
        if (err) return res.status(500).send(err);
        if (users.length === 0) return res.status(404).send({ message: 'User not found' });

        const user = users[0];
        if (!user.is_active) {
            return res.status(403).send({ message: 'Account is not activated. Please check your email for activation link.' });
        }

        bcrypt.compare(password, user.password, (err, match) => {
            if (err) return res.status(500).send(err);
            if (!match) return res.status(401).send({ message: 'Invalid credentials' });

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.send({ token });
        });
    });
};
