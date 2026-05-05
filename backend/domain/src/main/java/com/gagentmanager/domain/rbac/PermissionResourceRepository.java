package com.gagentmanager.domain.rbac;

import java.util.List;

/** 权限资源仓储接口 */
public interface PermissionResourceRepository {
    PermissionResource findById(Long id);
    List<PermissionResource> listAll();
    List<PermissionResource> findByParentId(Long parentId);
    void save(PermissionResource resource, Long operatorId);
}
