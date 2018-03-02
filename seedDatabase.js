const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to database'))
    .catch(error => console.error('Unable to connect to database', error));

const genres = require('./models/genre').repository;
const customers = require('./models/customer').repository;

Promise.all([
        genres.add({
            name: 'Comedy',
            tags: ['Light-hearted', 'Good times']
        }),

        genres.add({
            name: 'Horror',
            tags: ['R', 'Night', 'Intense']
        }),

        genres.add({
            name: 'Drama',
            tags: ['Serious']
        }),

        genres.add({
            name: 'Romance',
            tags: ['Datenight', 'Light-hearted', 'Heart-warming']
        }),

        genres.add({
            name: 'Action',
            tags: ['Intense', 'Serious']
        }),

        genres.add({
            name: 'Thriller',
            tags: ['R', 'Intense']
        }),

        genres.add({
            name: 'Animation',
            tags: ['Children']
        }),

        genres.add({
            name: 'Western',
            tags: ['Oldies']
        }),

        genres.add({
            name: 'Adventure',
            tags: ['Good times', 'Intense']
        }),

        genres.add({
            name: 'Romantic Comedy',
            tags: ['Datenight', 'Light-hearted', 'Heart-warming', 'Good times', 'Funny']
        }),

        genres.add({
            name: 'Fiction',
            tags: []
        }),

        genres.add({
            name: 'Science Fiction',
            tags: ['Nerdy']
        }),

        genres.add({
            name: 'Musical',
            tags: ['Nerdy', 'Family']
        }),

        customers.add({
            name: 'Mr Customer 1',
            phone: '123-456-7890',
            isGold: true
        }),

        customers.add({
            name: 'Mr Customer 2',
            phone: '456-7890',
            isGold: false
        }),

        customers.add({
            name: 'Mr Customer 3',
            phone: '123-456-7890 x2145',
            isGold: false
        }),

        customers.add({
            name: 'Mr Customer 4',
            phone: '123-7890 x4561',
            isGold: false
        }),

        customers.add({
            name: 'Mr Customer 5',
            phone: '987-654-3210',
            isGold: true
        })
    ])
    .then(() => console.log('Seeding complete'))
    .catch((e) => console.error(e));