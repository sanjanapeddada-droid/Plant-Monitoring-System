<template>
  <div class="dashboard">
    <h1>Plant Monitoring System</h1>

    
    <section class="section">
      <h2>System Architecture</h2>
      <p>
        Our Plant Monitoring System is built on a publish/subscribe model using MQTT. Sensors connected to a Wio Terminal measure environmental parameters (soil moisture, temperature, light, and water level) and publish the data to an MQTT broker in JSON format every 30 minutes. The application subscribes to these topics, processes the data, and stores it in a MongoDB database. This architecture enables real-time monitoring and efficient data management.
      </p>
    </section>

    
    <section class="section">
      <h2>Functionality</h2>
      <p>
        Our goal is to provide plant enthusiasts with a seamless, real-time monitoring system that alerts them when conditions are not optimal, helping to ensure that their plants always receive the care they need.
      </p>
    </section>

    
    <section class="section">
      <h2>Sensors</h2>
      <ul>
        <li>
          <strong>Soil Moisture Sensor:</strong> Measures the moisture level of the soil to ensure plants are watered properly.
        </li>
        <li>
          <strong>Temperature Sensor:</strong> Monitors the ambient temperature to alert if it's too high or too low.
        </li>
        <li>
          <strong>Light Sensor:</strong> Detects the intensity of sunlight to check if plants receive adequate light.
        </li>
        <li>
          <strong>Water Level Sensor:</strong> Checks water levels.
        </li>
      </ul>
    </section>
  </div>
</template>



<style scoped>
.dashboard {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.section {
  margin-bottom: 2rem;
  color: #228B22;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
}

h2 {
  color: #228B22;
  margin-bottom: 1rem;
}

p {
  line-height: 1.6;
  font-size: 0.9rem;
  color: #C71585;
}

ul {
  list-style-type: disc;
  margin-left: 1.5rem;
  padding-left: 0;
}

li {
  margin-bottom: 0.5rem;
}
</style>
