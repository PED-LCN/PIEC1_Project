package com.iot.piec1api.modules.leitura;

import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.channel.DirectChannel;
import org.springframework.integration.core.MessageProducer;
import org.springframework.integration.mqtt.core.DefaultMqttPahoClientFactory;
import org.springframework.integration.mqtt.core.MqttPahoClientFactory;
import org.springframework.integration.mqtt.inbound.MqttPahoMessageDrivenChannelAdapter;
import org.springframework.integration.mqtt.support.DefaultPahoMessageConverter;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageHandler;

// =============================================================
//  MqttConfig — configuração do cliente MQTT no Spring Boot
//
//  Responsabilidades:
//    1. Conectar ao broker HiveMQ público
//    2. Assinar o tópico hubioe/residencia/leituras
//    3. Direcionar mensagens recebidas para o MqttLeituraService
// =============================================================
@Configuration
public class MqttConfig {

    @Value("${mqtt.broker}")
    private String broker;

    @Value("${mqtt.clientId}")
    private String clientId;

    @Value("${mqtt.topic}")
    private String topic;

    // ── Fábrica de conexão MQTT ──────────────────────────────
    @Bean
    public MqttPahoClientFactory mqttClientFactory() {
        DefaultMqttPahoClientFactory factory = new DefaultMqttPahoClientFactory();
        MqttConnectOptions options = new MqttConnectOptions();
        options.setServerURIs(new String[]{broker});
        options.setCleanSession(true);
        // Reconexão automática se o broker cair
        options.setAutomaticReconnect(true);
        options.setConnectionTimeout(30);
        options.setKeepAliveInterval(60);
        factory.setConnectionOptions(options);
        return factory;
    }

    // ── Canal de entrada das mensagens MQTT ──────────────────
    // As mensagens chegam do broker e são colocadas neste canal
    @Bean
    public MessageChannel mqttInputChannel() {
        return new DirectChannel();
    }

    // ── Adaptador de entrada MQTT ────────────────────────────
    // Conecta ao broker e assina o tópico configurado
    @Bean
    public MessageProducer mqttInbound() {
        MqttPahoMessageDrivenChannelAdapter adapter =
                new MqttPahoMessageDrivenChannelAdapter(
                        clientId,
                        mqttClientFactory(),
                        topic
                );
        adapter.setCompletionTimeout(5000);
        adapter.setConverter(new DefaultPahoMessageConverter());
        adapter.setQos(1);
        adapter.setOutputChannel(mqttInputChannel());
        return adapter;
    }

    // ── Handler de mensagens ─────────────────────────────────
    // Direciona cada mensagem recebida para o MqttLeituraService
    @Bean
    @ServiceActivator(inputChannel = "mqttInputChannel")
    public MessageHandler mqttMessageHandler(MqttLeituraService mqttLeituraService) {
        return message -> {
            String payload = (String) message.getPayload();
            mqttLeituraService.processarMensagem(payload);
        };
    }
}
