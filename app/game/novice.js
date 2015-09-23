var path = require('path');

module.exports.move = function (req, res) {
  //read board and put in DB
  var board = req.query.board;
  var move  = makeRandomMove(board);
  //send the move as JSON
  res.send({move : move});
};

//==========================PLAYER FUNCTIONS=========================

function makeRandomMove (board) {
  //find empty spaces
  var emptySpaces = [];
  board.map(function (space, i) {
    if(space === '0'){
      emptySpaces.push(i);
    }
  });
  //choose a random empty space
  var guess = Math.floor(Math.random() * (emptySpaces.length));
  return emptySpaces[guess];
}
