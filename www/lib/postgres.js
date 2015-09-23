var pg = require('pg');

var client = new pg.Client(process.env.POSTGRES_URL);

module.exports = client;
