package com.gagentmanager.client.mcp;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/** 创建 MCP 服务参数，包含服务器地址、传输协议、认证和健康检查配置 */
@Data
public class CreateMcpParam {
    @NotBlank
    private String mcpCode;
    @NotBlank
    private String mcpName;
    private String description;
    @NotBlank
    private String serverUrl;
    @NotBlank
    private String protocolVersion;
    @NotBlank
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
