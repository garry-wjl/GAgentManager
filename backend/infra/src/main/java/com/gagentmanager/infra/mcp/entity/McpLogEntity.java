package com.gagentmanager.infra.mcp.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/** MCP 日志数据库实体，映射 mcp_log 表 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("mcp_log")
public class McpLogEntity extends DomainEntity {
    private Long mcpId;
    private String logLevel;
    private String message;
    private String requestUrl;
    private Integer statusCode;
    private Integer responseTime;
    private String errorCode;
}
