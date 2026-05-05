package com.gagentmanager.infra.mcp.repository;

import com.gagentmanager.domain.mcp.McpClientGateway;
import com.gagentmanager.domain.mcp.McpService;
import org.springframework.stereotype.Repository;

/** MCP 客户端网关实现，当前为 TODO 桩，待 Spring AI MCP Client 集成后实现 */
@Repository
public class McpClientGatewayImpl implements McpClientGateway {
    @Override
    public TestResult testConnectivity(McpService mcp) {
        // TODO: Implement with Spring AI MCP Client
        return new TestResult(true, 0L, null);
    }
}
