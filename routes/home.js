const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('index', {
        title: 'Vidly',
        message: 'Welcome to Vidly'
    });
});

module.exports = router;