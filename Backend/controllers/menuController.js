const MenuItem = require('../models/menuItemModel');

exports.getMenuByRestaurant = (req, res) => {
  const { restaurantName } = req.params;
  MenuItem.findByRestaurant(restaurantName, (err, items) => {
    if (err) return res.status(500).json({ message: 'Error fetching menu.' });
    res.json(items);
  });
};

exports.addMenuItem = (req, res) => {
  const { restaurantName, itemName, price, image } = req.body;
  if (!restaurantName || !itemName || !price) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }
  MenuItem.create(restaurantName, itemName, price, image, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error adding menu item.' });
    res.status(201).json({ message: 'Menu item added.' });
  });
};

exports.deleteMenuItem = (req, res) => {
  const { id } = req.params;
  MenuItem.deleteById(id, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error deleting menu item.' });
    res.json({ message: 'Menu item deleted.' });
  });
};

// Optional: Edit menu item
exports.editMenuItem = (req, res) => {
  const { id } = req.params;
  const { itemName, price, image } = req.body;
  MenuItem.updateById(id, itemName, price, image, (err, result) => {
    if (err) return res.status(500).json({ message: 'Error updating menu item.' });
    res.json({ message: 'Menu item updated.' });
  });
};
