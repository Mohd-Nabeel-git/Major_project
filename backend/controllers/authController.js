import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import Notification from '../models/Notification.js';

export async function register(req,res){
  const errors = validationResult(req)
  if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()})
  const { name, email, password } = req.body
  const exists = await User.findOne({ email })
  if(exists) return res.status(400).json({message:'Email in use'})
  const hash = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, password: hash })
  const token = jwt.sign({ _id: user._id, email }, process.env.JWT_SECRET, { expiresIn: '7d' })
  // Removed welcome notification creation
  res.json({ user, token })
}

export async function login(req,res){
  const errors = validationResult(req)
  if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()})
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if(!user) return res.status(400).json({message:'Invalid credentials'})
  const ok = await bcrypt.compare(password, user.password)
  if(!ok) return res.status(400).json({message:'Invalid credentials'})
  const token = jwt.sign({ _id: user._id, email }, process.env.JWT_SECRET, { expiresIn: '7d' })
  res.json({ user, token })
}