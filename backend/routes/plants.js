import express from 'express'
import { pool } from '../db.js'
import jwt from 'jsonwebtoken'


const router = express.Router()

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]
  if (!token) return res.status(403).json({ message: 'No token provided' })

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Unauthorized' })
    req.userId = decoded.id
    next()
  })
}

// Get all plant profiles (to display in the frontend)
router.get('/profiles', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM plant_profiles')
    res.json(rows)
  } catch (err) {
    console.error('Error fetching plant profiles:', err)
    res.status(500).json({ message: 'Error fetching plant profiles' })
  }
})

// Get user-specific plants
router.get('/user/:id', async (req, res) => {
  const userId = req.params.id
  try {
    const [rows] = await pool.query(
      `SELECT up.id AS userPlantId, p.name, p.min_percentage, p.max_percentage, p.light_requirement
       FROM user_plants up
       JOIN plant_profiles p
       ON up.plant_type_id = p.id
       WHERE up.user_id = ?
       ORDER BY p.name ASC`,
      [userId]
    )
    res.json(rows)
  } catch (err) {
    console.error('Error fetching user plants:', err)
    res.status(500).json({ message: 'Error fetching user plants' })
  }
})


// DELETE a user_plant by its record ID
router.delete(
  '/user/:id',
  verifyToken,               
  async (req, res) => {
    const userPlantId = req.params.id
    const userId      = req.userId   
     console.log(`DELETE /api/plants/user/${userPlantId} called by user ${userId}`)

    try {
      const [result] = await pool.query(
        'DELETE FROM user_plants WHERE id = ? AND user_id = ?',
        [userPlantId, userId]
      )
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Plant not found' })
      }
      res.json({ message: 'Plant deleted successfully' })
    } catch (err) {
      console.error('Error deleting user plant:', err)
      res.status(500).json({ message: 'Error deleting plant' })
    }
  }
)

// Add a plant to the user's personal list (requires authentication)
router.post('/add', verifyToken, async (req, res) => {
  const { plant_id } = req.body
  const userId = req.userId // User ID from the token

  try {
    // Insert the plant into the user's personal plants list
    const [result] = await pool.query(
      'INSERT INTO user_plants (user_id, plant_type_id) VALUES (?, ?)',
      [userId, plant_id]
    )
    res.status(201).json({ message: 'Plant added successfully' })
  } catch (err) {
    console.error('Error adding plant to user list:', err)
    res.status(500).json({ message: 'Error adding plant to user list' })
  }
})


//  Activate or deactivate a plant
router.put('/user/:id/activate', verifyToken, async (req, res) => {
  const userPlantId = req.params.id
  const { deactivate } = req.body
  const isActive = deactivate ? 0 : 1

 try {
    // ✅ This should deactivate all the user's plants first
    await pool.query('UPDATE user_plants SET is_active = 0 WHERE user_id = ?', [req.userId])

    // ✅ Then activate the selected one, unless we are deactivating it
    if (!deactivate) {
      await pool.query('UPDATE user_plants SET is_active = 1 WHERE id = ?', [userPlantId])
    }

    res.sendStatus(200)
  } catch (err) {
    console.error('❌ Error updating activation:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// Frontend: sending the plant name
async function onPlantSelected(plantName) {
  try {
    const response = await fetch('http://localhost:3000/api/select-plant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ plantName })
    });

    const data = await response.json();

    if (response.ok) {
      console.log(` Subscribed to plant: ${plantName}, ID: ${data.plantID}`);
      // Optional: Trigger UI changes or notifications
    } else {
      console.error(` Error: ${data.error}`);
    }
  } catch (error) {
    console.error(' Network error:', error);
  }
}

export default router
