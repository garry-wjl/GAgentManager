package com.gagentmanager.client.mcp;

import lombok.Data;

/** 更新 MCP 服务参数，支持部分更新 */
@Data
public class UpdateMcpParam {
    private Long id;
    private String mcpName;
    private String description;
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
}
