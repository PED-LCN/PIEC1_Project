package com.iot.piec1api.modules.alerta;

import com.iot.piec1api.modules.alerta.dtos.AlertaResponseDTO;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlertaService {

    private final AlertaRepository alertaRepository;

    // Recebe também o usuarioId para garantir a segurança
    public List<AlertaResponseDTO> listarAlertasAtivos(Integer dispositivoId, Integer usuarioId) {
        return alertaRepository.findByDispositivoIdAndDispositivo_Usuario_IdAndLidoFalse(dispositivoId, usuarioId).stream()
                .map(a -> new AlertaResponseDTO(
                        a.getId(),
                        a.getMensagem(),
                        a.getDataHora(),
                        a.getLido(),
                        a.getDispositivo().getId()
                )).collect(Collectors.toList());
    }

    @Transactional
    public void marcarComoLido(Integer alertaId, Integer usuarioId) {
        // Usa a nova query do repository para garantir que o utilizador não marca o alerta de outro como lido
        Alerta alerta = alertaRepository.findByIdAndDispositivo_Usuario_Id(alertaId, usuarioId)
                .orElseThrow(() -> new EntityNotFoundException("Alerta com ID " + alertaId + " não encontrado ou não tem permissão de acesso."));

        alerta.setLido(true);
        alertaRepository.save(alerta);
    }
}