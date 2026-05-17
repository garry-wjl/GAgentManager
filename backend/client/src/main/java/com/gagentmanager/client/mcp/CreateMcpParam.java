package com.gagentmanager.client.mcp;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/** 创建 MCP 服务参数，包含基础信息和 MCP 配置 */
@Data
public class CreateMcpParam {
    @NotBlank
    private String mcpName;
    @NotBlank
    private String description;
    private String feature;
    private String tags;
    private String icon;
    private String source;
    private String status;
    private String configJson;
    private String requestHeaders;
}
