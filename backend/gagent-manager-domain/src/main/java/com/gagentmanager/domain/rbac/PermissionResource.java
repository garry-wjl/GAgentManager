package com.gagentmanager.domain.rbac;

import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;

/** 权限资源实体，定义 MODULE/MENU/BUTTON/API 层级的资源树 */
@Data
public class PermissionResource extends DomainEntity {
    private String resourceCode;
    private String resourceName;
    private String resourceType;  // MODULE/MENU/BUTTON/API
    private Long parentId;
    private Integer sortOrder;
}
