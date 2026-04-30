package com.gagentmanager.client.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/** 刷新 Token 参数，仅需提供过期的 Refresh Token */
@Data
public class RefreshTokenParam {
    @NotBlank
    private String refreshToken;
}
