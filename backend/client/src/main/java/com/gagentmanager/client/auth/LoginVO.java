package com.gagentmanager.client.auth;

import lombok.Data;

/** 登录响应对象，包含 Access/Refresh Token 和用户基本信息 */
@Data
public class LoginVO {
    private String accessToken;
    private String refreshToken;
    private Long expiresIn;
    private Long userId;
    private String username;
    private String realName;
    private String avatar;
    private Boolean mfaRequired;
}
