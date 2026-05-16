package com.gagentmanager.domain.mcp;

import java.util.List;

/** MCP 模板仓储接口 */
public interface McpTemplateRepository {
    List<McpTemplate> findByCategory(String category);
    List<McpTemplate> findAll();
}
