package com.gagentmanager.facade.workflow;

import lombok.Data;
import java.util.Date;

/** 工作流状态变更事件，触发于发布/下线等操作后 */
@Data
public class WorkflowStatusChangedEvent {
    private String workflowNum;
    private String workflowName;
    private String status;
    private String operatorId;
    private Date eventTime;
}
