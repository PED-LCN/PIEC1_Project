package com.iot.piec1api.modules.dispositivo.dtos;

public record DispositivoResponseDTO(
        Integer id,
        String nome,
        String tipoLeitura,
        Double limiteAlerta,
        Integer usuarioId
) {
}
