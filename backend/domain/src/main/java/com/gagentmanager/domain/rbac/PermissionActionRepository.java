package com.gagentmanager.domain.rbac;

import java.util.List;

/** 权限操作仓储接口 */
public interface PermissionActionRepository {
    PermissionAction findById(Long id);
    List<PermissionAction> listAll();
}
