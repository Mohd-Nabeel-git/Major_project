import Job from '../models/Job.js'
import Notification from '../models/Notification.js'

export async function postJob(req,res){
  const job = await Job.create({
    postedBy: req.user._id,
    title: req.body.title,
    description: req.body.description || '',
    skills: req.body.skills || []
  })
  res.json(job)
}

export async function listJobs(req,res){
  const jobs = await Job.find().sort({ createdAt: -1 })
  res.json(jobs)
}

export async function applyJob(req,res){
  const job = await Job.findById(req.params.jobId)
  if(!job) return res.status(404).json({message:'Not found'})
  if(!job.applicants.includes(req.user._id)){
    job.applicants.push(req.user._id)
    await job.save()
  }
  // Notify job poster
  if (job.postedBy.toString() !== req.user._id) {
    await Notification.create({
      user: job.postedBy,
      type: 'job',
      message: `${req.user.name || 'Someone'} applied for your job: ${job.title}`,
      link: `/jobs/${job._id}`
    });
  }
  // Notify applicant
  await Notification.create({
    user: req.user._id,
    type: 'job',
    message: `You applied for the job: ${job.title}`,
    link: `/jobs/${job._id}`
  });
  res.json({ ok: true })
}