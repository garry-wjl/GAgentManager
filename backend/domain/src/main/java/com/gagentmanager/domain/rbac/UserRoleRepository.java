package com.gagentmanager.domain.rbac;

import com.baomidou.mybatisplus.core.metadata.IPage;

import java.util.List;

/** 用户-角色关联仓储接口，包含查询用户权限的聚合方法 */
public interface UserRoleRepository {
    List<RolePermission> findPermissionsByUserId(Long userId);
    List<UserRole> findByUserId(Long userId);
    List<UserRole> findByRoleId(Long roleId);
    IPage<UserRole> findUsersByRoleId(IPage<UserRole> page, Long roleId);
    void save(UserRole ur, Long operatorId);
    void deleteByUserIdAndRoleId(Long userId, Long roleId);
    void batchSave(List<UserRole> userRoles, Long operatorId);
    boolean existsByUserIdAndRoleId(Long userId, Long roleId);
    long countByRoleId(Long roleId);
}
