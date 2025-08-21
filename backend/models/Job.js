import mongoose from 'mongoose'

const jobSchema = new mongoose.Schema({
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
  title: String,
  description: String,
  skills: [String],
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref:'User' }]
},{ timestamps:true })

export default mongoose.model('Job', jobSchema)