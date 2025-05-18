import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import http from 'http'
import mqtt from 'mqtt'
import { Server as SocketIO } from 'socket.io'

import authRoutes from './routes/auth.js'
import plantRoutes from './routes/plants.js'
import selectPlantRoute from './routes/select-plant.js'
import { pool } from './db.js'

dotenv.config()

// Initialize Express app and HTTP server
const app = express()
const server = http.createServer(app)

// Set up Socket.IO for real-time communication
export const io = new SocketIO(server, {
  cors: {
    origin: '*', // Update this to your frontend URL in production
    methods: ['GET', 'POST']
  }
})

// Middleware
app.use(cors())
app.use(express.json())

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/plants', plantRoutes)
app.use('/api/select-plant', selectPlantRoute)

// Example API Endpoint
app.get('/api/plant_profiles', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM plant_profiles')
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not load plant profiles' })
  }
})

// MQTT Client Setup
const mqttClient = mqtt.connect(process.env.MQTT_BROKER || 'ws://localhost:9001')// 🔁 Replace with actual IP and port

mqttClient.on('connect', () => {
  console.log('WS MQTT connected')
  mqttClient.subscribe('wio/moisture', (err) => {
    if (err) console.error('Subscription error:', err)
  })
  mqttClient.subscribe('wio/temperature', (err) => {
    if (err) console.error('Subscription error:', err)
    })
  mqttClient.subscribe('wio/humidity', (err) => {
    if (err) console.error('Subscription error:', err)
    })
})

mqttClient.on('message', (topic, message) => {
  const payload = message.toString()
  // decide the event name by topic
  switch (topic) {
    case 'wio/moisture':
      io.emit('moisture_update',   { moisture: payload })
      break
    case 'wio/temperature':
      io.emit('temperature_update',{ temperature: payload })
      break
    case 'wio/humidity':
      io.emit('humidity_update',   { humidity: payload })
      break
    default:
      console.warn('Unexpected topic:', topic)
  }
})

// Start HTTP + WebSocket Server
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Server + WebSocket running on port ${PORT}`)
})
