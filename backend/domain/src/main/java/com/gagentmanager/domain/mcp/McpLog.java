package com.gagentmanager.domain.mcp;

import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;

/** MCP 连接日志实体，记录请求状态码和响应时间 */
@Data
public class McpLog extends DomainEntity {
    private Long mcpId;
    private String logLevel;
    private String message;
    private String requestUrl;
    private Integer statusCode;
    private Integer responseTime;
    private String errorCode;
}
