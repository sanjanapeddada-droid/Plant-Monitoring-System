How to add the wifi:

1. Create a file with the name wifi_config.h

2. Write this in the wifi_config.h file:

    #pragma once  

    const char* ssid = "wifi_name";     

    const char* password = "wifi_password"; 

    const char* mqtt_server = "IP_adress";    

    (The IP adress you can find by writing ipconfig in the powershell.)

In the Read_soil_moisture_readings.ino file there is a #include <wifi_config.h> that gets the wifi credentials of the choosen wifi. You can change the wifi credential if you need to change enviroment. The .gitignore file will make sure that the wifi_config.h file si not pushed to git, making sure that your wifi credential isn't public