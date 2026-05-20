package com.iot.piec1api.modules.leitura;

import com.iot.piec1api.modules.leitura.dtos.LeituraRequestDTO;
import com.iot.piec1api.modules.leitura.dtos.LeituraResponseDTO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leituras")
@CrossOrigin(origins = "*")
public class LeituraController {

    @Autowired
    private LeituraService leituraService;

    @PostMapping
    public ResponseEntity<LeituraResponseDTO> registrarLeitura(@Valid @RequestBody LeituraRequestDTO dto) {
        LeituraResponseDTO salva = leituraService.receberLeitura(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

    @GetMapping("/dispositivo/{dispositivoId}")
    public ResponseEntity<List<LeituraResponseDTO>> listarHistorico(@PathVariable Integer dispositivoId) {
        List<LeituraResponseDTO> historico = leituraService.buscarHistoricoDoDispositivo(dispositivoId);
        return ResponseEntity.ok(historico);
    }
}

