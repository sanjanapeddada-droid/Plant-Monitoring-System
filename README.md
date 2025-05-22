#  Plant Monitoring System

##  Purpose and Benefits

This project aims to monitor indoor plant conditions using smart sensors. The system continuously tracks temperature, light levels, soil moisture, water levels, and humidity to help plant owners take better care of their plants.

###  Benefits:
- Prevents over or under watering
- Warns if the light exposure is too high or too low
- Real time environmental feedback (humidity, temperature, light, water)
- Easy to use GUI with historical data

---

##  Hardware & Software Architecture

###  Hardware
- **Wio Terminal**
- **Wio Terminal Battery Chassis**
- **Grove Sensors:**
  - DHT11 for temperature and humidity
  - Soil moisture sensor
  - Light sensor
  - Water presence sensor

### Software
- **Arduino (C++)** on Wio Terminal
- **Mosquitto MQTT Broker** (running on local network)
- **Vue.js Frontend** (displays live sensor data)
- **MySQL** (stores sensor history)
- **CI/CD pipeline** via GitLab for Arduino builds

>  *Architecture Diagram:*  
[![Architecture Diagram](https://git.chalmers.se/courses/dit113/2025/group-12/plant-monitoring-system/-/wikis/uploads/2f376b7f179247ee3e0079d3afb4c782/Screenshot_2025-04-10_at_17.05.45.png)](https://git.chalmers.se/courses/dit113/2025/group-12/plant-monitoring-system/-/wikis/uploads/2f376b7f179247ee3e0079d3afb4c782/Screenshot_2025-04-10_at_17.05.45.png)

---

##  How to Set Up and Run

###  Requirements
- Arduino IDE with **PubSubClient** and **DHT** libraries
- Docker + Mosquitto (with WebSocket configured)
- Node.js + Vue CLI 

---

###  Arduino Setup
1. Open Arduino IDE
2. Install libraries:
    - Select Tools>Manage libraries 
    - Search up and install:
        "PubSubClient"
        "rpcWifi"
        "DHT"
        “ArduinoJson"
3. Include libraries:
    - Skiss>Include Libraries
    - Select:
        "PubSubClient"
        "rpcWifi"
        "DHT"
        “ArduinoJson"
4. Upload code to Wio Terminal
5. Ensure WiFi credentials and MQTT broker IP are correctly configured

---

###  MQTT Broker (Mosquitto)
1. Edit "Mosquitto conf" to enable WebSocket:
    ```bash
    listener 1883
    protocol mqtt

    listener 9001
    protocol websockets
    ```
2. Run:

    ```bash
    mosquitto -c mosquitto.conf
    ```

---

###  Vue Frontend
1. Navigate to the "Data/" folder
2. Run:
    ```bash
    npm install
    npm run dev
    ```
3. The Vue app will connect to MQTT over WebSocket

---

### Server 
1. Open a terminal 
2. cd into the backend folder 
3. type node server.js 
if everything is set up correctly you will see a messege similar to:


![alt text](image.png)

---

### Database (mySQL)

1. Install mySQL: https://dev.mysql.com/downloads/installer/

2. In terminal type: mysql -u root -p.
3. When prompted to enter a password, simply press enter.
4. type CREATE DATABASE plantdb;
5. USE plantdb;
6. Now we need to connect to the rest of the code.
7. Start by finding the path to plantdb.sql in the repo.
8. Type: SOURCE C:your/path;

---

### Node modules
1. cd into project root.
2. type: npm install socket.io
3. cd into the data folder. 
4. type: npm install socket.io
5. type: npm install socket.io-client
6. cd into backend folder. 
7. type: npm install socket.io
8. cd into dataComparison
9. type: npm install socket.io  

---

### Repository structure 

- to be done 

##  Team Contributions

| Name      | Contribution |
|-----------|--------------|
| **Tilly**     | Arduino programming, sensor integration, documentation |
| **Artemis**   | MQTT setup, CI/CD pipeline, Arduino programming |
| **Sanjana**   | Frontend development with Vue.js |
| **Tyra**      | MySQL integration, data storage logic, frontend development focused on integration with the database|
| **Giovanna**  | Project coordination, development with Vue.js, video editing |

---

