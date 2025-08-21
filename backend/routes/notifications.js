import express from 'express';
import notificationsController from '../controllers/notificationsController.js';
import auth from '../middleware/auth.js';
const router = express.Router();

// Get all notifications for logged-in user
router.get('/', auth, notificationsController.getNotifications);

// Add a new notification
router.post('/', auth, notificationsController.addNotification);

// Mark a notification as read
router.patch('/:id/read', auth, notificationsController.markAsRead);

// Clear all notifications for logged-in user
router.delete('/clear', auth, notificationsController.clearNotifications);

export default router;
