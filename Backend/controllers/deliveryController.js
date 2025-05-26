const Delivery = require('../models/Delivery');

exports.saveDelivery = async (req, res) => {
  const { orderId, deliveryPerson, deliveryTime, status } = req.body;

  if (!orderId || !deliveryPerson || !deliveryTime) {
    return res.status(400).json({ error: 'Order ID, delivery person, and delivery time are required.' });
  }

  try {
    await Delivery.save(orderId, deliveryPerson, deliveryTime, status || 'Pending');
    res.status(201).json({ message: 'Delivery saved successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save delivery.' });
  }
};

exports.getDeliveries = async (req, res) => {
  const { restaurantName } = req.params;

  if (!restaurantName) {
    return res.status(400).json({ error: 'Restaurant name is required.' });
  }

  try {
    const deliveries = await Delivery.getAllByRestaurant(restaurantName);
    res.status(200).json(deliveries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch deliveries.' });
  }
};