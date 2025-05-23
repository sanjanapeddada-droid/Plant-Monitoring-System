// backend/routes/auth.js
import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '../db.js'

const router = express.Router()

// Middleware to authenticate JWT tokens
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) return res.sendStatus(401)

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

// 1) Sign Up
router.post('/signup', async (req, res) => {
  try {
    const { username, full_name, password } = req.body

    // Check if user already exists
    const [exists] = await pool.query('SELECT id FROM users WHERE username = ?', [username])
    if (exists.length) {
      return res.status(400).json({ message: 'Username taken' })
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10)

    // Insert new user
    const [result] = await pool.query(
      'INSERT INTO users (username, full_name, password) VALUES (?,?,?)',
      [username, full_name, hash]
    )

    res.status(201).json({ id: result.insertId, username, full_name })
  } catch (err) {
    console.error('Signup error:', err)
    res.status(500).json({ message: 'Server error during signup' })
  }
})

// 2) Log In
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username])
    if (!rows.length) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const user = rows[0]
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' })

    res.json({ token, user: { id: user.id, username: user.username, full_name: user.full_name } })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Server error during login' })
  }
})

// 3) Protected account deletion
router.post('/delete', authenticateToken, async (req, res) => {
  try {
    const { username, password } = req.body
    const userId = req.user.id

    // Check user exists and username matches JWT user
    const [users] = await pool.query('SELECT * FROM users WHERE id = ? AND username = ?', [
      userId,
      username,
    ])

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid user or username mismatch' })
    }

    const user = users[0]

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' })
    }

    // (Optional) Delete related user data, e.g., user_plants
    await pool.query('DELETE FROM user_plants WHERE user_id = ?', [userId])

    // Delete user account
    await pool.query('DELETE FROM users WHERE id = ?', [userId])

    res.json({ message: 'Account deleted successfully' })
  } catch (err) {
    console.error('Account deletion error:', err)
    res.status(500).json({ error: 'Could not delete account' })
  }
})

export default router
