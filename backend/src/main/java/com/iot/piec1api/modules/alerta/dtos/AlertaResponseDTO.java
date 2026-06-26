package com.iot.piec1api.modules.alerta.dtos;

import java.time.LocalDateTime;

public record AlertaResponseDTO(
        Integer id,
        String mensagem,
        LocalDateTime dataHora,
        Boolean lido,
        Integer dispositivoId
) {
}