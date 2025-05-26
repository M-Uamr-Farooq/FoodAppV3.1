const db = require('../config/db'); // Import your database connection

const Delivery = {
  save: (orderId, deliveryPerson, deliveryTime, status) => {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO delivery (order_id, delivery_person, delivery_time, status)
        VALUES (?, ?, ?, ?)
      `;
      db.query(query, [orderId, deliveryPerson, deliveryTime, status], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  getAllByRestaurant: (restaurantName) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT d.*, o.buyer_name, o.address, o.contact, o.total
        FROM delivery d
        JOIN orders o ON d.order_id = o.id
        WHERE o.restaurantName = ?
        ORDER BY d.delivery_time DESC
      `;
      db.query(query, [restaurantName], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },
};

module.exports = Delivery;