var turn = 'X';
var winner;
var $squares = $('.square');


function game () {
  var board = readBoard();
  winner = checkForWin(board);
  console.log(winner);
  if(winner){
    gameOver(winner);
    return winner;
  }else{
    turn = turn === 'X' ? 'O' : 'X';
    $squares.click(turn, function () {
      if(!$(this).text()){
        $(this).text(turn);
        game();
      }
    });
  }
};

function checkForWin (board) {
  //there are 8 winning patterns
  //if three in a row
  //return 'X' or 'O'
  //else return null
  var isItOver = checkForThree(board, 0, 1, 2) || checkForThree(board, 3, 4, 5) || checkForThree(board, 6, 7, 8) || checkForThree(board, 0, 3, 6) || checkForThree(board, 1, 4, 7) || checkForThree(board, 2, 5, 8)|| checkForThree(board, 0, 4, 8) || checkForThree(board, 2, 4, 6);
  return isItOver;
};

function checkForThree (board, x, y, z) {
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
  $squares.off();
  $($squares[winner.how[0]]).addClass('win');
  $($squares[winner.how[1]]).addClass('win');
  $($squares[winner.how[2]]).addClass('win');
  winner.who = winner.who === 1 ? 'X' : 'O';
  $('.winner').append('<h1>' + winner.who + ' wins! Play again?</h1>')
}


//play ball
game(turn);

