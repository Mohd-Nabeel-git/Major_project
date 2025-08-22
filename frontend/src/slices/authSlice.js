import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../utils/api'

export const loginThunk = createAsyncThunk('auth/login', async (payload)=>{
  const { data } = await api.post('/api/auth/login', payload)
  return data
})
export const registerThunk = createAsyncThunk('auth/register', async (payload)=>{
  const { data } = await api.post('/api/auth/register', payload)
  return data
})

const slice = createSlice({
  name: 'auth',
  initialState: { 
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null, 
    token: localStorage.getItem('token') || null, 
    status: 'idle', 
    error: null 
  },
  reducers: {
    logout(state){ 
      state.user=null; 
      state.token=null; 
      localStorage.removeItem('token'); 
      localStorage.removeItem('user'); 
    }
  },
  extraReducers: (b)=>{
    b.addCase(loginThunk.fulfilled, (s,a)=>{ 
      s.user=a.payload.user; 
      s.token=a.payload.token; 
      localStorage.setItem('token', a.payload.token);
      localStorage.setItem('user', JSON.stringify(a.payload.user));
    })
    b.addCase(registerThunk.fulfilled, (s,a)=>{ 
      s.user=a.payload.user; 
      s.token=a.payload.token; 
      localStorage.setItem('token', a.payload.token);
      localStorage.setItem('user', JSON.stringify(a.payload.user));
    })
  }
})

export const { logout } = slice.actions
export default slice.reducer