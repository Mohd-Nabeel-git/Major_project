import { Router } from 'express'
import auth from '../middleware/auth.js'
import { postJob, listJobs, applyJob } from '../controllers/jobsController.js'

const r = Router()
r.post('/', auth, postJob)
r.get('/', listJobs)
r.post('/apply/:jobId', auth, applyJob)
export default r