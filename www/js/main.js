var turn = 'X';
var winner;
var $squares = $('.square');
var $playAgain = $('#playAgain');

// =====================GAME LOGIC========================

function game () {
  var board = readBoard();
  winner = checkForWin(board);
  if(winner){
    gameOver(winner);
    return winner;
  }else{
    //based on turn
    //allow for user to click
    //or make a call to opponent API
    if(turn === 'X'){
      $squares.click(turn, function () {
        if(!$(this).text()){
          $(this).text(turn);
          turn = turn === 'X' ? 'O' : 'X';
          game();
        }
      });
    }else{
      $squares.off(); // remove click handler from squares during opponent turn
      $.get('/random', {board : board})
        .done(function(res){
          console.log(res.move);
          $($squares[res.move]).text(turn);
          turn = turn === 'X' ? 'O' : 'X';
          game();
        });
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

function gameOver (winner) {
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


//play ball
game(turn);

//playAgain click
$('.winner').on('click', 'button', function () {
  $('.winner').empty();
  $squares.each(function (i, square) {
    $(square).removeClass('win');
    $(square).empty();
  });
  winner = null;
  turn = 'X';
  game(turn);
});


















