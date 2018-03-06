const common = require('../routes/common');
const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
    if (req.user) return next();

    var token = req.cookies['x-auth-token'];
    if (!token)
        return common.send(res).redirect("/login");

    try {
        req.user = jwt.verify(token, config.get('jwtPrivateKey'));
        next();
    } catch (error) {
        common.send(res).redirect("/login");
    }
}