package com.gagentmanager.domain.mcp;

import com.baomidou.mybatisplus.core.metadata.IPage;

import java.util.List;

/** MCP 服务仓储接口 */
public interface McpRepository {
    McpService findById(Long id);
    McpService findByNum(String num);
    McpService findByCode(String mcpCode);
    IPage<McpService> list(IPage<McpService> page, String keyword, String status);
    void save(McpService mcp, Long operatorId);
    void delete(String num, Long operatorId);
    List<McpService> findEnabledMcps();
}
