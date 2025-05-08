

<template>
    <div class="plant-database">
      <h2>Plant Database</h2>
      <ul>
        <li v-for="plant in plants" :key="plant.id">
          {{ plant.name }} – Optimal Moisture: {{ plant.moisture }}
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>

  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  const plants = ref([])
  const error  = ref(null)



  onMounted(async () => {
  try {
    const res = await axios.get('/api/plant_profiles')
    plants.value = res.data
  } catch (e) {
    console.error(e)
    error.value = 'Could not load plant data'
  }
})
</script>

  




  
  <style scoped>
  .plant-database {
    text-align: center;
    padding: 2rem;
  }
  
  .plant-database h2 {
    margin-bottom: 1rem;
    color: #00d991;
  }
  
  .plant-database ul {
    list-style: none;
    padding: 0;
  }
  
  .plant-database li {
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }
  </style>
  