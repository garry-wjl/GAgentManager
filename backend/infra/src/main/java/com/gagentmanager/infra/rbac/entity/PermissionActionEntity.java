package com.gagentmanager.infra.rbac.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/** 权限操作数据库实体，映射 permission_action 表 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("permission_action")
public class PermissionActionEntity extends DomainEntity {
    private String actionCode;
    private String actionName;
    private String description;
}
