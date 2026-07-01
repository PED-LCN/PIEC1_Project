package com.iot.piec1api.modules.leitura.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

public record LeituraResponseDTO(
        Integer id,
        Double valorLeitura,

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss'Z'")
        LocalDateTime dataHora,
        Integer dispositivoId
) {
}