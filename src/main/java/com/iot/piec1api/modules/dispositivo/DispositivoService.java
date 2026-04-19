package com.iot.piec1api.modules.dispositivo;

import com.iot.piec1api.modules.dispositivo.dtos.DispositivoRequestDTO;
import com.iot.piec1api.modules.dispositivo.dtos.DispositivoResponseDTO;
import com.iot.piec1api.modules.usuario.Usuario;
import com.iot.piec1api.modules.usuario.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DispositivoService {

    @Autowired
    private DispositivoRepository dispositivoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public DispositivoResponseDTO cadastrar(DispositivoRequestDTO dto) {
        Usuario dono = usuarioRepository.findById(dto.usuarioId())
                .orElseThrow(() -> new EntityNotFoundException("Usuário com ID " + dto.usuarioId() + " não foi encontrado."));

        Dispositivo dispositivo = new Dispositivo();
        dispositivo.setNome(dto.nome());
        dispositivo.setTipoLeitura(dto.tipoLeitura());
        dispositivo.setUsuario(dono);

        dispositivo.setLimiteAlerta(dto.limiteAlerta() != null ? dto.limiteAlerta() : 100.0);

        Dispositivo dispositivoSalvo = dispositivoRepository.save(dispositivo);

        return new DispositivoResponseDTO(
                dispositivoSalvo.getId(),
                dispositivoSalvo.getNome(),
                dispositivoSalvo.getTipoLeitura(),
                dispositivoSalvo.getLimiteAlerta(),
                dispositivoSalvo.getId()

        );
    }

    public List<DispositivoResponseDTO> listarPorUsuario(Integer usuarioId) {
        return dispositivoRepository.findByUsuarioId(usuarioId).stream()
                .map(d -> new DispositivoResponseDTO(
                        d.getId(),
                        d.getNome(),
                        d.getTipoLeitura(),
                        d.getLimiteAlerta(),
                        d.getUsuario().getId()
                ))
                .collect(Collectors.toList());
    }
}
