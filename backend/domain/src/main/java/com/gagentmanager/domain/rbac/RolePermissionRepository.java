package com.gagentmanager.domain.rbac;

import java.util.List;

/** 角色-权限关联仓储接口 */
public interface RolePermissionRepository {
    List<RolePermission> findByRoleId(Long roleId);
    List<RolePermission> findByRoleIds(List<Long> roleIds);
    void save(RolePermission rp, Long operatorId);
    void deleteByRoleIdAndResourceId(Long roleId, Long resourceId);
    void batchDeleteByRoleId(Long roleId);
    void batchSave(List<RolePermission> permissions, Long operatorId);
}
