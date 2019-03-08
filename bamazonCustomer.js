
// ---------- Imports and global vars ---------- //

require('dotenv').config();
var inquirer = require('inquirer');
var db_utils = require('./db_utils.js');
var connection = db_utils.connection;
var getProductTableInfo = db_utils.getProductTableInfo;
var showCustomerView = db_utils.showCustomerView;
var productTableInfo = {};

// Connect to DB
connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  // Add number of products to productTableInfo
  getProductTableInfo(productTableInfo);

  // Query products db, passing makePurchase as callback
  showCustomerView(connection, makePurchase);
});


// ---------- Function definitions ---------- //

function makePurchase(connection) {
  // Define questions
  var questions = [
    {
      type: 'input',
      name: 'productID',
      message: "Enter the ID for the product would you like to buy, or type '0' to exit:",
      validate: function(value) {
        if (value === '0') {
          connection.end();
          process.exit();
        }
        if (!(productTableInfo.productIDs.includes(value)) || !(/\d+/.exec(value))) {
          return 'Error! Please enter a valid product ID.';
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'quantity',
      message: "How many would you like?",
      validate: function (value) {
        if (!(/^\d+$/.exec(value))) {
          return 'Error! Please enter a valid quantity.';
        }
        return true;
      }
    }
  ];

  // Query user for purchase info, then update DB with new quantity
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
        console.log('Your total cost is $' + (results[0].price * answers.quantity).toFixed(2) + '.');
        connection.query(`UPDATE products
                          SET stock_quantity =?
                          WHERE id=?`, [newQuantity, answers.productID], function (error, results, fields) {
          if (error) throw error;
        });
      }

      // Ask user if they would like to make another purchase
      inquirer.prompt([
        {
          type: 'confirm',
          name: 'buyAgain',
          message: "Would you like to make another purchase?",
          default: false
        }]).then(answers => {
          if (answers.buyAgain) {
            showCustomerView(connection, makePurchase);
          }
          else {
            connection.end();
            process.exit();
          }
      });
    });
  });
}
