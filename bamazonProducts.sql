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
  VALUES ('broccoli', 'grocery', 1.29, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
  VALUES ('almond milk', 'grocery', 3.50, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
  VALUES ('basketball', 'sporting goods', 25.99, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
  VALUES ('t-shirt', 'clothing', 8.00, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
  VALUES ('ibuprofen', 'pharmacy', 15.74, 20);

--

INSERT INTO products (product_name, department_name, price, stock_quantity) 
  VALUES ('catnip', 'pet supplies', 12.25, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
  VALUES ('coffee', 'grocery', 15.00, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
  VALUES ('dog leash', 'pet supplies', 9.99, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
  VALUES ('unicycle', 'sporting goods', 80, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
  VALUES ('sweater', 'clothing', 45, 20);