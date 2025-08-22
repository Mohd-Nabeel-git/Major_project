import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
  text: String,
  createdAt: { type: Date, default: Date.now }
},{ _id: false })

const mediaSchema = new mongoose.Schema({
  url: String,  // file path or link
  type: { type: String, enum: ['image', 'video'], default: 'image' }
},{ _id: false })

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
  content: String,

  // 🔄 Keep old single-image field for backward compatibility
  image: String,

  // 🆕 Support multiple media (images/videos)
  media: [mediaSchema],

  likes: [{ type: mongoose.Schema.Types.ObjectId, ref:'User' }],
  comments: [commentSchema]
},{ timestamps:true })

export default mongoose.model('Post', postSchema)
