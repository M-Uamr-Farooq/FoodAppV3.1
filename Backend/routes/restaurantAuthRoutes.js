const express = require('express');
const router = express.Router();
const restaurantAuthController = require('../controllers/restaurantAuthController');

router.post('/authenticate', restaurantAuthController.authenticate);

module.exports = router;