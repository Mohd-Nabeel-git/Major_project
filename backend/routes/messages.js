import { Router } from 'express'
import auth from '../middleware/auth.js'
import { sendMessage, getChat } from '../controllers/messagesController.js'

const r = Router()
r.post('/', auth, sendMessage)
r.get('/:sender/:receiver', auth, getChat)
export default r