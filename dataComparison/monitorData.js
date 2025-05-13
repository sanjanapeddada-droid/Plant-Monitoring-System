import { SubscribeToMoistureTopic, client as moistureClient } from './mqttClientMoisture.js';
import { SubscribeToTemperatureTopic, client as tempClient } from './mqttClientTemp.js';
import { SubscribeToLightTopic, client as lightClient } from './mqttClientLight.js';

import { CompareMoistureData } from './moisture.js';
import { CompareTemperatureData } from './temp.js';
import { CompareLightData } from './light.js';

// User selects plant_id
const selectedID = 3; // Will be replaced with user input

// Subscribe to sensor topics
SubscribeToMoistureTopic(selectedID);
SubscribeToTemperatureTopic(selectedID);
SubscribeToLightTopic(selectedID);

// Handle moisture messages
moistureClient.on('message', (topic, message) => {
  const match = topic.match(/plant\/(\d+)\/moisture/);
  if (match) {
    const plantID = parseInt(match[1]);
    CompareMoistureData(topic, message, plantID);
  }
});

// Handle temperature messages(MUST BE CHANGED)
tempClient.on('message', (topic, message) => {
  if (topic.includes('/temp')) {
    CompareTemperatureData(topic, message, selectedID);
  }
});

// Handle light messages(MUST BE CHANGED)
lightClient.on('message', (topic, message) => {
  if (topic.includes('/light')) {
    CompareLightData(topic, message, selectedID);
  }
});
