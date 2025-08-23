import { Router } from 'express'
import auth from '../middleware/auth.js'
import {
  postJob,
  listJobs,
  listUserJobs,
  applyJob,
  deleteJob
} from '../controllers/jobsController.js'

const r = Router()

// ✅ Post a new job (auth required)
r.post('/', auth, postJob)

// ✅ Get all jobs (public)
r.get('/', listJobs)

// ✅ Get jobs by specific user (public)
r.get('/user/:userId', listUserJobs)

// ✅ Apply for a job (auth required)
r.post('/apply/:jobId', auth, applyJob)

// ✅ Delete a job (only job poster can delete)
r.delete('/:id', auth, deleteJob)

export default r
