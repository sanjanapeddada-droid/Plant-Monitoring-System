import mqtt from 'mqtt';
import dotenv from 'dotenv';
import { CompareMoistureData } from './moisture.js'; // Import CompareMoistureData

// Load environment variables
dotenv.config();

// Log the MQTT_BROKER to verify it's being loaded
console.log('MQTT_BROKER:', process.env.MQTT_BROKER); // This should print 'mqtt://localhost:1883'

export const client = mqtt.connect(process.env.MQTT_BROKER);

// On connection to the MQTT broker
client.on('connect', () => {
  console.log("Connected to MQTT broker");
});

// Handle errors during MQTT connection
client.on('error', (err) => {
  console.error(" MQTT error:", err.message);
});

// Subscribe to the moisture topic dynamically based on plantID
export const SubscribeToMoistureTopic = (plantID) => {
  const topic = `plant/${plantID}/moisture`;  // Dynamic topic based on plantID
  client.subscribe(topic, (error) => {
    if (error) {
      console.error(`Failed to subscribe to topic ${topic}`, error);
    } else {
      console.log(`Successfully subscribed to topic: ${topic}`);
    }
  });
};

// Listen for moisture messages and process them dynamically based on the topic
client.on('message', (topic, message) => {
  const match = topic.match(/plant\/(\d+)\/moisture/);  // Match plantID in the topic
  if (match) {
    const plantID = parseInt(match[1]);  // Extract plantID from the topic
    CompareMoistureData(topic, message, plantID);  // Pass plantID dynamically
  }
});
