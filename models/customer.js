const mongoose = require('mongoose');
const Joi = require('joi');

const Customer = mongoose.model('Customer', {
    isGold: Boolean,
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    phone: {
        type: String,
        required: true,
        matches: /^[\d{3}-]{1, 2}\d{4}[\032x?\032?\d+]?$/
    }
})

const schema = {
    isGold: Joi.boolean(),
    name: Joi.string()
        .required()
        .min(3)
        .max(255),
    phone: Joi.string()
        .required()
        .min(8)
}

module.exports = require('./repository')(Customer, schema);