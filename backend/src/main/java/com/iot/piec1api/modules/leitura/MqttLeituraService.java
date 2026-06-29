package com.iot.piec1api.modules.leitura;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.iot.piec1api.modules.leitura.dtos.LeituraRequestDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

// =============================================================
//  MqttLeituraService — ponte entre o MQTT e o LeituraService
//
//  Responsabilidades:
//    1. Receber o payload JSON cru do ESP32
//    2. Deserializar os campos energia_amperes, energia_watts
//       e agua_pulsos
//    3. Chamar o LeituraService existente para cada tipo de
//       leitura, associando ao dispositivo correto
//
//  JSON esperado do ESP32:
//    {"energia_amperes": 3.45, "energia_watts": 758.45, "agua_pulsos": 12}
// =============================================================
@Service
public class MqttLeituraService {

    private static final Logger log = LoggerFactory.getLogger(MqttLeituraService.class);

    @Autowired
    private LeituraService leituraService;

    @Autowired
    private ObjectMapper objectMapper;

    // IDs dos dispositivos cadastrados via migration Flyway
    // ID 1 → Sensor de Energia (SCT-013)
    // ID 2 → Sensor de Água (YF-S201)
    @Value("${mqtt.dispositivoEnergiaId}")
    private Integer dispositivoEnergiaId;

    @Value("${mqtt.dispositivoAguaId}")
    private Integer dispositivoAguaId;

    // ── Processamento da mensagem MQTT ───────────────────────
    public void processarMensagem(String payload) {
        log.info("Mensagem MQTT recebida: {}", payload);

        try {
            JsonNode json = objectMapper.readTree(payload);

            // ── Leitura de energia (watts) ───────────────────
            // Usa energia_watts como valorLeitura pois é a grandeza
            // mais relevante para comparação com o limite de alerta
            if (json.has("energia_watts")) {
                double energiaWatts = json.get("energia_watts").asDouble();

                // Só persiste se houver leitura real (acima do noise gate)
                if (energiaWatts > 0.0) {
                    LeituraRequestDTO dtoEnergia = new LeituraRequestDTO(
                            energiaWatts,
                            dispositivoEnergiaId
                    );
                    leituraService.receberLeitura(dtoEnergia);
                    log.info("Leitura de energia salva: {} W", energiaWatts);
                }
            }

            // ── Leitura de água (pulsos) ─────────────────────
            // Usa agua_pulsos como valorLeitura
            // O backend pode converter para litros futuramente:
            // litros = pulsos / 450.0 (fator YF-S201)
            if (json.has("agua_pulsos")) {
                int aguaPulsos = json.get("agua_pulsos").asInt();

                // Só persiste se houver fluxo real
                if (aguaPulsos > 0) {
                    LeituraRequestDTO dtoAgua = new LeituraRequestDTO(
                            (double) aguaPulsos,
                            dispositivoAguaId
                    );
                    leituraService.receberLeitura(dtoAgua);
                    log.info("Leitura de água salva: {} pulsos", aguaPulsos);
                }
            }

        } catch (Exception e) {
            log.error("Erro ao processar mensagem MQTT: {} | payload: {}", e.getMessage(), payload);
        }
    }
}
