import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import http from 'http'
import mqtt from 'mqtt'
import { Server as SocketIO } from 'socket.io'

import authRoutes from './routes/auth.js'
import plantsRoutes from './routes/plants.js'
import selectPlantRoute from './routes/select-plant.js'
import { pool } from './db.js'

dotenv.config()

const app = express()
const server = http.createServer(app)
const allowedOrigin = 'http://localhost:5173'

// Check DB connection
const [rows] = await pool.query('SELECT DATABASE() AS db')
console.log('Connected to DB:', rows[0].db)

// Set up WebSocket server
export const io = new SocketIO(server, {
  cors: {
    origin: allowedOrigin,
    methods: ['GET', 'POST'],
    credentials: true
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true
  }
})

// Track connected plants for emitting updates
const activePlants = new Map()

// Middleware
app.use(cors({ origin: allowedOrigin, credentials: true }))
app.use(express.json())

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/plants', plantsRoutes)
app.use('/api/select-plant', selectPlantRoute)

// MQTT client
const mqttClient = mqtt.connect('ws://localhost:9001',//change to local ip 
  {
  clientId: `node_server_${Math.random().toString(16).substr(2, 8)}`,
  clean: true,
  reconnectPeriod: 5000
})

// WebSocket connections
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`)

  socket.on('join_plant_room', (plantId) => {
    socket.join(`plant_${plantId}`)
    activePlants.set(socket.id, plantId)
  })

  socket.on('disconnect', () => {
    activePlants.delete(socket.id)
    console.log(`Client disconnected: ${socket.id}`)
  })
})

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    mqtt: mqttClient.connected ? 'connected' : 'disconnected',
    clients: io.engine.clientsCount
  })
})

// ✅ Start server
async function startServer() {
  mqttClient.on('connect', () => {
    console.log('✅ WS MQTT connected')
    mqttClient.subscribe('wio/readings', { qos: 1 }, (err) => {
      if (err) console.error('Subscription error:', err)
    })
  })

  mqttClient.on('message', async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    const userId = 1;

    const [rows] = await pool.execute(
      `SELECT up.id AS user_plant_id, pp.name, pp.min_percentage, pp.max_percentage,
              pp.min_temp, pp.max_temp, pp.light_requirement
       FROM user_plants up
       JOIN plant_profiles pp ON pp.id = up.plant_type_id
       WHERE up.user_id = ? LIMIT 1`,
      [userId]
    );

    if (rows.length === 0) {
      console.warn(`No selected plant for user_id ${userId}`);
      return;
    }

    const {
      user_plant_id, name, min_percentage, max_percentage,
      min_temp, max_temp, light_requirement
    } = rows[0];

    // Handle moisture data
    if (data.moisture != null) {
      const moisture = data.moisture;

      await pool.execute(
        `INSERT INTO plant_sensor_data (user_plant_id, moisture)
         VALUES (?, ?)`,
        [user_plant_id, moisture]
      );

      io.to(`plant_${user_plant_id}`).emit('moisture_update', {
        user_plant_id,
        plant: name,
        moisture
      });

      if (moisture < min_percentage) {
        io.to(`plant_${user_plant_id}`).emit('moisture_alert', {
          type: 'warning',
          message: `${name} moisture is too low: ${Math.round(moisture)}%`
        });
        console.log('🚨 Moisture too low!');
      } else if (moisture > max_percentage) {
        io.to(`plant_${user_plant_id}`).emit('moisture_alert', {
          type: 'danger',
          message: `${name} moisture is too high: ${Math.round(moisture)}%`
        });
        console.log('🚨 Moisture too high!');
      } else {
        console.log(`✅ ${name} moisture level: ${Math.round(moisture)}% (normal)`);
      }
    }

      // Handle humidity data
    
      if (data.humidity != null) {
      const humidity = data.humidity;

      await pool.execute(
      `INSERT INTO plant_sensor_data (user_plant_id, humidity)
      VALUES (?, ?)`,
      [user_plant_id, humidity]
      );

      io.to(`plant_${user_plant_id}`).emit('humidity_update', {
      user_plant_id,
      plant: name,
      humidity
      });

  console.log(`✅ ${name} humidity: ${Math.round(humidity)}%`);
}
//handle water_level
if (data.water_level != null) {
  const waterLevel = data.water_level;

  await pool.execute(
    `INSERT INTO plant_sensor_data (user_plant_id, water_level)
     VALUES (?, ?)`,
    [user_plant_id, waterLevel]
  );

  io.to(`plant_${user_plant_id}`).emit('water_level_update', {
    user_plant_id,
    plant: name,
    water_level: waterLevel,
  });

  console.log(`💧 ${name} water level: ${Math.round(waterLevel)}%`);

  // Add alert for low water level below 30%
  if (waterLevel < 30) {
    io.to(`plant_${user_plant_id}`).emit('water_level_alert', {
      type: 'warning',
      message: `${name} water level is too high: ${Math.round(waterLevel)}%`
    });
    console.log('🚨 Water level too high!');
  }
}

    

    // Handle temperature data
    if (data.temperature != null) {
      const temperature = data.temperature;

      await pool.execute(
        `INSERT INTO plant_sensor_data (user_plant_id, temperature)
         VALUES (?, ?)`,
        [user_plant_id, temperature]
      );

      io.to(`plant_${user_plant_id}`).emit('temperature_update', {
        user_plant_id,
        plant: name,
        temperature
      });

      if (temperature < min_temp) {
        io.to(`plant_${user_plant_id}`).emit('temperature_alert', {
          type: 'warning',
          message: `${name} temperature is too low: ${Math.round(temperature)}°C`
        });
        console.log('🚨 Temperature too low!');
      } else if (temperature > max_temp) {
        io.to(`plant_${user_plant_id}`).emit('temperature_alert', {
          type: 'danger',
          message: `${name} temperature is too high: ${Math.round(temperature)}°C`
        });
        console.log('🚨 Temperature too high!');
      } else {
        console.log(`✅ ${name} temperature: ${Math.round(temperature)}°C (normal)`);
      }
    }

    // Handle light level data
    if (data.light != null) {
      const light_level = data.light;

      await pool.execute(
        `INSERT INTO plant_sensor_data (user_plant_id, light_level)
         VALUES (?, ?)`,
        [user_plant_id, light_level]
      );

      io.to(`plant_${user_plant_id}`).emit('light_update', {
        user_plant_id,
        plant: name,
        light: light_level
      });

      let minLight = 0, maxLight = 100;
      switch (light_requirement.toLowerCase()) {
        case 'full sun exposure':
          minLight = 75;
          maxLight = 100;
          break;
        case 'partial sun exposure':
          minLight = 40;
          maxLight = 75;
          break;
        case 'low sun exposure':
          minLight = 0;
          maxLight = 40;
          break;
      }

      if (light_level < minLight) {
        io.to(`plant_${user_plant_id}`).emit('light_alert', {
          type: 'warning',
          message: `${name} light level is too low: ${Math.round(light_level)}%`
        });
        console.log('🚨 Light level too low!');
      } else if (light_level > maxLight) {
        io.to(`plant_${user_plant_id}`).emit('light_alert', {
          type: 'danger',
          message: `${name} light level is too high: ${Math.round(light_level)}%`
        });
        console.log('🚨 Light level too high!');
      } else {
        console.log(`✅ ${name} light level: ${Math.round(light_level)}% (normal)`);
      }
    }

  } catch (err) {
    console.error('Error handling MQTT message:', err.message);
  }

  
});


  const PORT = process.env.PORT || 3000
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
  })
}

startServer()

process.on('SIGINT', () => {
  mqttClient.end()
  server.close()
  process.exit()
})

