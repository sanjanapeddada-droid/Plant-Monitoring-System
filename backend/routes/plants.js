import express from 'express';
import { pool } from '../db.js';
const router = express.Router();

router.get('/profiles', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM plant_profiles');
  res.json(rows);
});


router.get('/user/:id', async (req, res) => {
  const userId = req.params.id;
  const [rows] = await pool.query(
    `SELECT up.id AS userPlantId, p.name,
            p.min_percentage, p.max_percentage,
            p.light_requirement
     FROM user_plants up
     JOIN plant_profiles p
       ON up.plant_type_id = p.id
     WHERE up.user_id = ?`,
    [userId]
  );
  res.json(rows);
});

export default router;
