const debug = require('debug')('app:startup');

const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const Joi = require('joi');
const express = require('express');
const logger = require('./logger');
const authenticator = require('./authenticator');

const app = express();

app.set('view engine', 'pug');
app.set('views', './views'); // DEFAULT

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    debug('Logging enabled');
}

app.use(logger);
app.use(authenticator);

const registerGenre = require('./vidly-genres');
registerGenre(app);

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Vidly',
        message: 'Welcome to Vidly'
    });
});

const port = process.env.PORT;
app.listen(port, () => {
    debug(`Listening on port ${port}...`)
});