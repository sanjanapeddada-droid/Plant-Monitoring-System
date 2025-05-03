import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import './mqttClient.js';       
import plantRoutes from './routes/plants.js';

const app = express();
app.use(cors(), express.json());
app.use('/api/plants', plantRoutes);

app.listen(process.env.PORT, () =>
  console.log(`API listening on port ${process.env.PORT}`)
);
