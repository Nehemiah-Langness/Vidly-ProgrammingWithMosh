const mongoose = require('mongoose');
const Joi = require('joi');

const Genre = mongoose.model('Genre', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    tags: [String],
    createDate: { type: Date, default: Date.now }
}));

const schema = {
    name: Joi.string()
        .required()
        .min(3)
        .max(50),
    tags: Joi.array(),
    createDate: Joi.date()
}

function validate(genre) {
    return Joi.validate(genre, schema);
}

async function add(genre) {
    const result = await new Genre(genre).save();
    return result;
};

async function update(id, values) {
    var result = await Genre.findByIdAndUpdate(id, values, { new: true });
    return result;
}

async function remove(id) {
    var result = await Genre.findByIdAndRemove(id);
    return result;
};

async function get(id) {
    if (!id) return await Genre.find().sort('name');
    return await Genre.findById(id);
}

module.exports.model = Genre;
module.exports.schema = schema;
module.exports.validate = (genre) => validate(genre).error;
module.exports.crud = {
    add: add,
    remove: remove,
    update: update,
    get: get
};