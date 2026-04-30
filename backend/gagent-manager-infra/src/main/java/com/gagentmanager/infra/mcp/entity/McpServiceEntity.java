package com.gagentmanager.infra.mcp.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.util.Date;

/** MCP 服务数据库实体，映射 mcp_service 表 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("mcp_service")
public class McpServiceEntity extends DomainEntity {
    private String mcpCode;
    private String mcpName;
    private String description;
    private String latestVersion;
    private String currentVersion;
    private Boolean isEnabled;
    private String status;
    private Integer boundAgentCount;
    private String serverUrl;
    private String protocolVersion;
    private String transportType;
    private String authType;
    private String credentials;
    private Integer timeoutSeconds;
    private Boolean retryEnabled;
    private Integer maxRetries;
    private String healthCheckUrl;
    private Integer healthCheckInterval;
    private String envVariables;
    private String command;
    private String args;
    private Date lastConnectTime;
    private Integer errorCount;
}
