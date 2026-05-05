package com.gagentmanager.client.workflow;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/** 创建工作流参数，需提供编码、名称和工作流定义 */
@Data
public class CreateWorkflowParam {
    @NotBlank
    private String workflowCode;
    @NotBlank
    private String workflowName;
    private String description;
    private String definition;
    private String category;
}
