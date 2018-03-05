const common = require('../routes/common');

module.exports = function(req, res, next) {
    if (!req.user.isAdmin) return common.send(res).forbidden();
    next();
}