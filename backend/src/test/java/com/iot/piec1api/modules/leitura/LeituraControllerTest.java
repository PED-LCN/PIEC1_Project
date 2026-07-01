package com.iot.piec1api.modules.leitura;

import com.iot.piec1api.config.security.DeviceAuthService;
import com.iot.piec1api.modules.leitura.dtos.LeituraResponseDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = LeituraController.class)
@Import(DeviceAuthService.class)
@TestPropertySource(properties = "api.security.device.key=test-device-key")
class LeituraControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private LeituraService leituraService;

    @Test
    void devePermitirRegistroDeLeituraComChaveDeHardwareValida() throws Exception {
        when(leituraService.receberLeitura(any()))
                .thenReturn(new LeituraResponseDTO(1, 12.5, LocalDateTime.now(), 1));

        mockMvc.perform(post("/api/leituras")
                        .header("X-DEVICE-KEY", "test-device-key")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "valorLeitura": 12.5,
                                  "dispositivoId": 1
                                }
                                """))
                .andExpect(status().isCreated());
    }

    @Test
    void deveNegarRegistroDeLeituraSemChaveDeHardware() throws Exception {
        mockMvc.perform(post("/api/leituras")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "valorLeitura": 12.5,
                                  "dispositivoId": 1
                                }
                                """))
                .andExpect(status().isUnauthorized());
    }
}
