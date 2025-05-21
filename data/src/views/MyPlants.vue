<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const plants = ref([])
const USER_ID = 1 // Replace with dynamic user ID if needed

const activePlant = computed(() => {
  return plants.value.find(p => p.is_active === 1) || null
})

const inactivePlants = computed(() => {
  return plants.value.filter(p => p.is_active !== 1)
})

onMounted(async () => {
  await fetchPlants()
})

const fetchPlants = async () => {
  try {
    const res = await axios.get(`http://localhost:3000/api/plants/user/${USER_ID}`)
    plants.value = res.data.map(p => ({
      ...p,
      is_active: Number(p.is_active)
    }))
    console.log('🌿 Plant data updated:', plants.value)
  } catch (err) {
    console.error('❌ Error fetching user plants:', err)
  }
}

const deletePlant = async (userPlantId) => {
  try {
    const token = localStorage.getItem('token')
    await axios.delete(`http://localhost:3000/api/plants/user/${userPlantId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    plants.value = plants.value.filter(p => p.userPlantId !== userPlantId)
  } catch (err) {
    console.error('❌ Error deleting plant:', err)
  }
}

const toggleActive = async (userPlantId) => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return console.error('No token found')

    const selectedPlant = plants.value.find(p => p.userPlantId === userPlantId)
    const isCurrentlyActive = selectedPlant?.is_active === 1

    plants.value.forEach(p => {
      p.is_active = isCurrentlyActive ? 0 : (p.userPlantId === userPlantId ? 1 : 0)
    })

    await axios.put(`http://localhost:3000/api/plants/user/${userPlantId}/activate`, {
      deactivate: isCurrentlyActive
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })

    console.log(isCurrentlyActive ? '✅ Deactivated!' : '✅ Activated!')
  } catch (err) {
    await fetchPlants()
    console.error('❌ Error toggling plant:', err)
  }
}
</script>

<template>
  <div class="main-content">
    <h1>My Plants</h1>

    <div class="plant-sections">
      <!-- Active Plant -->
      <div class="plant-box">
        <h2>Active Plant</h2>
        <div v-if="activePlant" class="plant-card active">
          <strong>{{ activePlant.name }}</strong><br />
          Moisture: {{ activePlant.min_percentage }}–{{ activePlant.max_percentage }}%<br />
          Light: {{ activePlant.light_requirement }}
          <div class="buttons">
            <button class="delete-btn" @click="deletePlant(activePlant.userPlantId)">Delete</button>
            <button class="deactivate-btn" @click="toggleActive(activePlant.userPlantId)">Deactivate</button>
          </div>
        </div>
        <p v-else>No active plants yet.</p>
      </div>

      <!-- Inactive Plants -->
      <div class="plant-box">
        <h2>Inactive Plants</h2>
        <ul>
          <li v-for="p in inactivePlants" :key="p.userPlantId" class="plant-card">
            <strong>{{ p.name }}</strong><br />
            Moisture: {{ p.min_percentage }}–{{ p.max_percentage }}%<br />
            Needs: {{ p.light_requirement }}
            <div class="buttons">
              <button class="delete-btn" @click="deletePlant(p.userPlantId)">Delete</button>
              <button class="activate-btn" @click="toggleActive(p.userPlantId)">Activate</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-content {
  padding: 2rem;
  width: 100%;
}

h1 {
  font-size: 2rem;
  color: #2e7d32;
  margin-bottom: 1.5rem;
}

.plant-sections {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.plant-box {
  flex: 1;
  min-width: 300px;
  background-color: #f9fffc;
  border: 2px solid #b2dfdb;
  padding: 1rem;
  border-radius: 8px;
}

.plant-box h2 {
  margin-bottom: 1rem;
  color: #388e3c;
}

.plant-card {
  background: #ffffff;
  border-left: 4px solid #009688;
  margin-bottom: 1rem;
  padding: 0.75rem;
  border-radius: 4px;
}

.plant-card.active {
  border-left-color: #ff9800;
}

.buttons {
  margin-top: 0.5rem;
}

button {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  margin-right: 0.5rem;
  color: white;
  cursor: pointer;
}

.delete-btn {
  background-color: #f44336;
}
.delete-btn:hover {
  background-color: #d32f2f;
}

.activate-btn {
  background-color: #4caf50;
}
.activate-btn:hover {
  background-color: #388e3c;
}

.deactivate-btn {
  background-color: #ff9800;
}
.deactivate-btn:hover {
  background-color: #f57c00;
}
</style>

