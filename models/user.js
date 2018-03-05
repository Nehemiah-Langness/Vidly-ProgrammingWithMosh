const _ = require('lodash');
const mongoose = require('mongoose');
const Joi = require('joi');
const hashing = require('../hash');

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

    entity.password = await hashing.getHash(entity.password);
    user = await new Model(_.pick(entity, ['name', 'email', 'password'])).save();

    return _.pick(user, ['name', 'email']);
}

module.exports = repository;