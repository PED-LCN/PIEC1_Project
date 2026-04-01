package com.piec1.api_iot.controllers;

import com.piec1.api_iot.dto.LeituraRequestDTO;
import com.piec1.api_iot.dto.LeituraResponseDTO;
import com.piec1.api_iot.service.LeituraService;
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
    public ResponseEntity<?> receberLeitura(@RequestBody LeituraRequestDTO dto) {
        try {
            LeituraResponseDTO leituraSalva = leituraService.registrarLeitura(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(leituraSalva);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<LeituraResponseDTO>> listarTodasLeituras() {
        return ResponseEntity.ok(leituraService.listarTodas());
    }
}