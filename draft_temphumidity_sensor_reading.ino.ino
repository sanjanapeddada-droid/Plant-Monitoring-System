#include <rpcWiFi.h>
#include <PubSubClient.h>
#include "DHT.h"

// DHT sensor settings
#define DHTPIN 0            // use D1 (Grove digital port)
#define DHTTYPE DHT11       // sensor type: DHT11

// moisture sensor settings
#define moisturePin A0
const char* moistureTopic = "wio/moisture";
const char* temperatureTopic = "wio/temperature";
const char* humidityTopic = "wio/humidity";

// wiFi and MQTT settings
const char* ssid = "TP-Link_755C_5G";
const char* password = "59822936";
const char* mqtt_server = "192.168.0.105";

WiFiClient wifiClient;
PubSubClient client(wifiClient);
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  while (!Serial);  

  dht.begin();  

  Serial.print("Connecting to Wi-Fi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println(" Connected!");

  client.setServer(mqtt_server, 1883);
  delay(2000);
}

void connectMQTT() {
  while (!client.connected()) {
    Serial.println("Connecting to MQTT...");
    if (client.connect("WioClient")) {
      Serial.println("Connected to MQTT");
    } else {
      Serial.print("MQTT connection failed. State: ");
      Serial.println(client.state());
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
  int moistureValue = analogRead(moisturePin);
  char moisturePayload[10];
  sprintf(moisturePayload, "%d", moistureValue);
  client.publish(moistureTopic, moisturePayload);
  Serial.print("Moisture: ");
  Serial.println(moisturePayload);

  // read temperature
  Serial.println("Reading temperature...");
  float temperatureC = dht.readTemperature();
  if (!isnan(temperatureC)) {
    char tempPayload[10];
    dtostrf(temperatureC, 1, 2, tempPayload);
    client.publish(temperatureTopic, tempPayload);
    Serial.print("Temperature: ");
    Serial.println(tempPayload);
  } else {
    Serial.println("Failed to read temperature from DHT!");
  }

  // read humidity
  Serial.println("Reading humidity...");
  float humidity = dht.readHumidity();
  if (!isnan(humidity)) {
    char humidityPayload[10];
    dtostrf(humidity, 1, 2, humidityPayload);
    client.publish(humidityTopic, humidityPayload);
    Serial.print("Humidity: ");
    Serial.println(humidityPayload);
  } else {
    Serial.println("Failed to read humidity from DHT!");
  }

  delay(300000); // 5 minute intervals 
}
