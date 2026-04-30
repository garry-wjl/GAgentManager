package com.gagentmanager.domain.mcp;

import java.util.List;

/** MCP 版本仓储接口 */
public interface McpVersionRepository {
    List<McpVersion> findByMcpId(Long mcpId);
    void save(McpVersion version, Long operatorId);
}
