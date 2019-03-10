# Bamazon

Bamazon is a series of node-based command line apps which simulate basic online shopping and product management. Here is a brief [video walkthrough](https://drive.google.com/open?id=1pSZMg7Mwo0A68AdOlvvK0r5cbLzmIxdu) describing its use. The main functionality is coded in JavaScript, and product table is stored in a MySQL database. 

Bamazon consists of two separate apps:

+ **bamazonCustomer.js** - the customer interface, allowing a customer to view and purchase available products

+ **bamazonManager.js** - the manager interface, allowing a manager to view and add to stock on hand, as well as add new products for purchase

Basic usage is as follows:

*Use the customer interface (for shopping)*  
`node bamazonCustomer.js`

*Use the manager interface (for managing inventory)*  
`node bamazonManager.js`
