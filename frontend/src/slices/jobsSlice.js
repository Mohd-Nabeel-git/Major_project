import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../utils/api'

// ✅ List all jobs
export const listJobs = createAsyncThunk('jobs/list', async () => {
  const { data } = await api.get('/api/jobs')
  return data
})

// ✅ List jobs by specific user
export const listUserJobs = createAsyncThunk('jobs/listUser', async (userId) => {
  const { data } = await api.get(`/api/jobs/user/${userId}`)
  return { userId, jobs: data }
})

// ✅ Create a new job
export const createJob = createAsyncThunk('jobs/create', async (payload) => {
  const { data } = await api.post('/api/jobs', payload)
  return data
})

// ✅ Apply for a job (with message)
export const applyJob = createAsyncThunk('jobs/apply', async ({ jobId, message }) => {
  const { data } = await api.post(`/api/jobs/apply/${jobId}`, { message })
  return { jobId, ...data }
})

// ✅ Delete a job
export const deleteJob = createAsyncThunk('jobs/delete', async (jobId) => {
  await api.delete(`/api/jobs/${jobId}`)
  return jobId
})

const slice = createSlice({
  name: 'jobs',
  initialState: { items: [], userJobs: {}, status: 'idle' },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(listJobs.fulfilled, (s, a) => { s.items = a.payload })
    b.addCase(listUserJobs.fulfilled, (s, a) => { s.userJobs[a.payload.userId] = a.payload.jobs })
    b.addCase(createJob.fulfilled, (s, a) => { s.items.unshift(a.payload) })
    b.addCase(deleteJob.fulfilled, (s, a) => {
      s.items = s.items.filter(job => job._id !== a.payload)
      Object.keys(s.userJobs).forEach(userId => {
        s.userJobs[userId] = s.userJobs[userId].filter(job => job._id !== a.payload)
      })
    })
    b.addCase(applyJob.fulfilled, (s, a) => {
      const job = s.items.find(j => j._id === a.payload.jobId)
      if (job) {
        // prevent duplicate applicants
        if (!job.applicants?.includes(a.meta.arg.jobId)) {
          job.applicants = [...(job.applicants || []), s.currentUserId || 'me'] 
          // NOTE: If you keep user in Redux, replace with actual user._id
        }
      }
    })
  }
})

export default slice.reducer
