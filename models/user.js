const _ = require('lodash');
const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');
const hashing = require('../hash');

const userSchema = new mongoose.Schema({
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
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 1024
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.generateAuthToken = function() {
    return token = jwt.sign({
            _id: this._id,
            isAdmin: this.isAdmin
        },
        config.get('jwtPrivateKey'));
}

const User = mongoose.model('User', userSchema);


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
    isAdmin: Joi
        .boolean()
}

var repository = require('../repositories/repository')(User, joiSchema);

repository.base.add = async function(Model, entity) {
    let user = await Model.findOne({ email: entity.email });
    if (user) throw new Error('User already registered');

    entity.password = await hashing.getHash(entity.password);
    user = await new Model(_.pick(entity, ['name', 'email', 'password'])).save();

    return user;
}

module.exports = repository;