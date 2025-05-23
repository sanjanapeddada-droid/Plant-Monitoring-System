import express from 'express';
import { pool } from '../db.js';


const router = express.Router();

// Define POST route for /api/select-plant
router.post('/', async (req, res) => {
  const { plantName } = req.body;

  try {
    // Query the plant's ID based on the plant name
    const [rows] = await pool.execute(
      `SELECT id FROM plant_profiles WHERE name = ?`,
      [plantName]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Plant not found' });
    }

    const plantID = rows[0].id;

    // Subscribe to MQTT topic for this plant ID
    console.log(`Subscribing to MQTT topic for plant with ID: ${plantID}`);
    
    return res.json({ success: true, plantID });

  } catch (err) {
    console.error('Error selecting plant:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
