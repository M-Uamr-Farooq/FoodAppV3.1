const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const db = require('../config/db');

router.get('/:name', restaurantController.getProfile);
router.put('/:name/profile', (req, res) => {
  const { name } = req.params;
  const { name: newName, image } = req.body;
  db.query('UPDATE restaurants SET name = ?, image = ? WHERE name = ?', [newName, image, name], (err, result) => {
    if (err) return res.status(500).json({ message: 'Failed to update profile.' });
    res.json({ message: 'Profile updated.' });
  });
});

router.delete('/:name', (req, res) => {
  const { name } = req.params;
  // First, delete menu items for this restaurant
  db.query('DELETE FROM menu_items WHERE restaurant_name = ?', [name], (err) => {
    if (err) return res.status(500).json({ message: 'Failed to delete menu items.' });
    // Then, delete the restaurant
    db.query('DELETE FROM restaurants WHERE name = ?', [name], (err2) => {
      if (err2) return res.status(500).json({ message: 'Failed to delete restaurant.' });
      res.json({ message: 'Restaurant and its menu items deleted.' });
    });
  });
});

module.exports = router;
