<template>
    <div class="active-sensors">
      <h2>Active Sensors</h2>
      <ul>
        <li v-for="sensor in sensors" :key="sensor.id">
          {{ sensor.name }} – Status: {{ sensor.status }}, Value: {{ sensor.value }}
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const sensors = ref([
    { id: 1, name: 'Soil Moisture Sensor', status: 'Active', value: '40%' },
    { id: 2, name: 'Temperature Sensor', status: 'Active', value: '22°C' },
    { id: 3, name: 'Light Sensor', status: 'Active', value: 'High' },
    { id: 4, name: 'Water Level Sensor', status: 'Active', value: 'Normal' }
  ])
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
  