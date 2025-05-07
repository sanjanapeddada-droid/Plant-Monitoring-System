<template>
  <div id="app">
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
        </ul>
      </nav>
    </aside>
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
// Import the auth store
import { auth } from './stores/auth'

// Access the router
const router = useRouter()

// Computed property to check if the user is logged in using the auth store
const isLoggedIn = computed(() => auth.isLoggedIn)

// Function to handle sign out (logout)
function signOut() {
  auth.logout()  // Clear the user data and token from the store and localStorage
  router.push('/login')  // Redirect to the login page
}
</script>

<style>
#app {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 220px;
  background: #5db09e;
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
