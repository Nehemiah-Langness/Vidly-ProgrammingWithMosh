const router = require('express').Router();
require('./vidly-common').addBasicCrud(router, require('../models/genre'));
module.exports = router;