
// ---------- Imports and global vars ---------- //

require('dotenv').config();
var chalk = require('chalk');
var fs = require('fs');
var inquirer = require('inquirer');
var keys = require("./keys.js");
var mysql = require('mysql');

var separator = chalk.green;
var field = chalk.yellow;

var db = mysql.createConnection({
  host: keys.mysql_db.host,
  user: keys.mysql_db.username,
  password: keys.mysql_db.password,
  database: keys.mysql_db.database
});

db.connect();

db.query(`SELECT product_name AS product, 
            department_name AS department, 
            price 
          FROM products`, function (error, results, fields) {
  if (error) throw error;

  var product_width = 0;
  var department_width = 0;
  var price_width = 0;

  console.log(results);

  results.forEach(element => {
    if (element.product.length > product_width) { 
      product_width = element.product.length; 
    }
    if (element.department.length > department_width) { 
      department_width = element.department.length; 
    }
    if (String(element.price).length > price_width) { 
      price_width = String(element.price).length; 
    }
  });

  console.log(product_width, department_width, price_width);

  var separator_length = product_width + department_width + price_width + 6;

    console.log(separator('-'.repeat(separator_length)));

    console.log(field(fields[0].name.toUpperCase().padEnd(product_width + 1)), 
      field(fields[1].name.toUpperCase().padEnd(department_width + 1)), 
      field(fields[2].name.toUpperCase().padEnd(price_width + 1)));

    console.log(separator('-'.repeat(separator_length)));

  results.forEach(element => {
    console.log(String(element.product).padEnd(product_width + 1), 
      String(element.department).padEnd(department_width + 1), 
      '$' + String(element.price.toFixed(2)).padStart(price_width + 1));
  });

    console.log(separator('-'.repeat(separator_length)));
});

db.end();
