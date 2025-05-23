<template>
  <div class="plant-sections">
    <!-- My Plants from DB -->
    <div class="my-plants">
      <h2>My Plants</h2>
      <ul>
        <li
          v-for="p in plants"
          :key="p.userPlantId"
          :class="{ selected: selectedPlantStore.selectedPlantId === p.userPlantId }"
          @click="selectPlant(p.userPlantId, p.name)"
        >
          {{ p.name }} — Moisture: {{ p.min_percentage }}–{{ p.max_percentage }}%
          <br />
          Needs: {{ p.light_requirement }}
          <button class="delete-btn" @click.stop="deletePlant(p.userPlantId)">
            Delete
          </button>
          <button
            class="select-btn"
            @click.stop="selectPlant(p.userPlantId, p.name)"
            :disabled="selectedPlantStore.selectedPlantId === p.userPlantId"
          >
            {{ selectedPlantStore.selectedPlantId === p.userPlantId ? 'Selected' : 'Select' }}
          </button>
        </li>
      </ul>
    </div>

    <!-- Active Plants from MQTT -->
    <div class="active-plants">
      <h2>Live Readings</h2>

      <!-- Moisture -->
      <div v-if="activeMoisture !== null">
        <strong>Live Moisture Reading:</strong> {{ activeMoisture }}%
        <div v-if="moistureStatus || moistureAlertMessage" :class="['status', moistureStatus || 'normal']">
          {{ moistureMessage }}
        </div>
      </div>
      <p v-else>No active moisture data received yet.</p>

      <!-- Temperature -->
      <div v-if="activeTemperature !== null" style="margin-top: 1rem">
        <strong>Live Temperature Reading:</strong> {{ activeTemperature }}°C
        <div v-if="temperatureStatus" :class="['status', temperatureStatus]">
          {{ temperatureMessage }}
        </div>
      </div>
      <p v-else>No active temperature data received yet.</p>

    <!-- Light -->
    <div v-if="activeLight !== null" style="margin-top: 1rem">
  <strong>Live Light Reading:</strong> {{ activeLight ?? 0 }}%
  <div v-if="lightStatus" :class="['status', lightStatus]">
    {{ lightMessage }}
  </div>
</div>
<p v-else>No active light data received yet.</p>

    <!-- Humidity -->
    <div v-if="activeHumidity !== null" style="margin-top: 1rem">
      <strong>Live Humidity Reading:</strong> {{ activeHumidity }}%
      </div>
      <p v-else>No active humidity data received yet.</p>

        <!-- Water Level -->
      <!-- Water Level -->
<div v-if="activeWaterLevel !== null" style="margin-top: 1rem">
  <strong>Live Water Level Reading:</strong> {{ activeWaterLevel }}%
  <div v-if="waterLevelStatus" :class="['status', waterLevelStatus]">
    {{ waterLevelMessage }}
  </div>
</div>
<p v-else>No active water level data received yet.</p>


    <!-- Invisible span for Vue scoped CSS to register dynamic classes -->
    <span style="display: none">
      <span class="status warning"></span>
      <span class="status danger"></span>
      <span class="status normal"></span>
    </span>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted, watch } from 'vue'
import mqtt from 'mqtt'
import axios from 'axios'
import socket from '../utils/socket'
import { useSelectedPlant } from '@/stores/selectedPlant'

const plants = ref([])
const activeMoisture = ref(null)
const activeTemperature = ref(null)
const activeLight = ref(null)
const activeHumidity = ref(null)
const activeWaterLevel = ref(null)



const moistureAlertMessage = ref('')
const moistureAlertType = ref(null)

const temperatureAlertMessage = ref('')
const temperatureAlertType = ref(null)

const lightAlertMessage = ref('')
const lightAlertType = ref(null)

const waterLevelAlertMessage = ref('')
const waterLevelAlertType = ref(null)


const selectedPlantStore = useSelectedPlant()

// Computed properties for MOISTURE
const moistureStatus = computed(() => {
  if (moistureAlertType.value) return moistureAlertType.value
  if (activeMoisture.value === null) return null

  const currentPlant = plants.value.find(
    (p) => p.userPlantId === selectedPlantStore.selectedPlantId
  )
  if (!currentPlant) return null

  const moisture = parseFloat(activeMoisture.value)
  if (moisture < currentPlant.min_percentage) return 'warning'
  if (moisture > currentPlant.max_percentage) return 'danger'
  return 'normal'
})

