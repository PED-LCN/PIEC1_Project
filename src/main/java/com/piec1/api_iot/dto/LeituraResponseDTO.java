package com.piec1.api_iot.dto;

import java.time.LocalDateTime;

public record LeituraResponseDTO(
        Integer Id,
        Double valorLeitura,
        LocalDateTime dataHora,
        String nomeProduto
) {
}
