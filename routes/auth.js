const router = require('express').Router();
const config = require('config');
const common = require('./common');
const hashing = require('../hash');
const BadRequest = require('../errors/BadRequest');
const userModule = require('../models/user');
const jwt = require('jsonwebtoken');

const { validate, repository } = require('../models/auth');

router.get('/', (req, res) => {
    console.log("Login")
    res.render('login', {
        message: 'Login with an Existing Account'
    });
});

// Add
router.post('/', async (req, res) => {
    try {
        var toAdd = req.body;
        const error = validate(toAdd);
        if (error) return common.send(res).badRequest(error);

        let user = await userModule.model.findOne({ email: toAdd.email });
        if (!user) return common.send(res).badRequest('Invalid email or password');

        if (!(await hashing.compare(toAdd.password, user.password)))
            return common.send(res).badRequest('Invalid email or password');

        return res.cookie('x-auth-token', user.generateAuthToken()).redirect('/');

    } catch (error) {
        if (error instanceof BadRequest)
            common.send(res).badRequest(error);
        common.send(res).serverError(error);
    }
});



module.exports.router = router;