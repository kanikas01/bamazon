
// ---------- Imports and global vars ---------- //

require('dotenv').config();
const cTable = require('console.table');
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

  // Execute main function
  main();

});

// ---------- Function definitions ---------- //

function main() {
  // getProductTableInfo(productTableInfo);
  getProductTableInfo(productTableInfo);

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

function addToInventory(callback) {
  // Define questions
  var questions = [
    {
      type: 'input',
      name: 'id',
      message: "Product ID: ",
      validate: function (value) {
        if (value === '0') {
          connection.end();
          process.exit();
        }
        if (!(productTableInfo.productIDs.includes(value)) || !(/^\d+$/.exec(value))) {
          return 'Error! Please enter a valid product ID.';
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'quantity',
      message: "Quantity to add: ",
      validate: function(value) {
        if (!(/^\d+$/.exec(value))) {
          return 'Error! Please enter a valid quantity.';
        }
        return true;
      }
    }
  ];

  // Prompt user for info
  inquirer.prompt(questions).then(answers => {
    // Check current stock and calculate new stock_quantity
    connection.query(`SELECT stock_quantity
                      FROM products
                      WHERE id=?`, [answers.id], function (error, results, fields) {
      if (error) throw error;
      var newQuantity = Number(answers.quantity) + parseInt(Number(results[0].stock_quantity));
  
      // Update products table with new stock_quantity
      connection.query(`UPDATE products
                        SET stock_quantity =?
                        WHERE id=?`,
                        [newQuantity, answers.id], function (error, results, fields) {
        if (error) throw error;
        
        // Alert user that stock_quantity has been updated 
        console.log();
        console.log('Quantity is now ' + newQuantity + '.\n')

        if (callback) {
          callback();
        }
      });
    });
  });
}

function addNewProduct(callback) {
  // Define questions
  var questions = [
    {
      type: 'input',
      name: 'name',
      message: "Product name: "
    },
    {
      type: 'list',
      name: 'department',
      message: "Product department: ",
      choices: productTableInfo.departments
    },
    {
      type: 'input',
      name: 'price',
      message: "Product price: "
    },
    {
      type: 'input',
      name: 'quantity',
      message: "Initial quantity: "
    }
  ];

  inquirer.prompt(questions).then(answers => {
    // execute UPDATE query
    console.log(answers);
    if (callback) {
      callback();
    }
  });
}
