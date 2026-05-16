package com.gagentmanager.client.mcp;

import lombok.Data;

import java.util.Date;

/** MCP 连接日志视图对象，记录请求 URL、状态码和响应时间 */
@Data
public class McpLogVO {
    private Long id;
    private Long mcpId;
    private String logLevel;
    private String message;
    private String requestUrl;
    private Integer statusCode;
    private Integer responseTime;
    private String errorCode;
    private Date createTime;
}
