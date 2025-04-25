const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

router.get('/:restaurantName', menuController.getMenuByRestaurant);
router.post('/', menuController.addMenuItem);
router.delete('/:id', menuController.deleteMenuItem);
// Optional: Edit menu item
router.put('/:id', menuController.editMenuItem);

module.exports = router;
