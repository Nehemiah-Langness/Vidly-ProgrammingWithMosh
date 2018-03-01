const debug = require('debug')('app:startup');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
    .then(() => debug('Connected to database'))
    .catch(error => console.error('Unable to connect to database', error));

// Available Schema types:
// String, Number, Date, Buffer, Boolean, ObjectID, Array
const Genre = mongoose.model('Genre', new mongoose.Schema({
    name: String,
    tags: [String],
    createDate: { type: Date, default: Date.now }
}));

// async function createGenre() {
//     const genre = new Genre({
//         name: 'Comedy',
//         tags: ['Funny', 'HaHa']
//     });

//     var result = await genre.save()
//     console.log(result);
// }
// createGenre();

async function getGenres() {
    genres = await Genre
        .find({
            'tags.length': {
                $eq: 1
            }
        })
        .limit(10)
        .sort({ name: 1 })
        .select({ name: 1, tags: 1 });

    console.log(genres);
}
getGenres();

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