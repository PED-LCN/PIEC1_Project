package com.iot.piec1api.modules.leitura;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeituraRepository extends JpaRepository<LeituraConsumo, Integer> {
    Page<LeituraConsumo> findByDispositivoIdAndDispositivo_Usuario_Id(Integer dispositivoId, Integer usuarioId, Pageable pageable);
}