const mongoose = require('mongoose');
const BadRequest = require('../routes/BadRequest');
const customer = require('../models/customer');
const movie = require('../models/movie');
const Fawn = require('fawn');
Fawn.init(mongoose);

async function setCustomer(id, entity) {
    const dbCustomer = await customer.repository.get(id);
    if (!dbCustomer) throw new BadRequest('Invalid customer id');
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
    if (!dbMovie) throw new BadRequest('Invalid movie id');
    if (!entity.movie)
        entity.movie = {}

    entity.movie._id = dbMovie._id;
    entity.movie.title = dbMovie.title;
    entity.movie.dailyRentalRate = dbMovie.dailyRentalRate;

    return dbMovie;
}

module.exports = function(model, validationSchema) {
    var core = {
        add: async function(Model, entity) {
            const transaction = new Fawn.Task();

            if (entity.customerId) await setCustomer(entity.customerId, entity);
            if (entity.movieId) {
                const movie = await setMovie(entity.movieId, entity);

                if (movie.numberInStock <= 0)
                    throw new BadRequest('All copies of movie have been checked out');

                transaction.update('movies', { _id: movie._id }, {
                    $inc: { numberInStock: -1 }
                })
            }

            var rental = new Model(entity);
            transaction.save('rentals', rental)
                .run()

            return rental;
        },
        update: async function(Model, id, values) {
            if (values.customerId) await setCustomer(values.customerId, values);
            if (values.movieId) await setCustomer(values.movieId, values);

            return await Model.findByIdAndUpdate(id, values, { new: true })
        },
        getMany: async function(Model) {
            return await Model.find().sort('-dateOut');
        }
    }

    return require('./repository')(model, validationSchema, null, core);
};