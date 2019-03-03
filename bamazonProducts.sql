DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
  id INT AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(255),
  department_name VARCHAR(255),
  price DECIMAL(10, 2),
  stock_quantity INT,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
  VALUES ('broccoli', 'grocery', 1.29, 20),
         ('almond milk', 'grocery', 3.50, 20),
         ('basketball', 'sporting goods', 25.99, 20),
         ('t-shirt', 'clothing', 8.00, 20),
         ('ibuprofen', 'pharmacy', 15.74, 20),
         ('catnip', 'pet supplies', 12.25, 20),
         ('coffee', 'grocery', 15.00, 20),
         ('dog leash', 'pet supplies', 9.99, 20),
         ('unicycle', 'sporting goods', 80, 20),
         ('sweater', 'clothing', 45, 20);