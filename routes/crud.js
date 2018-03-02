const common = require('./common');

function addCrudPaths(router, repo) {
    const { validate, repository } = repo;

    // Get-all
    router.get('/', async (req, res) => {
        try {
            const entities = await repository.get();
            res.send(entities);
        } catch (error) {
            common.send(res).serverError(error);
        }
    });

    // Get
    router.get('/:id', async (req, res) => {
        try {
            const entity = await repository.get(req.params.id);
            if (!entity) return common.send(res).notFound();

            res.send(entity);
        } catch (error) {
            common.send(res).serverError(error);
        }
    });

    // Add
    router.post('/', async (req, res) => {
        try {
            var toAdd = req.body;
            const error = validate(toAdd);
            if (error) return common.send(res).badRequest(error);

            const entity = await repository.add(toAdd);
            res.send(entity);

        } catch (error) {
            common.send(res).serverError(error);
        }
    });

    // Update
    router.put('/:id', async (req, res) => {
        try {
            const toUpdate = req.body;
            const error = validate(toUpdate);
            if (error) return common.send(res).badRequest(error);

            const entity = await repository.update(req.params.id, toUpdate)
            if (!entity) return common.send(res).notFound();

            res.send(entity);
        } catch (error) {
            common.send(res).serverError(error);
        }
    });

    // Delete
    router.delete('/:id', async (req, res) => {
        try {
            const genre = await repository.remove(req.params.id);
            if (!genre) return common.send(res).notFound();

            res.send(genre);
        } catch (error) {
            common.send(res).serverError(error);
        }
    });
}

module.exports = function(model) {
    const router = require('express').Router();
    addCrudPaths(router, model);
    return router;
}