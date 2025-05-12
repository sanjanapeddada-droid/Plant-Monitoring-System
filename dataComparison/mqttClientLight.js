import mqtt from 'mqtt';
import dotenv from 'dotenv';
dotenv.config(); 

export const client = mqtt.connect(process.env.MQTT_BROKER);

export const SubscribeToLightTopic = (plantID) => {
    const topic = `plant/${plantID}/light_requirements`;

    client.on('connect', () => {
        console.log("Connected to MQTT");

        client.subscribe(topic, (error) => {
            if (error) {
                console.error(`Failed to subscribe to ${topic}`, error);
            } else {
                console.log(`Subscribed to topic: ${topic}`);
            }
        });
    });
};

