import express from 'express'
import notificationController from '../controllers/notificationsController.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// 📌 Get all notifications for logged-in user
router.get('/', auth, notificationController.getNotifications)

// 📌 Add a new notification
router.post('/', auth, notificationController.addNotification)

// 📌 Mark a notification as read
router.patch('/:id/read', auth, notificationController.markAsRead)

// 📌 Mark all notifications as read
router.patch('/mark-all-read', auth, notificationController.markAllAsRead)

// 📌 Clear all notifications for logged-in user
router.delete('/clear', auth, notificationController.clearNotifications)

export default router
