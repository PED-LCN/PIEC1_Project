package com.iot.piec1api.modules.leitura;

import com.iot.piec1api.modules.alerta.Alerta;
import com.iot.piec1api.modules.alerta.AlertaRepository;
import com.iot.piec1api.modules.dispositivo.Dispositivo;
import com.iot.piec1api.modules.dispositivo.DispositivoRepository;
import com.iot.piec1api.modules.leitura.dtos.LeituraRequestDTO;
import com.iot.piec1api.modules.leitura.dtos.LeituraResponseDTO;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeituraService {

    @Autowired
    private LeituraRepository leituraRepository;

    @Autowired
    private DispositivoRepository dispositivoRepository;

    @Autowired
    private AlertaRepository alertaRepository;

    @Transactional
    public LeituraResponseDTO receberLeitura(LeituraRequestDTO dto) {
        Dispositivo dispositivo = dispositivoRepository.findById(dto.dispositivoId())
                .orElseThrow(() -> new EntityNotFoundException("Dispositivo com ID " + dto.dispositivoId() + " não encontrado."));

        LeituraConsumo leitura = new LeituraConsumo();
        leitura.setValorLeitura(dto.valorLeitura());
        leitura.setDispositivo(dispositivo);

        LeituraConsumo leituraSalva = leituraRepository.save(leitura);

        if (dto.valorLeitura() > dispositivo.getLimiteAlerta()) {
            Alerta alerta = new Alerta();
            alerta.setMensagem(
                    "Atenção! Consumo ultrapassou o limite de "
                            + dispositivo.getLimiteAlerta() +
                            " no dispositivo: " + dispositivo.getNome());
            alerta.setDispositivo(dispositivo);
            alertaRepository.save(alerta);
        }

        return new LeituraResponseDTO(
                leituraSalva.getId(),
                leituraSalva.getValorLeitura(),
                leituraSalva.getDataHora(),
                leituraSalva.getId()
        );
    }

    public List<LeituraResponseDTO> buscarHistoricoDoDispositivo(Integer dispositivoId) {
        return leituraRepository.findByDispositivoId(dispositivoId).stream()
                .map(l -> new LeituraResponseDTO(
                        l.getId(),
                        l.getValorLeitura(),
                        l.getDataHora(),
                        l.getId()
                ))
                .collect(Collectors.toList());
    }
}

