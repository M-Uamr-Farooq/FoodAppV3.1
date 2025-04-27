const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all menu items (for Home.jsx)
router.get('/', (req, res) => {
  db.query('SELECT * FROM menu', (err, results) => {
    if (err) {
      console.error('Error fetching all menu items:', err);
      return res.status(500).json({ message: 'Failed to fetch menu items.' });
    }
    res.json(results);
  });
});

// Get menu for a specific restaurant (for YourRestaurant.jsx)
router.get('/:restaurantName', (req, res) => {
  const restaurantName = decodeURIComponent(req.params.restaurantName);
  db.query('SELECT * FROM menu WHERE restaurant_name = ?', [restaurantName], (err, results) => {
    if (err) {
      console.error(`Error fetching menu for ${restaurantName}:`, err);
      return res.status(500).json({ message: 'Failed to fetch menu for this restaurant.' });
    }
    res.json(results);
  });
});

// Add menu item
router.post('/', (req, res) => {
  const { restaurantName, itemName, price, image } = req.body;
  if (!restaurantName || !itemName || !price || !image) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  db.query(
    'INSERT INTO menu (restaurant_name, item_name, price, image) VALUES (?, ?, ?, ?)',
    [restaurantName, itemName, price, image],
    (err, result) => {
      if (err) {
        console.error('Error adding menu item:', err);
        return res.status(500).json({ message: 'Failed to add menu item.' });
      }
      res.json({ message: 'Menu item added!' });
    }
  );
});

// Remove menu item
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM menu WHERE id = ?', [req.params.id], (err, result) => {
    if (err) {
      console.error('Error removing menu item:', err);
      return res.status(500).json({ message: 'Failed to remove item.' });
    }
    res.json({ message: 'Item removed!' });
  });
});

module.exports = router;
