package com.gagentmanager.client.workflow;

import lombok.Data;

/** 更新工作流参数，支持部分字段更新 */
@Data
public class UpdateWorkflowParam {
    private Long id;
    private String workflowName;
    private String description;
    private String definition;
    private String category;
}
