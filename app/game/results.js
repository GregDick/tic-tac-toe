var path = require('path');

var query = require(path.join(process.cwd(), '/www/lib/query'));

module.exports.start = function (req, res) {
  //make all time table
  createAllTime();
  //render the main page
  res.render('views/index');
};

module.exports.dropAdd = function (req, res) {
  dropResults(function () {
    // only create results if drop is finished
    createResults(function () {
      // query is finished
      console.log('results table created');
      res.end();
    });
  });
}

module.exports.createSessionTable = function (req, res) {
  var tableName = req.body.tableName;
  createUniqueTable(tableName, function () {
    console.log('session table created');
    res.end();
  })
}

module.exports.save = function (req, res) {
  var tableName = req.body.tableName;
  var gameID  = req.body.gameID;
  var winner  = req.body.winner.who * 1;
  //insert data
  logWinner(tableName, gameID, winner, function () {
    //send a quick empty response
    res.end();
  });
}

module.exports.query = function (req, res) {
  var tableName = req.query.tableName;
  console.log('node tableName', tableName);
  // view the results of gameplay
  getWinningPercent(tableName, function (result) {
    result.xPercent = 100 * result.xWins / result.total;
    result.oPercent = 100 * result.oWins / result.total;
    result.tiePercent = 100 * result.ties / result.total;
    dropUniqueTable(tableName);
    res.send(result);
  });
}

module.exports.addToAllTime = function (req, res) {
  // body...
}


//==========================SQL FUNCTIONS=========================

function createResults (cb) {
  var queryText = `CREATE TABLE IF NOT EXISTS "Results"("boardID" VARCHAR(10) NOT NULL PRIMARY KEY,
    "gameID" INTEGER NOT NULL, "winner" INTEGER, "_0" INTEGER NOT NULL, "_1" INTEGER NOT NULL,
    "_2" INTEGER NOT NULL, "_3" INTEGER NOT NULL, "_4" INTEGER NOT NULL, "_5" INTEGER NOT NULL,
    "_6" INTEGER NOT NULL, "_7" INTEGER NOT NULL, "_8" INTEGER NOT NULL)`;

  query(queryText, null, function (err, rows, result) {
    if(err){
      console.log('create results error', err);
    }else{
      cb();
    }
  });
};

function createUniqueTable (tableName, cb) {
  var queryText = `CREATE TABLE IF NOT EXISTS "${tableName}"("gameID" INTEGER NOT NULL PRIMARY KEY,
    "winner" INTEGER NOT NULL)`;

  query(queryText, null, function (err, rows, result) {
    if(err){
      console.log('create unique error', err);
    }else{
      cb();
    }
  });
}

function dropResults (cb) {
  var queryText = `DROP TABLE IF EXISTS "Results"`;

  query(queryText, null, function (err, rows, result) {
    if(err){
      console.log('drop results error', err);
    }else{
      console.log('results table dropped');
      cb();
    }
  });
}

function dropUniqueTable (tableName) {
  var queryText = `DROP TABLE IF EXISTS "${tableName}"`;

  query(queryText, null, function (err, rows, result) {
    if(err){
      console.log('drop unique error', err);
    }else{
      console.log('unique table dropped');
    }
  });
}

function createAllTime () {
  var queryText = `CREATE TABLE IF NOT EXISTS "AllTime"("boardID" VARCHAR(10) NOT NULL PRIMARY KEY,
    "gameID" INTEGER NOT NULL, "winner" INTEGER, "playerX" VARCHAR(20) NOT NULL, "playerO" VARCHAR(20) NOT NULL)`;

  query(queryText, null, function (err, rows, result) {
    if(err){
      console.log('create all time error', err);
    }
  });
}

function logGameState (board, boardID, gameID, winner, cb) {
  var columns = "";
  board.forEach(function (space, i) {
    columns += `, _${i}`;
  });
  //if winner is undefined, set to null
  winner = winner ? winner.who : null;
  //creates unique primary key based on gameID and board ID
  var unique = '"_' + gameID + '-' + boardID + '"';
  //concatenates all the values into an array for the parameterized query
  var queryValues = [unique, gameID, winner].concat(board);

  var queryText = `INSERT INTO "Results"("boardID", "gameID", "winner"${columns}) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);`;

  query(queryText, queryValues, function (err, rows, result) {
    if(err){
      console.log('results insert error', err);
    }else{
      cb();
    }
  });
};

function logWinner (tableName, gameID, winner, cb) {
  var queryText = `INSERT INTO "${tableName}"("gameID", "winner") VALUES($1, $2)`;
  var queryValues = [gameID, winner];

  query(queryText, queryValues, function (err, rows, result) {
    if(err){
      console.log('session insert error', err);
    }else{
      cb();
    }
  });
}

function getWinningPercent (tableName, cb) {
  var queryText = `SELECT (SELECT COUNT("winner") FROM "${tableName}" WHERE "winner"=$1) AS "xWins",
    (SELECT COUNT("winner") FROM "${tableName}" WHERE "winner"=$2) AS "oWins",
    (SELECT COUNT("winner") FROM "${tableName}" WHERE "winner"=$3) AS "ties",
    (SELECT COUNT(*) FROM "${tableName}") AS "total"`;
  var queryValues = [1, -1, 0];

  query(queryText, queryValues, function (err, rows, result) {
    if(err){
      console.log('winning percentage of session error', err);
    }else{
      cb(rows[0]);
    }
  })
}
















