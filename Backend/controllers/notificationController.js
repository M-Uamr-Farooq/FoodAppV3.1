const Notification = require('../models/Notification');

exports.saveNotification = async (req, res) => {
  const { restaurantName, message } = req.body;

  if (!restaurantName || !message) {
    return res.status(400).json({ error: 'Restaurant name and message are required.' });
  }

  try {
    await Notification.save(restaurantName, message);
    res.status(201).json({ message: 'Notification saved successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save notification.' });
  }
};

exports.getNotifications = async (req, res) => {
  const { restaurantName } = req.params;

  if (!restaurantName) {
    return res.status(400).json({ error: 'Restaurant name is required.' });
  }

  try {
    const notifications = await Notification.getByRestaurant(restaurantName);
    res.status(200).json(notifications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch notifications.' });
  }
};

exports.markNotificationAsRead = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Notification ID is required.' });
  }

  try {
    await Notification.markAsRead(id);
    res.status(200).json({ message: 'Notification marked as read.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to mark notification as read.' });
  }
};