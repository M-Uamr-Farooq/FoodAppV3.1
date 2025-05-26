const db = require('../config/db'); // Import your database connection

const Notification = {
  save: (restaurantName, message) => {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO notifications (restaurant_name, message) VALUES (?, ?)';
      db.query(query, [restaurantName, message], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  getByRestaurant: (restaurantName) => {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM notifications WHERE restaurant_name = ? ORDER BY created_at DESC';
      db.query(query, [restaurantName], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  markAsRead: (id) => {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE notifications SET is_read = 1 WHERE id = ?';
      db.query(query, [id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },
};

module.exports = Notification;