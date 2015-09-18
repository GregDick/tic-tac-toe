var winner = null;
var turn   = 'X';
var board;
var xWins  = 0;
var oWins  = 0;
var tie    = 0;
var numberOfGames = 20;
var gameCounter   = 0;
var turnCounter   = 0;
//jQuery selectors
var $squares      = $('.square');
var $playAgain    = $('#playAgain');

// ===================== GAME ========================

function game () {
  board = readBoard();
  if(winner !== null){
    // userGameOver(winner);
    gameCounter++;
    logResults();
  }else{
    turnCounter++;
    //based on turn
    //allow for user to click
    //or make a call to opponent API
    if(turn === 'X'){
      randomTurn();
      // userTurn();
    }else{
      randomTurn();
    }
  }
};

function checkForWin () {
  //there are 8 winning patterns
  //checkForThree with each pattern
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
game();


// ===================== PLAYERS ========================

function userTurn () {
  $squares.click(turn, function () {
    if(!$(this).text()){
      $(this).text(turn);
      turn = turn === 'X' ? 'O' : 'X';
      game();
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
      //read board, check for winner and send game state to DB
      board = readBoard();
      winner = checkForWin();
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
}

//playAgain click handler
$('.winner').on('click', 'button', function () {
  $('.winner').empty();
  resetGameValues();
  game();
});

// ===================== LOOP GAME========================

function logResults () {
  //increment the winner
  if(winner.who === 1){
    xWins++;
  }else if(winner.who === -1){
    oWins++;
  }else{
    tie++;
  };
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
  //posts game state to /random/board
  //calls game() when SQL finishes writing data
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
  $.get('/results', function (response) {
    console.log(response);
    $('.winner').append('<h1>Winning Percentage</h1>');
    createChart(response);
  });
  console.log('x', xWins);
  console.log('o', oWins);
  console.log('tie', tie);
  console.log('games', gameCounter);
  // $('.winner').append('<h1> X : ' + xWins + '</h1>');
  // $('.winner').append('<h1> O : ' + oWins + '</h1>');
  // $('.winner').append('<h1> Ties : ' + tie + '</h1>');
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







