module.exports.index = function (req, res) {
  res.render('views/index');
};

module.exports.random = function (req, res) {
  //read board from req.query.board
  //find empty spaces
  var board = req.query.board;
  var emptySpaces = [];
  board.forEach(function (space, i) {
    if(space === '0'){
      emptySpaces.push(i);
    }
  });
  //choose a random empty space
  var guess = Math.floor(Math.random() * (emptySpaces.length + 1));
  var move = emptySpaces[guess];
  //send the move as JSON
  res.send({move : move});
};
