package com.gagentmanager.domain.rbac;

import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;

/** 角色-权限关联实体，记录角色对资源的 ALLOW/DENY 授权 */
@Data
public class RolePermission extends DomainEntity {
    private Long roleId;
    private Long resourceId;
    private Long actionId;
    private String permissionCode;  // resourceCode:actionCode
    private String grantType;       // ALLOW/DENY

    public static RolePermission create(Long roleId, Long resourceId, Long actionId, String permissionCode, String grantType) {
        RolePermission rp = new RolePermission();
        rp.roleId = roleId;
        rp.resourceId = resourceId;
        rp.actionId = actionId;
        rp.permissionCode = permissionCode;
        rp.grantType = grantType;
        rp.setDeleted(false);
        return rp;
    }
}
