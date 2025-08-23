// controllers/notificationController.js
import Notification from '../models/Notification.js'

// 📌 Get all notifications for logged-in user
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
    res.json(notifications)
  } catch (err) {
    console.error("❌ getNotifications error:", err)
    res.status(500).json({ error: 'Failed to fetch notifications' })
  }
}

// 📌 Add a new notification (can be called from other controllers)
const addNotification = async (req, res) => {
  try {
    const { user, type, message, link } = req.body
    if (!user || !type || !message) {
      return res.status(400).json({ error: "user, type, and message are required" })
    }

    const notification = new Notification({
      user,
      type,
      message,
      link
    })

    await notification.save()
    res.status(201).json(notification)
  } catch (err) {
    console.error("❌ addNotification error:", err)
    res.status(500).json({ error: 'Failed to add notification' })
  }
}

// 📌 Mark one notification as read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { new: true }
    )
    if (!notification) return res.status(404).json({ error: "Notification not found" })
    res.json(notification)
  } catch (err) {
    console.error("❌ markAsRead error:", err)
    res.status(500).json({ error: 'Failed to mark notification as read' })
  }
}

// 📌 Mark all as read
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { $set: { read: true } }
    )
    res.json({ success: true })
  } catch (err) {
    console.error("❌ markAllAsRead error:", err)
    res.status(500).json({ error: 'Failed to mark all notifications as read' })
  }
}

// 📌 Clear all notifications for logged-in user
const clearNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user._id })
    res.json({ success: true })
  } catch (err) {
    console.error("❌ clearNotifications error:", err)
    res.status(500).json({ error: 'Failed to clear notifications' })
  }
}

export default {
  getNotifications,
  addNotification,
  markAsRead,
  markAllAsRead,
  clearNotifications
}
