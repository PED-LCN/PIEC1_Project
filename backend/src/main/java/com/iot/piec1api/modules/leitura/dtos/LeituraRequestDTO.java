package com.iot.piec1api.modules.leitura.dtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record LeituraRequestDTO(
        @NotNull(message = "O valor da leitura não pode ser nulo.")
        @PositiveOrZero(message = "O hardware não pode enviar consumos negativos.")
        Double valorLeitura,

        @NotNull(message = "O ID do dispositivo é obrigatório.")
        Integer dispositivoId
) {
}