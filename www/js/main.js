var turn = 'X';
var winner;
var $squares = $('.square');

$squares.click(turn, function () {
  if(!$(this).text()){
    $(this).text(turn);
  }
});


function game (winner, turn) {
  if(winner){
    return winner;
  }else{
    var board = readBoard();
    winner = checkForWin(board);
    turn = turn === 'X' ? 'O' : 'X';
    game(winner, turn);
  }
};

function checkForWin (board) {
  //if three in a row
  //return 'X' or 'O'
  //else return null;
};

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

