const genre = require('../models/genre');
const BadRequest = require('../errors/BadRequest');

async function setGenre(id, entity) {
    const dbGenre = await genre.repository.get(id);
    if (!dbGenre) throw new BadRequest('Invalid genre id');
    if (!entity.genre)
        entity.genre = {}

    entity.genre._id = dbGenre._id;
    entity.genre.name = dbGenre.name;

    return dbGenre;
}

module.exports = function(model, validationSchema) {

    var core = {
        add: async function(Model, entity) {
            if (entity.genreId) await setGenre(entity.genreId, entity);
            return await new Model(entity).save();
        },
        update: async function(Model, id, values) {
            if (values.genreId) await setGenre(values.genreId, values);
            return await Model.findByIdAndUpdate(id, values, { new: true })
        }
    }

    return require('./repository')(model, validationSchema, null, core);
};