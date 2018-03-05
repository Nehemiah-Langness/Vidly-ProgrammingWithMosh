const mongoose = require('mongoose');
const Joi = require('joi');

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 255
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 255,
        lower: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 1024
    }
})

const joiSchema = {
    name: Joi
        .string()
        .required()
        .min(3)
        .max(255),
    email: Joi
        .string()
        .required()
        .min(3)
        .max(255)
        .email(),
    password: Joi
        .string()
        .required()
        .min(3)
        .max(255),
}

var repository = require('./repository')(User, joiSchema);

repository.base.add = async function(Model, entity) {
    let user = await Model.findOne({ email: entity.email });
    if (user) throw new Error('User already registered');

    return await new Model(entity).save();
}

module.exports = repository;