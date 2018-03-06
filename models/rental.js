const mongoose = require('mongoose');
const Joi = require('joi');

const Rental = mongoose.model('Rental', {
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 3,
                maxlength: 255
            },
            phone: {
                type: String,
                required: true,
                minlength: 8,
                maxlength: 50
            },
            isGold: Boolean
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                minlength: 3,
                maxlength: 255
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
})

const joiSchema = {
    customerId: Joi
        .objectId()
        .required(),
    movieId: Joi
        .objectId()
        .required()
}

module.exports = require('../repositories/rental')(Rental, joiSchema);