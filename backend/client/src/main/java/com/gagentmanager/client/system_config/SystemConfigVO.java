package com.gagentmanager.client.system_config;

import lombok.Data;

import java.util.Date;

/** 系统配置项视图对象，包含是否公开和是否可修改标记 */
@Data
public class SystemConfigVO {
    private Long id;
    private String configKey;
    private String configValue;
    private String configType;
    private String description;
    private Boolean isPublic;
    private Boolean isModifiable;
    private Date updateTime;
}
