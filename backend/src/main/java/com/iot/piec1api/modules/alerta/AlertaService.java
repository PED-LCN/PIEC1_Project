package com.iot.piec1api.modules.alerta;

import com.iot.piec1api.modules.alerta.dtos.AlertaResponseDTO;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlertaService {

    @Autowired
    private AlertaRepository alertaRepository;

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
