import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../utils/api'

export const listJobs = createAsyncThunk('jobs/list', async ()=>{
  const { data } = await api.get('/api/jobs')
  return data
})
export const createJob = createAsyncThunk('jobs/create', async (payload)=>{
  const { data } = await api.post('/api/jobs', payload)
  return data
})

const slice = createSlice({
  name: 'jobs',
  initialState: { items: [] },
  reducers: {},
  extraReducers: (b)=>{
    b.addCase(listJobs.fulfilled, (s,a)=>{ s.items=a.payload })
    b.addCase(createJob.fulfilled, (s,a)=>{ s.items.unshift(a.payload) })
  }
})
export default slice.reducer