var turn  = 'X';
var winner;
var xWins = 0;
var oWins = 0;
var tie   = 0;
var gameCounter = 0;
var $squares    = $('.square');
var $playAgain  = $('#playAgain');

// =====================GAME LOGIC========================

function game () {
  var board = readBoard();
  winner = checkForWin(board);
  if(winner){
    gameCounter++;
    logResults(winner, gameCounter);
    return winner;
  }else{
    //based on turn
    //allow for user to click
    //or make a call to opponent API
    if(turn === 'X'){
      randomTurn(board);
    }else{
      randomTurn(board);
    }

  }
};

function checkForWin (board) {
  //there are 8 winning patterns
  //checkForThree with each pattern
  var isItOver = checkForThree(board, 0, 1, 2) || checkForThree(board, 3, 4, 5) || checkForThree(board, 6, 7, 8) || checkForThree(board, 0, 3, 6) || checkForThree(board, 1, 4, 7) || checkForThree(board, 2, 5, 8)|| checkForThree(board, 0, 4, 8) || checkForThree(board, 2, 4, 6);
  //check for draw
  if(!isItOver && board.indexOf(0) === -1){
    isItOver = 'draw';
  }
  return isItOver;
};

function checkForThree (board, x, y, z) {
  //if three in a row
  //return who wins and the winning play
  //else return null
  if(board[x] && board[x] === board[y] && board[y] === board[z]){
    return {
      who : board[x],
      how : [x, y, z]
    };
  }else{
    return null;
  }
}

function readBoard () {
  //iterate over board elements
  //and push to map array
  //for X = 1 empty = 0 and O = -1
  var map = [];
  $.each($squares, function (i, square) {
    var text = $(square).text();
    if(text === 'X'){
      map.push(1);
    }else if(text === 'O'){
      map.push(-1);
    }else{
      map.push(0);
    }
  });
  return map;
}

//play ball
game(turn);


// =====================PLAYER LOGIC========================

function userTurn () {
  $squares.click(turn, function () {
    if(!$(this).text()){
      $(this).text(turn);
      turn = turn === 'X' ? 'O' : 'X';
      game();
    }
  });
}

function randomTurn (board) {
  $squares.off(); // remove click handler from squares during opponent turn
  $.get('/random', {board : board})
    .done(function(res){
      $($squares[res.move]).text(turn);
      turn = turn === 'X' ? 'O' : 'X';
      game();
    });
}


// =====================AFTER GAME LOGIC========================

function userGameOver (winner) {
  //remove click handler from all squares
  $squares.off();
  //if there is a winner, show winner and how they won
  if(winner.who){
    //highlight winning move
    $($squares[winner.how[0]]).addClass('win');
    $($squares[winner.how[1]]).addClass('win');
    $($squares[winner.how[2]]).addClass('win');
    //display who won and playAgain button
    winner.who = winner.who === 1 ? 'X' : 'O';
    $('.winner').append('<span class="h1">' + winner.who + ' wins!</span>');
  }
  //either way append the playAgain button
  $('.winner').append('<button id="playAgain" class="btn btn-default">Play Again?</button>');
}

function resetGameValues (argument) {
  $squares.each(function (i, square) {
    $(square).removeClass('win');
    $(square).empty();
  });
  winner = null;
  turn = 'X';
}

//playAgain click handler
$('.winner').on('click', 'button', function () {
  $('.winner').empty();
  resetGameValues();
  game();
});

function logResults (winner, gameCounter) {
  //increment the winner
  if(winner.who === 1){
    xWins++;
  }else if(winner.who === -1){
    oWins++;
  }else{
    tie++;
  };
  //loop until gameCounter exceeds value
  if (gameCounter < 100) {
    resetGameValues();
    game();
  }else{
    console.log('x', xWins);
    console.log('o', oWins);
    console.log('tie', tie);
    console.log('games', gameCounter);
  }
}

// =====================LOOP GAME========================


















