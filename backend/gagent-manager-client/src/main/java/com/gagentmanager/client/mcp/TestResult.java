package com.gagentmanager.client.mcp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * MCP 连通性测试结果
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestResult {
    private boolean success;
    private Long responseTime;
    private String errorMessage;
}
