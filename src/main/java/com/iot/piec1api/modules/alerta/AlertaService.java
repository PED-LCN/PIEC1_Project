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

    // Listar alertas que ainda não foram vistos pelo usuário
    public List<AlertaResponseDTO> listarAlertasAtivos(Integer dispositivoId) {
        return alertaRepository.findByDispositivoIdAndLidoFalse(dispositivoId).stream()
                .map(a -> new AlertaResponseDTO(
                        a.getId(),
                        a.getMensagem(),
                        a.getDataHora(),
                        a.getLido(),
                        a.getDispositivo().getId()
                )).collect((Collectors.toList()));
    }

    @Transactional
    public void marcarComoLido(Integer alertaId) {
        Alerta alerta = alertaRepository.findById(alertaId).orElseThrow(() -> new EntityNotFoundException("Alerta com ID " + alertaId + " não encontrado."));

        alerta.setLido(true);
        alertaRepository.save(alerta);
    }
}
