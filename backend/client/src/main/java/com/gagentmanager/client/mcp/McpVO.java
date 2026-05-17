package com.gagentmanager.client.mcp;

import lombok.Data;

import java.util.Date;

/** MCP 服务详情视图对象，包含来源、状态、配置信息和绑定 Agent 数量 */
@Data
public class McpVO {
    private Long id;
    private String num;
    private String mcpName;
    private String description;
    private String feature;
    private String tags;
    private String source;
    private String status;
    private String icon;
    private String configJson;
    private String requestHeaders;
    private Integer boundAgentCount;
    private String creator;
    private String createNo;
    private Date createTime;
    private Date updateTime;
    private String updater;
}
