const Task = require('../models/Task');

exports.createTask = (req, res) => {
    const { title, description } = req.body;
    const user_id = req.user.id;

    if (!title) {
        return res.status(400).send({ message: 'Title is required' });
    }

    Task.create({ user_id, title, description, status: 'to_do' }, (err, result) => {
        if (err) {
            console.error('Error creating task:', err);
            return res.status(500).send(err);
        }
        res.status(201).send({ message: 'Task created successfully' });
    });
};

exports.getTasks = (req, res) => {
    const user_id = req.user.id;
    const { status } = req.query; // Pobranie statusu z zapytania

    if (!status) {
        // Jeśli status nie jest podany, zwracamy wszystkie zadania użytkownika
        Task.findByUserId(user_id, (err, tasks) => {
            if (err) return res.status(500).send(err);
            res.send(tasks);
        });
    } else {
        // Jeśli status jest podany, zwracamy zadania tylko z tym statusem
        Task.findByStatusAndUserId(status, user_id, (err, tasks) => {
            if (err) return res.status(500).send(err);
            res.send(tasks);
        });
    }
};


exports.updateTask = (req, res) => {
    const taskId = req.params.id;
    const { title, description, status } = req.body;

    // Utwórz pusty obiekt na dane, które będą aktualizowane
    const updatedFields = {};

    // Dodaj tylko te pola do obiektu, które zostały przesłane w zapytaniu
    if (title) updatedFields.title = title;
    if (description) updatedFields.description = description;
    if (status) updatedFields.status = status;

    Task.update(taskId, updatedFields, (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ message: 'Task updated successfully' });
    });
};

exports.deleteTask = (req, res) => {
    const taskId = req.params.id;

    Task.delete(taskId, (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ message: 'Task deleted successfully' });
    });
};
