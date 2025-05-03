
import { SubscribeToMoistureTopic, client as moistureClient } from './mqttClientMoisture.js';
import { SubscribeToTemperatureTopic, client as tempClient } from './mqttClientTemp.js';

import { CompareMoistureData } from './moisture.js';
import { CompareTemperatureData } from './temp.js';

//User selects plant_id
const selectedID = 3 //Assuming its 3 (will be changed to user input)

SubscribeToMoistureTopic(selectedID);
SubscribeToTemperatureTopic(selectedID);

// Handle moisture messages
moistureClient.on('message', (topic, message) => {
  if (topic.includes('/moisture')) {
      CompareMoistureData(topic, message, selectedID);
  }
});

// Handle temperature messages
tempClient.on('message', (topic, message) => {
  if (topic.includes('/temp')) {
      CompareTemperatureData(topic, message, selectedID);
  }
});


