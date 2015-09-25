var pg = require('pg');

module.exports = function(queryText, queryValues, cb) {
  pg.connect(process.env.POSTGRES_URL, function(err, client, release) {
    //connection failure
    //we don't need to release anything
    //because we were never handed a client in this case
    if(err){
      return cb(err);
    }

    client.query(queryText, queryValues, function(err, result) {
      //always release the client
      release();

      if(err) return cb(err);

      return cb(null, result.rows, result);
    });
  });
};
