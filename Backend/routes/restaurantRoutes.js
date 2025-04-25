const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');

router.get('/:name', restaurantController.getProfile);
router.put('/:name/image', restaurantController.updateProfileImage);

module.exports = router;
