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
  //make all time table
  createAllTime();
  //make results table
  createResults();
  //render the main page
  res.render('views/index');
};



//==========================SQL FUNCTIONS=========================

function createResults () {
  client.query(`DROP TABLE IF EXISTS "Results"`, function (err) {
    if(err){
      console.log(err);
    }else{
      console.log('dropped table');
    }
  });
  client.query(`CREATE TABLE IF NOT EXISTS "Results"("boardID" VARCHAR(10) NOT NULL PRIMARY KEY,
    "gameID" INTEGER NOT NULL, "winner" INTEGER, "_0" INTEGER NOT NULL, "_1" INTEGER NOT NULL,
    "_2" INTEGER NOT NULL, "_3" INTEGER NOT NULL, "_4" INTEGER NOT NULL, "_5" INTEGER NOT NULL,
    "_6" INTEGER NOT NULL, "_7" INTEGER NOT NULL, "_8" INTEGER NOT NULL)`,
    function (err) {
      if(err){
        console.log(err);
      }else{
        console.log('results table created');
      }
  });
};

function createAllTime () {
  var tableString = `CREATE TABLE IF NOT EXISTS "AllTime"("boardID" VARCHAR(10) NOT NULL PRIMARY KEY,
    "gameID" INTEGER NOT NULL, "winner" INTEGER, "playerX" VARCHAR(20) NOT NULL, "playerO" VARCHAR(20) NOT NULL)`;
  client.query(tableString,
    function (err) {
      if(err){
        console.log(err);
      }
  });
}






