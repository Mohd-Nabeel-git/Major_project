import mongoose from 'mongoose'

const experienceSchema = new mongoose.Schema({
  company: String, role: String, from: Date, to: Date
},{_id:false})
const educationSchema = new mongoose.Schema({
  school: String, degree: String, from: Date, to: Date
},{_id:false})

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  bio: String,
  profilePic: String,
  banner: String,
  experience: [experienceSchema],
  education: [educationSchema],
  skills: [String],
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  connectionRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  role: { type: String, enum: ['user','admin'], default:'user' }
},{ timestamps:true })

export default mongoose.model('User', userSchema)