import express from 'express'
import { likePost, commentPost } from '../controllers/postsController.js'
import auth from '../middleware/auth.js'

const router = express.Router()

router.post('/:id/like', auth, likePost)
router.post('/:id/comment', auth, commentPost)

export default router
