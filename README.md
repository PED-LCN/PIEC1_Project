# Monitor de gastos Elétricos e hídricos

## 📌 Descrição do Problema
O projeto busca solucionar a falta de visibilidade sobre o consumo detalhado de recursos básicos. Ele visa averiguar dados de gastos domiciliares ou de instituições para identificar o consumo contínuo e gerar um histórico detalhado. Com isso, é possível compreender onde e como estão ocorrendo os gastos de água e energia, permitindo a identificação precoce de *outliers* (anomalias e desperdícios) em equipamentos ou sistemas hidráulicos e elétricos.

---

## 🎯 Objetivo
Desenvolver um sistema de monitoramento baseado em IoT/IoE que utiliza sensores para leituras contínuas, enviando esses dados para uma aplicação centralizada. O sistema realiza análises estatísticas para gerar relatórios gerais e específicos, auxiliando o usuário no controle efetivo de seus gastos por meio de um Dashboard visual.

---

## ⚙️ Funcionalidades (Casos de Uso)
- **Leitura de Dados:** Captura automatizada via sensores de fluxo e corrente.
- **Transmissão de Dados:** Envio das informações dos nós para a central via rede sem fio.
- **Processamento Estatístico:** Tratamento e organização dos dados para identificar padrões.
- **Histórico de Consumo:** Armazenamento de leituras para consultas temporais.
- **Relatórios Automáticos:** Geração de balanços de gastos periódicos.
- **Dashboard Interativo:** Visualização em tempo real dos dados processados.
- **Identificação de Anomalias:** Alertas sobre possíveis vazamentos ou picos de energia.
- **Gestão de Dispositivos:** Controle e monitoramento individualizado de pontos de consumo.

---

## 👥 Atores do Sistema
- **Gestores de Instituições:** Para controle de custos operacionais em prédios e empresas.
- **Usuários Residenciais:** Para monitoramento doméstico e economia familiar.

---

## 🧱 Estrutura do Projeto
O projeto integra hardware, comunicação e software em uma arquitetura robusta:

- **Hardware (Nós Sensores):** Microcontroladores (Arduino ou família ESP) equipados com sensores específicos, operando com estratégias de baixo consumo (Deep Sleep).
- **Conectividade:** Protocolos LoRa ou Wi-Fi para comunicação entre sensores.
- **Back-End e Dados:** API desenvolvida em Java para processamento de mensagens e lógica de negócio, com banco de dados MySQL para persistência do histórico.
- **Front-End:** Interface visual responsiva para exibição do Dashboard e gráficos.
- **Repositório Oficial:** [PIEC1_Project](https://github.com/PED-LCN/PIEC1_Project)
