package com.iot.piec1api.modules.dispositivo;

import com.iot.piec1api.modules.dispositivo.dtos.DispositivoRequestDTO;
import com.iot.piec1api.modules.dispositivo.dtos.DispositivoResponseDTO;
import com.iot.piec1api.modules.usuario.Usuario;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dispositivos")
@RequiredArgsConstructor
public class DispositivoController {

    private final DispositivoService dispositivoService;

    @PostMapping
    public ResponseEntity<DispositivoResponseDTO> cadastrarDispositivo(@Valid @RequestBody DispositivoRequestDTO dto) {
        DispositivoResponseDTO salvo = dispositivoService.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    // Rota segura: O Frontend não precisa passar o ID na URL, o próprio backend resolve quem está logado
    @GetMapping("/meus-dispositivos")
    public ResponseEntity<List<DispositivoResponseDTO>> listarDispositivosDoUsuario() {
        Usuario usuarioLogado = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<DispositivoResponseDTO> lista = dispositivoService.listarPorUsuario(usuarioLogado.getId());
        return ResponseEntity.ok(lista);
    }
}