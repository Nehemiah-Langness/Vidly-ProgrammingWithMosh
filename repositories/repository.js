const Joi = require('joi');

module.exports = function(model, schema, security) {

    if (!security)
        security = {
            get: [],
            getAll: [],
            add: [],
            update: [],
            remove: []
        }

    const repository = {
        get: async function(Model, id) {
            return await Model.findById(id);
        },
        getMany: async function(Model) {
            return await model.find().sort('name');
        },
        add: async function(Model, entity) {
            return await new Model(entity).save();
        },
        update: async function(Model, id, values) {
            return await Model.findByIdAndUpdate(id, values, { new: true });
        },
        remove: async function(Model, id) {
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
        base: repository,
        repository: {
            add: add,
            update: update,
            remove: remove,
            get: get
        },
        permissions: security
    }
}