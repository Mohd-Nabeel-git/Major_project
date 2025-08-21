import Notification from '../models/Notification.js';

// Get notifications for a user
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

// Add a new notification
const addNotification = async (req, res) => {
  try {
    const { type, message, link } = req.body;
    const notification = new Notification({
      user: req.user._id,
      type,
      message,
      link
    });
    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add notification' });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

// Clear all notifications for a user
const clearNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user._id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear notifications' });
  }
};

export default {
  getNotifications,
  addNotification,
  markAsRead,
  clearNotifications
};
