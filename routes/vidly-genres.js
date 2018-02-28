const Joi = require('joi');
const router = require('express').Router();

const genres = [
    { id: 1, name: "Film" },
    { id: 2, name: "Comedy" },
    { id: 3, name: "Horror" },
    { id: 4, name: "Action" },
    { id: 5, name: "Drama" },
    { id: 6, name: "Romance" },
    { id: 7, name: "Thriller" },
    { id: 8, name: "Animation" },
    { id: 9, name: "Western" },
    { id: 10, name: "Adventure" },
    { id: 11, name: "Romantic Comedy" },
    { id: 12, name: "Fiction" },
    { id: 13, name: "Science Fiction" },
    { id: 14, name: "Musical" },
    { id: 15, name: "Documentary" }
];

genres.Add = function(genre) {
    const newGenre = {
        id: this.length + 1,
        name: genre.name
    }
    this.push(newGenre);
    return newGenre;
};

genres.Remove = function(genre) {
    this.splice(this.indexOf(genre), 1);
};

function update(dbGenre, values) {
    if (values.name)
        dbGenre.name = values.name;

    return dbGenre;
}

function getGenre(id, res) {
    if (!id) return genres;
    id = parseInt(id);
    return genres.find((genre) => genre.id === id);
}

function notFound(res) {
    res.status(404).send('The genre with the specified ID does not exist');
}

function badRequest(res, error) {
    res.status(400).send(getErrorMessage(error));
}

function getErrorMessage(error) {
    return error.details
        .map((e) => e.message)
        .reduce((current, next) => { return !current ? next : `${current},\n${next}`; })
}

function validate(genre) {
    const schema = {
        id: Joi.number().integer(),
        name: Joi.string().min(3).required()
    }

    return Joi.validate(genre, schema);
}

// Get-all
router.get('/', (req, res) => {
    res.send(genres);
});

// Get
router.get('/:id', (req, res) => {
    var genre = getGenre(req.params.id);
    if (!genre) return notFound(res);
    res.send(genre);
});

// Add
router.post('/', (req, res) => {
    var toAdd = req.body;
    const { error } = validate(toAdd);
    if (error) return badRequest(res, error);

    const genre = genres.Add(toAdd)
    res.send(genre);
});

// Update
router.put('/:id', (req, res) => {
    const genre = getGenre(req.params.id);
    if (!genre) return notFound(res);

    const toUpdate = req.body;
    const { error } = validate(toUpdate);
    if (error) return badRequest(res, error);

    res.send(update(genre, toUpdate));
});

// Delete
router.delete('/:id', (req, res) => {
    const genre = getGenre(req.params.id);
    if (!genre) return notFound(res);

    genres.Remove(genres);
    res.send(genre);
});

module.exports = router;