import mongoose from 'mongoose'

const jobSchema = new mongoose.Schema({
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, default: "Remote" },
  employmentType: { 
    type: String, 
    enum: ["Full-time", "Part-time", "Contract", "Internship"], 
    default: "Full-time" 
  },
  salaryRange: { type: String }, 
  skills: [{ type: String }],

  // instead of only userId, now we keep structured applicant data
  applicants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: { type: String }, // cover letter / why applying
    appliedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true })

export default mongoose.model('Job', jobSchema)

