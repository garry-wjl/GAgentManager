package com.gagentmanager.client.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/** 重置密码参数，需验证用户名和邮箱匹配 */
@Data
public class ResetPasswordParam {
    @NotBlank
    private String username;
    @NotBlank
    private String email;
    @NotBlank
    private String newPassword;
    private String captchaKey;
    private String captchaCode;
}
