<template>
  <div class="active-sensors">
    <h2>Live Sensor Readings</h2>

    <div v-if="sensorData">
      <ul>
        <li><strong>Moisture:</strong> {{ sensorData.moisture }}</li>
        <li><strong>Temperature:</strong> {{ sensorData.temperature }} °C</li>
        <li><strong>Light:</strong> {{ sensorData.light }} lux</li>
        <li><strong>Humidity:</strong> {{ sensorData.humidity }} %</li>
        <li><strong>Water:</strong> {{ sensorData.water }} mL</li>
      </ul>
    </div>

    <p v-else>No data received yet from sensors.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import mqtt from 'mqtt'

const sensorData = ref(null)

const setupMQTT = () => {
  const client = mqtt.connect('ws://192.168.X.X:9001') // 🛠 replace with your IP

  client.on('connect', () => {
    console.log('☁️ MQTT connected')
    client.subscribe('wio/readings')
  })

  client.on('message', (topic, message) => {
    if (topic === 'wio/readings') {
      try {
        const payload = JSON.parse(message.toString())
        sensorData.value = payload
      } catch (err) {
        console.error('Failed to parse MQTT message:', err)
      }
    }
  })

  client.on('error', err => {
    console.error('MQTT error:', err)
  })
}

onMounted(() => {
  setupMQTT()
})
</script>

<style scoped>
.active-sensors {
  max-width: 500px;
  margin: auto;
  background: #f8fff8;
  border: 2px solid #4caf50;
  padding: 1.5rem;
  border-radius: 10px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 0.5rem;
}
</style>
