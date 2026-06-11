package com.iot.piec1api.modules.usuario;

import com.iot.piec1api.config.security.TokenService;
import com.iot.piec1api.modules.usuario.dtos.AutenticacaoRequestDTO;
import com.iot.piec1api.modules.usuario.dtos.LoginResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class AutenticacaoController {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> efetuarLogin(@RequestBody @Valid AutenticacaoRequestDTO dto) {
        var authenticationToken = new UsernamePasswordAuthenticationToken(dto.email().trim().toLowerCase(), dto.senha());

        var authentication = authenticationManager.authenticate(authenticationToken);

        var usuarioLogado = (Usuario) authentication.getPrincipal();
        var tokenJWT = tokenService.gerarToken(usuarioLogado);

        return ResponseEntity.ok(new LoginResponseDTO(tokenJWT));
    }
}
