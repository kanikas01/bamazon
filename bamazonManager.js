
// ---------- Imports and global vars ---------- //

require('dotenv').config();
const cTable = require('console.table');
var customer = require('./db_utils.js');
var inquirer = require('inquirer');

var connection = customer.connection;
var showCustomerView = customer.showCustomerView;

var questions = [
  {
    type: 'list',
    name: 'choice',
    message: 'What would you like to do?',
    choices: ['View products for sale', 
              'View low inventory', 
              'Add to inventory',
              'Add new product',
              'Show customer view',
              'Exit']
  }
];

// Connect to DB
connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  // Execute main function
  main();

});

// ---------- Function definitions ---------- //

function main() {
  inquirer.prompt(questions).then(answers => {
    switch (answers.choice) {
      case 'View products for sale':
        viewProductsForSale(main);
        break;
      case 'View low inventory':
        viewLowInventory(main);
        break;
      case 'Add to inventory':
        break;
      case 'Add new product':
        break;
      case 'Show customer view':
        showCustomerView(connection, main);
        break;
      case 'Exit':
        connection.end();
    }
  });
}

function viewProductsForSale(callback) {
  connection.query(`SELECT id,
                      product_name, 
                      department_name, 
                      price,
                      stock_quantity
                    FROM products`, function (error, results, fields) {
    if (error) throw error;
    console.log();
    console.table(results);
    if (callback) {
      callback();
    }
  });
}

function viewLowInventory(callback) {
  connection.query(`SELECT id,
                      product_name AS product, 
                      department_name AS department, 
                      price,
                      stock_quantity AS quantity
                    FROM products
                    WHERE stock_quantity < 5`, function (error, results, fields) {
    if (error) throw error;
    console.log();
    if (results.length === 0) {
      console.log("Inventory is sufficiently stocked.\n");
    }
    else {
      console.table(results);
    }

    if (callback) {
      callback();
    }
  });
}