const moistureMessage = computed(() => {
  if (moistureAlertMessage.value) return moistureAlertMessage.value

  switch (moistureStatus.value) {
    case 'warning':
      return `${selectedPlantStore.selectedPlantName} - Moisture too low!`
    case 'danger':
      return `${selectedPlantStore.selectedPlantName} - Moisture too high!`
    case 'normal':
      return `${selectedPlantStore.selectedPlantName} - Moisture level is fine.`
    default:
      return ''
  }
})

// Computed properties for TEMPERATURE
const temperatureStatus = computed(() => {
  if (temperatureAlertType.value) return temperatureAlertType.value
  if (activeTemperature.value === null) return null

  const currentPlant = plants.value.find(
    (p) => p.userPlantId === selectedPlantStore.selectedPlantId
  )
  if (!currentPlant) return null

  const temp = parseFloat(activeTemperature.value)
  if (temp < currentPlant.min_temp) return 'warning'
  if (temp > currentPlant.max_temp) return 'danger'
  return 'normal'
})

const temperatureMessage = computed(() => {
  if (temperatureAlertMessage.value) return temperatureAlertMessage.value

  switch (temperatureStatus.value) {
    case 'warning':
      return `${selectedPlantStore.selectedPlantName} - Temperature too low!`
    case 'danger':
      return `${selectedPlantStore.selectedPlantName} - Temperature too high!`
    case 'normal':
      return `${selectedPlantStore.selectedPlantName} - Temperature is normal.`
    default:
      return ''
  }
})

// Computed properties for LIGHT
const lightStatus = computed(() => {
  if (lightAlertType.value) return lightAlertType.value
  if (activeLight.value === null) return null

  const currentPlant = plants.value.find(
    (p) => p.userPlantId === selectedPlantStore.selectedPlantId
  )
  if (!currentPlant) return null

  const light = parseFloat(activeLight.value)
  const { min: minLight, max: maxLight } = getLightRange(currentPlant.light_requirement || '')

  if (light < minLight) return 'warning'
  if (light > maxLight) return 'danger'
  return 'normal'
})


const lightMessage = computed(() => {
  if (lightAlertMessage.value) return lightAlertMessage.value

  switch (lightStatus.value) {
    case 'warning':
      return `${selectedPlantStore.selectedPlantName} - Light level too low!`
    case 'danger':
      return `${selectedPlantStore.selectedPlantName} - Light level too high!`
    case 'normal':
      return `${selectedPlantStore.selectedPlantName} - Light level is normal.`
    default:
      return ''
  }
})

const waterLevelStatus = computed(() => {
  if (waterLevelAlertType.value) return waterLevelAlertType.value
  if (activeWaterLevel.value === null) return null

  const waterLevel = parseFloat(activeWaterLevel.value)
  if (waterLevel < 30) return 'warning'         // too low threshold (as you requested)

  return 'normal'
})

const waterLevelMessage = computed(() => {
  if (waterLevelAlertMessage.value) return waterLevelAlertMessage.value

  switch (waterLevelStatus.value) {
    case 'warning':
      return `${selectedPlantStore.selectedPlantName} - Water level too high!`
    case 'normal':
      return `${selectedPlantStore.selectedPlantName} - Water level is normal.`
    default:
      return ''
  }
})

const fetchPlants = async () => {
  try {
    const USER_ID = 1 // Replace with actual user ID logic
    const res = await axios.get(`http://localhost:3000/api/plants/user/${USER_ID}`)
    plants.value = res.data
  } catch (err) {
    console.error('Error fetching user plants:', err)
  }
}

