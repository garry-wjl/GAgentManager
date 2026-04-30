package com.gagentmanager.client.mcp;

import lombok.Data;

import java.util.Date;

/** MCP 配置模板视图对象，用于快速创建 MCP 服务 */
@Data
public class McpTemplateVO {
    private String num;
    private String templateName;
    private String description;
    private String configPreset;
    private String category;
    private Boolean isOfficial;
    private Integer useCount;
    private Date createTime;
}
