var express = require('express');
var router = express.Router();

var ctrl = require('./controller');

router.get('/', ctrl.index);

router.get('/random', ctrl.random);

module.exports = router;
