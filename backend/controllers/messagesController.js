import Message from '../models/Message.js'
import Notification from '../models/Notification.js'

export async function sendMessage(req,res){
  const { senderId, receiverId, content } = req.body
  if(req.user._id !== senderId) return res.status(403).json({message:'Forbidden'})
  const msg = await Message.create({ senderId, receiverId, content })
  // Notify receiver
  await Notification.create({
    user: receiverId,
    type: 'message',
    message: `New message from ${req.user.name || 'someone'}`,
    link: `/chat/${senderId}`
  });
  res.json(msg)
}

export async function getChat(req,res){
  const { sender, receiver } = req.params
  const msgs = await Message.find({
  $or: [
    { senderId: sender, receiverId: receiver },
    { senderId: receiver, receiverId: sender }
  ]
})
.populate("senderId", "name")       
.populate("receiverId", "name")     
.sort({ timestamp: 1 })

  res.json(msgs)
}