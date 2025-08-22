import User from '../models/User.js'
import Notification from '../models/Notification.js';

export async function getUser(req, res) {
  const user = await User.findById(req.params.id).select('-password')
  if (!user) return res.status(404).json({ message: 'Not found' })

  // Notify user (this seems odd for just viewing, but leaving as is from your code)
  await Notification.create({
    user: req.user._id,
    type: 'profile',
    message: 'Your profile was updated.',
    link: `/profile/${req.user._id}`
  });
  res.json(user)
}

export async function updateUser(req, res) {
  if (req.user._id !== req.params.id) return res.status(403).json({ message: 'Forbidden' })
  const allowed = ['name','bio','profilePic','banner','experience','education','skills']
  const update = {}
  for (const k of allowed) if (k in req.body) update[k] = req.body[k]
  const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select('-password')
  res.json(user)
}


// 🆕 NEW: get all users (for chat list)
export async function getAllUsers(req, res) {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select('-password')
    res.json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

