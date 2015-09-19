var path = require('path');
var client = require(path.join(process.cwd(), '/www/lib/postgres'));


module.exports.move = function (req, res) {
  var originalBoard = req.query.board;
  console.log(originalBoard);
  var turn = req.query.turn === 'X' ? '1' : '-1';

  var moves = getPossibleMoves(originalBoard);
  console.log(moves);
  getPossibleBoards(originalBoard, turn, moves);
  // miniMax(originalBoard, turn, null);
  // res.send({move : move});
}


//=========================== GAME FUNCTIONS =========================
var scores = {};

function miniMax (board, turn, move) {
  var winner = checkForWin(board);
  if(winner !== null){
    var score = winner.who * 10;
    if (scores[move]) {
      scores[move] += score;
    }else{
      scores[move] = score;
    }
    console.log('scores', scores);
    return score;
  }else {
    turn = turn === '1' ? '-1' : '1';
    var possibleMoves = getPossibleMoves(board);
    getPossibleBoards(board, turn, possibleMoves);
  }
}


function checkForWin (board) {
  //there are 8 winning patterns
  //checkForThree with each pattern
  var isItOver = checkForThree(board, 0, 1, 2) || checkForThree(board, 3, 4, 5) || checkForThree(board, 6, 7, 8) || checkForThree(board, 0, 3, 6) || checkForThree(board, 1, 4, 7) || checkForThree(board, 2, 5, 8)|| checkForThree(board, 0, 4, 8) || checkForThree(board, 2, 4, 6);
  //check for draw where winner is 0
  if(!isItOver && board.indexOf('0') === -1){
    isItOver = {
      who : '0'
    };
  }
  return isItOver;
};

function checkForThree (board, x, y, z) {
  //if three in a row
  //return who wins and the winning play
  //else return null
  if(board[x] !== '0' && board[x] === board[y] && board[y] === board[z]){
    return {
      who : board[x]
    };
  }else{
    return null;
  }
}

function getPossibleMoves (board) {
  var arr = [];
  board.forEach(function (space, i) {
    if(space === '0'){
      arr.push(i);
    }
  });
  return arr;
}

function getPossibleBoards (board, turn, possibleMoves) {
  //extrapolate all possible game states from a given board
  possibleMoves.forEach(function (newMove, i) {
    var newBoard = board.slice(0);
    //create a new board with each move
    newBoard[newMove] = turn;
    //call minimax on all new boards

    miniMax(newBoard, turn, newMove);
  });
}












