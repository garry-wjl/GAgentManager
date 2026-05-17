package com.gagentmanager.client.mcp;

import lombok.Data;

/** 更新 MCP 服务参数，支持部分更新 */
@Data
public class UpdateMcpParam {
    private String num;
    private String mcpName;
    private String description;
    private String feature;
    private String tags;
    private String icon;
    private String source;
    private String status;
    private String configJson;
    private String requestHeaders;
}
