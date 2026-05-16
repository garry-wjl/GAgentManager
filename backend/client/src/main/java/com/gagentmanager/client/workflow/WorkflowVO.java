package com.gagentmanager.client.workflow;

import lombok.Data;

import java.util.Date;

/** 工作流详情视图对象，包含工作流定义 JSON 和状态 */
@Data
public class WorkflowVO {
    private Long id;
    private String num;
    private String workflowCode;
    private String workflowName;
    private String description;
    private String definition;
    private String category;
    private String status;
    private String version;
    private String creator;
    private String createNo;
    private Date createTime;
    private Date updateTime;
}
