import mqtt from 'mqtt';
import { pool } from './db.js';
import dotenv from 'dotenv';
dotenv.config();

const client = mqtt.connect(`mqtt://${process.env.MQTT_BROKER}`);

client.on('connect', () => {
  console.log('MQTT connected');
  client.subscribe(process.env.MQTT_TOPIC);
});

client.on('message', async (topic, message) => {
  const value = parseInt(message.toString(), 10);
  await pool.query(
    'INSERT INTO moisture_readings (value, timestamp) VALUES (?, NOW())',
    [value]
  );
  console.log('Saved moisture reading:', value);
});

export default client;
