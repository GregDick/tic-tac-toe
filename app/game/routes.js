var express = require('express');
var path = require('path');
var router = express.Router();

var results = require(path.join(process.cwd(), '/app/game/results'));
var novice = require(path.join(process.cwd(), '/app/game/novice'));
var expert = require(path.join(process.cwd(), '/app/game/expert'));

//renders page and creates tables
router.get('/', results.start);

//gets a random move
router.get('/novice', novice.move);

//gets an expert move
router.get('/expert', expert.move);

//stores current board in the Random table
router.post('/results', results.save);

//gets the game results from the Random table
router.get('/results', results.query);

module.exports = router;



//middleware example
// router.use(function (req, res, next) {
//   next();
// });
