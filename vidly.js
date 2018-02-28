const debug = require('debug')('app:startup');

const express = require('express');
const app = express();

app.set('view engine', 'pug');
app.set('views', './views'); // DEFAULT

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(require('helmet')());

app.use('/api/genres', require('./routes/vidly-genres'));
app.use('/', require('./routes/vidly-index'));

if (app.get('env') === 'development') {
    app.use(require('morgan')('tiny'));
    debug('Logging enabled');
}

app.use(require('./middleware/authenticator'));

const port = process.env.PORT;
app.listen(port, () => {
    debug(`Listening on port ${port}...`)
});