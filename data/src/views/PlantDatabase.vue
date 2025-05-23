<template>
  <div class="plant-database">
    <h2>Search Plant Database</h2>
    <input
      v-model="search"
      type="text"
      placeholder="Search plant by name..."
      class="search-input"
    />

    <ul v-if="filteredPlants.length">
      <li v-for="plant in filteredPlants" :key="plant.id">
        {{ plant.name }}
        <button class="add-button" @click="addPlant(plant)">Add</button>
      </li>
    </ul>

    <p v-else-if="search">No matching plants found.</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { auth } from '../stores/auth'
import { useSelectedPlant } from '../stores/selectedPlant'
const selectedPlantStore = useSelectedPlant()

const plants = ref([])
const search = ref('')

// Fetch all plant profiles on component mount
onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/plants/profiles')
    plants.value = res.data
  } catch (err) {
    console.error('Failed to fetch plants:', err)
  }
})

// Filter plants based on the search input
const filteredPlants = computed(() => {
  if (!search.value.trim()) return [] // Hide everything if search is empty
  return plants.value.filter(plant =>
    plant.name.toLowerCase().includes(search.value.toLowerCase())
  )
})

// Function to add plant to user's personal list
async function addPlant(plant) {
  console.log('Adding plant, token=', auth.token)

  if (!auth.token) {
    alert('You are not logged in! Please log in first.')
    return
  }

  try {
    // 1. Add to user's list
    await axios.post(
      'http://localhost:3000/api/plants/add',
      { plantName: plant.name },
      { headers: { Authorization: `Bearer ${auth.token}` } }
    )

    // 2. Select plant for monitoring
    await axios.post('http://localhost:3000/api/select-plant', {
      plantName: plant.name
    })

    // 3. Save selection globally
    selectedPlantStore.selectPlant(plant.id, plant.name)

    alert(`${plant.name} has been added!`)
  } catch (err) {
    console.error('Error adding/selecting plant:', err)
    alert('Something went wrong.')
  }
}
</script>


<style scoped>
.plant-database {
  text-align: center;
  padding: 2rem;
  max-width: 600px;
  margin: auto;
}

.search-input {
  padding: 0.5rem;
  width: 100%;
  max-width: 400px;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.add-button {
  background-color: #228B22;
  color: white;
  padding: 0.4rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-button:hover {
  background-color: #228B22;
}
</style>
