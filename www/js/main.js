//jQuery selectors
var $squares      = $('.square');
//game variables
var winner = null;
var turn   = 'X';
var board  = readBoard();
var numberOfGames = 1;
var gameCounter   = 0;
var turnCounter   = 0;
//user interface variables
var playerX;
var playerO;
var resultsDonut;
//database variables
var uniqueTableName;

// ===================== GAME ========================

function game () {
  if(winner){
    gameCounter++;
    highlightWin();
    loopGame();
  }else{
    turnCounter++;
    //based on turn, allow for user to click or make a call to opponent API
    if(turn === 'X'){
      takeTurn(playerX);
    }else{
      takeTurn(playerO);
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

// ===================== PLAYERS ========================

function takeTurn (player) {
  if(player === 'user'){
    userTurn();
  }else if(player === 'novice' || player === 'expert'){
    aiTurn(player);
  }else{
    intermediateTurn();
  }
}

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

function aiTurn (level) {
  var pathName = `/${level}`;
  $squares.off(); // remove click handler from squares during opponent turn
  $.get(pathName, {board : board})
    .done(function(res){
      //make the move
      $($squares[res.move]).text(turn);
      //switch turns
      turn = turn === 'X' ? 'O' : 'X';
      //calls game() when it is finished writing data
      postBoard();
    });
}

function intermediateTurn () {
  var coinToss = Math.floor(Math.random() * 2);
  var skillLevel = coinToss ? 'novice' : 'expert';
  aiTurn(skillLevel);
}

// ===================== AFTER GAME ========================

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

// ===================== LOOP GAME========================

function loopGame () {
  //loop until gameCounter exceeds numberOfGames
  if(gameCounter < numberOfGames){
    resetGameValues();
    game();
  }else{
    highlightWin();
    getResults();
    if(playerX !== 'user' && playerO !== 'user'){
      $('.loop button').removeClass('disabled');
    }
  }
}

// ===================== DATABASE ========================

function postBoard () {
  //reads board, checks for winner and sends game state to DB
  board = readBoard();
  winner = checkForWin();
  if (winner) {
    $.post('/results', {
      tableName : uniqueTableName,
      gameID : gameCounter,
      winner : winner
    })
      .done(function () {
        game();
      });
  }else{
    game();
  }
}

function getResults () {
  $('.results').empty();
  //calls /results for a SQL query to get all the data from the past loop
  $.get('/results', {tableName : uniqueTableName}, function (response) {
    console.log(response);
    $('.results').append('<h3>Winning Percentage of '+ response.total +' Games</h3>');
    createChart(response);
  });
}


// ================================ DISPLAY DATA ========================

function highlightWin () {
  //highlight winning move
  if(winner.who){
    $($squares[winner.how[0]]).addClass('win');
    $($squares[winner.how[1]]).addClass('win');
    $($squares[winner.how[2]]).addClass('win');
  }
}

function createChart (response) {
  // Get context with jQuery - using jQuery's .get() method.
  var ctx = $("#stats").get(0).getContext("2d");

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

  if(resultsDonut){
    //wipe out old chart
    resultsDonut.destroy();
  }

  resultsDonut = new Chart(ctx).Doughnut(data);
}



// ================================ USER INTERFACE ========================


//=============================== CHOOSE A PLAYER
$('#userX').click(function () {
  $('#playerX').text('X : User');
  playerX = 'user';
});

$('#noviceX').click(function () {
  $('#playerX').text('X : Novice Computer');
  playerX = 'novice';
});

$('#intermediateX').click(function () {
  $('#playerX').text('X : Intermediate Computer');
  playerX = 'intermediate';
});

$('#expertX').click(function () {
  $('#playerX').text('X : Expert Computer');
  playerX = 'expert';
});

$('#userO').click(function () {
  $('#playerO').text('O : User');
  playerO = 'user';
});

$('#noviceO').click(function () {
  $('#playerO').text('O : Novice Computer');
  playerO = 'novice';
});

$('#intermediateO').click(function () {
  $('#playerO').text('O : Intermediate Computer');
  playerO = 'intermediate';
});

$('#expertO').click(function () {
  $('#playerO').text('O : Expert Computer');
  playerO = 'expert';
});

//===============================

$('.player-menu').click(function () {
  //change button disability each time a player is chosen
  buttonAbility();
})

function buttonAbility () {
  //change button disability based on who's playing
  if(playerX && playerO){
    $('#play').removeClass('disabled');
  }

  if(playerX === 'user' || playerO === 'user'){
    $('.loop button').addClass('disabled');
    numberOfGames = 1;
  }else{
    $('.loop button').removeClass('disabled');
  }
}

$('#one').click(function () {
  numberOfGames = 1;
});

$('#five').click(function () {
  numberOfGames = 5;
});

$('#ten').click(function () {
  numberOfGames = 10;
});

//===============================

$('#play').click(function () {
  if(!$('.loop button').hasClass('disabled')){
    $('.loop button').addClass('disabled');
  }
  gameCounter = 0;
  resetGameValues();
  uniqueTableName = '_' + Date.now() + '_' + Math.floor(Math.random() * 100000);
  $.post('/createSessionTable', {tableName : uniqueTableName})
    .done(function () {
      game();
    });
})






