package com.iot.piec1api.config.security;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CorsConfigTest {

    @Test
    void deveAplicarOrigensPermitidasConfiguradas() {
        CorsConfig corsConfig = new CorsConfig("https://app.exemplo.com, http://localhost:3000");
        CorsConfigurationSource source = corsConfig.corsConfigurationSource();
        CorsConfiguration configuration = source.getCorsConfiguration(new MockHttpServletRequest("GET", "/api/usuarios"));

        assertTrue(configuration != null && configuration.getAllowedOriginPatterns() != null);
        assertEquals(2, configuration.getAllowedOriginPatterns().size());
        assertTrue(configuration.getAllowedOriginPatterns().contains("https://app.exemplo.com"));
        assertTrue(configuration.getAllowedOriginPatterns().contains("http://localhost:3000"));
        assertTrue(configuration.getAllowedHeaders().contains("*"));
    }
}
