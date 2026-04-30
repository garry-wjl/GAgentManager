package com.gagentmanager.domain.mcp;

import com.baomidou.mybatisplus.core.metadata.IPage;

/** MCP 日志仓储接口 */
public interface McpLogRepository {
    IPage<McpLog> findByMcpId(IPage<McpLog> page, Long mcpId, String logLevel);
    void save(McpLog log);
}
