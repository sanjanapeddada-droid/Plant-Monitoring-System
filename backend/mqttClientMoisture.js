import mqtt from 'mqtt';
import dotenv from 'dotenv';
dotenv.config(); 


export const client = mqtt.connect(process.env.MQTT_BROKER);

export const SubscribeToMoistureTopic = (plantID) => {
    const topic = `plant/${plantID}/moisture`;

    client.on(`connect`, () => {
    console.log("Connected to MQTT");

    client.subscribe(topic, (error) =>{
        if (error){
            console.error(`Failed to connect to ${topic}`,error);
        }

        else{
            console.log(`Subscribed to topic: ${topic}`)
        }
    });
});
};

