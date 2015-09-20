var path = require('path');
var client = require(path.join(process.cwd(), '/www/lib/postgres'));


module.exports.move = function (req, res) {
  var originalBoard = req.query.board;
  console.log(originalBoard);
  var turn = req.query.turn === 'X' ? '1' : '-1';

  var moves = getPossibleMoves(originalBoard);
  console.log(moves);

  miniMax(originalBoard, turn, 0);
  // res.send({move : move}) ;
}


//=========================== GAME FUNCTIONS =========================
function miniMax (board, turn, depth) {
  var winner = checkForWin(board);
  if(winner !== null){
    var score = winner;
    // console.log(score);
    return score;
  }else {
    //make new moves and scores list based on depth
    var possibleMoves = getPossibleMoves(board);
    //create a scores list for the possible moves
    var scoresList = [];
    possibleMoves.forEach(function () {
      scoresList.push(null);
    });
    getPossibleBoards(board, turn, possibleMoves, scoresList, depth);
  }
}


function checkForWin (board) {
  //there are 8 winning patterns
  //checkForThree with each pattern
  var isItOver = checkForThree(board, 0, 1, 2) || checkForThree(board, 3, 4, 5) || checkForThree(board, 6, 7, 8) || checkForThree(board, 0, 3, 6) || checkForThree(board, 1, 4, 7) || checkForThree(board, 2, 5, 8)|| checkForThree(board, 0, 4, 8) || checkForThree(board, 2, 4, 6);
  //check for draw and return 0
  if(!isItOver && board.indexOf('0') === -1){
    isItOver = 0;
  }
  return isItOver;
};

function checkForThree (board, x, y, z) {
  //if three in a row
  //return the score relative to player X
  //else return null
  if(board[x] !== '0' && board[x] === board[y] && board[y] === board[z]){
    if(board[x] === '1'){
      return 10;
    }else{
      return -10;
    }
  }else{
    return null;
  }
}

function getPossibleMoves (board) {
  //return an array of all the available moves for a board
  var arr = [];
  board.forEach(function (space, i) {
    if(space === '0'){
      arr.push(i);
    }
  });
  return arr;
}

function getPossibleBoards (board, turn, possibleMoves, scoresList, depth) {
  //extrapolate all possible game states from a given board
  possibleMoves.forEach(function (newMove, i) {
    var newBoard = board.slice(0);
    //create a new board with each move
    newBoard[newMove] = turn;
    //recurse miniMax until it returns a score
    //put that score in the scores list at the same index as its move
    turn = turn === '1' ? '-1' : '1';
    scoresList[i] = miniMax(newBoard, turn, depth++);
  });
  console.log(scoresList);
  return scoresList;
}












