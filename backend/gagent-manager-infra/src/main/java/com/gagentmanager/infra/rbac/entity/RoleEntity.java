package com.gagentmanager.infra.rbac.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/** 角色数据库实体，映射 role 表 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("role")
public class RoleEntity extends DomainEntity {
    private String roleCode;
    private String roleName;
    private String description;
    private Boolean isSystem;
    private Boolean isEnabled;
}
