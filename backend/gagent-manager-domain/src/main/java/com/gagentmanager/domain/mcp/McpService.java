package com.gagentmanager.domain.mcp;

import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;

import java.util.Date;

/** MCP 服务聚合根，封装 MCP 的连接状态管理、启用/禁用和测试记录逻辑 */
@Data
public class McpService extends DomainEntity {
    private String mcpCode;
    private String mcpName;
    private String description;
    private String latestVersion;
    private String currentVersion;
    private Boolean isEnabled;
    private String status;
    private Integer boundAgentCount;
    private String serverUrl;
    private String protocolVersion;
    private String transportType;
    private String authType;
    private String credentials;
    private Integer timeoutSeconds;
    private Boolean retryEnabled;
    private Integer maxRetries;
    private String healthCheckUrl;
    private Integer healthCheckInterval;
    private String envVariables;
    private String command;
    private String args;
    private Date lastConnectTime;
    private Integer errorCount;

    public void save(Long operatorId) {
        if (this.isEnabled == null) {
            this.isEnabled = true;
        }
        if (this.status == null) {
            this.status = "UNCONNECTED";
        }
        if (this.boundAgentCount == null) {
            this.boundAgentCount = 0;
        }
        if (this.errorCount == null) {
            this.errorCount = 0;
        }
        if (this.retryEnabled == null) {
            this.retryEnabled = true;
        }
        if (this.maxRetries == null) {
            this.maxRetries = 3;
        }
        if (this.timeoutSeconds == null) {
            this.timeoutSeconds = 30;
        }
        if (this.healthCheckInterval == null) {
            this.healthCheckInterval = 60;
        }
        ensureNum();
        this.setUpdateNo(String.valueOf(operatorId));
        if (this.getCreateTime() == null) {
            this.setCreateNo(String.valueOf(operatorId));
            this.setCreateTime(new Date());
        }
        this.setUpdateTime(new Date());
    }

    public void delete(Long operatorId) {
        this.setDeleted(true);
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new Date());
    }

    public void enable(Long operatorId) {
        this.isEnabled = true;
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new Date());
    }

    public void disable(Long operatorId) {
        this.isEnabled = false;
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new Date());
    }

    public void recordTestResult(boolean success, Long responseTime) {
        this.lastConnectTime = new Date();
        if (success) {
            this.status = "CONNECTED";
        } else {
            this.status = "ERROR";
            this.errorCount++;
        }
        this.setUpdateTime(new Date());
    }
}
