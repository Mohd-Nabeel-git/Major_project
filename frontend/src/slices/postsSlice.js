// slices/postsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../utils/api'

// Fetch global feed (no userId needed anymore)
export const fetchFeed = createAsyncThunk('posts/feed', async () => {
  const { data } = await api.get('/api/posts')
  return data
})

export const createPost = createAsyncThunk('posts/create', async (payload) => {
  const isFormData = payload instanceof FormData
  const { data } = await api.post('/api/posts', payload, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {}
  })
  return data
})

const slice = createSlice({
  name: 'posts',
  initialState: { items: [], status: 'idle' },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchFeed.fulfilled, (s, a) => { s.items = a.payload })
    b.addCase(createPost.fulfilled, (s, a) => { s.items.unshift(a.payload) })
  }
})

export default slice.reducer
