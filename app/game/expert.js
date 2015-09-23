var path = require('path');
var _ = require('lodash');
var client = require(path.join(process.cwd(), '/www/lib/postgres'));

module.exports.move = function (req, res) {
  var board = req.query.board;
  var choice = bestMoveAndScore(board, 0);
  res.send({move : choice.move});
}

//===================================== MINIMAX ALGORITHM =======================================

function bestMoveAndScore (board, depth) {
  //gets the best move and score by trying each move
  // and predicting the opponent's best move until the game is over
  var best = {
    move : null,
    score : -Infinity
  }
  var moves = getPossibleMoves(board);
  var equalMoves;
  depth++;
  moves.forEach(function (move) {
    //try each move and get its score
    var score = scoreMove(board, move, depth);
    //set the highest score as best.score and save the move
    if(score > best.score){
      best.score = score;
      equalMoves = [move];
    }else if(score === best.score){
      //if scores are equal, push move to equalMoves to randomly pick one later
      equalMoves.push(move);
    }
  });

  //if there is more than one move in equal moves, randomly pick one
  best.move = equalMoves.length > 1 ? randomlyPickMove(equalMoves) : equalMoves[0];

  return best;
}

function scoreMove (board, move, depth) {
  //returns the score of a move
  var after = getPossibleBoard(board, move);
  //see if after is a winning board, return if it is
  var winningScore = checkForWin(after);
  if(winningScore !== null){
    return winningScore - depth;
  }
  //if move is not a winning move, recurse and predict moves until the game is over and a score is returned
  var counter = bestMoveAndScore(after, depth);
  return -counter.score;
}

//===================================== HELPER FUNCTIONS =======================================

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
  //return the score relative to who just went
  //else return null
  if(board[x] !== '0' && board[x] === board[y] && board[y] === board[z]){
    return whoJustWent(board) === board[x] ? 100 : -100;
  }else{
    return null;
  }
}

function whoJustWent (board) {
  //will not be called on a totally empty board
  //if empty spaces is even, O just went
  //if odd, X just went
  var emptyCount = 0;
  board.forEach(function (square) {
    emptyCount = square === '0' ? emptyCount + 1 : emptyCount;
  });
  return emptyCount % 2 ? '-1' : '1';
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

function getPossibleBoard (board, move) {
  //return a single board with the new move implemented
  var newBoard = board.slice(0);
  var turn = whoJustWent(board) === '1' ? '-1' : '1';
  newBoard[move] = turn;
  return newBoard;
}

function randomlyPickMove (moves) {
  // if more than one move is valued at the same score
  //  chooses one at random for variety in gameplay
  var guess = Math.floor(Math.random() * (moves.length));
  return moves[guess];
}






