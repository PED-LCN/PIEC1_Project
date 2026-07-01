package com.iot.piec1api.modules.alerta;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlertaRepository extends JpaRepository<Alerta, Integer> {
    List<Alerta> findByDispositivoIdAndDispositivo_Usuario_IdAndLidoFalse(Integer dispositivoId, Integer usuarioId);
    Optional<Alerta> findByIdAndDispositivo_Usuario_Id(Integer alertaId, Integer usuarioId);
}