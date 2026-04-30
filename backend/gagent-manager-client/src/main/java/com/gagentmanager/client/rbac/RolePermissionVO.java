package com.gagentmanager.client.rbac;

import lombok.Data;

/** 角色-权限关联视图对象，包含资源编码和权限编码 */
@Data
public class RolePermissionVO {
    private Long id;
    private String num;
    private Long roleId;
    private Long resourceId;
    private Long actionId;
    private String resourceCode;
    private String actionCode;
    private String permissionCode;
    private String grantType;
}
