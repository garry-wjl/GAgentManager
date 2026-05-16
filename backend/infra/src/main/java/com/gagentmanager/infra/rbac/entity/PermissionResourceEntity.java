package com.gagentmanager.infra.rbac.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/** 权限资源数据库实体，映射 permission_resource 表 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("permission_resource")
public class PermissionResourceEntity extends DomainEntity {
    private String resourceCode;
    private String resourceName;
    private String resourceType;
    private Long parentId;
    private Integer sortOrder;
}
