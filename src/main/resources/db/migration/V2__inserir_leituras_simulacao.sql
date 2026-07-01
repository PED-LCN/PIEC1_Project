-- --------------------------------------------------------------------------------------
-- Arquivo: V2__inserir_leituras_simulacao.sql
-- Descrição: Insere leituras simuladas para os dispositivos 1 e 2 (assumindo que já existem)
-- --------------------------------------------------------------------------------------

-- 1. Inserir Leituras Simuladas para o Dispositivo 1 (ex: Água)
-- Simulando um aumento de consumo ao longo do dia
INSERT INTO leituras_consumo (valor_leitura, data_hora, dispositivo_id) VALUES
                                                                            (12.5, '2026-06-30 08:00:00', 1),
                                                                            (15.0, '2026-06-30 08:30:00', 1),
                                                                            (18.2, '2026-06-30 09:00:00', 1),
                                                                            (14.1, '2026-06-30 09:30:00', 1),
                                                                            (105.5, '2026-06-30 10:00:00', 1),
                                                                            (20.0, '2026-06-30 10:30:00', 1),
                                                                            (22.4, '2026-06-30 11:00:00', 1);

-- 3. Inserir Leituras Simuladas para o Dispositivo 2 (ex: Energia)
INSERT INTO leituras_consumo (valor_leitura, data_hora, dispositivo_id) VALUES
                                                                            (150.0, '2026-06-30 08:00:00', 2),
                                                                            (160.5, '2026-06-30 09:00:00', 2),
                                                                            (155.2, '2026-06-30 10:00:00', 2),
                                                                            (158.9, '2026-06-30 11:00:00', 2),
                                                                            (162.0, '2026-06-30 12:00:00', 2),
                                                                            (170.1, '2026-06-30 13:00:00', 2);