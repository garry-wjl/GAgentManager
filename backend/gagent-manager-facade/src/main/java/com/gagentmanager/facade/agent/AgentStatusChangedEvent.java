package com.gagentmanager.facade.agent;

import lombok.Data;
import java.util.Date;

/** Agent 状态变更事件，触发于启用/停用/部署等操作后 */
@Data
public class AgentStatusChangedEvent {
    private String agentNum;
    private String agentName;
    private String status;
    private String operatorId;
    private Date eventTime;
}
