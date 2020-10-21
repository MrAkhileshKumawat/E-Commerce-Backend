# E-Commerce-Backend

In this project, I have made a backend of an e-commerce website using Express framework of NodeJS. I have also used JWT-authentication token to verify the if the customer is valid or not. We are already given the mysql-database in which there are different tables and their data. We've to write different queries for different endpoints to make them working.



## Install important tools using command :
  * `sudo apt-get install git`
  * `sudo apt-get install nodejs`

Clone this app using the command:
  * `git clone https://github.com/MrAkhileshKumawat/E-Commerce-Backend.git`

## Instructions of usage:

## How to run the Project?

1. `cd e-commerce_backend/`
2. `npm install` to install the dependencies
3. Create a .env file in the root directory of the project and update the required variables. You can use `sample.env` as the skeleton.
4. `npm start` to run the server. The server will run with auto reloading using nodemon.

*Note: Check `Import Schema` section under `Important Commands` to see how to import the tshirt.sql file into your DB.*

## Important Commands

### Export Schema of DB
`mysqldump -u root -p --no-data e_commerce > schema.sql`

### Import Schema
`mysql -u username -p e_commerce < sqlScript/tshirt.sql`

### Run server with Auto Reload
`npm start`


*This needs to be run from the root of the project.*

Make sure to re-start the server after doing adding product,customer because the product features loads all the products and customer in memory to load the customer or product. If you don't restart the server, then it will keep on products or customer from the old dtabase memory.