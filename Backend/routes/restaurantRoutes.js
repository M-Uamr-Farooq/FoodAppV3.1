const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

router.get('/:name', restaurantController.getProfile);

module.exports = router;
