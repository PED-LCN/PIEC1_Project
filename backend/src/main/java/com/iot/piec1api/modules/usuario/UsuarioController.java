package com.iot.piec1api.modules.usuario;

import com.iot.piec1api.modules.usuario.dtos.UsuarioRequestDTO;
import com.iot.piec1api.modules.usuario.dtos.UsuarioResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> cadastrarUsuario(@Valid @RequestBody UsuarioRequestDTO dto) {
        UsuarioResponseDTO usuarioSalvo = usuarioService.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioSalvo);
    }

    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> listarUsuarios() {
        List<UsuarioResponseDTO> lista = usuarioService.listarTodos();
        return ResponseEntity.ok(lista);
    }
}
