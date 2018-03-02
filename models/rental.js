const mongoose = require('mongoose');
const Joi = require('joi');
const Fawn = require('fawn');
Fawn.init(mongoose);

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

var repository = require('./repository')(Rental, joiSchema);

async function setCustomer(id, entity) {
    const dbCustomer = await customer.repository.get(id);
    if (!dbCustomer) throw new Error('Invalid customer id');
    if (!entity.customer)
        entity.customer = {}

    entity.customer._id = dbCustomer._id;
    entity.customer.name = dbCustomer.name;
    entity.customer.phone = dbCustomer.phone;
    entity.customer.isGold = dbCustomer.isGold;

    return dbCustomer;
}

async function setMovie(id, entity) {
    const dbMovie = await movie.repository.get(id);
    if (!dbMovie) throw new Error('Invalid movie id');
    if (!entity.movie)
        entity.movie = {}

    entity.movie._id = dbMovie._id;
    entity.movie.title = dbMovie.title;
    entity.movie.dailyRentalRate = dbMovie.dailyRentalRate;

    return dbMovie;
}

repository.base.add = async function(Model, entity) {
    const transaction = new Fawn.Task();

    if (entity.customerId) await setCustomer(entity.customerId, entity);
    if (entity.movieId) {
        const movie = await setMovie(entity.movieId, entity);

        if (movie.numberInStock <= 0)
            throw new Error('All copies of movie have been checked out');

        transaction.update('movies', { _id: movie._id }, {
            $inc: { numberInStock: -1 }
        })
    }

    var rental = new Model(entity);
    transaction.save('rentals', rental)
        .run()

    return rental;
}

repository.base.update = async function(Model, id, values) {
    if (values.customerId) await setCustomer(values.customerId, values);
    if (values.movieId) await setCustomer(values.movieId, values);

    return await Model.findByIdAndUpdate(id, values, { new: true })
}

repository.base.getMany = async function(Model) {
    return await Model.find().sort('-dateOut');
};

module.exports = repository;