import express from 'express';
import { pool } from '../db.js';
import { SubscribeToMoistureTopic } from '../../dataComparison/mqttClientMoisture.js'; // Make sure the path is correct

const router = express.Router();

// POST /api/select-plant
router.post('/', async (req, res) => {
  const { plantName } = req.body;

  try {
    // Query the plant's ID from the database based on the plant name
    const [rows] = await pool.execute(
      `SELECT id FROM plants WHERE name = ?`,  // Query to fetch plant ID by name
      [plantName]
    );

    // If no plant with that name is found, return an error
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Plant not found' });
    }

    const plantID = rows[0].id; // Extract the plant ID

    // Subscribe to MQTT topic for this plant ID
    console.log(`Subscribing to MQTT topic for plant with ID: ${plantID}`);
    try {
      SubscribeToMoistureTopic(plantID); // This function subscribes to the MQTT topic for the plant
      console.log(`Successfully subscribed to MQTT topic for plant ${plantID}`);
    } catch (mqttError) {
      console.error(`Error subscribing to MQTT for plant ${plantID}: `, mqttError);
      return res.status(500).json({ error: 'Error subscribing to MQTT topic' });
    }

    // Return a response with the plant ID and success status
    return res.json({ success: true, plantID });

  } catch (err) {
    console.error('Error selecting plant:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
