package com.gagentmanager.facade.agent;

import lombok.Data;
import java.util.Date;

/** Agent 创建事件，触发于新建 Agent 后 */
@Data
public class AgentCreatedEvent {
    private String agentNum;
    private String agentCode;
    private String agentName;
    private String agentType;
    private String operatorId;
    private Date eventTime;
}
