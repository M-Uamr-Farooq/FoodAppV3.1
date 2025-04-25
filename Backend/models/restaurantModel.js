const db = require('../config/db');

const Restaurant = {
  findByEmailOrName: (email, name, callback) => {
    const query = `SELECT * FROM restaurants WHERE LOWER(name) = LOWER(?) OR LOWER(email) = LOWER(?)`;
    db.query(query, [name, email], callback);
  },

  insert: (name, email, description, hashedPassword, callback) => {
    const query = `INSERT INTO restaurants (name, email, description, password) VALUES (?, ?, ?, ?)`;
    db.query(query, [name, email, description, hashedPassword], callback);
  },

  findByEmail: (email, callback) => {
    const query = `SELECT * FROM restaurants WHERE LOWER(email) = LOWER(?)`;
    db.query(query, [email], callback);
  },

  findByName: (name, callback) => {
    const query = `SELECT name, email, description, image FROM restaurants WHERE LOWER(name) = LOWER(?)`;
    db.query(query, [name], callback);
  },
};

module.exports = Restaurant;
