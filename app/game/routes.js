var express = require('express');
var path = require('path');
var router = express.Router();

var ctrl = require(path.join(process.cwd(), '/app/game/controller'));
var random = require(path.join(process.cwd(), '/app/game/random'));
var expert = require(path.join(process.cwd(), '/app/game/expert'));

router.get('/', ctrl.index);

//middleware example
// router.use(function (req, res, next) {
//   next();
// });

//gets a random move
router.get('/random', random.move);

//stores current board in the Random table
router.post('/random/board', random.save);

//gets the game results from the Random table
router.get('/random/results', random.results);

//gets an expert move
router.get('/expert', expert.move);

module.exports = router;
