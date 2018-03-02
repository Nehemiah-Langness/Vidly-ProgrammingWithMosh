const Joi = require('joi');

module.exports = function(model, schema) {
    async function add(entity) {
        const result = await new model(entity).save();
        return result;
    };

    async function update(id, values) {
        var result = await model.findByIdAndUpdate(id, values, { new: true });
        return result;
    }

    async function remove(id) {
        var result = await model.findByIdAndRemove(id);
        return result;
    };

    async function get(id) {
        if (!id) return await model.find().sort('name');
        return await model.findById(id);
    }

    return {

        model: model,
        schema: schema,
        validate: (entity) => Joi.validate(entity, schema).error,
        repository: {
            add: add,
            update: update,
            remove: remove,
            get: get
        }
    }
}