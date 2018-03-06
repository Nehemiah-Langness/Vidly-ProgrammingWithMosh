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
        .objectId()
        .required()
}

module.exports = require('../repositories/movie')(Movie, joiSchema);