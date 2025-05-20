<template>
  <div class="plant-sections">
    <!-- My Plants -->
    <div class="my-plants">
      <h2>My Plants</h2>
      <ul>
        <li v-for="p in inactivePlants" :key="p.userPlantId">
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

    <!-- Active Plant -->
    <div class="active-plants">
      <h2>Active Plant</h2>
      <div v-if="activePlant" class="active-plant-card">
        <p>
          <strong>{{ activePlant.name }}</strong><br />
          Moisture Range: {{ activePlant.min_percentage }}–{{ activePlant.max_percentage }}%<br />
          Light: {{ activePlant.light_requirement }}<br />
        </p>
        <div class="buttons">
          <button class="delete-btn" @click="deletePlant(activePlant.userPlantId)">Delete</button>
          <button class="deactivate-btn" @click="toggleActive(activePlant.userPlantId)">Deactivate</button>
        </div>
      </div>
      <p v-else>No active plant selected.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import mqtt from 'mqtt'
import axios from 'axios'

const USER_ID = 1
const plants = ref([])

const activePlant = computed(() => plants.value.find(p => p.is_active === 1) || null)
const inactivePlants = computed(() => plants.value.filter(p => p.is_active !== 1))

const fetchPlants = async () => {
  try {
    const res = await axios.get(`http://localhost:3000/api/plants/user/${USER_ID}`)
    plants.value = res.data.map(p => ({
      ...p,
      is_active: Number(p.is_active)
    }))
  } catch (err) {
    console.error('❌ Error fetching user plants:', err)
  }
}

const deletePlant = async (id) => {
  try {
    const token = localStorage.getItem('token')
    await axios.delete(`http://localhost:3000/api/plants/user/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    plants.value = plants.value.filter(p => p.userPlantId !== id)
  } catch (err) {
    console.error('❌ Error deleting plant:', err)
  }
}

const toggleActive = async (userPlantId) => {
  try {
    const token = localStorage.getItem('token')
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
  } catch (err) {
    await fetchPlants()
    console.error('❌ Error toggling activation:', err)
  }
}

onMounted(() => {
  fetchPlants()
})
</script>
