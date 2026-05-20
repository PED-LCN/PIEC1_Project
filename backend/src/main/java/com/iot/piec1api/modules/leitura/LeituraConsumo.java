package com.iot.piec1api.modules.leitura;


import com.iot.piec1api.modules.dispositivo.Dispositivo;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "leituras_consumo")
@Getter
@Setter
@NoArgsConstructor
public class LeituraConsumo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "valor_leitura", nullable = false)
    private Double valorLeitura;

    @Column(name = "data_hora", nullable = false, updatable = false)
    private LocalDateTime dataHora;

    @ManyToOne
    @JoinColumn(name = "dispositivo_id", nullable = false)
    private Dispositivo dispositivo;

    @PrePersist
    public void preencherDataHora() {
        this.dataHora = LocalDateTime.now();
    }
}
