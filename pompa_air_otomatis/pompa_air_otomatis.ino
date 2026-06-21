#include <WiFi.h>
#include <PubSubClient.h>

const char* ssid = "Infinix GT 30 Pro";
const char* password = "Kanzafatin09";
const char* mqtt_server = "10.142.42.40";

const int soilPin = 35;
const int trigPin = 18;
const int echoPin = 5;
const int relayPin = 23;

const int batasKering = 50;
const int jarakAirHabis = 20;

WiFiClient espClient;
PubSubClient client(espClient);
unsigned long lastMsg = 0;

bool modeManual = false;

void hubungkanWiFi() {
  delay(10);
  Serial.print("Menghubungkan ke WiFi: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Berhasil Terhubung!");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void hubungkanMQTT() {
  while (!client.connected()) {
    Serial.print("Menghubungkan ke MQTT Broker...");
    String clientId = "ESP32-Wokwi-" + String(random(0xffff), HEX);
    if (client.connect(clientId.c_str())) {
      Serial.println("Terhubung ke MQTT!");

      client.subscribe("kebunku/pompa/kontrol");
      Serial.println("Berhasil Subscribe ke topik kontrol!");
      
    } else {
      Serial.print("Gagal, status=");
      Serial.print(client.state());
      Serial.println(". Mencoba lagi dalam 5 detik...");
      delay(5000);
    }
  }
}

void callbackMQTT(char* topic, byte* payload, unsigned int length) {
  String pesan = "";
  for (int i = 0; i < length; i++) {
    pesan += (char)payload[i];
  }

  if (String(topic) == "kebunku/pompa/kontrol") {
    if (pesan == "ON") {
      digitalWrite(relayPin, HIGH);
      modeManual = true;
    } else if (pesan == "OFF") {
      digitalWrite(relayPin, LOW);
      modeManual = false;
    }
  }
}

int bacaKelembabanTanah() {
  int nilaiAnalog = analogRead(soilPin);

  Serial.print("Nilai Analog: ");
  Serial.println(nilaiAnalog);

  int persentase = map(nilaiAnalog, 4095, 0, 0, 100);

  return constrain(persentase, 0, 100);
}

float bacaJarakAir() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long durasi = pulseIn(echoPin, HIGH);
  float jarak = durasi * 0.034 / 2;
  return jarak;
}

String kontrolPompa(int kelembaban, float jarakAir) {
  String status;

  if (kelembaban < batasKering && jarakAir < jarakAirHabis) {
    digitalWrite(relayPin, HIGH);
    status = "MENYALA";
  } else {
    digitalWrite(relayPin, LOW);

    if (jarakAir >= jarakAirHabis) {
      status = "MATI (Air Habis)";
    } else {
      status = "MATI (Tanah Basah)";
    }
  }
  return status;
}

void kirimDataKeMQTT(int kelembaban, float jarakAir, String statusPompa) {
  client.publish("kebunku/tanah", String(kelembaban).c_str());
  client.publish("kebunku/air", String(jarakAir).c_str());
  client.publish("kebunku/pompa", statusPompa.c_str());

  Serial.println("  [v] Data berhasil di-publish ke MQTT Broker!\n");
}

void setup() {
  Serial.begin(115200);

  analogReadResolution(12);

  pinMode(relayPin, OUTPUT);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  digitalWrite(relayPin, LOW);

  hubungkanWiFi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callbackMQTT);
}

void loop() {
  if (!client.connected()) {
    hubungkanMQTT();
  }
  client.loop();
  unsigned long waktuSekarang = millis();
  if (waktuSekarang - lastMsg > 5000) {
    lastMsg = waktuSekarang;
    int kelembabanSaatIni = bacaKelembabanTanah();
    float jarakAirSaatIni = bacaJarakAir();
    String statusPompaSaatIni;
    if (!modeManual) {
      statusPompaSaatIni = kontrolPompa(kelembabanSaatIni, jarakAirSaatIni);
    } else {
      statusPompaSaatIni = digitalRead(relayPin) == HIGH ? "MENYALA" : "MATI";
    }
    Serial.println("--- UPDATE PEMBACAAN SENSOR ---");
    Serial.print("  Kelembaban Tanah : ");
    Serial.print(kelembabanSaatIni);
    Serial.println(" %");
    Serial.print("  Jarak Air Tandon : ");
    Serial.print(jarakAirSaatIni);
    Serial.println(" cm");
    Serial.print("  Status Pompa/LED : ");
    Serial.println(statusPompaSaatIni);
    Serial.println("  -> Bersiap mengirim ke MQTT...");
    kirimDataKeMQTT(kelembabanSaatIni, jarakAirSaatIni, statusPompaSaatIni);
  }
}