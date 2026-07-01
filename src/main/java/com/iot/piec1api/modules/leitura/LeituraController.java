package com.iot.piec1api.modules.leitura;

import com.iot.piec1api.config.security.DeviceAuthService;
import com.iot.piec1api.modules.leitura.dtos.LeituraRequestDTO;
import com.iot.piec1api.modules.leitura.dtos.LeituraResponseDTO;
import com.iot.piec1api.modules.usuario.Usuario;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/leituras")
@RequiredArgsConstructor
public class LeituraController {

    private final LeituraService leituraService;
    private final DeviceAuthService deviceAuthService;

    @PostMapping
    public ResponseEntity<LeituraResponseDTO> registrarLeitura(
            @RequestHeader(name = "X-DEVICE-KEY", required = false) String deviceKey,
            @Valid @RequestBody LeituraRequestDTO dto
    ) {
        deviceAuthService.validarChaveDispositivo(deviceKey);
        LeituraResponseDTO salva = leituraService.receberLeitura(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

    @GetMapping("/dispositivo/{dispositivoId}")
    public ResponseEntity<Page<LeituraResponseDTO>> listarHistorico(
            @PathVariable("dispositivoId") Integer dispositivoId,
            @PageableDefault(size = 50, sort = "dataHora", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Usuario utilizadorLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // O service e o repository devem ser atualizados para receber este ID
        Page<LeituraResponseDTO> historico = leituraService.buscarHistoricoDoDispositivo(dispositivoId, utilizadorLogado.getId(), pageable);
        return ResponseEntity.ok(historico);
    }
}