//jQuery selectors
var $squares      = $('.square');
var $playAgain    = $('#playAgain');
//game variables
var winner = null;
var turn   = 'X';
var board  = readBoard();
var numberOfGames = 10;
var gameCounter   = 0;
var turnCounter   = 0;

// ===================== GAME ========================

function game () {
  if(winner){
    // userGameOver(winner);
    gameCounter++;
    loopGame();
  }else{
    turnCounter++;
    //based on turn, allow for user to click or make a call to opponent API
    if(turn === 'X'){
      expertTurn();
      // randomTurn();
      // userTurn();
    }else{
      // randomTurn();
      expertTurn();
      // userTurn();
    }
  }
};

function checkForWin () {
  //there are 8 winning patterns. Call checkForThree with each pattern
  var isItOver = checkForThree(0, 1, 2) || checkForThree(3, 4, 5) || checkForThree(6, 7, 8) || checkForThree(0, 3, 6) || checkForThree(1, 4, 7) || checkForThree(2, 5, 8)|| checkForThree(0, 4, 8) || checkForThree(2, 4, 6);
  //check for draw where winner is 0
  if(!isItOver && board.indexOf(0) === -1){
    isItOver = {
      who : 0
    };
  }
  return isItOver;
};

function checkForThree (x, y, z) {
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
  //translate the HTML board to the javascript array board where X = 1 empty = 0 and O = -1
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
game();


// ===================== PLAYERS ========================

function userTurn () {
  $squares.click(turn, function () {
    //if square has no text, it's an allowable move
    if(!$(this).text()){
      $(this).text(turn);
      turn = turn === 'X' ? 'O' : 'X';
      //calls game() when it is finished writing data
      postBoard();
    }
  });
}

function randomTurn () {
  $squares.off(); // remove click handler from squares during opponent turn
  $.get('/random', {board : board})
    .done(function(res){
      //make the move
      $($squares[res.move]).text(turn);
      //switch turns
      turn = turn === 'X' ? 'O' : 'X';
      //calls game() when it is finished writing data
      postBoard();
    });
}

function expertTurn () {
  $squares.off(); // remove click handler from squares during opponent turn
  $.get('/expert', {board : board})
    .done(function (res) {
      //make the move
      $($squares[res.move]).text(turn);
      //switch turns
      turn = turn === 'X' ? 'O' : 'X';
      //calls game() when it is finished writing data
      postBoard();
    });
}


// ===================== AFTER GAME ========================

function userGameOver () {
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

function resetGameValues () {
  //clear all the board tiles
  $squares.each(function (i, square) {
    $(square).removeClass('win');
    $(square).empty();
  });
  turnCounter = 0;
  winner = null;
  turn = 'X';
  board = readBoard();
}

//playAgain click handler
$('.winner').on('click', 'button', function () {
  $('.winner').empty();
  resetGameValues();
  game();
});

// ===================== LOOP GAME========================

function loopGame () {
  //loop until gameCounter exceeds numberOfGames
  if(gameCounter < numberOfGames){
    resetGameValues();
    game();
  }else{
    getResults();
  }
}

// ===================== DATABASE ========================

function postBoard () {
  //reads board, checks for winner and sends game state to DB
  board = readBoard();
  winner = checkForWin();
  $.post('/random/board', {
    board : board,
    gameID : gameCounter,
    boardID : turnCounter,
    winner : winner
  })
    .done(function () {
      game();
    });
}

function getResults () {
  //calls /results for a SQL query to get all the data from the past loop
  $.get('/random/results', function (response) {
    console.log(response);
    $('.winner').append('<h1>Winning Percentage of '+ response.total +' Games</h1>');
    createChart(response);
  });
}

function createChart (response) {
  // Get context with jQuery - using jQuery's .get() method.
  var ctx = $("#results").get(0).getContext("2d");

  data = [{
    value : response.xPercent,
    color : 'red',
    label : 'X Wins'
  },{
    value : response.oPercent,
    color : 'blue',
    label : 'O Wins'
  },{
    value : response.tiePercent,
    color : 'yellow',
    label : 'Ties'
  }];

  new Chart(ctx).Doughnut(data);
}







