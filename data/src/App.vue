<template>
  <div id="app">
    <Notification
      v-if="notification"
      :type="notification.type"
      :message="notification.message"
      @close="notification = null"
    />

    <aside class="sidebar">
      <h1 class="title">Plant Monitoring</h1>
      <nav>
        <ul>
          <!-- Only show "Sign Up" and "Log In" if the user is not logged in -->
          <li v-if="!isLoggedIn">
            <router-link to="/signup">Sign Up</router-link>
          </li>
          <li v-if="!isLoggedIn">
            <router-link to="/login">Log In</router-link>
          </li>

          <!-- Show "Sign Out" if the user is logged in -->
          <li v-if="isLoggedIn">
            <button @click="signOut">Sign Out</button>
          </li>

          <!-- Show other menu links if the user is logged in -->
          <li>
            <router-link to="/dashboard">Dashboard</router-link>
          </li>
          <li v-if="isLoggedIn">
            <router-link to="/menu/myplants">My Plants</router-link>
          </li>
          <li v-if="isLoggedIn">
            <router-link to="/menu/activesensors">Active Sensors</router-link>
          </li>
          <li v-if="isLoggedIn">
            <router-link to="/menu/plantdatabase">Plant Database</router-link>
          </li>

          <!-- Delete Account link, only when logged in -->
          <li v-if="isLoggedIn">
            <router-link to="/account/delete">Delete Account</router-link>
          </li>
        </ul>
      </nav>
    </aside>

    <main class="content">
      <router-view />
    </main>
  </div>
</template>




<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from './stores/auth'
import socket from './utils/socket'
import Notification from './views/Notification.vue'
import { useSelectedPlant } from './stores/selectedPlant'
import axios from 'axios'

const router = useRouter()
const isLoggedIn = computed(() => auth.isLoggedIn)
const notification = ref(null)
const selectedPlantStore = useSelectedPlant()

const setupSocketListeners = () => {
  socket.on('notification', (data) => {
    notification.value = data
    setTimeout(() => (notification.value = null), 5000)
  })

  socket.on('moisture_alert', (data) => {
    notification.value = {
      type: ['warning', 'danger'].includes(data.type) ? 'warning' : 'success',
      message: data.message
    }
    setTimeout(() => (notification.value = null), 30000)
  })
  
  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err)
  })
}



// Reactively join a socket room when the plant changes
watch(
  () => selectedPlantStore.selectedPlantId,
  (newPlantID) => {
    if (newPlantID) {
      socket.emit('join_plant_room', newPlantID)
      console.log('Joined plant room: plant_${newPlantID}')
    }
  },
  { immediate: true }
)

function signOut() {
  auth.logout()
  router.push('/login')
}

onMounted(async () => {
  setupSocketListeners()
  selectedPlantStore.loadStoredPlant()

  if (selectedPlantStore.selectedPlantName) {
    try {
      await axios.post('http://localhost:3000/api/select-plant', {
        plantName: selectedPlantStore.selectedPlantName
      })
    } catch (err) {
      console.error('Failed to reselect plant:', err)
    }
  }
})
</script>



<style>
#app {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 220px;
  background: #5db09e;;
  padding: 1rem;
}

.sidebar .title {
  color: white;
  margin-bottom: 1rem;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  margin: 0.5rem 0;
}

.sidebar a,
.sidebar button {
  color: white;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  font-family: inherit; 
  width: 100%; 
  text-align: left; 
  padding: 0.5rem; 
  box-sizing: border-box; 
}

.content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}
</style>
