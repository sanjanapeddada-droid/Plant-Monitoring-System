<script setup>
import Login from './views/Login.vue'
import { ref } from 'vue'
const showLogin = ref(false)
</script>

<template>
  <header>
    <div id="app">
    <h1>Welcome to the Plant Monitoring System🌸</h1>
    <router-view /> 
  </div>
  </header>

  <div>
    
    <button :disabled="false" v-if="!showLogin" @click="showLogin = true">Login</button> 
    
    <Login v-if="showLogin" />
    
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  button {
  padding: 0.75rem 1rem;
  font-size: 1.1rem;
  background-color: #0069d9;
  color: #3f19d8;
  border: none;
  border-radius: 4px;
}
button:hover {
  background-color: #d75a73;
}
}
</style>
