package com.piec1.api_iot.repositories;

import com.piec1.api_iot.models.LeituraConsumo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LeituraConsumoRepository extends JpaRepository<LeituraConsumo, Integer> {
}
