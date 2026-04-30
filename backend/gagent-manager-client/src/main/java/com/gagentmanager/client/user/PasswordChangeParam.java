package com.gagentmanager.client.user;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/** 用户修改密码参数，需验证旧密码 */
@Data
public class PasswordChangeParam {
    @NotBlank
    private String oldPassword;
    @NotBlank
    private String newPassword;
}
