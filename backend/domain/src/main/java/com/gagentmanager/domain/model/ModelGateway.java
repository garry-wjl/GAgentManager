package com.gagentmanager.domain.model;

/** 模型网关接口，定义与外部 LLM 服务通信的连通性测试能力 */
public interface ModelGateway {

    TestResult testConnectivity(Model model);

    class TestResult {
        private final boolean success;
        private final Long responseTime;
        private final String errorMessage;

        public TestResult(boolean success, Long responseTime, String errorMessage) {
            this.success = success;
            this.responseTime = responseTime;
            this.errorMessage = errorMessage;
        }

        public static TestResult success(Long responseTime) {
            return new TestResult(true, responseTime, null);
        }

        public static TestResult failure(String errorMessage) {
            return new TestResult(false, null, errorMessage);
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
