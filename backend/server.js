import express from 'express'
import cors    from 'cors'
import dotenv  from 'dotenv'
dotenv.config()
import mqtt from 'mqtt'
import authRoutes  from './routes/auth.js'
import plantRoutes from './routes/plants.js'
import { pool } from './db.js'
import './mqttClient.js'

const app = express()
app.use(cors())
app.use(express.json())
const client = mqtt.connect('ws://...')  //change to computers ip

app.use('/api/auth', authRoutes)


app.use('/api/plants', plantRoutes)

const PORT = process.env.PORT || 3000


app.get('/api/plant_profiles', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM plant_profiles');
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Could not load plant profiles' });
    }
  });
  
app.listen(PORT, () => console.log(`API listening on port ${PORT}`))


client.on('connect', () => {
  console.log('WS MQTT connected')
  client.subscribe('wio/moisture')
})


  





