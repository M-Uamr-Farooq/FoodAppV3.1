const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// Get all menu items (for Home page)
router.get('/', menuController.getAllMenuItems);

// Get menu items for a specific restaurant
router.get('/:restaurantName', menuController.getMenuByRestaurant);

// ...other routes...
module.exports = router;
