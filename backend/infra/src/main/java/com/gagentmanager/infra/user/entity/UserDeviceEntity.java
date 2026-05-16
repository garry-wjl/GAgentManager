package com.gagentmanager.infra.user.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Date;

/** 登录设备数据库实体，映射 user_device 表 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("user_device")
public class UserDeviceEntity extends DomainEntity {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;
    private String deviceToken;
    private String deviceName;
    private String ipAddress;
    private String userAgent;
    private Date loginTime;
    private Date lastActiveTime;
    private Boolean isOnline;
}
