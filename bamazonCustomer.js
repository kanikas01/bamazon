
// ---------- Imports and global vars ---------- //

require('dotenv').config();
var inquirer = require('inquirer');
var db_utils = require('./db_utils.js');

var connection = db_utils.connection;
var generalQuery = db_utils.generalQuery;
var queryProducts = db_utils.queryProducts;


// Connect to DB
connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  // Query products db, passing makePurchase as callback
  queryProducts(connection, generalQuery, makePurchase);
});


// ---------- Function definitions ---------- //

function makePurchase(connection) {
  var questions = [
    {
      type: 'input',
      name: 'productID',
      message: "Enter the ID for the product would you like to buy:"
    },
    {
      type: 'input',
      name: 'quantity',
      message: "How many would you like?",
    }
  ];

  inquirer.prompt(questions).then(answers => {
    connection.query(`SELECT stock_quantity, price
                      FROM products
                      WHERE id=?`, [answers.productID], function (error, results, fields) {
      if (error) throw error;
      if (results[0].stock_quantity < answers.quantity) {
        console.log("Insufficient quantity!");
      } 
      else {
        var newQuantity = results[0].stock_quantity - answers.quantity;
        console.log('Your total cost is $' + (results[0].price * answers.quantity) + '.');
        connection.query(`UPDATE products
                          SET stock_quantity =?
                          WHERE id=?`, [newQuantity, answers.productID], function (error, results, fields) {
          if (error) throw error;
        });

      }
      inquirer.prompt([
        {
          type: 'confirm',
          name: 'buyAgain',
          message: "Would you like to make another purchase?",
          default: false
        }]).then(answers => {
          if (answers.buyAgain) {
            queryProducts(connection, generalQuery, makePurchase);
          }
          else {
            // queryProducts(connection, generalQuery);
            connection.end();
          }
      });
    });
  });
}
