const common = require('./common');
const BadRequest = require('./BadRequest');



function addCrudPaths(router, modelRepository) {
    const { validate, repository } = modelRepository;

    const actions = {
        getAll: async function(req, res, validate, repository) {
            const entities = await repository.get();
            res.send(entities);
        },

        get: async function(id, req, res, validate, repository) {
            const entity = await repository.get(id);
            if (!entity) return common.send(res).notFound();

            res.send(entity);
        },

        add: async function(toAdd, req, res, validate, repository) {
            const error = validate(toAdd);
            if (error) return common.send(res).badRequest(error);

            const entity = await repository.add(toAdd);
            if (!entity) return common.send(res).badRequest();

            res.send(entity);
        },

        update: async function(id, toUpdate, req, res, validate, repository) {
            const error = validate(toUpdate);
            if (error) return common.send(res).badRequest(error);

            const entity = await repository.update(id, toUpdate)
            if (!entity) return common.send(res).badRequest();

            res.send(entity);
        },

        remove: async function(id, req, res, validate, repository) {
            const genre = await repository.remove(id);
            if (!genre) return common.send(res).notFound();

            res.send(genre);
        },

        handleError: async function(res, error) {
            if (error instanceof BadRequest)
                common.send(res).badRequest(error);

            common.send(res).serverError(error);
        }
    }


    // Get-all
    router.get('/', async (req, res) => {
        try {
            await actions.getAll(req, res, validate, repository);
        } catch (error) {
            await actions.handleError(res, error);
        }
    });

    // Get
    router.get('/:id', async (req, res) => {
        try {
            await actions.get(req.params.id, req, res, validate, repository);
        } catch (error) {
            await actions.handleError(res, error);
        }
    });

    // Add
    router.post('/', async (req, res) => {
        try {
            await actions.add(req.body, req, res, validate, repository)
        } catch (error) {
            await actions.handleError(res, error);
        }
    });

    // Update
    router.put('/:id', async (req, res) => {
        try {
            await actions.update(req.params.id, req.body, req, res, validate, repository);
        } catch (error) {
            await actions.handleError(res, error);
        }
    });

    // Delete
    router.delete('/:id', async (req, res) => {
        try {
            await actions.remove(req.params.id, req, res, validate, repository);
        } catch (error) {
            await actions.handleError(res, error);
        }
    });

    return actions;
}

module.exports = function(model) {
    const router = require('express').Router();
    const actions = addCrudPaths(router, model);
    return {
        router: router,
        actions: actions,
    };
}