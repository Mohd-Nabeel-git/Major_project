import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../utils/api"

// --- Thunks ---
export const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  async () => {
    const res = await api.get("/api/notifications")
    return res.data
  }
)

export const clearNotifications = createAsyncThunk(
  "notifications/clear",
  async () => {
    await api.delete("/api/notifications/clear")
    return []
  }
)

export const markAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (id) => {
    const res = await api.patch(`/api/notifications/${id}/read`)
    return res.data
  }
)

// --- Slice ---
const notificationsSlice = createSlice({
  name: "notifications",
  initialState: { items: [], loading: false },
  reducers: {
    addNotification: (state, action) => {
      // ✅ avoid duplicates (if already in list, skip)
      const exists = state.items.find(n => n._id === action.payload._id)
      if (!exists) {
        state.items.unshift(action.payload) // new one comes in on top
      }
    },
    removeNotification: (state, action) => {
      state.items = state.items.filter((n) => n._id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.items = action.payload
        state.loading = false
      })
      .addCase(fetchNotifications.rejected, (state) => {
        state.loading = false
      })

      // clear
      .addCase(clearNotifications.fulfilled, (state) => {
        state.items = []
      })

      // mark as read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const idx = state.items.findIndex((n) => n._id === action.payload._id)
        if (idx !== -1) state.items[idx] = action.payload
      })
  },
})

export const { addNotification, removeNotification } = notificationsSlice.actions
export default notificationsSlice.reducer
