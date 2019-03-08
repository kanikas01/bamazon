
// ---------- Imports and global vars ---------- //

require('dotenv').config();
const cTable = require('console.table');
var inquirer = require('inquirer');
var db_utils = require('./db_utils.js');
var connection = db_utils.connection;
var getProductTableInfo = db_utils.getProductTableInfo;
var showCustomerView = db_utils.showCustomerView;

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

  inquirer.prompt(questions).then(answers => {
    switch (answers.choice) {
      case 'View products for sale':
        viewProductsForSale(main);
        break;
      case 'View low inventory':
        viewLowInventory(main);
        break;
      case 'Add to inventory':
        addToInventory(main);
        break;
      case 'Add new product':
        addNewProduct(main);
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


async function addToInventory(callback) {
  var questions = [
    {
      type: 'input',
      name: 'id',
      message: "Product ID: ",
    },
    {
      type: 'input',
      name: 'quantity',
      message: "Quantity to add: ",
    }
  ];

  inquirer.prompt(questions).then(answers => {
    console.log(answers);
    connection.query(`SELECT id,
                      product_name, 
                      department_name, 
                      price,
                      stock_quantity
                    FROM products`, function (error, results, fields) {
                      
        if (error) throw error;
        if (callback) {
          callback();
        }
      });
  });
}

function addNewProduct(callback) {
  var questions = [
    {
      type: 'input',
      name: 'name',
      message: "Product name: ",
    },
    {
      type: 'input',
      name: 'department',
      message: "Product department: ",
    },
    {
      type: 'input',
      name: 'price',
      message: "Product price: ",
    },
    {
      type: 'input',
      name: 'quantity',
      message: "Initial quantity: ",
    }
  ];

  // display all current products
  // prompt for product name
  // prompt for product department
  // prompt for product price
  // prompt for product quantity

  // execute UPDATE query

  if (callback) {
    callback();
  }
}
