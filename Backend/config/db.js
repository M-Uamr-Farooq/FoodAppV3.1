const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Shani786',
  database: 'foodDB',
});

db.connect((err) => {
  if (err) throw err;
  console.log('✅ Connected to MySQL');
});

module.exports = db;
