import { Router } from 'express'
import auth from '../middleware/auth.js'
import { getUser, updateUser, getAllUsers } from '../controllers/usersController.js'

const r = Router()
r.get('/', auth, getAllUsers)   // 🆕 new route
r.get('/:id', auth, getUser)
r.put('/:id', auth, updateUser)
export default r
