package com.gagentmanager.client.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/** 登录请求参数，包含用户名、密码和验证码 */
@Data
public class LoginParam {
    @NotBlank
    private String username;
    @NotBlank
    private String password;
    private String captchaKey;
    private String captchaCode;
}
