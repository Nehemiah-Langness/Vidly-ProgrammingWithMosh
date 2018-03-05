const config = require('config');
const debug = require('debug')('app:startup');
const mongoose = require('mongoose');
const Joi = require('joi');
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

app.use('/api/login', require('./routes/auth').router);
app.use('/api/genres', require('./routes/crud')(require('./models/genre')).router);
app.use('/api/customers', require('./routes/crud')(require('./models/customer')).router);
app.use('/api/movies', require('./routes/crud')(require('./models/movie')).router);
app.use('/api/rentals', require('./routes/crud')(require('./models/rental')).router);
app.use('/api/users', require('./routes/user').router);
app.use('/', require('./routes/home'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    debug(`Listening on port ${port}...`)
});