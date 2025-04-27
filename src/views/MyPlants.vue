<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const plants = ref([]);
const USER_ID = 1; // replace with ID later (every time someone signs up, they get a unique id)

onMounted(async () => {
  const res = await fetch(`http://localhost:3000/api/plants/user/${USER_ID}`);
  const data = await res.json();
  console.log('🪴 user plants:', data);
  plants.value = data;
});



</script>

<template>
  <div class="my-plants">
    <h2>My Plants</h2>
    <ul>
      <li v-for="p in plants" :key="p.userPlantId">
        {{ p.name }} —
        Moisture: {{ p.min_percentage }}–{{ p.max_percentage }}%
        <br/>
        Needs: {{ p.light_requirement }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.my-plants {
  background: #f0fff4;        
  border: 2px solid #e91e63; 
  border-radius: 8px;
  padding: 1.5rem;
}

.my-plants h2 {
  color: #4caf50;           
}

.my-plants li {
  margin: 0.75rem 0;
  padding: 0.5rem;
  background: #ffffff;
  border-left: 4px solid #e91e63; 
}
</style>
