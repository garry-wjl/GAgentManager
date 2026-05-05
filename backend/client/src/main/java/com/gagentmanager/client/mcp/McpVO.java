package com.gagentmanager.client.mcp;

import lombok.Data;

import java.util.Date;

/** MCP 服务详情视图对象，包含连接状态、版本信息和绑定 Agent 数量 */
@Data
public class McpVO {
    private Long id;
    private String num;
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
    private Integer timeoutSeconds;
    private Boolean retryEnabled;
    private Integer maxRetries;
    private String healthCheckUrl;
    private Integer healthCheckInterval;
    private Date lastConnectTime;
    private Integer errorCount;
    private String creator;
    private String createNo;
    private Date createTime;
    private Date updateTime;
}
