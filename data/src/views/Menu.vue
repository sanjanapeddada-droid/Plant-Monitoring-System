<template>
  <div class="menu-container">
    
    <div class="menu-page">
      <h1>Menu Page</h1>
      <router-view />
      
    </div>
  </div>
</template>



<style scoped>
.menu-container {
  text-align: center;
  padding: 2rem;
}

.myPlants, .activeSensors {
  margin-top: 1rem;
}

.myPlants h2, .activeSensors h2 {
  color: #228B22;
}
</style>


<style scoped>
.menu-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}


.activeSensors {
  margin-bottom: 2rem;
  text-align: center;
}

.activeSensors h2 {
  font-size: 1.5rem;
  color: #228B22;
  margin-bottom: 1rem;
}

.activeSensors p {
  font-size: 1rem;
  line-height: 1.6;
  color: #333;
}
</style>