const deletePlant = async (id) => {
  try {
    const token = localStorage.getItem('token')
    await axios.delete(`http://localhost:3000/api/plants/user/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    plants.value = plants.value.filter((p) => p.userPlantId !== id)

    if (
      selectedPlantStore.selectedPlantId &&
      !plants.value.find((p) => p.userPlantId === selectedPlantStore.selectedPlantId)
    ) {
      selectedPlantStore.clearPlant()
      activeMoisture.value = null
      moistureAlertMessage.value = ''
      moistureAlertType.value = null
      activeTemperature.value = null
      temperatureAlertMessage.value = ''
      temperatureAlertType.value = null
      activeLight.value = null
      lightAlertMessage.value = ''
      lightAlertType.value = null
      activeHumidity.value = null
      activeWaterLevel.value = null
      waterLevelAlertMessage.value = ''
      waterLevelAlertType.value = null


    }
  } catch (err) {
    console.error('Error deleting plant:', err)
  }
}

const selectPlant = async (userPlantId, name) => {
  selectedPlantStore.selectPlant(userPlantId, name)
  activeMoisture.value = null
  activeTemperature.value = null
  activeLight.value = null
  activeHumidity.value = null
  activeWaterLevel.value = null
  moistureAlertMessage.value = ''
  moistureAlertType.value = null
  temperatureAlertMessage.value = ''
  temperatureAlertType.value = null
  lightAlertMessage.value = ''
  lightAlertType.value = null
  waterLevelAlertMessage.value = ''
  waterLevelAlertType.value = null


  axios.post('http://localhost:3000/api/select-plant', { plantName: name }).catch(console.error)

  try {
    const token = localStorage.getItem('token')
    const moistureRes = await axios.get(`http://localhost:3000/api/plants/moisture/${userPlantId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (moistureRes.data?.moisture != null) {
      activeMoisture.value = moistureRes.data.moisture
    }
  } catch (err) {
    console.error('Error fetching moisture data:', err)
  }

  try {
    const token = localStorage.getItem('token')
    const tempRes = await axios.get(`http://localhost:3000/api/plants/temperature/${userPlantId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (tempRes.data?.temperature != null) {
      activeTemperature.value = tempRes.data.temperature
    }
  } catch (err) {
    console.error('Error fetching temperature data:', err)
  }

  try {
    const token = localStorage.getItem('token')
    const lightRes = await axios.get(`http://localhost:3000/api/plants/light/${userPlantId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (lightRes.data?.light != null) {
      activeLight.value = lightRes.data.light
    }
  } catch (err) {
    console.error('Error fetching light data:', err)
  }
  try {
  const token = localStorage.getItem('token')
  const humidityRes = await axios.get(`http://localhost:3000/api/plants/humidity/${userPlantId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (humidityRes.data?.humidity != null) {
    activeHumidity.value = humidityRes.data.humidity
  }
} catch (err) {
  console.error('Error fetching humidity data:', err)
}
try {
  const token = localStorage.getItem('token')
  const waterRes = await axios.get(`http://localhost:3000/api/plants/water-level/${userPlantId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (waterRes.data?.water_level != null) {
    activeWaterLevel.value = waterRes.data.water_level
  }
} catch (err) {
  console.error('Error fetching water level data:', err)
}


}

// Optional: MQTT Setup for live sensor updates
const setupMQTT = () => {
  const client = mqtt.connect('ws://localhost:9001')

  client.on('connect', () => {
    console.log('☁️ MQTT connected')
    client.subscribe('wio/readings')
  })

  client.on('message', (topic, msg) => {
    if (topic === 'wio/readings') {
      try {
        const data = JSON.parse(msg.toString())
        const { user_plant_id, moisture, temperature, light, humidity, water_level } = data
        if (user_plant_id === selectedPlantStore.selectedPlantId) {
          if (moisture != null) activeMoisture.value = moisture
          if (temperature != null) activeTemperature.value = temperature
          if (light !== undefined) activeLight.value = light
          if (humidity != null) activeHumidity.value = humidity
          if (water_level != null) activeWaterLevel.value = water_level

        }
      } catch (err) {
        console.error('Invalid MQTT message:', err)
      }
    }
  })

  client.on('error', (err) => {
    console.error('MQTT error:', err)
  })
}

// Socket listeners
const onMoistureUpdate = (data) => {
  if (data.user_plant_id === selectedPlantStore.selectedPlantId) {
    activeMoisture.value = data.moisture
    moistureAlertMessage.value = ''
    moistureAlertType.value = null
  }
}

const onMoistureAlert = (alert) => {
  if (selectedPlantStore.selectedPlantId) {
    moistureAlertMessage.value = alert.message

    // Only set if the alert type is valid
    const validTypes = ['normal', 'warning', 'danger']
    if (validTypes.includes(alert.type)) {
      moistureAlertType.value = alert.type
    } else {
      moistureAlertType.value = null  // fallback to computed
    }
  }
}


const onTemperatureUpdate = (data) => {
  if (data.user_plant_id === selectedPlantStore.selectedPlantId) {
    activeTemperature.value = data.temperature
    temperatureAlertMessage.value = ''
    temperatureAlertType.value = null
  }
}

const onTemperatureAlert = (alert) => {
  if (selectedPlantStore.selectedPlantId) {
    temperatureAlertMessage.value = alert.message
    const validTypes = ['normal', 'warning', 'danger'];
    if (validTypes.includes(alert.type)) {
      temperatureAlertType.value = alert.type;
    } else {
      temperatureAlertType.value = null;
    }
  }
}

