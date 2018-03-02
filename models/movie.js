const mongoose = require('mongoose');
const Joi = require('joi');
const genre = require('./genre');

const Movie = mongoose.model('Movie', {
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 255
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    genre: {
        type: genre.dbSchema,
        required: true
    }
})

const joiSchema = {
    title: Joi
        .string()
        .required()
        .min(3)
        .max(255),
    numberInStock: Joi
        .number()
        .required()
        .min(0)
        .max(255),
    dailyRentalRate: Joi
        .number()
        .required()
        .min(0)
        .max(255),
    genreId: Joi
        .string()
        .required()
}

var repository = require('./repository')(Movie, joiSchema);

repository.base.add = async function(Model, entity) {
    if (entity.genreId) {
        const genre = await genre.repository.get(genreId);
        if (!genre) return null;

        entity.genre._id = genre._id;
        entity.genre.name = genre.name;
    }
    return await new Model(entity).save();
}

repository.base.update = async function(Model, id, values) {
    if (values.genreId) {
        const genre = await genre.repository.get(genreId);
        if (!genre) return null;

        values.genre._id = genre._id;
        values.genre.name = genre.name;
    }
    return await Model.findByIdAndUpdate(id, values, { new: true })
}

module.exports = repository;