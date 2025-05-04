
# How to Add the Wi-Fi Configuration File

1. Create a file with the name wifi_config.h

2. Write this in the wifi_config.h file:

    #pragma once  

    const char* ssid = "wifi_name";     

    const char* password = "wifi_password"; 

    const char* mqtt_server = "IP_adress";    

    (The IP adress you can find by writing ipconfig in the powershell.)

In the Read_sensor_readings.ino file there is a #include "wifi_config.h" that gets the wifi credentials of the choosen wifi. 
You can change the wifi credential if you need to change enviroment. The .gitignore file will make sure that the wifi_config.h file 
is not pushed to git, making sure that your wifi credential isn't public.

# plant-monitoring-system

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

