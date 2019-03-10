
// ---------- Imports and global vars ---------- //

require('dotenv').config();
var chalk = require('chalk');
var mysql = require('mysql');
var separatorChar = '-';
var separatorColor = chalk.green;
var fieldColor = chalk.yellow;

// Creates the DB connection object
var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

/* Provides a general query with results displayed in a customer-friendly fashion
Accepts optional callback function to run after query is complete. */
function showCustomerView(connection, callback) {
  // Execute query
  connection.query(`SELECT id,
                      product_name AS product, 
                      department_name AS department, 
                      price,
                      stock_quantity AS quantity
                    FROM products`, function (error, results, fields) {
    if (error) throw error;

    // Set column widths
    var idWidth = 5;
    var productWidth = 16;
    var departmentWidth = 16;
    var priceWidth = 7;
    var quantityWidth = 12;

    // Set table width based on combined widths of columns
    var tableWidth = idWidth +
                     productWidth +
                     departmentWidth +
                     priceWidth +
                     quantityWidth +
                     (fields.length * 2);

    // Create horizontal rule for table display
    var horizontalRule = separatorColor(separatorChar.repeat(tableWidth))
    
    console.log();
    console.log(horizontalRule);

    // Display column names
    console.log(fieldColor(fields[0].name.toUpperCase().padEnd(idWidth + 3),
                           fields[1].name.toUpperCase().padEnd(productWidth + 1),
                           fields[2].name.toUpperCase().padEnd(departmentWidth + 1),
                           fields[3].name.toUpperCase().padEnd(priceWidth + 5),
                           fields[4].name.toUpperCase().padEnd(quantityWidth + 1)));

    console.log(horizontalRule);

    // Display query results (numeric types must be cast as strings)
    results.forEach(element => { 
      console.log(String(element.id).padEnd(idWidth + 3),
                         element.product.padEnd(productWidth + 1),
                         element.department.padEnd(departmentWidth + 1),
           '$ ' + String(element.price.toFixed(2)).padEnd(priceWidth + 3),
                  String(element.quantity).padEnd(quantityWidth + 1));
    });

    console.log(horizontalRule, '\n');

    if (callback) {
      callback(connection);
    }

  });
}

// Get all products, ids and departments from the `products` table
function getProductTableInfo(myObj) {
  connection.query(`SELECT * FROM products`, function (error, results, fields) {
    if (error) throw error;
    myObj.numProducts = results.length;
    myObj.departments = [];
    myObj.productIDs = [];
    myObj.productNames = [];
    results.forEach(element => {
      if (!myObj.departments.includes(element.department_name)) {
        myObj.departments.push(element.department_name);
      }
      if (!myObj.productIDs.includes(element.id)) {
        myObj.productIDs.push(String(element.id));
      }
      if (!myObj.productNames.includes(element.product_name)) {
        myObj.productNames.push(String(element.product_name));
      }
      myObj.departments.sort();
    });
  });
}

module.exports = { connection, showCustomerView, getProductTableInfo };


