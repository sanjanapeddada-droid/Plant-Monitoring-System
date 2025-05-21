#include <rpcWiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include "wifi_config.h" //getting the wifi credentials

// DHT sensor settings
#define DHTPIN D2          // use D2 (Grove digital port)
#define DHTTYPE DHT11       // sensor type: DHT11

WiFiClient wifiClient;
PubSubClient client(wifiClient);
DHT dht(DHTPIN, DHTTYPE);

int moisturePin = A0; 
int waterPin = A6;

const char* topic = "wio/readings";

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
  
  client.setServer("mqtt_server", 1883);    
  
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

  // read moisture
  int moistureValue = ((analogRead(moisturePin)/1023.0)*100.0);
  Serial.println(moistureValue);

  // read temperature
  float temperatureC = dht.readTemperature();
  if (!isnan(temperatureC)) {
    Serial.println(temperatureC);
  } else {
    Serial.println("Failed to read temperature from DHT!");
  }

  // read light
  int lightValue = ((analogRead(WIO_LIGHT)/1023.0)*100.0);
  Serial.println(lightValue);

  // read humidity
  float humidity = dht.readHumidity();
  if (!isnan(humidity)) {
    Serial.println(humidity);
  } else {
    Serial.println("Failed to read humidity from DHT!");
  }

  // read waterlevel
  int waterValue = ((analogRead(waterPin)/1023.0)*100.0);
  Serial.println(waterValue);

  // these lines under is from chatgpt. It takes the numeric sensor values, turns it into a string and sends it to an MQTT toppic so other devices can read it.
  char payload[128];
  snprintf(payload, sizeof(payload),"{\"moisture\":%d,\"temperature\":%.1f,\"light\":%d,\"humidity\":%.1f,\"water\":%d}", moistureValue, temperatureC, lightValue, humidity, waterValue);
  client.publish(topic, payload);

  delay(30000); // Send every 30 seconds

}