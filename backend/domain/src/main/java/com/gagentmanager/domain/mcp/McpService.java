package com.gagentmanager.domain.mcp;

import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;

/** MCP 服务聚合根，封装 MCP 的状态管理、启用/禁用操作 */
@Data
public class McpService extends DomainEntity {
    private String mcpName;
    private String description;
    private String feature;
    private String tags;
    private String source;
    private String status;
    private String icon;
    private String configJson;
    private String requestHeaders;
    private Integer boundAgentCount;

    public void save(Long operatorId) {
        if (this.source == null) {
            this.source = "MANUAL";
        }
        if (this.status == null) {
            this.status = "DRAFT";
        }
        if (this.boundAgentCount == null) {
            this.boundAgentCount = 0;
        }
        ensureNum();
        this.setUpdateNo(String.valueOf(operatorId));
        if (this.getCreateTime() == null) {
            this.setCreateNo(String.valueOf(operatorId));
            this.setCreateTime(new java.util.Date());
        }
        this.setUpdateTime(new java.util.Date());
    }

    public void delete(Long operatorId) {
        this.setDeleted(true);
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new java.util.Date());
    }

    public void enable(Long operatorId) {
        this.status = "ENABLED";
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new java.util.Date());
    }

    public void disable(Long operatorId) {
        this.status = "DISABLED";
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new java.util.Date());
    }
}
