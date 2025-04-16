<template>
    <div class="my-plants">
      <h2>My Plants</h2>
      <ul>
        <li v-for="plant in plants" :key="plant.id">
          {{ plant.name }} – Moisture: {{ plant.moisture }}, Light: {{ plant.light }}, Temp: {{ plant.temp }}
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  
  const plants = ref([
    { id: 1, name: 'Aloe Vera', moisture: '40%', light: 'Medium', temp: '22°C' },
    { id: 2, name: 'Ficus', moisture: '35%', light: 'High', temp: '20°C' }
  ])
  </script>
  
  <style scoped>
  .my-plants {
    text-align: center;
    padding: 2rem;
  }
  
  .my-plants h2 {
    margin-bottom: 1rem;
    color: #00d989;
  }
  
  .my-plants ul {
    list-style: none;
    padding: 0;
  }
  
  .my-plants li {
    margin: 0.5rem 0;
    font-size: 1.1rem;
  }
  </style>
  