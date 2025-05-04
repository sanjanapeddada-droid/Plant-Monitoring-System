<template>
  <div id="app">
    <aside class="sidebar">
      <h1 class="title">Plant Monitoring</h1>
      <nav>
        <ul>
          <li v-if="!isLoggedIn">
            <router-link to="/signup">Sign Up</router-link>
          </li>
          <li v-if="!isLoggedIn">
            <router-link to="/login">Log In</router-link>
          </li>
          <li v-else>
            <button @click="signOut">Sign Out</button>
          </li>
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
      <router-view/>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router     = useRouter()
const isLoggedIn = computed(() => !!localStorage.getItem('token'))

function signOut() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
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
.sidebar a, .sidebar button {
  color: white;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}
.content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}
</style>
