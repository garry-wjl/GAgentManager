package com.gagentmanager.client.rbac;

import lombok.Data;

import java.util.Date;

/** 角色下的用户列表视图对象，包含关联时间和方式 */
@Data
public class UserInRoleVO {
    private Long userId;
    private String userNum;
    private String username;
    private String realName;
    private String email;
    private String status;
    private String assignType;
    private Date assignTime;
}
