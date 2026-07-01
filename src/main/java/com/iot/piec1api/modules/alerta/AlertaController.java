package com.iot.piec1api.modules.alerta;

import com.iot.piec1api.modules.alerta.dtos.AlertaResponseDTO;
import com.iot.piec1api.modules.usuario.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alertas")
@RequiredArgsConstructor
public class AlertaController {

    private final AlertaService alertaService;

    @GetMapping("/dispositivo/{dispositivoId}")
    public ResponseEntity<List<AlertaResponseDTO>> buscarAlertasAtivos(@PathVariable("dispositivoId") Integer dispositivoId) {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        return ResponseEntity.ok(alertaService.listarAlertasAtivos(dispositivoId, usuarioLogado.getId()));
    }

    @PatchMapping("/{id}/ler")
    public ResponseEntity<Void> marcarLido(@PathVariable("id") Integer id) {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        alertaService.marcarComoLido(id, usuarioLogado.getId());
        return ResponseEntity.noContent().build();
    }
}