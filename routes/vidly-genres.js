const router = require('express').Router();
const genreModule = require('../models/genre');
const Genre = genreModule.model;
const validate = genreModule.validate;
const repository = genreModule.crud;

function notFound(res) {
    res.status(404).send('The genre with the specified ID does not exist');
}

function badRequest(res, error) {
    res.status(400).send(getErrorMessage(error));
}

function serverError(res, error) {
    res.status(500).send(getErrorMessage(error));
}

function getErrorMessage(error) {
    return error.details
        .map((e) => e.message)
        .reduce((current, next) => !current ? next : `${current},\n${next}`)
}

// Get-all
router.get('/', async (req, res) => {
    try {
        const genres = await repository.get();

        res.send(genres);
    } catch (error) {
        serverError(res, error);
    }
});

// Get
router.get('/:id', async (req, res) => {
    try {
        const genre = await repository.get(req.params.id);
        if (!genre) return notFound(res);

        res.send(genre);
    } catch (error) {
        serverError(res, error);
    }
});

// Add
router.post('/', async (req, res) => {
    try {
        var toAdd = req.body;
        const error = validate(toAdd);
        if (error) return badRequest(res, error);

        const genre = await repository.add(toAdd);
        res.send(genre);

    } catch (error) {
        serverError(res, error);
    }
});

// Update
router.put('/:id', async (req, res) => {
    try {
        const toUpdate = req.body;
        const error = validate(toUpdate);
        if (error) return badRequest(res, error);

        const genre = await repository.update(req.params.id, toUpdate)
        if (!genre) return notFound(res);

        res.send(genre);
    } catch (error) {
        serverError(res, error);
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    try {
        const genre = await repository.remove(req.params.id);
        if (!genre) return notFound(res);

        res.send(genre);
    } catch (error) {
        serverError(res, error);
    }
});

module.exports = router;