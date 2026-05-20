package com.iot.piec1api.modules.alerta;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertaRepository extends JpaRepository<Alerta, Integer> {
    List<Alerta> findByDispositivoIdAndLidoFalse(Integer dispositivoId);
}
