var express = require('express');
var router = express.Router();

var game = require('./game/routes')

router.use('/', game);

module.exports = router;
