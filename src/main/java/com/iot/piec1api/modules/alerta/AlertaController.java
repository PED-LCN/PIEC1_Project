package com.iot.piec1api.modules.alerta;

import com.iot.piec1api.modules.alerta.dtos.AlertaResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alertas")
@CrossOrigin(origins = "*")
public class AlertaController {

    @Autowired
    private AlertaService alertaService;

    @GetMapping("/dispositivo/{dispositivoId}")
    public ResponseEntity<List<AlertaResponseDTO>> buscarAlertasAtivos(@PathVariable Integer dispositivoId) {
        return ResponseEntity.ok(alertaService.listarAlertasAtivos(dispositivoId));
    }

    @PatchMapping("/{id}/ler")
    public ResponseEntity<Void> marcarLido(@PathVariable Integer id) {
        alertaService.marcarComoLido(id);
        return ResponseEntity.noContent().build();
    }
}

