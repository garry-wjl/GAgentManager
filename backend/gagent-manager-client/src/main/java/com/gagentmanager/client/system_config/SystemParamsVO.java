package com.gagentmanager.client.system_config;

import lombok.Data;

/** 系统参数汇总视图对象，包含 Agent 限制、密码策略、MFA 等全局配置 */
@Data
public class SystemParamsVO {
    private Integer maxAgentsPerUser;
    private Integer maxConcurrentAgents;
    private String defaultModelId;
    private Integer maxUploadFileSize;
    private Integer sessionTimeout;
    private Integer passwordMinLength;
    private Boolean passwordRequireUpper;
    private Boolean passwordRequireLower;
    private Boolean passwordRequireNumber;
    private Boolean passwordRequireSpecial;
    private Integer passwordExpireDays;
    private Integer maxLoginFailures;
    private Integer lockDuration;
    private Boolean enableMfa;
    private Boolean enableSso;
    private Integer dataRetentionDays;
}
