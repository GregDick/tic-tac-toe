var path = require('path');
var client = require(path.join(process.cwd(), '/www/lib/postgres'));
var async = require('async');

//==========================CONTROLLER EXPORTS=========================

module.exports.index = function (req, res) {

  client.connect(function(err) {if (true) {};
    if(err) {
      return console.error('could not connect to postgres', err);
    }
    else{console.log('connected')}
  });

  res.render('views/index');
};

module.exports.random = function (req, res) {
  //read board and put in DB
  var board = req.query.board;

  createTable();

  logGameState(board);

  client.query(`SELECT * FROM Test`, function(err, result){
    if(err){
      console.log(err);
    }
    console.log(result.rows);
  });
  //find empty spaces
  var emptySpaces = [];
  board.forEach(function (space, i) {
    if(space === '0'){
      emptySpaces.push(i);
    }
  });
  //choose a random empty space
  var guess = Math.floor(Math.random() * (emptySpaces.length));
  var move = emptySpaces[guess];
  //send the move as JSON
  res.send({move : move});
};

//==========================SQL FUNCTIONS=========================

function createTable () {
  client.query(`DROP TABLE IF EXISTS Test`, function (err) {
    if(err){
      console.log(err);
    }
  });
  client.query(`CREATE TABLE IF NOT EXISTS Test("somethingID" INTEGER NOT NULL PRIMARY KEY,
    "0" INTEGER NOT NULL, "1" INTEGER NOT NULL, "2" INTEGER NOT NULL, "3" INTEGER NOT NULL,
    "4" INTEGER NOT NULL, "5" INTEGER NOT NULL, "6" INTEGER NOT NULL, "7" INTEGER NOT NULL,
    "8" INTEGER NOT NULL)`, function (err) {
    if(err){
      console.log(err);
    }
  });
};

function logGameState (board) {
  var columns = "";
  var values = "0";
  board.forEach(function (space, i) {
    columns += `, "${i}"`;
    values += `,${space}`;
  });
  client.query(`INSERT INTO Test ("somethingID"${columns}) VALUES (${values})`, function(err){
    if(err){
      console.log(err);
    }
  });
};










