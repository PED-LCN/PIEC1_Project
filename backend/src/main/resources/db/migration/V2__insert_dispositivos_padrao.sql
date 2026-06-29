-- =============================================================
--  V2__insert_dispositivos_padrao.sql
--  Cria os dois dispositivos padrão do Hub IoE:
--    ID 1 → Sensor de Energia (SCT-013)
--    ID 2 → Sensor de Água (YF-S201)
--
--  Colocar em: src/main/resources/db/migration/
--  (verificar qual é o número da próxima migration no projeto
--   e ajustar o prefixo V2__ se necessário)
-- =============================================================

INSERT INTO dispositivo (id, nome, tipo, limite_alerta)
VALUES
    (1, 'Sensor de Energia Principal', 'ENERGIA', 50.0),
    (2, 'Sensor de Água Principal',    'AGUA',    100.0);
