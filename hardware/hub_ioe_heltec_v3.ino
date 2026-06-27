
#include <WiFi.h>
#include <PubSubClient.h>

// ── CONFIGURAÇÕES WI-FI ─────────────────────────────────────
const char* WIFI_SSID     = "SEU_WIFI_AQUI";
const char* WIFI_PASSWORD = "SUA_SENHA_AQUI";

// ── CONFIGURAÇÕES MQTT ──────────────────────────────────────
const char* MQTT_BROKER    = "broker.hivemq.com";
const int   MQTT_PORT      = 1883;
const char* MQTT_TOPIC     = "hubioe/residencia/leituras";
const char* MQTT_CLIENT_ID = "hub_ioe_central_01";

// ── PINOS — Heltec WiFi LoRa 32 V3 ─────────────────────────
// Consultar pinout HTIT-WB32LA(F)_V3
const int pinoEnergia = 1;   // GPIO1 — ADC1_CH0 — sinal DC Offset
const int pinoAgua    = 2;   // GPIO2 — ADC1_CH1 — pulsos YF-S201

// ── CONSTANTES DO SENSOR DE CORRENTE ────────────────────────
// ESP32: ADC 12 bits → 0 a 4095 counts, referência 3,3V
//
// MidRail real medido no Nano = 1,568V
// Convertendo para 12 bits:
//   ADC_REPOUSO = (1568 / 3300) * 4095 ≈ 1946 counts
//
// ATENÇÃO: após montar o circuito no ESP32, rodar o sketch
// de calibração abaixo para obter o valor real, pois a
// tensão do divisor pode variar com a nova referência de 3,3V.
const int   ADC_REPOUSO  = 1946;   // ajustar após calibração
const int   NUM_AMOSTRAS = 200;
const float LIMIAR_RUIDO = 0.0;    // calibrar após primeira leitura

// ── VARIÁVEIS DO SENSOR DE ÁGUA ─────────────────────────────
volatile int contadorPulsos = 0;
unsigned long tempoAnterior = 0;

// ── OBJETOS ─────────────────────────────────────────────────
WiFiClient   wifiClient;
PubSubClient mqttClient(wifiClient);

// ── INTERRUPÇÃO YF-S201 ──────────────────────────────────────
// IRAM_ATTR: garante execução na RAM interna do ESP32
// para resposta rápida e segura durante a interrupção
void IRAM_ATTR contarPulso() {
  contadorPulsos++;
}

// ── CONEXÃO WI-FI ────────────────────────────────────────────
void conectarWiFi() {
  Serial.print("Conectando ao Wi-Fi: ");
  Serial.println(WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int tentativas = 0;
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    tentativas++;
    if (tentativas > 30) {
      Serial.println("\nFalha no Wi-Fi! Reiniciando...");
      ESP.restart();
    }
  }
  Serial.println("\nWi-Fi conectado!");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
}

