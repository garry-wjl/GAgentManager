package com.gagentmanager.infra.workflow.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.gagentmanager.facade.common.DomainEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/** 工作流数据库实体，映射 workflow 表 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("workflow")
public class WorkflowEntity extends DomainEntity {
    private String workflowCode;
    private String workflowName;
    private String description;
    private String definition;
    private String category;
    private String status;
    private String version;
}
