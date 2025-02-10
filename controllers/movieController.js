// controllers/movieController.js
const Movie = require('../models/Movie');
const Actor = require('../models/Actor');

// Pobieranie wszystkich filmów
exports.getMovies = async (req, res) => {
    try {
        const movies = await Movie.getAll();
        res.json(movies);
    } catch (err) {
        res.status(500).send({ message: "Błąd pobierania filmów" });
    }
};

// Tworzenie nowego filmu
exports.createMovie = async (req, res) => {
    try {
        const { title, year, image_url, description, actors } = req.body;
        const movie = await Movie.create({ title, year, image_url, description, actors });
        res.status(201).json(movie);
    } catch (err) {
        res.status(500).send({ message: "Błąd dodawania filmu" });
    }
};

// Aktualizacja filmu
exports.updateMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, year, image_url, description, actors } = req.body;
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

// Usuwanie filmu
exports.deleteMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMovie = await Movie.delete(id);
        if (deletedMovie) {
            res.json({ message: "Film usunięty pomyślnie" });
        } else {
            res.status(404).send({ message: "Film nie znaleziony" });
        }
    } catch (err) {
        res.status(500).send({ message: "Błąd usuwania filmu" });
    }
};

// Dodawanie aktorów do filmu
exports.addActorsToMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const { actorIds } = req.body;
        const movie = await Movie.getById(id);
        if (!movie) {
            return res.status(404).send({ message: "Film nie znaleziony" });
        }

        for (let actorId of actorIds) {
            await Movie.addActor(id, actorId);
        }

        res.status(200).json({ message: "Aktorzy zostali dodani do filmu" });
    } catch (err) {
        res.status(500).send({ message: "Błąd dodawania aktorów do filmu" });
    }
};

// Usuwanie aktora z filmu
exports.removeActorFromMovie = async (req, res) => {
    try {
        const { id, actorId } = req.params;
        const movie = await Movie.getById(id);
        if (!movie) {
            return res.status(404).send({ message: "Film nie znaleziony" });
        }

        await Movie.removeActor(id, actorId);

        res.status(200).json({ message: "Aktor został usunięty z filmu" });
    } catch (err) {
        res.status(500).send({ message: "Błąd usuwania aktora z filmu" });
    }
};