// ── CONEXÃO MQTT ─────────────────────────────────────────────
void conectarMQTT() {
  mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
  while (!mqttClient.connected()) {
    Serial.print("Conectando ao broker MQTT...");
    if (mqttClient.connect(MQTT_CLIENT_ID)) {
      Serial.println(" conectado!");
      Serial.print("Tópico: ");
      Serial.println(MQTT_TOPIC);
    } else {
      Serial.print(" falhou, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" tentando novamente em 3s...");
      delay(3000);
    }
  }
}

// ── SETUP ────────────────────────────────────────────────────
void setup() {
  Serial.begin(115200);
  Serial.println("Hub IoE - Heltec WiFi LoRa 32 V3 iniciando...");

  // Sensor de água — pull-up interno evita leituras falsas
  pinMode(pinoAgua, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(pinoAgua), contarPulso, FALLING);

  // Wi-Fi e MQTT
  conectarWiFi();
  conectarMQTT();

  Serial.println("Sistema pronto!");
  Serial.println("---");
}

// ── LOOP ─────────────────────────────────────────────────────
void loop() {
  // Mantém conexão MQTT ativa
  if (!mqttClient.connected()) {
    conectarMQTT();
  }
  mqttClient.loop();

  unsigned long tempoAtual = millis();

  if (tempoAtual - tempoAnterior >= 2000) {
    tempoAnterior = tempoAtual;

    // ── 1. LEITURA DA ENERGIA ────────────────────────────
    // Amostragem RMS: 200 leituras com 100µs de intervalo
    // → taxa de amostragem ≈ 10 kHz (suficiente para 60 Hz)
    long somaQuadrados = 0;
    for (int i = 0; i < NUM_AMOSTRAS; i++) {
      int leitura = analogRead(pinoEnergia);
      int desvio  = leitura - ADC_REPOUSO;
      somaQuadrados += (long)desvio * desvio;
      delayMicroseconds(100);
    }

    // Valor RMS do desvio em counts
    float rmsADC = sqrt((float)somaQuadrados / NUM_AMOSTRAS);

    // Converte counts → tensão RMS
    // ESP32: 3,3V / 4095 counts
    float tensaoRMS = rmsADC * (3.3 / 4095.0);

    // Converte tensão → corrente
    // Sensor 100A/1V: 1V pico → 100A pico
    // MidRail real = 1,568V → usado como referência de escala
    float correnteRMS = (tensaoRMS / 1.568) * 100.0;

    // Noise gate — zera leituras abaixo do limiar de ruído
    if (correnteRMS < LIMIAR_RUIDO) correnteRMS = 0.0;

    // Potência aparente — ajuste para 127.0 se rede for 127V
    float potenciaWatts = correnteRMS * 220.0;

    // ── 2. LEITURA DA ÁGUA ────────────────────────────────
    // Desabilita interrupção brevemente para leitura atômica
    detachInterrupt(digitalPinToInterrupt(pinoAgua));
    int pulsosAtuais = contadorPulsos;
    contadorPulsos   = 0;
    attachInterrupt(digitalPinToInterrupt(pinoAgua), contarPulso, FALLING);

    // ── 3. MONTA O JSON ───────────────────────────────────
    String payload = "{";
    payload += "\"energia_amperes\": " + String(correnteRMS, 2)   + ", ";
    payload += "\"energia_watts\": "   + String(potenciaWatts, 2) + ", ";
    payload += "\"agua_pulsos\": "     + String(pulsosAtuais);
    payload += "}";

    // ── 4. PUBLICA VIA MQTT ───────────────────────────────
    if (mqttClient.publish(MQTT_TOPIC, payload.c_str())) {
      Serial.print("Publicado: ");
      Serial.println(payload);
    } else {
      Serial.println("Falha ao publicar — reconectando...");
      conectarMQTT();
    }
  }
}

// ============================================================
//  SKETCH DE CALIBRAÇÃO DO MIDRail — rodar antes do firmware
//  principal para obter o ADC_REPOUSO real do circuito no ESP32
//
//  void setup() { Serial.begin(115200); }
//  void loop() {
//    long soma = 0;
//    for (int i = 0; i < 5000; i++) soma += analogRead(1);
//    float media = soma / 5000.0;
//    float tensao = media * (3.3 / 4095.0);
//    Serial.print("ADC medio: "); Serial.print(media);
//    Serial.print(" | MidRail: "); Serial.println(tensao, 4);
//    delay(1000);
//  }
// ============================================================

// ============================================================
//  NOTAS DE EXPANSÃO — NÓS DE ÁGUA COM LoRa (fase futura)
//
//  O Heltec V3 já possui rádio LoRa SX1276 integrado em 915MHz.
//  Cada nó remoto de água enviará pulsos do YF-S201 via LoRa
//  para este nó central, que agregará ao payload MQTT.
//
//  Biblioteca necessária: LoRa.h (Sandeep Mistry)
//
//  Tópicos MQTT futuros:
//    hubioe/residencia/leituras  ← este nó (energia + água local)
//    hubioe/agua/no1             ← nó remoto 1
//    hubioe/agua/no2             ← nó remoto 2
// ============================================================
