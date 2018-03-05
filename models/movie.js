const mongoose = require('mongoose');
const Joi = require('joi');
const genre = require('./genre');
const BadRequest = require('../routes/BadRequest');

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
        .objectId()
        .required()
}

var repository = require('./repository')(Movie, joiSchema);

async function setGenre(id, entity) {
    const dbGenre = await genre.repository.get(id);
    if (!dbGenre) throw new BadRequest('Invalid genre id');
    if (!entity.genre)
        entity.genre = {}

    entity.genre._id = dbGenre._id;
    entity.genre.name = dbGenre.name;

    return dbGenre;
}

repository.base.add = async function(Model, entity) {
    if (entity.genreId) await setGenre(entity.genreId, entity);
    return await new Model(entity).save();
}

repository.base.update = async function(Model, id, values) {
    if (values.genreId) await setGenre(values.genreId, values);
    return await Model.findByIdAndUpdate(id, values, { new: true })
}

module.exports = repository;