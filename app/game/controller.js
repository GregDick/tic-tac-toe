var path = require('path');
var client = require(path.join(process.cwd(), '/www/lib/postgres'));

//==========================CONTROLLER EXPORTS=========================

module.exports.index = function (req, res) {
  //make connection to client
  //close connection somewhere???
  client.connect(function(err) {
    if(err) {
      return console.error('could not connect to postgres', err);
    }
    else{
      console.log('connected');
    }
  });
  //make table
  createTable();
  //render the main page
  res.render('views/index');
};

module.exports.random = function (req, res) {
  //read board and put in DB
  var board = req.query.board;
  var move  = makeRandomMove(board);
  //send the move as JSON
  res.send({move : move});
};

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

module.exports.results = function (req, res) {
  // view the results of gameplay
  client.query(`SELECT * FROM "Random"`, function(err, result){
    if(err){
      console.log(err);
    }
    res.send({data : result.rows});
  });
}

//==========================SQL FUNCTIONS=========================

function createTable () {
  client.query(`DROP TABLE IF EXISTS "Random"`, function (err) {
    if(err){
      console.log(err);
    }else{
      console.log('dropped table');
    }
  });
  client.query(`CREATE TABLE IF NOT EXISTS "Random"("boardID" VARCHAR(10) NOT NULL PRIMARY KEY,
    "gameID" INTEGER NOT NULL, "winner" INTEGER, "_0" INTEGER NOT NULL, "_1" INTEGER NOT NULL,
    "_2" INTEGER NOT NULL, "_3" INTEGER NOT NULL, "_4" INTEGER NOT NULL, "_5" INTEGER NOT NULL,
    "_6" INTEGER NOT NULL, "_7" INTEGER NOT NULL, "_8" INTEGER NOT NULL)`,
    function (err) {
      if(err){
        console.log(err);
      }else{
        console.log('table created');
      }
  });
};

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

  var queryString = `INSERT INTO "Random"("boardID", "gameID", "winner"${columns}) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);`;

  client.query(queryString, values, function(err){
    if(err){
      console.log(err);
    }
  });
};


//==========================PLAYER FUNCTIONS=========================

function makeRandomMove (board) {
  //find empty spaces
  var emptySpaces = [];
  board.forEach(function (space, i) {
    if(space === '0'){
      emptySpaces.push(i);
    }
  });
  //choose a random empty space
  var guess = Math.floor(Math.random() * (emptySpaces.length));
  return emptySpaces[guess];
}






