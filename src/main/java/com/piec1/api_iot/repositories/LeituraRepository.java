package com.piec1.api_iot.repositories;

import com.piec1.api_iot.models.Leitura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LeituraRepository extends JpaRepository<Leitura, Integer> {
}
