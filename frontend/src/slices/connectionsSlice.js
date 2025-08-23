import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../utils/api"

// ✅ Send request
export const sendRequest = createAsyncThunk("connections/send", async (userId) => {
  const { data } = await api.post(`/api/connections/request/${userId}`)
  return data
})

// ✅ Accept request
export const acceptRequest = createAsyncThunk("connections/accept", async (requestId) => {
  const { data } = await api.post(`/api/connections/respond/${requestId}`, { action: "accept" })
  return data
})

// ✅ Reject request
export const rejectRequest = createAsyncThunk("connections/reject", async (requestId) => {
  const { data } = await api.post(`/api/connections/respond/${requestId}`, { action: "reject" })
  return data
})

// ✅ My connections
export const fetchConnections = createAsyncThunk("connections/fetch", async () => {
  const { data } = await api.get("/api/connections")
  return data
})

// ✅ Pending requests
export const fetchRequests = createAsyncThunk("connections/fetchRequests", async () => {
  const { data } = await api.get("/api/connections/pending")
  return data
})

const slice = createSlice({
  name: "connections",
  initialState: { connections: [], requests: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConnections.fulfilled, (state, action) => {
        state.connections = action.payload || []
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.requests = action.payload || []
      })
      .addCase(sendRequest.fulfilled, (state, action) => {
        if (action.payload) {
          state.requests.push(action.payload)
        }
      })
      .addCase(acceptRequest.fulfilled, (state, action) => {
        if (action.payload) {
          state.connections.push(action.payload)
          state.requests = state.requests.filter((r) => r._id !== action.payload._id)
        }
      })
      .addCase(rejectRequest.fulfilled, (state, action) => {
        if (action.payload) {
          state.requests = state.requests.filter((r) => r._id !== action.payload._id)
        }
      })
      // ✅ Handle errors to avoid slice becoming undefined
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.error = action.error?.message || "Something went wrong"
        }
      )
  },
})

export default slice.reducer
