package com.gagentmanager.infra.system_config.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/** 系统配置数据库实体，映射 system_config 表 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("system_config")
public class SystemConfigEntity extends DomainEntity {
    private String configKey;
    private String configValue;
    private String configType;
    private String description;
    private Boolean isPublic;
    private Boolean isModifiable;
}
