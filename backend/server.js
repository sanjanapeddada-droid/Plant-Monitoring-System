import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import http from 'http'             // 🔸 Import Node's HTTP module
import { Server as SocketIO } from 'socket.io'  // 🔸 Import Socket.IO
import selectPlantRoute from './routes/select-plant.js';

dotenv.config()

import authRoutes from './routes/auth.js'
import plantRoutes from './routes/plants.js'
import { pool } from './db.js'

// Initialize app and HTTP server
const app = express()
const server = http.createServer(app) // 🔸 Create HTTP server manually

// Set up Socket.IO
export const io = new SocketIO(server, {
  cors: {
    origin: '*', // You can restrict this to your frontend origin
    methods: ['GET', 'POST']
  }
})

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/plants', plantRoutes)

// Test API route
app.get('/api/plant_profiles', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM plant_profiles')
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not load plant profiles' })
  }
})

// MQTT logic should now use `io` for real-time emits
import '/Users/sanjanapvk/Documents/Project-Sys_Dev/plant-monitoring-system-1/dataComparison/mqttClientMoisture.js' // Make sure your moisture.js uses `io.emit(...)`

// Listen on HTTP server, not app
const PORT = process.env.PORT || 3000
server.listen(PORT, () => console.log(`Server + WebSocket running on port ${PORT}`))

app.use('/api/select-plant', selectPlantRoute);
