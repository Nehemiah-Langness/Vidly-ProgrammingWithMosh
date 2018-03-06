const router = require('express').Router();
const config = require('config');

router.get('/', require('../middleware/authorize'), (req, res) => {
    res.render('index', {
        title: config.get('name'),
        message: 'Welcome to Vidly',
        user: req.user
    });
});

router.get('/register', (req, res) => {
    res.render('register', {
        message: 'Register an Account'
    });
});



module.exports = router;