import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../utils/api'

export const fetchFeed = createAsyncThunk('posts/feed', async (userId)=>{
  const { data } = await api.get(`/api/posts/feed/${userId}`)
  return data
})
export const createPost = createAsyncThunk('posts/create', async (payload)=>{
  const { data } = await api.post('/api/posts', payload)
  return data
})

const slice = createSlice({
  name: 'posts',
  initialState: { items: [], status: 'idle' },
  reducers: {},
  extraReducers: (b)=>{
    b.addCase(fetchFeed.fulfilled, (s,a)=>{ s.items = a.payload })
    b.addCase(createPost.fulfilled, (s,a)=>{ s.items.unshift(a.payload) })
  }
})
export default slice.reducer