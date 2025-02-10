const Actor = require('../models/Actor');

exports.getAllActors = async (req, res) => {
    try {
        const actors = await Actor.getAll();
        res.json(actors);
    } catch (err) {
        res.status(500).send({ message: "Błąd pobierania aktorów" });
    }
};

exports.createActor = async (req, res) => {
    try {
        const { name } = req.body;
        const actor = await Actor.create(name);
        res.status(201).json(actor);
    } catch (err) {
        res.status(500).send({ message: "Błąd dodawania aktora" });
    }
};