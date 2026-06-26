package com.iot.piec1api.modules.dispositivo;

import com.iot.piec1api.modules.dispositivo.dtos.DispositivoRequestDTO;
import com.iot.piec1api.modules.dispositivo.dtos.DispositivoResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dispositivos")
@RequiredArgsConstructor
public class DispositivoController {

    private final DispositivoService dispositivoService;

    // -----------------------------------------------------------------------
    // ENDPOINT: Cadastrar um novo dispositivo
    // Tipo: POST | URL: http://localhost:8080/api/dispositivos
    // -----------------------------------------------------------------------
    @PostMapping
    public ResponseEntity<DispositivoResponseDTO> cadastrarDispositivo(@Valid @RequestBody DispositivoRequestDTO dto) {
        DispositivoResponseDTO salvo = dispositivoService.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    // -----------------------------------------------------------------------
    // ENDPOINT: Buscar todos os dispositivos de um usuário
    // Tipo: GET | URL: http://localhost:8080/api/dispositivos/usuario/1
    // -----------------------------------------------------------------------
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<DispositivoResponseDTO>> listarDispositivosDoUsuario(@PathVariable Integer usuarioId) {
        List<DispositivoResponseDTO> lista = dispositivoService.listarPorUsuario(usuarioId);
        return ResponseEntity.ok(lista);
    }
}
