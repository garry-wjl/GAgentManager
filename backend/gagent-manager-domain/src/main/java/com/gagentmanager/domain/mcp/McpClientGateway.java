package com.gagentmanager.domain.mcp;

/** MCP 客户端网关接口，定义与外部 MCP 服务通信的连通性测试能力 */
public interface McpClientGateway {
    TestResult testConnectivity(McpService mcp);

    class TestResult {
        private final boolean success;
        private final Long responseTime;
        private final String errorMessage;

        public TestResult(boolean success, Long responseTime, String errorMessage) {
            this.success = success;
            this.responseTime = responseTime;
            this.errorMessage = errorMessage;
        }

        public boolean isSuccess() {
            return success;
        }

        public Long getResponseTime() {
            return responseTime;
        }

        public String getErrorMessage() {
            return errorMessage;
        }
    }
}
