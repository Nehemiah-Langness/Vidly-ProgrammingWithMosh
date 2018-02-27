const Joi = require('joi');
const express = require('express');

const app = express();
app.use(express.json());

const registerGenre = require('./vidly-genres');
registerGenre(app);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
});