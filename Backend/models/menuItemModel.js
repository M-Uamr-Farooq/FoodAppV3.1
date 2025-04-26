const db = require('../config/db');

const MenuItem = {
  create: (restaurantName, itemName, price, image, callback) => {
    const query = 'INSERT INTO menu_items (restaurant_name, item_name, price, image) VALUES (?, ?, ?, ?)';
    db.query(query, [restaurantName, itemName, price, image], callback);
  },

  findByRestaurant: (restaurantName, callback) => {
    const query = 'SELECT * FROM menu_items WHERE restaurant_name = ?';
    db.query(query, [restaurantName], callback);
  },

  findAll: (callback) => {
    const query = 'SELECT * FROM menu_items';
    db.query(query, callback);
  },

  deleteById: (id, callback) => {
    const query = 'DELETE FROM menu_items WHERE id = ?';
    db.query(query, [id], callback);
  },

  // Optional: Edit menu item
  updateById: (id, itemName, price, image, callback) => {
    const query = 'UPDATE menu_items SET item_name = ?, price = ?, image = ? WHERE id = ?';
    db.query(query, [itemName, price, image, id], callback);
  }
};

module.exports = MenuItem;
