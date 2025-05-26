const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Save a new notification
router.post('/notifications', notificationController.saveNotification);

// Get notifications for a specific restaurant
router.get('/notifications/:restaurantName', notificationController.getNotifications);

// Mark a notification as read
router.put('/notifications/:id/read', notificationController.markNotificationAsRead);

module.exports = router;