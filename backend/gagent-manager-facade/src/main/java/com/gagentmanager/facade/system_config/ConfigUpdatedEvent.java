package com.gagentmanager.facade.system_config;

import lombok.Data;
import java.util.Date;

/** 系统配置更新事件，记录配置项的旧值和新值 */
@Data
public class ConfigUpdatedEvent {
    private String configKey;
    private String oldValue;
    private String newValue;
    private String operatorId;
    private Date eventTime;
}
