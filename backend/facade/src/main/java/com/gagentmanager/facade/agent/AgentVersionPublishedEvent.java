package com.gagentmanager.facade.agent;

import lombok.Data;
import java.util.Date;

/** Agent 版本发布事件，触发于发布新版本后 */
@Data
public class AgentVersionPublishedEvent {
    private String agentNum;
    private String version;
    private String operatorId;
    private Date eventTime;
}
