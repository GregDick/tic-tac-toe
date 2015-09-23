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



//==========================SQL FUNCTIONS=========================

function createTable () {
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
        console.log('table created');
      }
  });
};







