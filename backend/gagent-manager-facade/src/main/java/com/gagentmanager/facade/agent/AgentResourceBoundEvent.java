package com.gagentmanager.facade.agent;

import lombok.Data;
import java.util.Date;

/** Agent 资源绑定事件，触发于关联 Model/MCP/Skill/Workflow 后 */
@Data
public class AgentResourceBoundEvent {
    private String agentNum;
    private String resourceType;
    private String resourceId;
    private String operatorId;
    private Date eventTime;
}
