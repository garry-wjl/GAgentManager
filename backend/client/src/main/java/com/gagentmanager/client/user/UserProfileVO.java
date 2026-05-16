package com.gagentmanager.client.user;

import lombok.Data;

import java.util.Date;
import java.util.List;

/** 用户个人中心和偏好设置视图对象，包含角色列表和界面主题 */
@Data
public class UserProfileVO {
    private Long userId;
    private String username;
    private String realName;
    private String nickname;
    private String phone;
    private String email;
    private String department;
    private String avatar;
    private String source;
    private String status;
    private List<String> roleNames;
    private Boolean mfaEnabled;
    private Date lastLoginTime;
    private String lastLoginIp;
    private String language;
    private String theme;
}
