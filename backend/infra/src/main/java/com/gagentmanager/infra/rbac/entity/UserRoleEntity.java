package com.gagentmanager.infra.rbac.entity;

import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.util.Date;

/** 用户-角色关联数据库实体，映射 user_role 表 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("user_role")
public class UserRoleEntity extends DomainEntity {
    private Long userId;
    private Long roleId;
    private String assignType;
    private Date assignTime;
    private String assignUser;
    private Date expireTime;
    @TableLogic
    private Boolean deleted;
}
