package com.iot.piec1api.modules.usuario;

import java.util.List;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.iot.piec1api.modules.usuario.dtos.UsuarioRequestDTO;
import com.iot.piec1api.modules.usuario.dtos.UsuarioResponseDTO;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioResponseDTO cadastrar(UsuarioRequestDTO dto) {
        String emailNormalizado = normalizarEmail(dto.email());

        if (usuarioRepository.findByEmailIgnoreCase(emailNormalizado).isPresent()) {
            throw new IllegalArgumentException("Já existe um usuário cadastrado com este e-mail.");
        }

        String senhaCriptografada = passwordEncoder.encode(dto.senha());

        Usuario usuario = new Usuario();
        usuario.setNome(dto.nome());
        usuario.setEmail(emailNormalizado);
        usuario.setSenha(senhaCriptografada);

        Usuario usuarioSalvo = usuarioRepository.save(usuario);

        return new UsuarioResponseDTO(
                usuarioSalvo.getId(),
                usuarioSalvo.getNome(),
                usuarioSalvo.getEmail()
        );
    }

    public List<UsuarioResponseDTO> listarTodos() {
        return usuarioRepository.findAll().stream()
                .map(u -> new UsuarioResponseDTO(
                        u.getId(),
                        u.getNome(),
                        u.getEmail())
                )
                .collect(Collectors.toList());
    }

    private String normalizarEmail(String email) {
        return email.trim().toLowerCase();
    }
}
