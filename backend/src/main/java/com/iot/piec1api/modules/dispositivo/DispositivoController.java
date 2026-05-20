package com.iot.piec1api.modules.dispositivo;

import com.iot.piec1api.modules.dispositivo.dtos.DispositivoRequestDTO;
import com.iot.piec1api.modules.dispositivo.dtos.DispositivoResponseDTO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dispositivos")
@CrossOrigin(origins = "*")
public class DispositivoController {

    @Autowired
    private DispositivoService dispositivoService;

    @PostMapping
    public ResponseEntity<DispositivoResponseDTO> cadastrarDispositivo(@Valid @RequestBody DispositivoRequestDTO dto) {
        DispositivoResponseDTO salvo = dispositivoService.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<DispositivoResponseDTO>> listarDispositivosDoUsuario(@PathVariable Integer usuarioId) {
        List<DispositivoResponseDTO> lista = dispositivoService.listarPorUsuario(usuarioId);
        return ResponseEntity.ok(lista);
    }
}

