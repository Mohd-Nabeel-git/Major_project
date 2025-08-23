import { configureStore } from '@reduxjs/toolkit'
import auth from './slices/authSlice'
import posts from './slices/postsSlice'
import jobs from './slices/jobsSlice'
import chat from './slices/chatSlice'
import notifications from './slices/notificationsSlice'
import connections from './slices/connectionsSlice'

export default configureStore({
  reducer: { auth, posts, jobs, chat, notifications, connections }
})