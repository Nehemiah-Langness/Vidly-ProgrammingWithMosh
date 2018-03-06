const Joi = require('joi');

module.exports = function(model, schema, security, coreRepository) {

    if (!coreRepository)
        coreRepository = {};

    if (!security)
        security = {
            get: [],
            getAll: [],
            add: [],
            update: [],
            remove: []
        };

    const repository = {
        get: coreRepository.get ? coreRepository.get : async function(Model, id) {
            return await Model.findById(id);
        },
        getMany: coreRepository.getMany ? coreRepository.getMany : async function(Model) {
            return await Model.find().sort('name');
        },
        add: coreRepository.add ? coreRepository.add : async function(Model, entity) {
            return await new Model(entity).save();
        },
        update: coreRepository.update ? coreRepository.update : async function(Model, id, values) {
            return await Model.findByIdAndUpdate(id, values, { new: true });
        },
        remove: coreRepository.remove ? coreRepository.remove : async function(Model, id) {
            return await Model.findByIdAndRemove(id);
        }
    }

    async function add(entity) {
        return await repository.add(model, entity);
    };

    async function update(id, values) {
        return await repository.update(model, id, values);
    }

    async function remove(id) {
        return await repository.remove(model, id);
    };

    async function get(id) {
        if (!id) return await repository.getMany(model);
        return await repository.get(model, id);
    }

    return {
        model: model,
        dbSchema: model.schema,
        validationSchema: schema,
        validate: (entity) => Joi.validate(entity, schema).error,
        repository: {
            add: add,
            update: update,
            remove: remove,
            get: get
        },
        core: repository,
        permissions: security
    }
}