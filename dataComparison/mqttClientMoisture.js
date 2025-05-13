import mqtt from 'mqtt';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Log the MQTT_BROKER to verify it's being loaded
console.log('MQTT_BROKER:', process.env.MQTT_BROKER); // This should print 'mqtt://localhost:1883'

export const client = mqtt.connect(process.env.MQTT_BROKER);

client.on('connect', () => {
  console.log("Connected to MQTT broker");
});

client.on('error', (err) => {
  console.error(" MQTT error:", err.message);
});

export const SubscribeToMoistureTopic = (plantID) => {
  const topic = `plant/${plantID}/moisture`;
  client.subscribe(topic, (error) => {
    if (error) {
      console.error(`Failed to subscribe to topic ${topic}`, error);
    } else {
      console.log(`Subscribed to topic: ${topic}`);
    }
  });
};
