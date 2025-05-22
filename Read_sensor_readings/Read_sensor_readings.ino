#include <rpcWiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include "wifi_config.h" //getting the wifi credentials
#include <ArduinoJson.h>

// DHT sensor settings
#define DHTPIN D2          // use D2 (Grove digital port)
#define DHTTYPE DHT11       // sensor type: DHT11

WiFiClient wifiClient;
PubSubClient client(wifiClient);
DHT dht(DHTPIN, DHTTYPE);

int moisturePin = A0; 
int waterPin = A6;

const char* topic = "wio/readings";

unsigned long lastSent = 0;  // Track last publish time

void setup() {
  pinMode(WIO_LIGHT, INPUT);
  Serial.begin(115200); 
  while (!Serial);  

  dht.begin();  

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
  
  StaticJsonDocument<256> doc;

  if (millis() - lastSent > 30000) {   //the interval is 30 seconds
    // read moisture
    int moistureValue = ((analogRead(moisturePin)/1023.0)*100.0);
    Serial.println(moistureValue);
    doc["moisture"] = moistureValue;

    // read temperature
    float temperatureValue = dht.readTemperature();
    Serial.println(temperatureValue);
    doc["temperature"] = temperatureValue;
    
    // read light
    int lightValue = ((analogRead(WIO_LIGHT)/1023.0)*100.0);
    Serial.println(lightValue);
    doc["light"] = lightValue;
  
    // read humidity
    float humidityValue = dht.readHumidity();
    Serial.println(humidityValue);
    doc["humidity"] = humidityValue;
  
    // read waterlevel
    int waterValue = ((analogRead(waterPin)/1023.0)*100.0);
    Serial.println(waterValue);
    doc["water"] = waterValue;
    
    // these lines under is from chatgpt. It takes the numeric sensor values, converts into a JSON string and sends it to an MQTT toppic so other devices can read it.
    char jsonBuffer[256];
    serializeJson(doc, jsonBuffer);
    client.publish(topic, jsonBuffer);
    lastSent = millis();
  }
}