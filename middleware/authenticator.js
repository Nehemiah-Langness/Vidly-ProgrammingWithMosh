const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
    var token = req.cookies['x-auth-token'];
    if (token) {
        try {
            req.user = jwt.verify(token, config.get('jwtPrivateKey'));
        } catch (e) {}
    }
    next();
}