const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all menu items (for Home page)
router.get('/', (req, res) => {
  db.query('SELECT * FROM menu_items', (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch menu.' });
    res.json(results);
  });
});

// Existing: Get menu for a specific restaurant
router.get('/:restaurantName', (req, res) => {
  const { restaurantName } = req.params;
  db.query('SELECT * FROM menu_items WHERE restaurant_name = ?', [restaurantName], (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to fetch menu.' });
    res.json(results);
  });
});

// Add menu item
router.post('/', (req, res) => {
  const { restaurantName, itemName, price, image } = req.body;
  db.query(
    'INSERT INTO menu_items (restaurant_name, item_name, price, image) VALUES (?, ?, ?, ?)',
    [restaurantName, itemName, price, image],
    (err, result) => {
      if (err) {
        console.error('Add menu item error:', err); // <-- Add this for debugging!
        return res.status(500).json({ message: 'Failed to add item.' });
      }
      res.json({ message: 'Item added!' });
    }
  );
});

// Delete menu item
router.delete('/:itemId', (req, res) => {
  const { itemId } = req.params;
  db.query('DELETE FROM menu_items WHERE id = ?', [itemId], (err, result) => {
    if (err) return res.status(500).json({ message: 'Failed to delete item.' });
    res.json({ message: 'Item deleted successfully.' });
  });
});

module.exports = router;
