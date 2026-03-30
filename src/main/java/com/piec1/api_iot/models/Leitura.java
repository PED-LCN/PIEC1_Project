package com.piec1.api_iot.models;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "leituras_consumo")
public class Leitura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "valor_leitura", nullable = false)
    private Double valorLeitura;

    @Column(name = "data_hora")
    private LocalDateTime dataHora;

    @ManyToOne
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;

    public Leitura() {
    }

    @PrePersist
    public void carimbarData() {
        this.dataHora = LocalDateTime.now();
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Produto getProduto() {
        return produto;
    }

    public void setProduto(Produto produto) {
        this.produto = produto;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public Double getValorLeitura() {
        return valorLeitura;
    }

    public void setValorLeitura(Double valorLeitura) {
        this.valorLeitura = valorLeitura;
    }
}
