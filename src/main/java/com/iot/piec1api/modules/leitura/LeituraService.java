package com.iot.piec1api.modules.leitura;

import com.iot.piec1api.modules.alerta.Alerta;
import com.iot.piec1api.modules.alerta.AlertaRepository;
import com.iot.piec1api.modules.dispositivo.Dispositivo;
import com.iot.piec1api.modules.dispositivo.DispositivoRepository;
import com.iot.piec1api.modules.leitura.dtos.LeituraRequestDTO;
import com.iot.piec1api.modules.leitura.dtos.LeituraResponseDTO;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LeituraService {

    private final LeituraRepository leituraRepository;
    private final DispositivoRepository dispositivoRepository;
    private final AlertaRepository alertaRepository;

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
            alerta.setMensagem("Atenção! Consumo ultrapassou o limite de "
                    + dispositivo.getLimiteAlerta() + " no dispositivo: " + dispositivo.getNome());
            alerta.setDispositivo(dispositivo);
            alertaRepository.save(alerta);
        }

        return new LeituraResponseDTO(
                leituraSalva.getId(),
                leituraSalva.getValorLeitura(),
                leituraSalva.getDataHora(),
                leituraSalva.getDispositivo().getId()
        );
    }

    @Transactional(readOnly = true)
    public Page<LeituraResponseDTO> buscarHistoricoDoDispositivo(Integer dispositivoId, Integer usuarioId, Pageable pageable) {
        // Agora chamamos o novo método do repository passando o usuarioId
        return leituraRepository.findByDispositivoIdAndDispositivo_Usuario_Id(dispositivoId, usuarioId, pageable)
                .map(l -> new LeituraResponseDTO(
                        l.getId(),
                        l.getValorLeitura(),
                        l.getDataHora(),
                        l.getDispositivo().getId()
                ));
    }
}