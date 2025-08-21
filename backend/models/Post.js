import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
  text: String,
  createdAt: { type: Date, default: Date.now }
},{ _id: false })

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
  content: String,
  image: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref:'User' }],
  comments: [commentSchema]
},{ timestamps:true })

export default mongoose.model('Post', postSchema)