const _ = require('lodash');
const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');

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

module.exports = require('../repositories/user')(User, joiSchema);