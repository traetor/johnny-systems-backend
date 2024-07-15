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
    const { language } = req.body;

    // Sprawdzenie, czy podano email i hasło
    if (!email || !password) {
        return res.status(400).send({ message: `Email and password are required` });
    }

    // Generowanie tokenu aktywacyjnego
    const activationToken = crypto.randomBytes(20).toString('hex');

    // Haszowanie hasła
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).send({ message: `Error during registration. Please try again later.` });
        }

        // Tworzenie użytkownika
        User.create({ username, email, password: hash, avatar: null, activation_token: activationToken }, (err, result) => {
            if (err) {
                console.error('Error creating user:', err);
                return res.status(500).send({ message: `Error during registration. Please try again later.` });
            }

            // Wysyłanie emaila aktywacyjnego
            const activationLink = `${process.env.FRONTEND_URL}/activate/${activationToken}`;
            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: 'Account Activation',
                html: `<p>Please click the following link to activate your account: <a href="${activationLink}">Activate</a></p>`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending activation email:', error);
                    return res.status(500).send({ message: `Error during registration. Please try again later.` });
                }

                res.status(201).send({ message: `User registered successfully. Please check your email to activate your account.` });
            });
        });
    });
};

exports.activate = (req, res) => {
    const { token } = req.params;

    User.activate(token, (err, user) => {
        if (err) {
            console.error('Error activating account:', err);
            return res.status(500).send({ message: `Error activating account. Please try again later.` });
        }
        if (!user) {
            return res.status(400).send({ message: `Invalid or expired activation token.` });
        }

        res.send({ message: `Account activated successfully. You can now log in.` });
    });
};

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const transporter = require('../config/nodemailer');
const User = require('../models/User');

const resendActivationEmail = (user, callback) => {
    const activationToken = crypto.randomBytes(20).toString('hex');
    User.updateActivationToken(user.id, activationToken, (err) => {
        if (err) {
            console.error('Błąd aktualizacji tokenu aktywacyjnego:', err);
            return callback(err);
        }

        const activationLink = `${process.env.FRONTEND_URL}/activate/${activationToken}`;
        const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Ponowne wysłanie aktywacji konta',
            html: `<p>Twoje konto nie jest aktywowane. Kliknij poniższy link, aby aktywować swoje konto: <a href="${activationLink}">Aktywuj</a></p>`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Błąd wysyłania emaila aktywacyjnego:', error);
                return callback(error);
            }
            callback(null);
        });
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ message: 'Email i hasło są wymagane' });
    }

    User.findByEmail(email, (err, users) => {
        if (err) {
            console.error('Błąd wyszukiwania użytkownika po emailu:', err);
            return res.status(500).send({ message: 'Błąd wyszukiwania użytkownika. Spróbuj ponownie później.' });
        }
        if (users.length === 0) {
            return res.status(404).send({ message: 'Użytkownik nie znaleziony' });
        }

        const user = users[0];
        if (!user.is_active) {
            return resendActivationEmail(user, (error) => {
                if (error) {
                    return res.status(500).send({ message: 'Błąd ponownego wysyłania emaila aktywacyjnego. Spróbuj ponownie później.' });
                }
                return res.status(403).send({ message: 'Konto nie jest aktywowane. Nowy link aktywacyjny został wysłany na twój email.' });
            });
        }

        bcrypt.compare(password, user.password, (err, match) => {
            if (err) {
                console.error('Błąd porównywania haseł:', err);
                return res.status(500).send({ message: 'Błąd porównywania haseł. Spróbuj ponownie później.' });
            }
            if (!match) {
                return res.status(401).send({ message: 'Nieprawidłowe dane' });
            }

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.send({ token });
        });
    });
};


exports.checkEmailAvailability = (req, res) => {
    const { email } = req.params;

    User.findByEmail(email, (err, users) => {
        if (err) {
            console.error('Error finding user by email:', err);
            return res.status(500).send({ message: `Error checking email availability` });
        }

        // Jeśli nie znaleziono użytkownika o podanym emailu, email jest dostępny
        const available = users.length === 0;
        res.send({ available });
    });
};

// Dodajemy nową funkcję w authController.js
exports.checkUsernameAvailability = (req, res) => {
    const { username } = req.params;

    User.findByUsername(username, (err, users) => {
        if (err) {
            console.error('Error finding user by username:', err);
            return res.status(500).send({ message: `Error checking username availability` });
        }

        // Jeśli nie znaleziono użytkownika o podanej nazwie użytkownika, nazwa jest dostępna
        const available = users.length === 0;
        res.send({ available });
    });
};
