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