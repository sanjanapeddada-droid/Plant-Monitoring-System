
#include <rpcWiFi.h>
#include <PubSubClient.h>
#include "wifi_config.h" //getting the wifi credentials

WiFiClient wifiClient;
PubSubClient client(wifiClient);

int moisturePin = A0; 
const char* topic = "wio/moisture"; 

void setup() {
  Serial.begin(115200); 
  
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  delay(1000);

  Serial.println("Searching...");
  delay(500);
  

  Serial.print("Connected to ");
  Serial.println(ssid);
  
  client.setServer(mqtt_server, 1883);
  
  delay(2000);
}
void connectMQTT() {
  while (!client.connected()) {
    Serial.println("Connecting to MQTT");
    Serial.println("Searching...");
    if (client.connect("WioClient")) {
      Serial.println("Connected to MQTT");
      delay(500);
    } else {
      Serial.println("Connection failed, retrying in 3 seconds");
      delay(3000);
    }
  }
}

void loop() {
  if (!client.connected()) {
    connectMQTT();
  }
  client.loop(); 
  int moistureValue = analogRead(moisturePin);
  Serial.println(moistureValue);

  char payload[10];                       // this line and the two under is from chatgpt. Explination: It takes a numeric sensor value (moistureValue), 
                                          // turns it into a string, and sends it to an MQTT topic so other devices or apps can read it.
  sprintf(payload, "%d", moistureValue);
  client.publish(topic, payload);

  delay(5000); // Send every 5 seconds

}
