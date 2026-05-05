package com.gagentmanager.domain.workflow;

import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;

/** 工作流聚合根，封装工作流的发布/下线状态管理 */
@Data
public class Workflow extends DomainEntity {
    private String workflowCode;
    private String workflowName;
    private String description;
    private String definition;
    private String category;
    private String status;
    private String version;

    public void save(Long operatorId) {
        if (this.status == null) this.status = "DRAFT";
        if (this.version == null) this.version = "V1.0.0";
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

    public void publish(Long operatorId) {
        this.status = "PUBLISHED";
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new java.util.Date());
    }

    public void offline(Long operatorId) {
        this.status = "OFFLINE";
        this.setUpdateNo(String.valueOf(operatorId));
        this.setUpdateTime(new java.util.Date());
    }
}
