package com.gagentmanager.domain.rbac;

import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;

/** 权限操作实体，定义 read/create/update/delete/admin 等操作 */
@Data
public class PermissionAction extends DomainEntity {
    private String actionCode;  // read/create/update/delete/admin
    private String actionName;
    private String description;
}
