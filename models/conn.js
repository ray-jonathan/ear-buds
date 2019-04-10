// require('dotenv').config();
const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;
// first require 'pg-promise'
// call it immediately, which gives us a configured database connector
const pgp = require('pg-promise')({
    query: e => {
    //   console.log('QUERY: ', e.query);
    }  
});
// next, define the connections options
const options = {
    host: 'localhost',
    database: 'earbuds-app'
};

// make a connection to the database specified by the options object
const db = pgp(options);
module.exports = db;