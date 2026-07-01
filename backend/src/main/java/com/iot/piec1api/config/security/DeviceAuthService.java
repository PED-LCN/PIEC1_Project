package com.iot.piec1api.config.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

@Service
public class DeviceAuthService {

    private final String deviceApiKey;

    public DeviceAuthService(@Value("${api.security.device.key}") String deviceApiKey) {
        this.deviceApiKey = deviceApiKey;
    }

    public void validarChaveDispositivo(String headerApiKey) {
        if (headerApiKey == null || headerApiKey.isBlank() || !deviceApiKey.equals(headerApiKey.trim())) {
            throw new BadCredentialsException("Chave do dispositivo inválida.");
        }
    }
}
