import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { createServer } from 'http'
import { Server } from 'socket.io'
import connectDB from './config/db.js'

import authRoutes from './routes/auth.js'
import usersRoutes from './routes/users.js'
import postsRoutes from './routes/posts.js'
import postActionsRoutes from './routes/postActions.js'
import messagesRoutes from './routes/messages.js'
import jobsRoutes from './routes/jobs.js'
import notificationsRoutes from './routes/notifications.js'

// 🆕 import your Message model
import Message from './models/Message.js'

dotenv.config()
const app = express()
const httpServer = createServer(app)

const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173'
app.use(cors({ origin: allowedOrigin, credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())
app.use('/uploads', express.static('uploads'))   // ← serve images


app.get('/', (req,res)=>res.send('Global_Connect API'))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/posts', postsRoutes)
app.use('/api/post-actions', postActionsRoutes)
app.use('/api/messages', messagesRoutes)
app.use('/api/jobs', jobsRoutes)
app.use('/api/notifications', notificationsRoutes)


const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigin,
    methods: ["GET", "POST"],
    credentials: true,   
  },
})


io.on('connection', (socket) => {
  console.log('✅ Socket connected:', socket.id)

  // join a room based on userId
  socket.on('join', (userId) => {
    socket.join(userId)
    console.log(`User ${userId} joined their room`)
  })

  // send message event
  socket.on('sendMessage', async ({ senderId, receiverId, content }) => {
  try {
    // save in DB
    let msg = await Message.create({ senderId, receiverId, content })

    // populate sender + receiver for proper names
    msg = await msg.populate("senderId", "name")
    msg = await msg.populate("receiverId", "name")

    // emit to receiver
    io.to(receiverId).emit('newMessage', msg)

    // also emit back to sender
    io.to(senderId).emit('newMessage', msg)
  } catch (err) {
    console.error('Error saving message:', err)
  }
})


  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected:', socket.id)
  })
})

const PORT = process.env.PORT || 5000
httpServer.listen(PORT, async () => {
  await connectDB(process.env.MONGODB_URI)
  console.log('🚀 Server running on', PORT)
})
