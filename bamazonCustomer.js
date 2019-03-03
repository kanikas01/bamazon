
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

// Put user through purchase path
setTimeout(makePurchase, 50, db);


// ---------- Function definitions ---------- //

function queryProducts(connection) {
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
                  String(element.quantity).padEnd(quantityWidth + 1),);
    });

    console.log(horizontalRule);
  });
}

function makePurchase(connection) {
  var questions = [
    {
      type: 'input',
      name: 'product_id',
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
                      WHERE id=?`, [answers.product_id], function (error, results, fields) {
      if (error) throw error;
      if(results[0].stock_quantity < answers.quantity) {
        console.log("Insufficient quantity!");
      } 
      else {
        var newQuantity = results[0].stock_quantity - answers.quantity;
        console.log('Your total cost is $' + (results[0].price * answers.quantity) + '.');
        connection.query(`UPDATE products
                          SET stock_quantity =?
                          WHERE id=?`, [newQuantity, answers.product_id], function (error, results, fields) {
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
            queryProducts(db);
            setTimeout(makePurchase, 50, db);
          }
          else {
            connection.end();
          }
      });
    });
  });
}


