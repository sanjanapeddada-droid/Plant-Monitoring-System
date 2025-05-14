<template>
  <div class="plant-sections">
    <!-- My Plants from DB -->
    <div class="my-plants">
      <h2>My Plants</h2>
      <ul>
        <li v-for="p in plants" :key="p.userPlantId">
          {{ p.name }} — Moisture: {{ p.min_percentage }}–{{ p.max_percentage }}%
          <br />
          Needs: {{ p.light_requirement }}
          <button class="delete-btn" @click="deletePlant(p.userPlantId)">
            Delete
          </button>
        </li>
      </ul>
    </div>

    <!-- Active Plants from MQTT -->
    <div class="active-plants">
      <h2>Active Plants</h2>
      <div v-if="activeMoisture !== null">
        <strong>Live Moisture Reading:</strong> {{ activeMoisture }}
      </div>
      <p v-else>No active sensor data received yet.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import mqtt           from 'mqtt'
import axios          from 'axios'

const plants         = ref([])
const activeMoisture = ref(null)
const USER_ID        = 1

// — fetch DB plants
const fetchPlants = async () => {
  try {
    const res = await axios.get(
      `http://localhost:3000/api/plants/user/${USER_ID}`
    )
    plants.value = res.data
  } catch (err) {
    console.error('Error fetching user plants:', err)
  }
}

// — delete a plant
const deletePlant = async (id) => {
  try {
    const token = localStorage.getItem('token')
    await axios.delete(
      `http://localhost:3000/api/plants/user/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    plants.value = plants.value.filter(p => p.userPlantId !== id)
  } catch (err) {
    console.error('Error deleting plant:', err)
  }
}

// — subscribe via MQTT over WebSocket
const setupMQTT = () => {
  const client = mqtt.connect('ws://localhost:9001')  // → MQTT broker’s WS port

  client.on('connect', () => {
    console.log('☁️ MQTT over WS connected')
    client.subscribe('wio/moisture')
  })

  client.on('message', (topic, msg) => {
    if (topic === 'wio/moisture') {
      activeMoisture.value = msg.toString()
    }
  })

  client.on('error', err => {
    console.error('MQTT error:', err)
  })
}

onMounted(() => {
  fetchPlants()    // △ load your DB plants
  setupMQTT()      // △ start live sensor feed
})
</script>

<style scoped>
.plant-sections {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.my-plants, .active-plants {
  flex: 1;
  min-width: 300px;
  background: #f0fff4;
  border: 2px solid #e91e63;
  border-radius: 8px;
  padding: 1.5rem;
}

.my-plants h2, .active-plants h2 {
  color: #4caf50;
}

.my-plants li {
  margin: 0.75rem 0;
  padding: 0.5rem;
  background: #ffffff;
  border-left: 4px solid #e91e63;
  position: relative;
}

.delete-btn {
  background-color: #e53935;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.4rem 0.8rem;
  margin-top: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.delete-btn:hover {
  background-color: #c62828;
}
</style>
