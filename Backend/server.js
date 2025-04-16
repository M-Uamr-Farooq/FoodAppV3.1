const express = require('express');
const app = express();
const mysql = require('mysql2'); 

const db = mysql.createConnection({
    host: 'localhost',  
    user: 'root',
    password: 'Shani786',
    database: 'foodDB'
})

db.connect((err) => {       
    if (err) throw err;
    console.log('Connected to the database!');
}
);  

// db.query('CREATE DATABASE foodDB', (err , result) =>
// {
//     if(err) throw err;
//     console.log('foodDB Database created!');
// }
// )

  var table = 'CREATE TABLE IF NOT EXISTS foodItems (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), price DECIMAL(10, 2))';
db.query(table, (err, result) => {
    if (err) throw err;
    console.log('foodItems Table created!');


    app.listen(3000, () => {    
        console.log('Server is running on port 3000');
        });
    });