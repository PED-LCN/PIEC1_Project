package com.iot.piec1api.modules.alerta;

import com.iot.piec1api.modules.alerta.dtos.AlertaResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alertas")
@RequiredArgsConstructor
public class AlertaController {

    private final AlertaService alertaService;

    // GET: /api/alertas/dispositivo/1
    @GetMapping("/dispositivo/{dispositivoId}")
    public ResponseEntity<List<AlertaResponseDTO>> buscarAlertasAtivos(@PathVariable Integer dispositivoId) {
        return ResponseEntity.ok(alertaService.listarAlertasAtivos(dispositivoId));
    }

    // PATCH: /api/alertas/5/ler
    @PatchMapping("/{id}/ler")
    public ResponseEntity<Void> marcarLido(@PathVariable Integer id) {
        alertaService.marcarComoLido(id);
        return ResponseEntity.noContent().build();
    }
}
