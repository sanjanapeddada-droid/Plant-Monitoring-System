import express from 'express'
import cors    from 'cors'
import dotenv  from 'dotenv'
dotenv.config()

import authRoutes  from './routes/auth.js'
import plantRoutes from './routes/plants.js'
import './mqttClient.js'

const app = express()
app.use(cors())
app.use(express.json())


app.use('/api/auth', authRoutes)


app.use('/api/plants', plantRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`API listening on port ${PORT}`))






