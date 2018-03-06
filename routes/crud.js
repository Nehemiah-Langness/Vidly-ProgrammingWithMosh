const common = require('./common');
const BadRequest = require('../errors/BadRequest');

function addCrudPaths(router, modelRepository) {
    const { validate, repository, permissions } = modelRepository;

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
        }
    }


    // Get-all
    router.get('/', permissions.getAll, common.execute(async (req, res) => {
        await actions.getAll(req, res, validate, repository);
    }));

    // Get
    router.get('/:id', permissions.get, common.execute(async (req, res) => {
        await actions.get(req.params.id, req, res, validate, repository);
    }));

    // Add
    router.post('/', permissions.add, common.execute(async (req, res, next) => {
        await actions.add(req.body, req, res, validate, repository)
    }));

    // Update
    router.put('/:id', permissions.update, common.execute(async (req, res, next) => {
        await actions.update(req.params.id, req.body, req, res, validate, repository);
    }));

    // Delete
    router.delete('/:id', permissions.remove, common.execute(async (req, res, next) => {
        await actions.remove(req.params.id, req, res, validate, repository);
    }));

    return actions;
}

module.exports = function(model) {
    const router = model.router ? model.router : require('express').Router();
    const actions = addCrudPaths(router, model);
    return {
        router: router,
        actions: actions,
    };
}