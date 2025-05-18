<template>
  <div class="active-sensors">
    <h2>Active Sensors</h2>
    <ul>
      <li v-for="sensor in sensors" :key="sensor.id">
        {{ sensor.name }} → Status: {{ sensor.status }}, Value: {{ sensor.value }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { io }                       from 'socket.io-client'

const sensors = ref([
  { id: 'moisture',    name: 'Soil Moisture Sensor', status: 'Connecting…', value: '—' },
  { id: 'temperature', name: 'Temperature Sensor',   status: 'Connecting…', value: '—' },
  { id: 'humidity',    name: 'Humidity Sensor',      status: 'Connecting…', value: '—' }
])

// connect to Socket.IO server
const socket = io('http://localhost:3000')

onMounted(() => {
  // moisture updates
  socket.on('moisture_update', ({ moisture }) => {
    const s = sensors.value.find(s => s.id === 'moisture')
    if (s) { s.status = 'Active'; s.value = moisture + '%' }
  })

  // temperature updates
  socket.on('temperature_update', ({ temperature }) => {
    const s = sensors.value.find(s => s.id === 'temperature')
    if (s) { s.status = 'Active'; s.value = temperature + '°C' }
  })

  // humidity updates
  socket.on('humidity_update', ({ humidity }) => {
    const s = sensors.value.find(s => s.id === 'humidity')
    if (s) { s.status = 'Active'; s.value = humidity + '%' }
  })
})

onUnmounted(() => {
  socket.disconnect()
})
</script>

<style scoped>
.active-sensors {
  text-align: center;
  padding: 2rem;
}
.active-sensors h2 {
  margin-bottom: 1rem;
  color: #37c28a;
}
.active-sensors ul {
  list-style: none;
  padding: 0;
}
.active-sensors li {
  margin: 0.5rem 0;
  font-size: 1.1rem;
}
</style>
