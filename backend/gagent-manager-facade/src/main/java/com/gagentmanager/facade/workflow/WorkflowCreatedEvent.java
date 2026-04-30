package com.gagentmanager.facade.workflow;

import lombok.Data;
import java.util.Date;

/** 工作流创建事件，触发于新建工作流后 */
@Data
public class WorkflowCreatedEvent {
    private String workflowNum;
    private String workflowCode;
    private String workflowName;
    private String operatorId;
    private Date eventTime;
}
