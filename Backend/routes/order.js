const express = require('express');
const router = express.Router();
const db = require('../config/db');

let orders = []; // In production, use a database!

router.post('/order', (req, res) => {
  const order = req.body;
  orders.push(order);
  res.json({ message: 'Order received!' });
});

// Endpoint for restaurant to fetch their orders
router.get('/orders/:restaurantName', (req, res) => {
  const { restaurantName } = req.params;
  const restaurantOrders = orders.filter(
    o => o.restaurantName === restaurantName
  );
  res.json(restaurantOrders);
});

// DELETE order by ID
router.delete('/orders/:id', (req, res) => {
  const orderId = req.params.id;
  db.query('DELETE FROM orders WHERE id = ?', [orderId], (err, result) => {
    if (err) {
      console.error('Error deleting order:', err);
      return res.status(500).json({ message: 'Failed to delete order.' });
    }
    res.json({ message: 'Order deleted.' });
  });
});

module.exports = router;