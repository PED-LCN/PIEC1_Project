package com.iot.piec1api.modules.leitura;

import com.iot.piec1api.config.security.DeviceAuthService;
import com.iot.piec1api.modules.leitura.dtos.LeituraRequestDTO;
import com.iot.piec1api.modules.leitura.dtos.LeituraResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leituras")
@RequiredArgsConstructor
public class LeituraController {

    private final LeituraService leituraService;
    private final DeviceAuthService deviceAuthService;

    // -----------------------------------------------------------------------
    // ENDPOINT: ESP32 envia dados dos sensores
    // Tipo: POST | URL: http://localhost:8080/api/leituras
    // -----------------------------------------------------------------------
    @PostMapping
    public ResponseEntity<LeituraResponseDTO> registrarLeitura(
            @RequestHeader(name = "X-DEVICE-KEY", required = false) String deviceKey,
            @Valid @RequestBody LeituraRequestDTO dto
    ) {
        deviceAuthService.validarChaveDispositivo(deviceKey);
        LeituraResponseDTO salva = leituraService.receberLeitura(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

    // -----------------------------------------------------------------------
    // ENDPOINT: Front-end (React) busca os dados para desenhar o gráfico
    // Tipo: GET | URL: http://localhost:8080/api/leituras/dispositivo/1
    // -----------------------------------------------------------------------
    @GetMapping("/dispositivo/{dispositivoId}")
    public ResponseEntity<List<LeituraResponseDTO>> listarHistorico(@PathVariable Integer dispositivoId) {
        List<LeituraResponseDTO> historico = leituraService.buscarHistoricoDoDispositivo(dispositivoId);
        return ResponseEntity.ok(historico);
    }
}
