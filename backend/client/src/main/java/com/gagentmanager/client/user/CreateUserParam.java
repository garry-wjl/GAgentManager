package com.gagentmanager.client.user;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/** 创建用户参数，包含用户名、密码和联系方式 */
@Data
public class CreateUserParam {
    @NotBlank
    private String username;
    @NotBlank
    private String password;
    private String realName;
    private String nickname;
    private String phone;
    private String email;
    private String source;
    private String department;
    private String notes;
}
