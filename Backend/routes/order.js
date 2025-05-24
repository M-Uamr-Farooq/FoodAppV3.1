const express = require('express');
const router = express.Router();
const db = require('../config/db');

// CREATE order
router.post('/order', (req, res) => {
  const { buyer_name, address, contact, total, items, restaurantName } = req.body;
  db.query(
    'INSERT INTO orders (buyer_name, address, contact, total, items, restaurantName) VALUES (?, ?, ?, ?, ?, ?)',
    [buyer_name, address, contact, total, JSON.stringify(items), restaurantName],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to save order.' });
      }
      res.json({ message: 'Order received!', id: result.insertId });
    }
  );
});

// READ orders for a restaurant (example: by buyer_email or all)
router.get('/orders', (req, res) => {
  db.query(
    'SELECT * FROM orders ORDER BY created_at DESC',
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Error fetching orders' });
      res.json(results);
    }
  );
});

// READ orders by restaurant name
router.get('/orders/:restaurantName', (req, res) => {
  const restaurantName = req.params.restaurantName;
  db.query(
    'SELECT * FROM orders WHERE restaurantName = ? ORDER BY created_at DESC',
    [restaurantName],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Error fetching orders' });
      // If you store items as JSON string, parse them:
      results.forEach(order => {
        if (order.items) {
          try { order.items = JSON.parse(order.items); } catch {}
        }
      });
      res.json(results);
    }
  );
});

// DELETE order by ID
router.delete('/orders/:id', (req, res) => {
  const orderId = req.params.id;
  db.query('DELETE FROM orders WHERE id = ?', [orderId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Failed to delete order.' });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Order not found.' });
    res.json({ message: 'Order deleted.' });
  });
});

module.exports = router;