const onLightUpdate = (data) => {
  if (data.user_plant_id === selectedPlantStore.selectedPlantId) {
    // Default to 0 if null/undefined, otherwise use the value
    activeLight.value = data.light ?? 0; // Nullish coalescing operator
    lightAlertMessage.value = '';
    lightAlertType.value = null;
  }
}

const onLightAlert = (alert) => {
  if (selectedPlantStore.selectedPlantId) {
    lightAlertMessage.value = alert.message;
    const validTypes = ['normal', 'warning', 'danger'];
    if (validTypes.includes(alert.type)) {
      lightAlertType.value = alert.type;
    } else {
      lightAlertType.value = null;
    }
  }
}
const getLightRange = (requirement) => {
  const req = requirement.toLowerCase();
  if (req.includes('full sun')) return { min: 75, max: 100 };
  if (req.includes('partial sun')) return { min: 40, max: 75 };
  if (req.includes('low sun')) return { min: 0, max: 40 };
  return { min: 0, max: 100 };
}


const onHumidityUpdate = (data) => {
  if (data.user_plant_id === selectedPlantStore.selectedPlantId) {
    activeHumidity.value = data.humidity
  }
}
const onWaterLevelUpdate = (data) => {
  if (data.user_plant_id === selectedPlantStore.selectedPlantId) {
    activeWaterLevel.value = data.water_level
  }
}
const onWaterLevelAlert = (alert) => {
  if (selectedPlantStore.selectedPlantId) {
    waterLevelAlertMessage.value = alert.message
    const validTypes = ['normal', 'warning', 'danger']
    if (validTypes.includes(alert.type)) {
      waterLevelAlertType.value = alert.type
    } else {
      waterLevelAlertType.value = null
    }
  }
}




onMounted(() => {
  fetchPlants()
  setupMQTT()
  socket.on('moisture_update', onMoistureUpdate)
  socket.on('moisture_alert', onMoistureAlert)
  socket.on('temperature_update', onTemperatureUpdate)
  socket.on('temperature_alert', onTemperatureAlert)
  socket.on('light_update', onLightUpdate)
  socket.on('light_alert', onLightAlert)
  socket.on('humidity_update', onHumidityUpdate)
  socket.on('water_level_update', onWaterLevelUpdate)
  socket.on('water_level_alert', onWaterLevelAlert)
})

onUnmounted(() => {
  socket.off('moisture_update', onMoistureUpdate)
  socket.off('moisture_alert', onMoistureAlert)
  socket.off('temperature_update', onTemperatureUpdate)
  socket.off('temperature_alert', onTemperatureAlert)
  socket.off('light_update', onLightUpdate)
  socket.off('light_alert', onLightAlert)
  socket.off('humidity_update', onHumidityUpdate)
  socket.off('water_level_update', onWaterLevelUpdate)
  socket.off('water_level_alert', onWaterLevelAlert)

})

watch(
  () => selectedPlantStore.selectedPlantId,
  (newPlantId, oldPlantId) => {
    if (oldPlantId) socket.emit('leave_plant_room', oldPlantId)
    if (newPlantId) {
      socket.emit('join_plant_room', newPlantId)
      activeMoisture.value = null
      activeTemperature.value = null
      activeLight.value = null
      activeHumidity.value = null
      activeWaterLevel.value = null
      moistureAlertMessage.value = ''
      moistureAlertType.value = null
      temperatureAlertMessage.value = ''
      temperatureAlertType.value = null
      lightAlertMessage.value = ''
      lightAlertType.value = null
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.plant-sections {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.my-plants,
.active-plants {
  flex: 1;
  min-width: 300px;
  background: #f0fff4;
  border: 2px solid #C71585;
  border-radius: 8px;
  padding: 1.5rem;
}

.my-plants h2,
.active-plants h2 {
  color: #228B22;
}

.my-plants li {
  margin: 0.75rem 0;
  padding: 0.5rem;
  background: #ffffff;
  border-left: 4px solid #C71585;
  position: relative;
  cursor: pointer;
}

.my-plants li.selected {
  background-color: #d0f0e8;
  border-left-color: #4caf50;
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

.select-btn {
  margin-left: 1rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.select-btn[disabled] {
  background-color: #a5d6a7;
  cursor: default;
}

.status {
  padding: 0.5rem;
  margin-top: 0.5rem;
  border-radius: 4px;
  font-weight: bold;
}

.status.warning {
  background-color: #f8d7da;
  color: #856404;
}

.status.danger {
  background-color: #f8d7da;
  color: #721c24;
}

.status.normal {
  background-color: #d4edda;
  color: #155724;
}
</style>
