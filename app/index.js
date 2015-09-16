var path = require('path');
var express = require('express');

var routes = require('./routes');

var app = module.exports = express();

if(process.env.NODE_ENV !== 'production'){
  require(path.join(process.cwd(), '/www/lib/secrets'));
}
// require(path.join(process.cwd(), '/www/lib/postgres'));

app.set('views', __dirname);

app.set('view engine', 'jade');

app.use(express.static('www'));

app.use('/', routes);

app.set('port', process.env.PORT || 3000);


startNodeListener();

function startNodeListener() {
  var server = app.listen(app.get('port'), function () {
    var port = server.address().port;
    console.log(`Server listening on port ${port}...`);
  });
};
