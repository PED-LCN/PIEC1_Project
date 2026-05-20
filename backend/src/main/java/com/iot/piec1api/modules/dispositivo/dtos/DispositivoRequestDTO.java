package com.iot.piec1api.modules.dispositivo.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DispositivoRequestDTO(
        @NotBlank(message = "O nome do dispositivo é obrigatório.")
        String nome,

        @NotBlank(message = "O tipo de leitura (ex: água, energia) é obrigatório.")
        String tipoLeitura,

        Double limiteAlerta,

        @NotNull(message = "O ID do usuário dono deste dispositivo é obrigatório.")
        Integer usuarioId
) {
}
