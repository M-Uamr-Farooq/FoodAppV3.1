const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

router.post('/register', restaurantController.register);

module.exports = router;
