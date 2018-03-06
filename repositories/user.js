const hashing = require('../hash');

module.exports = function(model, validationSchema) {

    var core = {
        add: async function(Model, entity) {
            let user = await Model.findOne({ email: entity.email });
            if (user) throw new Error('User already registered');

            entity.password = await hashing.getHash(entity.password);
            user = await new Model(_.pick(entity, ['name', 'email', 'password'])).save();

            return user;
        }
    }

    return require('./repository')(model, validationSchema, {
        get: require('../middleware/authorize'),
        getAll: require('../middleware/authorize'),
        update: require('../middleware/authorize'),
        remove: require('../middleware/authorize'),
        add: []
    }, core);
};