const morgan = require('morgan');
const helmet = require('helmet');
const Joi = require('joi');
const express = require('express');
const logger = require('./logger');
const authenticator = require('./authenticator');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
app.use(morgan('tiny'));


app.use(logger);
app.use(authenticator);

const registerGenre = require('./vidly-genres');
registerGenre(app);

app.get('/', (req, res) => {
    res.send('Home');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
});