const Movie = require('../models/Movie');

exports.getMovies = async (req, res) => {
    try {
        const movies = await Movie.getAll();
        res.json(movies);
    } catch (err) {
        res.status(500).send({ message: "Błąd pobierania filmów" });
    }
};

exports.createMovie = async (req, res) => {
    try {
        const { title, year, image_url, description, actors } = req.body;
        const movie = await Movie.create({ title, year, image_url, description, actors });
        res.status(201).json(movie);
    } catch (err) {
        res.status(500).send({ message: "Błąd dodawania filmu" });
    }
};

exports.updateMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, year, image_url, description, actors } = req.body;

        // Tutaj dodaj logikę aktualizacji filmu w bazie danych.
        const updatedMovie = await Movie.update(id, { title, year, image_url, description, actors });

        if (updatedMovie) {
            res.json(updatedMovie);
        } else {
            res.status(404).send({ message: "Film nie znaleziony" });
        }
    } catch (err) {
        res.status(500).send({ message: "Błąd aktualizacji filmu" });
    }
};

exports.deleteMovie = async (req, res) => {
    try {
        const { id } = req.params;

        // Próbujemy usunąć film
        const result = await Movie.delete(id);

        if (result) {
            res.status(200).send({ message: "Film usunięty pomyślnie" });
        } else {
            res.status(404).send({ message: "Film nie znaleziony" });
        }
    } catch (err) {
        res.status(500).send({ message: "Błąd usuwania filmu" });
    }
};