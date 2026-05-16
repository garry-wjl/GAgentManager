package com.gagentmanager.client.user;

import lombok.Data;

import java.util.Date;

/** 用户详情视图对象，包含登录信息、MFA 状态和账号状态 */
@Data
public class UserVO {
    private Long id;
    private String num;
    private String username;
    private String realName;
    private String nickname;
    private String phone;
    private String email;
    private String source;
    private String status;
    private String department;
    private String avatar;
    private String notes;
    private Boolean mfaEnabled;
    private Date lastLoginTime;
    private String lastLoginIp;
    private Integer loginFailCount;
    private Date expireTime;
    private String createNo;
    private String updateNo;
    private Date createTime;
    private Date updateTime;
}
