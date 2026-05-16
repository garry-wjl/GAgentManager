package com.gagentmanager.infra.rbac.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/** 角色-权限关联数据库实体，映射 role_permission 表 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("role_permission")
public class RolePermissionEntity extends DomainEntity {
    private Long roleId;
    private Long resourceId;
    private Long actionId;
    private String permissionCode;
    private String grantType;
}
