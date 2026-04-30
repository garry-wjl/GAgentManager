package com.gagentmanager.client.mcp;

import lombok.Data;

import java.util.Date;

/** MCP 版本视图对象，包含版本标签和变更日志 */
@Data
public class McpVersionVO {
    private String num;
    private String version;
    private String versionTag;
    private String changelog;
    private String configSnapshot;
    private String creator;
    private Date publishTime;
    private Date createTime;
    private Boolean isCurrent;
}
