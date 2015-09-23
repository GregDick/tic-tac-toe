var express = require('express');
var path = require('path');
var router = express.Router();

var ctrl = require(path.join(process.cwd(), '/app/game/controller'));
var results = require(path.join(process.cwd(), '/app/game/results'));
var novice = require(path.join(process.cwd(), '/app/game/novice'));
var expert = require(path.join(process.cwd(), '/app/game/expert'));

router.get('/', ctrl.index);

//middleware example
// router.use(function (req, res, next) {
//   next();
// });

//gets a random move
router.get('/novice', novice.move);

//stores current board in the Random table
router.post('/results', results.save);

//gets the game results from the Random table
router.get('/results', results.query);

//gets an expert move
router.get('/expert', expert.move);

module.exports = router;
