const router = require('express').Router();
require('./vidly-common').addBasicCrud(router, require('../models/customer'));
module.exports = router;