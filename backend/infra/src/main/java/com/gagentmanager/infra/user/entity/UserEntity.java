package com.gagentmanager.infra.user.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Date;

/** 用户数据库实体，映射 user 表 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("user")
public class UserEntity extends DomainEntity {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String username;
    private String passwordHash;
    private String realName;
    private String nickname;
    private String phone;
    private String email;
    private String source;
    private String status;
    private String department;
    private String avatar;
    private String notes;
    private Boolean mfaEnabled;
    private Date lastLoginTime;
    private String lastLoginIp;
    private Integer loginFailCount;
    private Date expireTime;
}
