import mongoose from 'mongoose'

const msgSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
  content: String,
  timestamp: { type: Date, default: Date.now }
})

export default mongoose.model('Message', msgSchema)