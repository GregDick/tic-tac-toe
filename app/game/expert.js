var path = require('path');
var _ = require('lodash');
var client = require(path.join(process.cwd(), '/www/lib/postgres'));


module.exports.move = function (req, res) {
  var board = req.query.board;

  var finalMoves = getPossibleMoves(board);
  console.log(finalMoves);

  var choice = bestMoveAndScore(board);
  console.log(choice);

  res.send({move : choice.move});
}


//=========================== GAME FUNCTIONS =========================
function miniMax (board, turn, depth) {
  turn = turn === '1' ? '-1' : '1';
  var winner = checkForWin(board);
  if(winner !== null){
    var score = winner;
    console.log('score', score);
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
  //if no score is returned, return the scoresList;
  // console.log('scoresList', scoresList);
  return scoresList;
}

// ====================== LET'S TRY SOMETHING DIFFERENT =================

function bestMoveAndScore (board) {
  var best = {
    move : null,
    score : -Infinity
  }
  var moves = getPossibleMoves(board);
  //get the best move and score by trying each move
  moves.forEach(function (move) {
    var score = scoreMove(board, move);
    if(score > best.score){
      best.score = score;
      best.move = move;
    }
  });

  return best;
}


function scoreMove (board, move) {
  var after = getPossibleBoard(board, move);
  //see if after is a winning board, return if it is
  var winningScore = checkForWin(after);
  if(winningScore !== null){
    return winningScore;
  }
  //find the opponent's best counter move and score
  var counter = bestMoveAndScore(after);
  return -counter.score;
}




// ====================== LET'S TRY SOMETHING DIFFERENT =================

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


function pickMove (finalScores, finalMoves, turn) {
  if(turn === 'X'){
    var maxScore = _.max(finalScores);
    var index = finalScores.indexOf(maxScore);
  }else{
    var minScore = _.min(finalScores);
    var index = finalScores.indexOf(minScore);
  }
  return finalMoves[index];
}

function pickAndFlatten (scores, turn) {
  return scores.map(function (element) {
    //for each element, loop pickHelper until element is a number
    while(typeof element !== 'number'){
      turn = turn === '1' ? '-1' : '1';
      element = pickHelper(element, turn);
    }
    return element;
  });
}

function pickHelper (data, turn) {
  // returns single number from an array

  //find the first array where all child elements are numbers,
  // return min or max of that array depending on turn
  //bring this number up one level in the array tree and repeat

  //if data is an array, get to the most nested element
  if(typeof data !== 'number'){
    //if all elements of data are numbers
    if(checkForNumbers(data)){
      //return min or max depending on turn
      if(turn==='1'){
        return _.max(data);
      }else{
        return _.min(data);
      }
    }else{
      //call pickHelper one level deeper and return resulting array to the while loop
      return data.map(function (element) {
        //alternate turn when going one level deeper
        turn = turn === '1' ? '-1' : '1';
        return pickHelper(element, turn);
      });
    }
  }else{
    //if data is just a number, return it
    return data;
  }
}

function checkForNumbers (arr) {
//checks if all elements of an array are numbers. returns boolean true if they are all numbers
  var passing = true;
  arr.forEach(function (element) {
    if(typeof element !== 'number'){
      passing = false;
    }
  });
  return passing;
}











