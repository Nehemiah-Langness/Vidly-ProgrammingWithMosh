const _ = require('lodash');
const common = require('./common');
const userModule = require('../models/user');

userModule.router = require('express').Router();
userModule.router.get('/me', [require('../middleware/authenticator')], async (req, res) => {
    const user = await userModule.repository.get(req.user._id);
    res.send(_.pick(user, ['name', 'email']));
});

const userRouteConfig = require('./crud')(userModule);
userRouteConfig.actions.add = async function(toAdd, req, res, validate, repository) {
    const error = validate(toAdd);
    if (error) return common.send(res).badRequest(error);

    const user = await repository.add(toAdd);
    if (!user) return common.send(res).badRequest();

    return res.cookie('x-auth-token', user.generateAuthToken()).redirect('/');
}

module.exports = userRouteConfig;