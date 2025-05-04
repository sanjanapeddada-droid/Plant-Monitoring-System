// backend/routes/auth.js
import express from 'express'
import bcrypt  from 'bcryptjs'
import jwt     from 'jsonwebtoken'
import { pool } from '../db.js'

const router = express.Router()

// 1) Sign Up
router.post('/signup', async (req, res) => {
  const { username, full_name, password } = req.body
  // check if user exists
  const [exists] = await pool.query('SELECT id FROM users WHERE username = ?', [username])
  if (exists.length) return res.status(400).json({ message: 'Username taken' })

  
  const hash = await bcrypt.hash(password, 10)
  const [result] = await pool.query(
    'INSERT INTO users (username, full_name, password) VALUES (?,?,?)',
    [username, full_name, hash]
  )
  res.status(201).json({ id: result.insertId, username, full_name })
})

// 2) Log In 
router.post('/login', async (req, res) => {
  const { username, password } = req.body
  const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username])
  if (!rows.length) return res.status(401).json({ message: 'Invalid credentials' })

  const user = rows[0]
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' })

  // sign a token
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' })
  res.json({ token, user: { id: user.id, username: user.username, full_name: user.full_name } })
})

export default router
