
// ---------- Imports and global vars ---------- //

require('dotenv').config();
var customer = require('./db_utils.js');
var inquirer = require('inquirer');

var connection = customer.connection;
var generalQuery = customer.generalQuery;
var queryProducts = customer.queryProducts;

// Connect to DB
connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  // Query products db, passing makePurchase as callback
  queryProducts(connection, generalQuery);
  connection.end();
});

