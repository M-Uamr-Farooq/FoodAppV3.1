const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const db = require('../config/db'); // Make sure you have this line if not already

// CREATE order
router.post('/order', async (req, res) => {
  const { buyer_name, address, contact, total, status = 'Placed', restaurantName } = req.body;

  console.log('Received order:', { buyer_name, address, contact, total, status, restaurantName });

  // Validate required fields
  if (!buyer_name || !address || !contact || !total || !restaurantName) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const query = `
      INSERT INTO orders (buyer_name, address, contact, total, status, restaurantName)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.promise().query(query, [
      buyer_name,
      address,
      contact,
      total,
      status,
      restaurantName,
    ]);
    // result.insertId contains the new order's ID
    res.status(201).json({ message: 'Order created successfully.', order_id: result.insertId });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ message: 'Failed to create order.' });
  }
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

// Update order status
router.patch('/orders/:id', orderController.updateOrderStatus);

// Fetch new orders count
router.get('/orders/:restaurantName/new-count', orderController.getNewOrdersCount);

module.exports = router;