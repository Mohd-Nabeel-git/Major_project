import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../utils/api'

// Only load history via REST
export const loadChat = createAsyncThunk('chat/load', async ({ sender, receiver }) => {
  const { data } = await api.get(`/api/messages/${sender}/${receiver}`)
  return data
})

const slice = createSlice({
  name: 'chat',
  initialState: { messages: [] },
  reducers: {
    // optional: handle socket new messages here later
    addMessage: (state, action) => {
      state.messages.push(action.payload)
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loadChat.fulfilled, (state, action) => {
      state.messages = action.payload
    })
  }
})

export const { addMessage } = slice.actions
export default slice.reducer
