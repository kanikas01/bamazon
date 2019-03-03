
// ---------- Imports and global vars ---------- //

require('dotenv').config();
var chalk = require('chalk');
var fs = require('fs');
var inquirer = require('inquirer');
var keys = require("./keys.js");
var mysql = require('mysql');
var separatorChar = '-';
var separatorColor = chalk.green;
var fieldColor = chalk.yellow;

// Create connection object
var db = mysql.createConnection({
  host: keys.mysql_db.host,
  user: keys.mysql_db.username,
  password: keys.mysql_db.password,
  database: keys.mysql_db.database
});

// Connect to DB
db.connect();

// Query 'product' table
queryProducts(db);

// Close DB connection
db.end();


// ---------- Function definitions ---------- //

function queryProducts(connection) {
  // Execute query
  connection.query(`SELECT id,
                      product_name AS product, 
                      department_name AS department, 
                      price 
                    FROM products`, function (error, results, fields) {
    if (error) throw error;

    var idWidth = 0;
    var productWidth = 0;
    var departmentWidth = 0;
    var priceWidth = 0;

    // Set width of each column based on the entry that has the most chars
    results.forEach(element => {
      if (element.id.length > idWidth) {
        idWidth = element.id.length;
      }
      if (element.product.length > productWidth) { 
        productWidth = element.product.length; 
      }
      if (element.department.length > departmentWidth) { 
        departmentWidth = element.department.length; 
      }
      if (String(element.price).length > priceWidth) { 
        priceWidth = String(element.price).length; 
      }
    });

    // Set table width based on combined widths of columns
    var tableWidth = idWidth +
                     productWidth + 
                     departmentWidth + 
                     priceWidth + 
                     (fields.length * 2) + 2;

    // Set horizontal rule
    var horizontalRule = separatorColor(separatorChar.repeat(tableWidth))

    console.log(horizontalRule);

    // Display column names
    console.log(fieldColor(fields[0].name.toUpperCase().padEnd(idWidth + 3), 
                           fields[1].name.toUpperCase().padEnd(productWidth + 1), 
                           fields[2].name.toUpperCase().padEnd(departmentWidth + 1),
                           fields[3].name.toUpperCase().padEnd(priceWidth + 1),));

    console.log(horizontalRule);

    // Display query results
    results.forEach(element => {
      console.log(String(element.id).padEnd(idWidth + 3),
                  String(element.product).padEnd(productWidth + 1), 
                  String(element.department).padEnd(departmentWidth + 1), 
            '$' + String(element.price.toFixed(2)).padStart(priceWidth + 1));
    });

    console.log(horizontalRule);
  });
}


