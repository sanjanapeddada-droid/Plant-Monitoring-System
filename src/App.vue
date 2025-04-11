<script setup>
import Login from './views/Login.vue'
import { ref } from 'vue'
const showLogin = ref(false)
</script>

<template>
  <div class="sidebar">
    
    <div class="title">Plant Monitoring System</div>
    
   
    <nav>
      <ul class="menu">
        <li>
          <router-link to="/dashboard" class="menu-link">Dashboard</router-link>
        </li>
        <li>
          <router-link to="/login" class="menu-link">Login</router-link>
        </li>
        <li>
          <router-link to="/menu" class="menu-link">Menu</router-link>
          
          <ul class="submenu">
            <li><router-link to="/menu/MyPlants" class="submenu-link">My plants</router-link></li>
            <li><router-link to="/menu/ActiveSensors" class="submenu-link">Active sensors</router-link></li>
          </ul>
        </li>
      </ul>
    </nav>
  </div>
  
  <!-- Main content area, shifted right to accommodate the sidebar -->
  <div class="content">
    <router-view />
  </div>
</template>


<style scoped>
/* Sidebar container for the title and menu */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;               
  height: 100vh;
  background-color: #5db09e;
  padding: 1rem;
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
}


.title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: left;
}


.menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu li {
  margin-bottom: 0.75rem;
}


.menu-link {
  text-decoration: none;
  color: #052c18;
}


.router-link-active {
  font-weight: bold;
  color: #7d67b6;
}


.submenu {
  list-style: none;
  padding-left: 1rem;  /* Indent nested items */
  margin-top: 0.5rem;
}

.submenu-link {
  text-decoration: none;
  color: #173522;
}


.content {
  margin-left: 260px;  /* This margin should be greater than the sidebar width */
  padding: 1rem;
}
nav:hover {
  background-color: #eaaab7;
}
</style>

