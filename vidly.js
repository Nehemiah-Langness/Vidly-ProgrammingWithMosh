const config = require('config');
const debug = require('debug')('app:startup');
const mongoose = require('mongoose');
const Joi = require('joi');
const _ = require('lodash');
const common = require('./routes/common');
Joi.objectId = require('joi-objectid')(Joi);

if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined');
    process.exit(1);
}

mongoose.connect('mongodb://localhost/playground')
    .then(() => debug('Connected to database'))
    .catch(error => console.error('Unable to connect to database', error));

const express = require('express');
const app = express();

app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(require('helmet')());

if (app.get('env') === 'development') {
    app.use(require('morgan')('tiny'));
    debug('Logging enabled');
}

app.use(require('./middleware/authenticator'));

const userRouteConfig = require('./routes/crud')(require('./models/user'));
userRouteConfig.actions.add = async function(toAdd, req, res, validate, repository) {
    const error = validate(toAdd);
    if (error) return common.send(res).badRequest(error);

    const user = await repository.add(toAdd);
    if (!user) return common.send(res).badRequest();

    res.header('x-auth-token', user.generateAuthToken()).send(_.pick(user, ['name', 'email']));
}

app.use('/api/genres', require('./routes/crud')(require('./models/genre')).router);
app.use('/api/customers', require('./routes/crud')(require('./models/customer')).router);
app.use('/api/movies', require('./routes/crud')(require('./models/movie')).router);
app.use('/api/rentals', require('./routes/crud')(require('./models/rental')).router);
app.use('/api/users', userRouteConfig.router);
app.use('/api/login', require('./routes/auth').router);
app.use('/', require('./routes/home'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    debug(`Listening on port ${port}...`)
});