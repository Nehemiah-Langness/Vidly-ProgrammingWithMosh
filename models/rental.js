const mongoose = require('mongoose');
const Joi = require('joi');
const customer = require('./customer');
const movie = require('./movie');

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
        .string()
        .required(),
    movieId: Joi
        .string()
        .required()
}

var repository = require('./repository')(Movie, joiSchema);

async function setCustomer(id, entity) {
    const customer = await customer.repository.get(id);
    if (!customer) throw new Error('Invalid customer id');

    entity.customer._id = customer._id;
    entity.customer.name = customer.name;
    entity.customer.phone = customer.phone;
    entity.customer.isGold = customer.isGold;
}

async function setMovie(id, entity) {
    const movie = await movie.repository.get(id);
    if (!movie) throw new Error('Invalid movie id');

    entity.movie._id = movie._id;
    entity.movie.title = movie.title;
    entity.movie.dailyRentalRate = movie.dailyRentalRate;

    if (movie.numberInStock <= 0)
        throw new Error('All copies of movie have been checked out');

    movie.numberInStock--;
    movie.save();
}

repository.base.add = async function(Model, entity) {
    if (entity.customerId) await setCustomer(entity.customerId, entity);
    if (entity.movieId) await setCustomer(entity.movieId, entity);

    return await new Model(entity).save();
}

repository.base.update = async function(Model, id, values) {
    if (values.customerId) await setCustomer(values.customerId, values);
    if (values.movieId) await setCustomer(values.movieId, values);

    return await Model.findByIdAndUpdate(id, values, { new: true })
}

repository.base.getMany = async function(Model) {
    return await model.find().sort('-dateOut');
};

module.exports = repository;