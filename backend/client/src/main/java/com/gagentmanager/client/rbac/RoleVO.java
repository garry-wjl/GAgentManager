package com.gagentmanager.client.rbac;

import lombok.Data;

import java.util.Date;

/** 角色视图对象，包含系统内置标记和关联用户数 */
@Data
public class RoleVO {
    private Long id;
    private String num;
    private String roleCode;
    private String roleName;
    private String description;
    private Boolean isSystem;
    private Boolean isEnabled;
    private Integer userCount;
    private String createNo;
    private String updateNo;
    private Date createTime;
    private Date updateTime;
}
