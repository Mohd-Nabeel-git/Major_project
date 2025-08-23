import Job from '../models/Job.js'
import Notification from '../models/Notification.js'

// ✅ Post a new job
export async function postJob(req, res) {
  try {
    const job = await Job.create({
      postedBy: req.user._id,
      title: req.body.title,
      description: req.body.description || '',
      company: req.body.company || 'Unknown Company',
      location: req.body.location || 'Remote',
      employmentType: req.body.employmentType || 'Full-time',
      salaryRange: req.body.salaryRange || '',
      skills: req.body.skills || []
    })

    res.status(201).json(job)
  } catch (err) {
    console.error("❌ Error posting job:", err)
    res.status(500).json({ message: "Server error" })
  }
}

// ✅ List all jobs (with poster info)
export async function listJobs(req, res) {
  try {
    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .populate('postedBy', 'name profilePic email')

    res.json(jobs)
  } catch (err) {
    console.error("❌ Error fetching jobs:", err)
    res.status(500).json({ message: "Server error" })
  }
}

// ✅ List jobs posted by a specific user
export async function listUserJobs(req, res) {
  try {
    const jobs = await Job.find({ postedBy: req.params.userId })
      .sort({ createdAt: -1 })

    res.json(jobs)
  } catch (err) {
    console.error("❌ Error fetching user jobs:", err)
    res.status(500).json({ message: "Server error" })
  }
}

// ✅ Apply for a job with message
export async function applyJob(req, res) {
  try {
    const { message } = req.body // application/cover letter text
    const job = await Job.findById(req.params.jobId)
    if (!job) return res.status(404).json({ message: 'Job not found' })

    // Check if user already applied
    const alreadyApplied = job.applicants.some(
      (a) => a.user.toString() === req.user._id.toString()
    )
    if (alreadyApplied) {
      return res.status(400).json({ message: 'You already applied for this job' })
    }

    // Add applicant with message
    job.applicants.push({
      user: req.user._id,
      message: message || "",
      appliedAt: new Date()
    })
    await job.save()

    // Notify job poster
    if (job.postedBy.toString() !== req.user._id.toString()) {
      await Notification.create({
        user: job.postedBy,
        type: 'job',
        message: `${req.user.name || 'Someone'} applied for your job: ${job.title}`,
        link: `/jobs/${job._id}`
      })
    }

    // Notify applicant
    await Notification.create({
      user: req.user._id,
      type: 'job',
      message: `You applied for the job: ${job.title}`,
      link: `/jobs/${job._id}`
    })

    res.json({ ok: true, message: "Application submitted successfully" })
  } catch (err) {
    console.error("❌ Error applying for job:", err)
    res.status(500).json({ message: "Server error" })
  }
}

// ✅ Delete job (only poster can delete)
export async function deleteJob(req, res) {
  try {
    const job = await Job.findById(req.params.id)
    if (!job) return res.status(404).json({ message: 'Job not found' })

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    await job.deleteOne()
    res.json({ ok: true, message: 'Job deleted successfully' })
  } catch (err) {
    console.error("❌ Error deleting job:", err)
    res.status(500).json({ message: "Server error" })
  }
}
