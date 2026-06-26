package com.iot.piec1api.modules.leitura;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeituraRepository extends JpaRepository<LeituraConsumo, Integer> {
    List<LeituraConsumo> findByDispositivoId(Integer id);
}
