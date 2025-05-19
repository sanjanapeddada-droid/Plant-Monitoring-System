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

const char* moistureTopic = "wio/moisture"; 
const char* temperatureTopic = "wio/temperature";
const char* humidityTopic = "wio/humidity";
 


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
  
  int moistureValue = analogRead(moisturePin);
  Serial.println(moistureValue);

  int waterValue = analogRead(waterPin);
  Serial.println(waterValue);

  int lightValue = analogRead(WIO_LIGHT);
  Serial.println(lightValue);

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
  
  //char payload[10];                       // this line and the two under is from chatgpt. Explination: It takes a numeric sensor value (moistureValue), 
                                          // turns it into a string, and sends it to an MQTT topic so other devices or apps can read it.
  //sprintf(payload, "%d", moistureValue);
  //client.publish(topic, payload);

  delay(30000); // Send every 30 seconds

}

