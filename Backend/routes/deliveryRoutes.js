const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');

// Save a new delivery
router.post('/deliveries', deliveryController.saveDelivery);

// Get all deliveries for a specific restaurant
router.get('/deliveries/:restaurantName', deliveryController.getDeliveries);

module.exports = router;