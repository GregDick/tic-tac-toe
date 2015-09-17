var express = require('express');
var router = express.Router();

var ctrl = require('./controller');

router.get('/', ctrl.index);

//middleware
// router.use(function (req, res, next) {
//   next();
// });

//gets a random move
router.get('/random', ctrl.random);

//stores current board in database
router.post('/random/board', ctrl.save);

//gets the game results from database
router.get('/results', ctrl.results);

module.exports = router;
