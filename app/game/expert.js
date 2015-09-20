var path = require('path');
var _ = require('lodash');
var client = require(path.join(process.cwd(), '/www/lib/postgres'));


module.exports.move = function (req, res) {
  var originalBoard = req.query.board;
  console.log(req.query.turn);
  var turn = req.query.turn === 'X' ? '1' : '-1';

  var finalMoves = getPossibleMoves(originalBoard);
  var scores = miniMax(originalBoard, turn, 0);
  var finalScores = flattenAndSum(scores);
  console.log('finalScores', finalScores);
  var move = pickMove(finalScores, finalMoves, req.query.turn);
  res.send({move : move});
}


//=========================== GAME FUNCTIONS =========================
function miniMax (board, turn, depth) {
  turn = turn === '1' ? '-1' : '1';
  var winner = checkForWin(board);
  if(winner !== null){
    var score = winner * turn;
    return score;
  }
  //make new possibleMoves and scoresList for each level of depth
  var possibleMoves = getPossibleMoves(board);
  //create a scores list for the possible moves
  var newBoard;
  var scoresList = possibleMoves.map(function (move, i) {
    //for each move, get the new board, switch the turn and call minimax
    //return the miniMax score to the scoresList at this move's index
    newBoard = getPossibleBoard(board, turn, move);
    turn = turn === '1' ? '-1' : '1';
    var thisScore = miniMax(newBoard, turn, depth++);
    return thisScore;
  });
  //if no score is returned, return the score list to group nested scores
  return scoresList;
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
    return 10;
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

function getPossibleBoard (board, turn, move) {
  //return a single board with a new move implemented
  var newBoard = board.slice(0);
  newBoard[move] = turn;
  return newBoard;
}

function flattenAndSum (scores) {
  //accepts an array of nested scores and returns an array with single scores for each index
  return scores.map(function (score) {
    if(typeof score === 'object'){
      _.flatten(score, true);
      return _.sum(score);
    }else{
      return score;
    }
  });
}

function pickMove (finalScores, finalMoves, turn) {
  if(turn === 'X'){
    var maxScore = _.max(finalScores);
    var index = finalScores.indexOf(maxScore);
  }else{
    var minScore = _.min(finalScores);
    var index = finalScores.indexOf(minScore);
  }
  console.log(index);
  return finalMoves[index];
}









