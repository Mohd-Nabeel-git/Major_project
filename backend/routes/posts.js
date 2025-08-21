import { Router } from 'express'
import auth from '../middleware/auth.js'
import { createPost, getFeed, deletePost, getUserPosts } from '../controllers/postsController.js'

const r = Router()
r.post('/', auth, createPost)
r.get('/feed/:userId', auth, getFeed)
r.delete('/:id', auth, deletePost)
r.get('/user/:userId', auth, getUserPosts)
export default r