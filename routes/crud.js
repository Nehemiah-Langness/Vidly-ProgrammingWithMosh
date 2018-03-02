module.exports = function(model) {
    const router = require('express').Router();
    require('./common').addBasicCrud(router, model);
    return router;
}