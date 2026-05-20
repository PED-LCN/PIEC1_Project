// ============================================================
//  Hub IoE — Firmware de Validação
//  Hardware: Arduino Nano ATmega328P (Old Bootloader)
//  Adaptado do código ESP32 para validação física na protoboard
//  Serial: 115200 baud — abrir Serial Monitor na Arduino IDE
// ============================================================

// --- PINOS ---
const int pinoEnergia = A0;  // Sinal do sensor de corrente via DC Offset
const int pinoAgua    = 2;   // Sinal do YF-S201 (INT0 — interrupção de hardware)

// --- VARIÁVEIS DO SENSOR DE ÁGUA ---
volatile int contadorPulsos = 0;  // volatile: modificada dentro da interrupção
unsigned long tempoAnterior = 0;

// --- CONSTANTE DO SENSOR DE CORRENTE ---
// Arduino Nano: ADC 10 bits → valores de 0 a 1023
// Valor de repouso sem corrente: ~512 (ponto central do DC Offset em 2,5V)
const int ADC_REPOUSO = 512;
const int ADC_MAX     = 1023;

// Função de interrupção — chamada a cada pulso do YF-S201
// Nota: no Arduino não existe IRAM_ATTR (é específico do ESP32)
void contarPulso() {
  contadorPulsos++;
}

void setup() {
  Serial.begin(115200);

  // Pull-up interno no pino D2 — evita leituras falsas quando o sensor
  // não está girando (sem este pinMode o pino ficaria "flutuando")
  pinMode(pinoAgua, INPUT_PULLUP);

  // Interrupção no pino D2 (INT0 do ATmega328P)
  // FALLING: conta quando o sinal vai de HIGH para LOW (pulso do sensor)
  attachInterrupt(digitalPinToInterrupt(pinoAgua), contarPulso, FALLING);

  Serial.println("Hub IoE - Validacao Arduino Nano iniciada!");
  Serial.println("Formato: {\"energia_amperes\": X.XX, \"energia_watts\": X.XX, \"agua_pulsos\": N}");
  Serial.println("---");
}

void loop() {
  unsigned long tempoAtual = millis();

  // Envia leitura a cada 2 segundos
  if (tempoAtual - tempoAnterior >= 2000) {
    tempoAnterior = tempoAtual;

    // ── 1. LEITURA DA ENERGIA ──────────────────────────────────
    // analogRead(A0) retorna 0-1023
    // O DC Offset coloca o repouso em ~512 — a onda AC oscila em torno disso
    // Para calcular RMS corretamente, amostramos várias vezes e calculamos
    // o desvio em relação ao ponto de repouso

    long somaQuadrados = 0;
    const int NUM_AMOSTRAS = 200;

    for (int i = 0; i < NUM_AMOSTRAS; i++) {
      int leitura = analogRead(pinoAgua == 2 ? A0 : pinoEnergia);
      // Centraliza em torno do offset (512 = metade de 1023)
      int desvio = leitura - ADC_REPOUSO;
      somaQuadrados += (long)desvio * desvio;
      delayMicroseconds(100); // ~100µs entre amostras → ~10kHz de amostragem
    }

    // Calcula valor RMS do desvio (em unidades ADC)
    float rmsADC = sqrt((float)somaQuadrados / NUM_AMOSTRAS);

    // Converte para tensão RMS real (sensor entrega até 1V pico para 100A)
    // ADC_REPOUSO (512 counts) = 2,5V = 0A
    // Cada count = 5V / 1023 ≈ 0,004887V por count
    float tensaoRMS = rmsADC * (5.0 / 1023.0);

    // Sensor 100A/1V → 1V pico = 100A pico → tensão RMS × 100 = corrente RMS
    // (o sensor já entrega tensão proporcional à corrente)
    float correnteRMS = tensaoRMS * 100.0;

    // Potência aparente (assumindo rede 220V — ajuste se for 127V)
    float potenciaWatts = correnteRMS * 220.0;

    // ── 2. LEITURA DA ÁGUA ────────────────────────────────────
    // Desabilita interrupção brevemente para ler/zerar o contador com segurança
    detachInterrupt(digitalPinToInterrupt(pinoAgua));
    int pulsosAtuais = contadorPulsos;
    contadorPulsos = 0;
    attachInterrupt(digitalPinToInterrupt(pinoAgua), contarPulso, FALLING);

    // ── 3. MONTA E ENVIA O JSON ───────────────────────────────
    // Mesmo formato que o backend Spring Boot vai receber via MQTT
    String payload = "{";
    payload += "\"energia_amperes\": " + String(correnteRMS, 2) + ", ";
    payload += "\"energia_watts\": "   + String(potenciaWatts, 2) + ", ";
    payload += "\"agua_pulsos\": "     + String(pulsosAtuais);
    payload += "}";

    Serial.println(payload);
  }
}

// ============================================================
//  NOTAS DE MIGRAÇÃO PARA ESP32 (TTGO LilyGO LoRa32)
//  Quando migrar, alterar:
//    pinoEnergia : A0  → 34
//    pinoAgua    : 2   → 33
//    ADC_REPOUSO : 512 → 2048  (12 bits, 3,3V)
//    ADC_MAX     : 1023 → 4095
//    tensaoRMS   : (5.0 / 1023.0) → (3.3 / 4095.0)
//    Adicionar IRAM_ATTR antes de contarPulso()
//    Adicionar bibliotecas WiFi.h e PubSubClient.h para MQTT
// ============================================================
