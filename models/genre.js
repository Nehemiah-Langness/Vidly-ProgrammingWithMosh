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

const joiSchema = {
    name: Joi.string()
        .required()
        .min(3)
        .max(50),
    tags: Joi.array(),
    createDate: Joi.date()
}

module.exports = require('../repositories/repository')(Genre, joiSchema);