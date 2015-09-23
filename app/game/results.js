var path = require('path');
var client = require(path.join(process.cwd(), '/www/lib/postgres'));

module.exports.save = function (req, res) {
  var board   = req.body.board;
  var boardID = req.body.boardID;
  var gameID  = req.body.gameID;
  var winner  = req.body.winner;
  //insert data
  logGameState(board, boardID, gameID, winner);
  //send a quick empty response
  res.end();
}

module.exports.query = function (req, res) {
  // view the results of gameplay
  getWinningPercent(function (result) {
    result.xPercent = 100 * result.xWins / result.total;
    result.oPercent = 100 * result.oWins / result.total;
    result.tiePercent = 100 * result.ties / result.total;
    res.send(result);
  });
}

//==========================SQL FUNCTIONS=========================

function logGameState (board, boardID, gameID, winner) {
  var columns = "";
  board.forEach(function (space, i) {
    columns += `, _${i}`;
  });
  //if winner is undefined, set to null
  winner = winner ? winner.who : null;
  //creates unique primary key based on gameID and board ID
  var unique = '"_' + gameID + '-' + boardID + '"';
  //concatenates all the values into an array for the parameterized query
  var values = [unique, gameID, winner].concat(board);

  var queryString = `INSERT INTO "Results"("boardID", "gameID", "winner"${columns}) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);`;

  client.query(queryString, values, function(err){
    if(err){
      console.log(err);
    }
  });
};

function getWinningPercent (cb) {
  var selectString = `SELECT (SELECT COUNT("winner") FROM "Results" WHERE "winner"=$1) AS "xWins",
    (SELECT COUNT("winner") FROM "Results" WHERE "winner"=$2) AS "oWins",
    (SELECT COUNT("winner") FROM "Results" WHERE "winner"=$3) AS "ties",
    (SELECT COUNT("winner") FROM "Results" WHERE "winner" IS NOT NULL) AS "total"`;
  client.query(selectString, [1, -1, 0], function (err, result) {
    if(err){
      console.log(err);
    }else{
      cb(result.rows[0]);
    }
  });
}

function getAll () {
  var queryString = `SELECT * FROM "Results" WHERE "winner" = $1`;
  client.query(queryString, [1], function(err, result){
    if(err){
      console.log(err);
    }
    console.log(result.rows);
  });
}
