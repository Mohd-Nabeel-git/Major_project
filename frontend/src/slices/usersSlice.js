import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../utils/api"

export const fetchUsers = createAsyncThunk("users/fetchAll", async () => {
  const { data } = await api.get("/api/users")
  return data
})

const usersSlice = createSlice({
  name: "users",
  initialState: { list: [], status: "idle" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.status = "loading" })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.list = action.payload
      })
      .addCase(fetchUsers.rejected, (state) => { state.status = "failed" })
  }
})

export default usersSlice.reducer
