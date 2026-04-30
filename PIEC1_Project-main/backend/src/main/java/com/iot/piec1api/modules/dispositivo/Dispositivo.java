package com.iot.piec1api.modules.dispositivo;

import com.iot.piec1api.modules.alerta.Alerta;
import com.iot.piec1api.modules.leitura.LeituraConsumo;
import com.iot.piec1api.modules.usuario.Usuario;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "dispositivos")
@Getter
@Setter
@NoArgsConstructor
public class Dispositivo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(name = "tipo_leitura", nullable = false, length = 20)
    private String tipoLeitura;

    @Column(name = "limite_alerta", nullable = false)
    private Double limiteAlerta = 100.0;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @OneToMany(mappedBy = "dispositivo", cascade = CascadeType.ALL)
    private List<LeituraConsumo> leituras;

    @OneToMany(mappedBy = "dispositivo", cascade = CascadeType.ALL)
    private List<Alerta> alertas;
}
