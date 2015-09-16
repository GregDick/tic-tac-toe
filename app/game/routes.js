var express = require('express');
var router = express.Router();

var ctrl = require('./controller');

router.get('/', ctrl.index);

//middleware
router.use(function (req, res, next) {
  next();
});

router.get('/random', ctrl.random);

module.exports = router;
