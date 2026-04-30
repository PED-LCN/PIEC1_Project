package com.iot.piec1api.modules.leitura.dtos;

import java.time.LocalDateTime;

public record LeituraResponseDTO(
        Integer Id,
        Double valorLeitura,
        LocalDateTime dataHora,
        Integer dispositivoId
) {
}
