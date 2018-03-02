const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to database'))
    .catch(error => console.error('Unable to connect to database', error));

const genres = require('./models/genre').repository;
const customers = require('./models/customer').repository;
const movies = require('./models/movie').repository;

Promise.all([
        genres.add({
            name: 'Comedy',
            tags: ['Light-hearted', 'Good times']
        })
        .then((genre) => {
            movies.add({
                title: "Funny Movie 1",
                numberInStock: 6,
                dailyRentalRate: 1,
                genre: genre
            })
        }),

        genres.add({
            name: 'Horror',
            tags: ['R', 'Night', 'Intense']
        }).then((genre) => {
            movies.add({
                title: "Scary Movie 1",
                numberInStock: 2,
                dailyRentalRate: 0,
                genre: genre
            })
        }),

        genres.add({
            name: 'Drama',
            tags: ['Serious']
        })
        .then((genre) => {
            movies.add({
                title: "Dramatic Movie 1",
                numberInStock: 5,
                dailyRentalRate: 2,
                genre: genre
            })
        }),

        genres.add({
            name: 'Romance',
            tags: ['Datenight', 'Light-hearted', 'Heart-warming']
        })
        .then((genre) => {
            movies.add({
                title: "Romantic Movie 1",
                numberInStock: 12,
                dailyRentalRate: 2,
                genre: genre
            })
        }),

        genres.add({
            name: 'Action',
            tags: ['Intense', 'Serious']
        })
        .then((genre) => {
            movies.add({
                title: "Action Movie 1",
                numberInStock: 4,
                dailyRentalRate: 0,
                genre: genre
            })
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
        })
        .then((genre) => {
            movies.add({
                title: "Musical Movie 1",
                numberInStock: 4,
                dailyRentalRate: 1,
                genre: genre
            })
        }),

        customers.add({
            name: 'Mr Customer 1',
            phone: '123-456-7890',
            isGold: true
        }),

        customers.add({
            name: 'Mr Customer 2',
            phone: '456-7890'
        }),

        customers.add({
            name: 'Mr Customer 3',
            phone: '123-456-7890 x2145'
        }),

        customers.add({
            name: 'Mr Customer 4',
            phone: '123-7890 x4561'
        }),

        customers.add({
            name: 'Mr Customer 5',
            phone: '987-654-3210',
            isGold: true
        })
    ])
    .then(() => console.log('Seeding complete'))
    .catch((e) => console.error(e));