-- V1: Criação da estrutura inicial do banco de dados do projeto

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE dispositivos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    tipo_leitura VARCHAR(20) NOT NULL,
    usuario_id INT NOT NULL,
    limite_alerta DOUBLE NOT NULL DEFAULT 100.0,
    CONSTRAINT fk_dispositivo_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE leituras_consumo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    valor_leitura DOUBLE NOT NULL,
    data_hora DATETIME NOT NULL,
    dispositivo_id INT NOT NULL,
    CONSTRAINT fk_leitura_dispositivo FOREIGN KEY (dispositivo_id) REFERENCES dispositivos(id) ON DELETE CASCADE
);

CREATE TABLE alertas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mensagem VARCHAR(255) NOT NULL,
    data_hora DATETIME NOT NULL,
    lido BOOLEAN NOT NULL DEFAULT FALSE,
    dispositivo_id INT NOT NULL,
    CONSTRAINT fk_alerta_dispositivo FOREIGN KEY (dispositivo_id) REFERENCES dispositivos(id) ON DELETE CASCADE
);