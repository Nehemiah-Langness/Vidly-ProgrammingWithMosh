const common = require('../routes/common');
const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function authenticate(req, res, next) {
    var token = req.header('x-auth-token');
    if (!token) return common.send(res).notAuthorized();

    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        console.log(decoded);
        next();
    } catch (error) {
        common.send(res).notAuthorized(error);
    }
}