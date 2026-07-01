package com.iot.piec1api.modules.alerta.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

public record AlertaResponseDTO(
        Integer id,
        String mensagem,

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
        LocalDateTime dataHora,
        Boolean lido,
        Integer dispositivoId
) {
}